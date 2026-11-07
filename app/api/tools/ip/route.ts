import { promises as dns } from "node:dns";
import { clientIp, json } from "@/lib/net";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const h = request.headers;
  const ip = clientIp(request);
  let ptr: string[] = [];
  try { ptr = await dns.reverse(ip); } catch {}
  const dec = (v: string | null) => (v ? decodeURIComponent(v) : null);
  return json({
    ip,
    version: ip.includes(":") ? 6 : 4,
    ptr,
    country: h.get("x-vercel-ip-country"),
    region: dec(h.get("x-vercel-ip-country-region")),
    city: dec(h.get("x-vercel-ip-city")),
    latitude: h.get("x-vercel-ip-latitude"),
    longitude: h.get("x-vercel-ip-longitude"),
    timezone: h.get("x-vercel-ip-timezone"),
    userAgent: h.get("user-agent"),
    acceptLanguage: h.get("accept-language"),
  });
}
