"use client";
import { useState } from "react";
import { useTool } from "./useTool";

type Spf = { domain: string; record: string | null; lookups: number; error?: string; includes: Spf[] };
type Res = { domain: string; mx: { priority: number; exchange: string }[]; spf: Spf; dmarc: { record: string; tags: Record<string, string> } | null; dkim: { selector: string; record: string }[]; notes: string[] };

const POLICY: Record<string, string> = { none: "solo osservazione: le mail false passano", quarantine: "le mail false finiscono in spam", reject: "le mail false vengono respinte" };

function SpfTree({ n, depth = 0 }: { n: Spf; depth?: number }) {
  return (
    <div style={{ marginLeft: depth * 16, borderLeft: depth ? "1px solid rgba(99,102,241,.3)" : "none", paddingLeft: depth ? 10 : 0, marginTop: 6 }}>
      <div className="mono"><b>{n.domain}</b>{n.error && <span className="tool-bad"> — {n.error}</span>}</div>
      {n.record && <div className="mono" style={{ color: "#a0a0c0" }}>{n.record}</div>}
      {n.includes.map((c, i) => <SpfTree key={i} n={c} depth={depth + 1} />)}
    </div>
  );
}

export default function MailTool() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("");
  const { data, error, loading, run } = useTool<Res>("/api/tools/mail");
  return (
    <>
      <form className="tool-form" onSubmit={(e) => { e.preventDefault(); if (q.trim()) run({ domain: q, selector: sel || undefined }); }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="esempio.it" aria-label="Dominio" autoCapitalize="none" spellCheck={false} />
        <input value={sel} onChange={(e) => setSel(e.target.value)} placeholder="selettore DKIM (facoltativo)" aria-label="Selettore DKIM" style={{ flex: "0 1 220px" }} autoCapitalize="none" spellCheck={false} />
        <button disabled={loading}>{loading ? "ANALIZZO…" : "ANALIZZA"}</button>
      </form>
      {error && <p className="tool-err">{error}</p>}
      {data && (
        <>
          <div className="tool-card">
            <h2>Verdetto per {data.domain}</h2>
            {data.notes.length === 0 ? <p className="tool-ok">✓ Configurazione completa: MX, SPF, DKIM e DMARC presenti e coerenti.</p>
              : <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>{data.notes.map((n, i) => <li key={i} className="tool-warn" style={{ marginBottom: 4 }}>{n}</li>)}</ul>}
          </div>
          <div className="tool-card"><h2>MX — chi riceve la posta</h2>
            {data.mx.length ? data.mx.map((m, i) => <div key={i} className="mono">{m.priority} {m.exchange}</div>) : <span className="tool-bad">nessun MX</span>}
          </div>
          <div className="tool-card"><h2>SPF — lookup DNS: <span className={data.spf.lookups > 10 ? "tool-bad" : "tool-ok"}>{data.spf.lookups}/10</span></h2>
            <SpfTree n={data.spf} />
          </div>
          <div className="tool-card"><h2>DMARC</h2>
            {data.dmarc ? (<>
              <div className="mono">{data.dmarc.record}</div>
              <p style={{ marginTop: 8 }}>Policy <b>{data.dmarc.tags.p}</b>: {POLICY[data.dmarc.tags.p] || "valore non standard"}.
                {data.dmarc.tags.rua ? <> Report aggregati a <span className="mono">{data.dmarc.tags.rua}</span>.</> : " Nessun report configurato."}</p>
            </>) : <span className="tool-bad">assente</span>}
          </div>
          <div className="tool-card"><h2>DKIM — selettori trovati</h2>
            {data.dkim.length ? data.dkim.map((k) => <div key={k.selector} style={{ marginBottom: 6 }}><b className="mono">{k.selector}</b> <span className="mono" style={{ color: "#a0a0c0" }}>{k.record}</span></div>)
              : <span className="tool-warn">nessuno tra i selettori comuni: prova a indicare il tuo</span>}
          </div>
        </>
      )}
    </>
  );
}
