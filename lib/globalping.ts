// Client minimale per l'API pubblica di Globalping (https://globalping.io)
// Rete aperta di sonde in ~120 paesi: dns, ping, http, traceroute, mtr.

const API = "https://api.globalping.io/v1/measurements";

export type GpType = "dns" | "ping" | "http" | "traceroute";

export type GpProbe = {
  country: string;
  city: string;
  asn: number;
  network: string;
  latitude: number;
  longitude: number;
};

export type GpResult = {
  probe: GpProbe;
  status: string;
  rawOutput?: string;
  answers?: { type: string; value: string; ttl: number }[];
  resolver?: string;
  stats?: { min: number; avg: number; max: number; loss: number };
  statusCode?: number;
  timings?: { total?: number };
  hops?: { resolvedAddress: string | null; resolvedHostname: string | null; timings: { rtt: number }[] }[];
};

// Paesi di default: copertura per continente, tutti con molte sonde attive.
export const WORLD = [
  "IT", "DE", "FR", "GB", "ES", "NL", "PL", "SE", "RO", "TR",
  "US", "CA", "MX", "BR", "AR", "CL",
  "ZA", "NG", "AE", "IN", "SG", "JP", "KR", "ID", "AU", "NZ",
];

// Cache in memoria per istanza: stesso tipo+target non riparte prima di 5 minuti.
const cache = new Map<string, { at: number; data: GpResult[] }>();
const TTL = 5 * 60_000;

export async function measure(
  type: GpType,
  target: string,
  countries: string[] = WORLD,
  options: Record<string, unknown> = {},
): Promise<{ results: GpResult[]; cached: boolean }> {
  const key = `${type}|${target}|${countries.join(",")}|${JSON.stringify(options)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return { results: hit.data, cached: true };

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.GLOBALPING_TOKEN) headers.authorization = `Bearer ${process.env.GLOBALPING_TOKEN}`;

  const body = {
    type,
    target,
    locations: countries.map((c) => ({ country: c, limit: 1 })),
    measurementOptions: options,
  };
  const r = await fetch(API, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) });
  if (r.status === 429) throw new Error("RATE");
  if (!r.ok) throw new Error(`Globalping ${r.status}`);
  const { id } = (await r.json()) as { id: string };

  const deadline = Date.now() + 25_000;
  let data: { status: string; results: { probe: GpProbe; result: Omit<GpResult, "probe"> }[] } | null = null;
  while (Date.now() < deadline) {
    await new Promise((res) => setTimeout(res, 800));
    const g = await fetch(`${API}/${id}`, { signal: AbortSignal.timeout(6000) });
    data = await g.json();
    if (data && data.status !== "in-progress") break;
  }
  const results = (data?.results || []).map((x) => ({ probe: x.probe, ...x.result })) as GpResult[];
  cache.set(key, { at: Date.now(), data: results });
  if (cache.size > 500) cache.clear();
  return { results, cached: false };
}
