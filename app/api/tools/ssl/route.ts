import { clientIp, inspectCert, json, limited, normalizeHost, resolvePublic } from "@/lib/net";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(request: Request) {
  if (limited("ssl:" + clientIp(request), 15)) return json({ error: "Troppe richieste, riprova tra un minuto." }, 429);
  const body = await request.json().catch(() => ({}));
  const host = normalizeHost(body.host);
  if (!host) return json({ error: "Inserisci un nome host valido, es. www.esempio.it" }, 400);
  const ip = await resolvePublic(host);
  if (!ip) return json({ error: `${host} non risolve verso un indirizzo pubblico.` }, 422);
  const cert = await inspectCert(host, ip);
  if (!cert) return json({ error: `Nessun certificato raggiungibile su ${host}:443.` }, 422);
  return json({ host, ip, ...cert });
}
