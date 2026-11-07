import { promises as dns } from "node:dns";
import net from "node:net";
import tls from "node:tls";

const HOST_RE = /^(?=.{4,253}$)(?!-)([a-z0-9_-]{1,63}(?<!-)\.)+[a-z]{2,63}$/;

/** Rate limit per istanza: max `max` richieste per finestra per chiave. */
const buckets = new Map<string, number[]>();
export function limited(key: string, max = 10, windowMs = 60_000) {
  const now = Date.now();
  const arr = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  buckets.set(key, arr);
  if (buckets.size > 10000) buckets.clear();
  return arr.length > max;
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anon";
}

/** Accetta "dominio.it", URL, "user@dominio"; restituisce hostname o null. Rifiuta IP. */
export function normalizeHost(input: string): string | null {
  let s = String(input || "").trim().toLowerCase();
  s = s.replace(/^[a-z]+:\/\//, "").split(/[/?#]/)[0].split("@").pop() || "";
  s = s.replace(/:\d+$/, "").replace(/\.$/, "");
  if (net.isIP(s)) return null;
  return HOST_RE.test(s) ? s : null;
}

/** Accetta hostname oppure IP pubblico. */
export function normalizeTarget(input: string): { kind: "host" | "ip"; value: string } | null {
  const raw = String(input || "").trim().toLowerCase().replace(/^\[|\]$/g, "");
  if (net.isIP(raw)) return isPrivate(raw) ? null : { kind: "ip", value: raw };
  const h = normalizeHost(raw);
  return h ? { kind: "host", value: h } : null;
}

export function isPrivate(ip: string): boolean {
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
  return v === "::1" || v === "::" || /^(fc|fd|fe[89ab]|ff)/.test(v);
}

export async function resolvePublic(host: string): Promise<string | null> {
  const ips: string[] = [];
  try { ips.push(...(await dns.resolve4(host))); } catch {}
  try { ips.push(...(await dns.resolve6(host))); } catch {}
  if (!ips.length || ips.some(isPrivate)) return null;
  return ips[0];
}

export async function txt(name: string): Promise<string[]> {
  try {
    return (await dns.resolveTxt(name)).map((r) => r.join(""));
  } catch {
    return [];
  }
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || "";

export type CertInfo = {
  authorized: boolean;
  authError?: string;
  subject?: string;
  issuer?: string;
  validFrom?: string;
  validTo?: string;
  daysLeft?: number;
  san: string[];
  protocol?: string | null;
  cipher?: string;
  chain: { subject: string; issuer: string; validTo: string }[];
};

export function inspectCert(host: string, ip: string, timeout = 6000): Promise<CertInfo | null> {
  return new Promise((resolve) => {
    const sock = tls.connect({ host: ip, port: 443, servername: host, timeout, rejectUnauthorized: false }, () => {
      const c = sock.getPeerCertificate(true);
      if (!c || !c.valid_to) { sock.end(); return resolve(null); }
      const chain: CertInfo["chain"] = [];
      let cur: tls.DetailedPeerCertificate | undefined = c;
      const seen = new Set<string>();
      while (cur && !seen.has(cur.fingerprint256) && chain.length < 5) {
        seen.add(cur.fingerprint256);
        chain.push({ subject: one(cur.subject?.CN), issuer: one(cur.issuer?.CN) || one(cur.issuer?.O), validTo: cur.valid_to });
        cur = cur.issuerCertificate;
      }
      const info: CertInfo = {
        authorized: sock.authorized,
        authError: sock.authorizationError ? String(sock.authorizationError) : undefined,
        subject: one(c.subject?.CN),
        issuer: one(c.issuer?.O) || one(c.issuer?.CN),
        validFrom: c.valid_from,
        validTo: c.valid_to,
        daysLeft: Math.floor((new Date(c.valid_to).getTime() - Date.now()) / 86_400_000),
        san: (c.subjectaltname || "").split(",").map((s) => s.trim().replace(/^DNS:/, "")).filter(Boolean).slice(0, 50),
        protocol: sock.getProtocol(),
        cipher: sock.getCipher()?.name,
        chain,
      };
      sock.end();
      resolve(info);
    });
    sock.on("error", () => resolve(null));
    sock.on("timeout", () => { sock.destroy(); resolve(null); });
  });
}

export function json(data: unknown, status = 200, extra: Record<string, string> = {}) {
  return Response.json(data, {
    status,
    headers: { "cache-control": "no-store", "access-control-allow-origin": "*", ...extra },
  });
}
