"use client";
import { useState } from "react";
import { useTool } from "./useTool";

type Res = { host: string; ip: string; authorized: boolean; authError?: string; subject?: string; issuer?: string; validFrom?: string; validTo?: string; daysLeft?: number; san: string[]; protocol?: string; cipher?: string; chain: { subject: string; issuer: string; validTo: string }[] };

export default function SslTool() {
  const [q, setQ] = useState("");
  const { data, error, loading, run } = useTool<Res>("/api/tools/ssl");
  const days = data?.daysLeft ?? 0;
  return (
    <>
      <form className="tool-form" onSubmit={(e) => { e.preventDefault(); if (q.trim()) run({ host: q }); }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="www.esempio.it" aria-label="Host" autoCapitalize="none" spellCheck={false} />
        <button disabled={loading}>{loading ? "CONTROLLO…" : "CONTROLLA"}</button>
      </form>
      {error && <p className="tool-err">{error}</p>}
      {data && (
        <>
          <div className="tool-card">
            <h2>{data.host} <span className="mono" style={{ color: "#64748b" }}>({data.ip})</span></h2>
            <p className={data.authorized ? (days < 14 ? "tool-warn" : "tool-ok") : "tool-bad"} style={{ fontSize: "1.2rem", margin: "0 0 1rem" }}>
              {data.authorized ? (days < 14 ? `⚠ Valido ma scade tra ${days} giorni` : `✓ Valido, scade tra ${days} giorni`) : `✗ Non valido: ${data.authError}`}
            </p>
            <table className="tool-table"><tbody>
              <tr><th>Intestato a</th><td className="mono">{data.subject}</td></tr>
              <tr><th>Emesso da</th><td className="mono">{data.issuer}</td></tr>
              <tr><th>Validità</th><td className="mono">{data.validFrom} → {data.validTo}</td></tr>
              <tr><th>Protocollo</th><td className="mono">{data.protocol} · {data.cipher}</td></tr>
              <tr><th>Nomi coperti</th><td className="mono">{data.san.join(", ")}</td></tr>
            </tbody></table>
          </div>
          <div className="tool-card"><h2>Catena dei certificati</h2>
            {data.chain.map((c, i) => <div key={i} className="mono" style={{ marginBottom: 6 }}>{i + 1}. {c.subject} <span style={{ color: "#818cf8" }}>← {c.issuer}</span> <span style={{ color: "#64748b" }}>(scade {c.validTo})</span></div>)}
          </div>
        </>
      )}
    </>
  );
}
