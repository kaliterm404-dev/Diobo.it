import { promises as dns } from "node:dns";
import { clientIp, json, limited, normalizeTarget } from "@/lib/net";

export const runtime = "nodejs";
export const maxDuration = 15;

const TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "CAA", "SOA"] as const;
// DNS-over-HTTPS JSON: funziona ovunque, anche dove la porta 53 in uscita è filtrata
const RESOLVERS: Record<string, string> = {
  Cloudflare: "https://cloudflare-dns.com/dns-query",
  Google: "https://dns.google/resolve",
};

async function doh(url: string, name: string): Promise<string[]> {
  try {
    const r = await fetch(`${url}?name=${encodeURIComponent(name)}&type=A`, { headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(3000) });
    const j = (await r.json()) as { Answer?: { type: number; data: string }[] };
    return (j.Answer || []).filter((a) => a.type === 1).map((a) => a.data).sort();
  } catch {
    return [];
  }
}

async function lookup(r: typeof dns, name: string, type: string): Promise<string[]> {
  try {
    const out: unknown = await (r.resolve as (n: string, t: string) => Promise<unknown>).call(r, name, type);
    if (type === "MX") return (out as { priority: number; exchange: string }[]).sort((a, b) => a.priority - b.priority).map((m) => `${m.priority} ${m.exchange}`);
    if (type === "TXT") return (out as string[][]).map((t) => t.join(""));
    if (type === "CAA") return (out as { critical: number; issue?: string; issuewild?: string; iodef?: string }[]).map((c) => `${c.critical} ${c.issue ? "issue " + c.issue : c.issuewild ? "issuewild " + c.issuewild : "iodef " + c.iodef}`);
    if (type === "SOA") { const s = out as { nsname: string; hostmaster: string; serial: number }; return [`${s.nsname} ${s.hostmaster} serial ${s.serial}`]; }
    return (out as string[]).map(String);
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  if (limited("dns:" + clientIp(request), 20)) return json({ error: "Troppe richieste, riprova tra un minuto." }, 429);
  const body = await request.json().catch(() => ({}));
  const t = normalizeTarget(body.domain);
  if (!t) return json({ error: "Inserisci un dominio o un IP pubblico valido." }, 400);

  if (t.kind === "ip") {
    let ptr: string[] = [];
    try { ptr = await dns.reverse(t.value); } catch {}
    return json({ target: t.value, kind: "ip", records: { PTR: ptr } });
  }

  const records: Record<string, string[]> = {};
  await Promise.all(TYPES.map(async (ty) => { records[ty] = await lookup(dns, t.value, ty); }));

  // Confronto A tra resolver pubblici: utile per vedere propagazioni in corso
  const compare: Record<string, string[]> = {};
  await Promise.all(Object.entries(RESOLVERS).map(async ([name, url]) => { compare[name] = await doh(url, t.value); }));
  compare["Server diobo.it"] = [...records.A].sort();

  return json({ target: t.value, kind: "host", records, compare });
}
