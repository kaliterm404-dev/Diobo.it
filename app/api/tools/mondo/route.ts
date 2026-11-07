import { clientIp, json, limited, normalizeTarget } from "@/lib/net";
import { measure, WORLD, type GpType } from "@/lib/globalping";

export const runtime = "nodejs";
export const maxDuration = 40;

const TYPES: GpType[] = ["dns", "ping", "http", "traceroute"];

export async function POST(request: Request) {
  if (limited("mondo:" + clientIp(request), 4)) return json({ error: "Massimo 4 test globali al minuto. Riprova tra poco." }, 429);
  const body = await request.json().catch(() => ({}));
  const type: GpType = TYPES.includes(body.type) ? body.type : "dns";
  const t = normalizeTarget(body.target);
  if (!t) return json({ error: "Inserisci un dominio o un IP pubblico valido." }, 400);
  if (type === "dns" && t.kind === "ip") return json({ error: "Per la propagazione DNS serve un nome di dominio." }, 400);

  const opts: Record<string, unknown> =
    type === "dns" ? { query: { type: ["A", "AAAA", "MX", "NS", "TXT", "CNAME"].includes(body.record) ? body.record : "A" } }
    : type === "http" ? { request: { method: "HEAD", path: "/" }, protocol: "HTTPS" }
    : type === "ping" ? { packets: 3 }
    : {};
  const countries = type === "traceroute" ? WORLD.filter((c) => ["IT", "DE", "US", "BR", "JP", "SG", "ZA", "AU"].includes(c)) : WORLD;

  try {
    const { results, cached } = await measure(type, t.value, countries, opts);
    const rows = results.map((r) => {
      const base = { country: r.probe.country, city: r.probe.city, network: r.probe.network, asn: r.probe.asn, lat: r.probe.latitude, lon: r.probe.longitude };
      if (type === "dns") {
        const values = (r.answers || []).map((a) => a.value).sort();
        return { ...base, ok: r.status === "finished" && values.length > 0, values, ms: null as number | null };
      }
      if (type === "ping") {
        const s = r.stats;
        return { ...base, ok: !!s && s.loss < 100, values: s ? [`${s.avg?.toFixed(1)} ms`, `perdita ${s.loss}%`] : [], ms: s?.avg ?? null };
      }
      if (type === "http") {
        return { ...base, ok: !!r.statusCode && r.statusCode < 500, values: r.statusCode ? [`HTTP ${r.statusCode}`] : [r.status], ms: r.timings?.total ?? null };
      }
      const hops = (r.hops || []).map((h) => `${h.resolvedHostname || h.resolvedAddress || "*"} ${h.timings?.[0]?.rtt ?? ""}`.trim());
      return { ...base, ok: r.status === "finished", values: hops, ms: null };
    });
    // Valore "maggioritario" per evidenziare chi risponde diverso (propagazione in corso)
    const freq = new Map<string, number>();
    if (type === "dns") rows.forEach((r) => { if (r.ok) { const k = r.values.join(","); freq.set(k, (freq.get(k) || 0) + 1); } });
    const majority = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    return json({ target: t.value, type, cached, majority, rows });
  } catch (e) {
    const msg = e instanceof Error && e.message === "RATE"
      ? "La rete di sonde globali ha raggiunto il limite orario. Riprova più tardi."
      : "Le sonde globali non hanno risposto. Riprova tra poco.";
    return json({ error: msg }, 503);
  }
}
