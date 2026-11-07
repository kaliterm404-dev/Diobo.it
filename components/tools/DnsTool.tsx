"use client";
import { useState } from "react";
import { useTool } from "./useTool";

type Res = { target: string; kind: "host" | "ip"; records: Record<string, string[]>; compare?: Record<string, string[]> };

export default function DnsTool() {
  const [q, setQ] = useState("");
  const { data, error, loading, run } = useTool<Res>("/api/tools/dns");
  const same = data?.compare ? new Set(Object.values(data.compare).map((v) => v.join(","))).size === 1 : true;
  return (
    <>
      <form className="tool-form" onSubmit={(e) => { e.preventDefault(); if (q.trim()) run({ domain: q }); }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="esempio.it oppure un IP per il PTR" aria-label="Dominio o IP" autoCapitalize="none" spellCheck={false} />
        <button disabled={loading}>{loading ? "CERCO…" : "CERCA"}</button>
      </form>
      {error && <p className="tool-err">{error}</p>}
      {data && (
        <>
          <div className="tool-card tool-scroll">
            <h2>Record DNS di {data.target}</h2>
            <table className="tool-table"><tbody>
              {Object.entries(data.records).map(([t, v]) => (
                <tr key={t}><th style={{ width: 90 }}>{t}</th><td className="mono">{v.length ? v.map((x, i) => <div key={i}>{x}</div>) : <span style={{ color: "#64748b" }}>nessun record</span>}</td></tr>
              ))}
            </tbody></table>
          </div>
          {data.compare && (
            <div className="tool-card">
              <h2>Confronto tra resolver (record A) {same ? <span className="tool-ok">· concordano</span> : <span className="tool-warn">· NON concordano: propagazione in corso</span>}</h2>
              <table className="tool-table"><tbody>
                {Object.entries(data.compare).map(([n, v]) => <tr key={n}><th style={{ width: 160 }}>{n}</th><td className="mono">{v.join(", ") || "—"}</td></tr>)}
              </tbody></table>
            </div>
          )}
        </>
      )}
    </>
  );
}
