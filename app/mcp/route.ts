// Server MCP pubblico (Streamable HTTP, stateless, JSON-RPC 2.0).
// Espone gli strumenti di rete di diobo.it agli assistenti AI.
// Aggiungi a un client MCP:  https://www.diobo.it/mcp
import { POST as dnsTool } from "@/app/api/tools/dns/route";
import { POST as mailTool } from "@/app/api/tools/mail/route";
import { POST as sslTool } from "@/app/api/tools/ssl/route";
import { POST as mondoTool } from "@/app/api/tools/mondo/route";
import { POST as checkupTool } from "@/app/api/checkup/route";

export const runtime = "nodejs";
export const maxDuration = 45;

const PROTOCOL = "2025-06-18";
const SERVER = { name: "diobo-network-tools", title: "DIOBO.IT strumenti di rete", version: "1.0.0" };

const str = (description: string) => ({ type: "string", description });

const TOOLS = [
  {
    name: "dns_lookup",
    title: "DNS lookup",
    description: "Restituisce i record DNS di un dominio (A, AAAA, CNAME, MX, NS, TXT, CAA, SOA) e confronta il record A tra Cloudflare e Google. Se riceve un IP restituisce il PTR.",
    inputSchema: { type: "object", properties: { domain: str("Dominio (es. esempio.it) o IP pubblico") }, required: ["domain"] },
    call: (a: Record<string, unknown>, req: Request) => dnsTool(forward(req, { domain: a.domain })),
  },
  {
    name: "email_security_check",
    title: "Verifica SPF, DKIM e DMARC",
    description: "Analizza la sicurezza email di un dominio: MX, SPF espanso con conteggio dei lookup DNS (limite RFC 10), DKIM sui selettori comuni (o uno indicato), DMARC con policy. Restituisce anche note in italiano sui problemi trovati.",
    inputSchema: { type: "object", properties: { domain: str("Dominio da analizzare"), selector: str("Selettore DKIM opzionale") }, required: ["domain"] },
    call: (a: Record<string, unknown>, req: Request) => mailTool(forward(req, { domain: a.domain, selector: a.selector })),
  },
  {
    name: "ssl_certificate_check",
    title: "Certificato SSL/TLS",
    description: "Controlla il certificato HTTPS di un host sulla porta 443: validità, giorni alla scadenza, emittente, SAN, versione TLS, cifrario e catena.",
    inputSchema: { type: "object", properties: { host: str("Nome host, es. www.esempio.it") }, required: ["host"] },
    call: (a: Record<string, unknown>, req: Request) => sslTool(forward(req, { host: a.host })),
  },
  {
    name: "global_network_test",
    title: "Test dal mondo (propagazione DNS, ping, HTTP, traceroute)",
    description: "Esegue un test da sonde reali in 26 paesi (rete Globalping). type=dns verifica la propagazione DNS paese per paese (con 'majority' = risposta prevalente), ping misura latenza e perdita, http verifica la raggiungibilità HTTPS, traceroute (8 paesi) mostra il percorso. Richiede 5-20 secondi.",
    inputSchema: {
      type: "object",
      properties: {
        target: str("Dominio o IP pubblico"),
        type: { type: "string", enum: ["dns", "ping", "http", "traceroute"], description: "Tipo di test (default dns)" },
        record: { type: "string", enum: ["A", "AAAA", "MX", "NS", "TXT", "CNAME"], description: "Record per type=dns (default A)" },
      },
      required: ["target"],
    },
    call: (a: Record<string, unknown>, req: Request) => mondoTool(forward(req, { target: a.target, type: a.type ?? "dns", record: a.record ?? "A" })),
  },
  {
    name: "website_checkup",
    title: "Check-up completo di un sito",
    description: "Punteggio 0-100 di un sito su sicurezza (HTTPS, header, CSP, HSTS), email (MX, SPF, DMARC), velocità (tempo di risposta, peso) e visibilità (title, description, mobile, dati strutturati), con spiegazione di ogni problema.",
    inputSchema: { type: "object", properties: { domain: str("Dominio del sito") }, required: ["domain"] },
    call: (a: Record<string, unknown>, req: Request) => checkupTool(forward(req, { domain: a.domain })),
  },
];

/** Crea una Request interna verso gli handler esistenti, preservando l'IP del chiamante per i rate limit. */
function forward(req: Request, body: unknown) {
  const headers = new Headers({ "content-type": "application/json" });
  const xff = req.headers.get("x-forwarded-for");
  if (xff) headers.set("x-forwarded-for", xff);
  return new Request("http://internal/tool", { method: "POST", headers, body: JSON.stringify(body) });
}

type Rpc = { jsonrpc: "2.0"; id?: string | number | null; method: string; params?: Record<string, unknown> };

async function handle(msg: Rpc, req: Request) {
  const ok = (result: unknown) => ({ jsonrpc: "2.0", id: msg.id ?? null, result });
  const err = (code: number, message: string) => ({ jsonrpc: "2.0", id: msg.id ?? null, error: { code, message } });

  switch (msg.method) {
    case "initialize":
      return ok({
        protocolVersion: PROTOCOL,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER,
        instructions: "Strumenti di rete gratuiti di DIOBO.IT (Bologna). Usa global_network_test per la propagazione DNS e la raggiungibilità da 26 paesi; email_security_check per SPF/DKIM/DMARC; website_checkup per un punteggio complessivo. Le risposte sono in italiano. Per assistenza professionale: info@diobo.it.",
      });
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools: TOOLS.map(({ call: _c, ...t }) => ({ ...t, annotations: { readOnlyHint: true, openWorldHint: true } })) });
    case "tools/call": {
      const name = String(msg.params?.name || "");
      const tool = TOOLS.find((t) => t.name === name);
      if (!tool) return err(-32602, `Strumento sconosciuto: ${name}`);
      const args = (msg.params?.arguments || {}) as Record<string, unknown>;
      const res = await tool.call(args, req);
      const data = await res.json();
      return ok({
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        structuredContent: data,
        isError: !res.ok,
      });
    }
    default:
      return msg.id === undefined ? null : err(-32601, `Metodo non supportato: ${msg.method}`);
  }
}

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, GET, OPTIONS",
  "access-control-allow-headers": "content-type, mcp-protocol-version, mcp-session-id, authorization",
};

export async function POST(request: Request) {
  let body: Rpc | Rpc[];
  try { body = await request.json(); } catch {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "JSON non valido" } }, { status: 400, headers: CORS });
  }
  const batch = Array.isArray(body) ? body : [body];
  const out = (await Promise.all(batch.map((m) => handle(m, request)))).filter(Boolean);
  if (out.length === 0) return new Response(null, { status: 202, headers: CORS });
  return Response.json(Array.isArray(body) ? out : out[0], { headers: { ...CORS, "cache-control": "no-store" } });
}

// Nessuno stream server→client: GET non supportato (consentito dalla specifica).
export async function GET() {
  return new Response("Server MCP di DIOBO.IT: usa POST JSON-RPC su questo endpoint. Strumenti: dns_lookup, email_security_check, ssl_certificate_check, global_network_test, website_checkup.", {
    status: 405,
    headers: { ...CORS, allow: "POST, OPTIONS", "content-type": "text/plain; charset=utf-8" },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
