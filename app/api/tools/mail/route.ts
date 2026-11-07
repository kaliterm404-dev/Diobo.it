import { promises as dns } from "node:dns";
import { clientIp, json, limited, normalizeHost, txt } from "@/lib/net";

export const runtime = "nodejs";
export const maxDuration = 20;

const SELECTORS = ["default", "google", "selector1", "selector2", "k1", "k2", "s1", "s2", "mail", "dkim", "brevo1", "brevo2", "cf2024-1", "zoho", "mxvault", "everlytickey1", "smtp", "sig1"];

type SpfNode = { domain: string; record: string | null; lookups: number; error?: string; includes: SpfNode[] };

/** Espande SPF ricorsivamente contando i lookup DNS (limite RFC 7208: 10). */
async function expandSpf(domain: string, depth = 0, seen = new Set<string>()): Promise<SpfNode> {
  const node: SpfNode = { domain, record: null, lookups: 0, includes: [] };
  if (depth > 10 || seen.has(domain)) { node.error = "ciclo o profondità eccessiva"; return node; }
  seen.add(domain);
  const recs = (await txt(domain)).filter((t) => /^v=spf1(\s|$)/i.test(t));
  if (recs.length === 0) { node.error = "nessun record SPF"; return node; }
  if (recs.length > 1) node.error = "più record SPF: non valido (permerror)";
  node.record = recs[0];
  for (const term of recs[0].split(/\s+/).slice(1)) {
    const t = term.replace(/^[+\-~?]/, "").toLowerCase();
    const m = t.match(/^(include|redirect)[:=](.+)$/);
    if (m) {
      node.lookups += 1;
      const child = await expandSpf(m[2], depth + 1, seen);
      node.includes.push(child);
      node.lookups += child.lookups;
    } else if (/^(a|mx|ptr|exists)([:/]|$)/.test(t)) {
      node.lookups += 1;
    }
  }
  return node;
}

function parseTags(rec: string) {
  return Object.fromEntries(rec.split(";").map((p) => p.trim()).filter(Boolean).map((p) => {
    const i = p.indexOf("=");
    return [p.slice(0, i).trim().toLowerCase(), p.slice(i + 1).trim()];
  }));
}

export async function POST(request: Request) {
  if (limited("mail:" + clientIp(request), 10)) return json({ error: "Troppe richieste, riprova tra un minuto." }, 429);
  const body = await request.json().catch(() => ({}));
  const domain = normalizeHost(body.domain);
  if (!domain) return json({ error: "Inserisci un dominio valido, es. esempio.it" }, 400);
  const extraSel = typeof body.selector === "string" && /^[a-z0-9._-]{1,63}$/i.test(body.selector) ? [body.selector] : [];

  const [mx, spf, dmarcTxt] = await Promise.all([
    dns.resolveMx(domain).then((r) => r.sort((a, b) => a.priority - b.priority)).catch(() => []),
    expandSpf(domain),
    txt(`_dmarc.${domain}`),
  ]);

  const dmarcRec = dmarcTxt.find((t) => /^v=dmarc1/i.test(t)) || null;
  const dmarc = dmarcRec ? parseTags(dmarcRec) : null;

  const dkim: { selector: string; record: string }[] = [];
  await Promise.all([...new Set([...extraSel, ...SELECTORS])].map(async (s) => {
    const name = `${s}._domainkey.${domain}`;
    let rec = (await txt(name)).find((t) => /v=dkim1|p=/i.test(t));
    if (!rec) {
      try { const c = await dns.resolveCname(name); if (c[0]) rec = (await txt(c[0])).find((t) => /p=/i.test(t)) ? `CNAME → ${c[0]}` : undefined; } catch {}
    }
    if (rec) dkim.push({ selector: s, record: rec.length > 120 ? rec.slice(0, 120) + "…" : rec });
  }));

  const notes: string[] = [];
  if (!mx.length) notes.push("Nessun MX: il dominio non riceve posta.");
  if (!spf.record) notes.push("Manca SPF: chiunque può spedire dichiarandosi questo dominio.");
  if (spf.lookups > 10) notes.push(`SPF supera il limite di 10 lookup DNS (${spf.lookups}): i destinatari lo considerano non valido.`);
  if (!dmarc) notes.push("Manca DMARC: nessuna protezione contro lo spoofing del mittente.");
  else if (dmarc.p === "none") notes.push("DMARC in sola osservazione (p=none): le mail false vengono comunque consegnate.");
  if (!dkim.length) notes.push("Nessuna chiave DKIM trovata sui selettori comuni (potrebbe usarne uno personalizzato).");

  return json({ domain, mx, spf, dmarc: dmarcRec ? { record: dmarcRec, tags: dmarc } : null, dkim, notes });
}
