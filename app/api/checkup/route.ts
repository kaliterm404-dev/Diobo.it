import { promises as dns } from "node:dns";
import net from "node:net";
import tls from "node:tls";

export const runtime = "nodejs";
export const maxDuration = 20;

type Status = "ok" | "warn" | "bad";
type Check = {
  id: string;
  area: "Sicurezza" | "Email" | "Velocità" | "Visibilità";
  label: string;
  status: Status;
  detail: string;
  why: string;
  weight: number;
};

const HOST_RE = /^(?=.{4,253}$)(?!-)([a-z0-9-]{1,63}(?<!-)\.)+[a-z]{2,63}$/;

// Rate limit minimale per istanza: 6 check al minuto per IP
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > 6;
}

function normalizeHost(input: string): string | null {
  let s = input.trim().toLowerCase();
  s = s.replace(/^[a-z]+:\/\//, "").split(/[/?#]/)[0].split("@").pop() || "";
  s = s.replace(/:\d+$/, "").replace(/\.$/, "");
  if (net.isIP(s)) return null;
  return HOST_RE.test(s) ? s : null;
}

function isPrivate(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  const v = ip.toLowerCase();
  if (v.startsWith("::ffff:")) return isPrivate(v.slice(7));
  return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe8") || v.startsWith("fe9") || v.startsWith("fea") || v.startsWith("feb") || v.startsWith("ff");
}

async function resolvePublic(host: string): Promise<string | null> {
  const ips: string[] = [];
  try { ips.push(...(await dns.resolve4(host))); } catch {}
  try { ips.push(...(await dns.resolve6(host))); } catch {}
  if (!ips.length || ips.some(isPrivate)) return null;
  return ips[0];
}

async function txt(name: string): Promise<string[]> {
  try {
    return (await dns.resolveTxt(name)).map((r) => r.join(""));
  } catch {
    return [];
  }
}

function certDaysLeft(host: string, ip: string): Promise<number | null> {
  return new Promise((resolve) => {
    const sock = tls.connect({ host: ip, port: 443, servername: host, timeout: 5000, rejectUnauthorized: false }, () => {
      const cert = sock.getPeerCertificate();
      const ok = sock.authorized;
      sock.end();
      if (!cert?.valid_to) return resolve(null);
      const days = Math.floor((new Date(cert.valid_to).getTime() - Date.now()) / 86_400_000);
      resolve(ok ? days : -9999);
    });
    sock.on("error", () => resolve(null));
    sock.on("timeout", () => { sock.destroy(); resolve(null); });
  });
}

async function timedFetch(url: string, ms: number, redirect: RequestRedirect = "manual") {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  const start = performance.now();
  try {
    const res = await fetch(url, {
      redirect,
      signal: ctrl.signal,
      headers: { "user-agent": "DIOBO-Checkup/1.0 (+https://www.diobo.it)" },
    });
    const ttfb = performance.now() - start;
    return { res, ttfb };
  } finally {
    clearTimeout(t);
  }
}

async function readCapped(res: Response, max = 600_000): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (size < max) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.length;
  }
  reader.cancel().catch(() => {});
  return new TextDecoder().decode(Buffer.concat(chunks));
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anon";
  if (limited(ip)) {
    return Response.json({ error: "Troppi controlli in poco tempo. Riprova tra un minuto." }, { status: 429 });
  }

  let body: { domain?: string } = {};
  try { body = await request.json(); } catch {}
  const host = normalizeHost(String(body.domain || ""));
  if (!host) {
    return Response.json({ error: "Inserisci un dominio valido, es. tuaazienda.it" }, { status: 400 });
  }

  const addr = await resolvePublic(host);
  if (!addr) {
    return Response.json({ error: `Non trovo ${host} in rete. Controlla di averlo scritto bene.` }, { status: 422 });
  }

  const checks: Check[] = [];
  const add = (c: Check) => checks.push(c);

  // --- EMAIL (DNS) ---
  const root = host.replace(/^www\./, "");
  const [mx, rootTxt, dmarcTxt] = await Promise.all([
    dns.resolveMx(root).catch(() => []),
    txt(root),
    txt(`_dmarc.${root}`),
  ]);
  const spf = rootTxt.find((t) => t.toLowerCase().startsWith("v=spf1"));
  const dmarc = dmarcTxt.find((t) => t.toLowerCase().startsWith("v=dmarc1"));
  const dmarcPolicy = dmarc?.match(/;\s*p=(\w+)/i)?.[1]?.toLowerCase();

  add({
    id: "mx", area: "Email", label: "Email sul tuo dominio", weight: 6,
    status: mx.length ? "ok" : "warn",
    detail: mx.length ? `Configurata (${mx.length} server di posta)` : "Nessuna casella email sul dominio",
    why: mx.length ? "I clienti possono scriverti a un indirizzo professionale." : "Un indirizzo @tuonome comunica serietà: una Gmail no.",
  });
  add({
    id: "spf", area: "Email", label: "Protezione SPF", weight: 10,
    status: spf ? "ok" : "bad",
    detail: spf ? "Presente" : "Assente",
    why: spf ? "Indica chi è autorizzato a spedire a nome tuo." : "Chiunque può inviare email fingendosi te: truffe ai tuoi clienti e mail finite in spam.",
  });
  add({
    id: "dmarc", area: "Email", label: "Protezione DMARC", weight: 12,
    status: !dmarc ? "bad" : dmarcPolicy === "none" ? "warn" : "ok",
    detail: !dmarc ? "Assente" : `Presente (policy: ${dmarcPolicy || "?"})`,
    why: !dmarc
      ? "Senza DMARC i provider non sanno cosa fare delle email false col tuo nome: il phishing passa."
      : dmarcPolicy === "none"
        ? "Stai solo osservando: le email false col tuo nome vengono ancora consegnate."
        : "Le email contraffatte col tuo nome vengono bloccate.",
  });

  // --- HTTPS + certificato ---
  const days = await certDaysLeft(host, addr);
  add({
    id: "tls", area: "Sicurezza", label: "Certificato HTTPS", weight: 14,
    status: days === null || days === -9999 ? "bad" : days < 14 ? "warn" : "ok",
    detail: days === null ? "HTTPS non raggiungibile" : days === -9999 ? "Certificato non valido" : `Valido, scade tra ${days} giorni`,
    why: days === null || days === -9999
      ? "Il browser mostra \"Non sicuro\": la maggior parte dei visitatori se ne va."
      : days < 14 ? "Sta per scadere: tra poco il sito mostrerà un avviso di pericolo." : "Connessione cifrata e lucchetto verde.",
  });

  // Redirect http -> https
  try {
    const { res } = await timedFetch(`http://${host}/`, 5000);
    const loc = res.headers.get("location") || "";
    const ok = res.status >= 300 && res.status < 400 && loc.startsWith("https://");
    add({
      id: "redirect", area: "Sicurezza", label: "Reindirizzamento a HTTPS", weight: 6,
      status: ok ? "ok" : "warn",
      detail: ok ? "Attivo" : "Il sito risponde anche in chiaro",
      why: ok ? "Tutti finiscono sulla versione sicura." : "Chi digita l'indirizzo senza https naviga senza protezione.",
    });
  } catch {
    // porta 80 chiusa: non penalizziamo
  }

  // --- Pagina principale ---
  let html = "";
  let headers: Headers | null = null;
  let ttfb = 0;
  let finalUrl = `https://${host}/`;
  try {
    let url = finalUrl;
    for (let i = 0; i < 4; i++) {
      const r = await timedFetch(url, 8000);
      const loc = r.res.headers.get("location");
      if (r.res.status >= 300 && r.res.status < 400 && loc) {
        const next = new URL(loc, url);
        const nh = normalizeHost(next.hostname);
        if (next.protocol !== "https:" || !nh || !(await resolvePublic(nh))) break;
        url = next.toString();
        continue;
      }
      headers = r.res.headers;
      ttfb = r.ttfb;
      finalUrl = url;
      html = await readCapped(r.res);
      break;
    }
  } catch {}

  if (headers) {
    const h = (k: string) => headers!.get(k);
    const csp = h("content-security-policy") || "";
    add({
      id: "hsts", area: "Sicurezza", label: "HSTS", weight: 6,
      status: h("strict-transport-security") ? "ok" : "warn",
      detail: h("strict-transport-security") ? "Attivo" : "Assente",
      why: h("strict-transport-security") ? "Il browser usa sempre la connessione sicura." : "Una rete Wi-Fi malevola può dirottare la prima visita.",
    });
    add({
      id: "csp", area: "Sicurezza", label: "Content Security Policy", weight: 8,
      status: csp ? "ok" : "bad",
      detail: csp ? "Presente" : "Assente",
      why: csp ? "Limita gli script che possono girare sul sito." : "Se il sito viene bucato, nulla impedisce di iniettare codice che ruba dati ai visitatori.",
    });
    const frame = h("x-frame-options") || /frame-ancestors/i.test(csp);
    add({
      id: "frame", area: "Sicurezza", label: "Protezione clickjacking", weight: 5,
      status: frame ? "ok" : "warn",
      detail: frame ? "Attiva" : "Assente",
      why: frame ? "Nessuno può incastrare il sito dentro una pagina trappola." : "Il sito può essere incorniciato in pagine che ingannano i visitatori.",
    });
    add({
      id: "nosniff", area: "Sicurezza", label: "Header di sicurezza di base", weight: 3,
      status: h("x-content-type-options") ? "ok" : "warn",
      detail: h("x-content-type-options") ? "Presenti" : "Mancanti",
      why: "Piccoli accorgimenti che chiudono intere classi di attacco.",
    });
    const server = h("x-powered-by") || h("server");
    if (server && /\d/.test(server)) {
      add({
        id: "banner", area: "Sicurezza", label: "Versione software esposta", weight: 4, status: "warn",
        detail: server,
        why: "Dichiarare la versione del software aiuta chi cerca falle note da sfruttare.",
      });
    }

    const ms = Math.round(ttfb);
    add({
      id: "ttfb", area: "Velocità", label: "Tempo di risposta del server", weight: 10,
      status: ms < 600 ? "ok" : ms < 1500 ? "warn" : "bad",
      detail: `${ms} ms`,
      why: ms < 600 ? "Risponde rapido: buono per utenti e Google." : "Ogni secondo di attesa fa perdere visitatori e posizioni su Google.",
    });
    const kb = Math.round(Buffer.byteLength(html) / 1024);
    if (kb > 0) {
      add({
        id: "weight", area: "Velocità", label: "Peso della pagina (HTML)", weight: 4,
        status: kb < 150 ? "ok" : kb < 400 ? "warn" : "bad",
        detail: `${kb} KB`,
        why: kb < 150 ? "Leggera, si carica bene anche in 4G." : "Una pagina pesante è lenta da telefono, dove arriva la maggior parte dei clienti.",
      });
    }

    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
    const desc = /<meta[^>]+name=["']description["'][^>]*content=["'][^"']{20,}/i.test(html) || /<meta[^>]+content=["'][^"']{20,}["'][^>]*name=["']description["']/i.test(html);
    const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const og = /<meta[^>]+property=["']og:/i.test(html);
    const ld = /application\/ld\+json/i.test(html);
    add({
      id: "title", area: "Visibilità", label: "Titolo per Google", weight: 4,
      status: title && title.length >= 10 ? "ok" : "bad",
      detail: title ? `“${title.slice(0, 70)}${title.length > 70 ? "…" : ""}”` : "Assente",
      why: "È la prima riga che le persone vedono su Google.",
    });
    add({
      id: "desc", area: "Visibilità", label: "Descrizione per Google", weight: 4,
      status: desc ? "ok" : "warn",
      detail: desc ? "Presente" : "Assente",
      why: desc ? "Controlli tu come ti presenti nei risultati." : "Google sceglie a caso un pezzo di testo: spesso il meno convincente.",
    });
    add({
      id: "mobile", area: "Visibilità", label: "Pronto per smartphone", weight: 6,
      status: viewport ? "ok" : "bad",
      detail: viewport ? "Sì" : "No",
      why: viewport ? "Si legge bene dal telefono." : "Da telefono il sito appare minuscolo: Google lo penalizza.",
    });
    add({
      id: "social", area: "Visibilità", label: "Anteprima social e dati strutturati", weight: 3,
      status: og && ld ? "ok" : og || ld ? "warn" : "bad",
      detail: [og ? "anteprima social ✓" : "anteprima social ✗", ld ? "dati strutturati ✓" : "dati strutturati ✗"].join(" · "),
      why: "Decide come appari quando qualcuno condivide il tuo link su WhatsApp o Facebook, e su Google.",
    });
  } else {
    add({
      id: "site", area: "Velocità", label: "Sito raggiungibile", weight: 20, status: "bad",
      detail: "Il sito non risponde in HTTPS",
      why: "Se il sito non si apre, per i clienti non esisti.",
    });
  }

  const total = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.reduce((s, c) => s + (c.status === "ok" ? c.weight : c.status === "warn" ? c.weight * 0.5 : 0), 0);
  const score = Math.round((got / total) * 100);

  return Response.json(
    { host, finalUrl, score, checks, checkedAt: new Date().toISOString() },
    { headers: { "cache-control": "no-store" } },
  );
}
