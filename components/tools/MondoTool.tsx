"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTool } from "./useTool";
import { countryName, flag } from "./countries";
import type { MapPoint } from "./WorldMap";

const WorldMap = dynamic(() => import("./WorldMap"), { ssr: false });

type Row = { country: string; city: string; network: string; asn: number; lat: number; lon: number; ok: boolean; values: string[]; ms: number | null };
type Res = { target: string; type: string; cached: boolean; majority: string | null; rows: Row[] };

const MODES = [
  { v: "dns", label: "Propagazione DNS" },
  { v: "ping", label: "Ping dal mondo" },
  { v: "http", label: "Sito raggiungibile (HTTP)" },
  { v: "traceroute", label: "Traceroute (8 paesi)" },
];

export default function MondoTool({ initialMode = "dns" }: { initialMode?: string }) {
  const [target, setTarget] = useState("");
  const [mode, setMode] = useState(initialMode);
  const [record, setRecord] = useState("A");
  const { data, error, loading, run } = useTool<Res>("/api/tools/mondo");

  const state = (r: Row): MapPoint["state"] =>
    !r.ok ? "bad" : data?.type === "dns" && data.majority && r.values.join(",") !== data.majority ? "diff" : "ok";

  const points: MapPoint[] = (data?.rows || []).map((r) => ({ country: r.country, lat: r.lat, lon: r.lon, state: state(r) }));
  const okCount = data?.rows.filter((r) => state(r) === "ok").length ?? 0;

  return (
    <>
      <form className="tool-form" onSubmit={(e) => { e.preventDefault(); if (target.trim()) run({ target, type: mode, record }); }}>
        <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="esempio.it oppure 8.8.8.8" aria-label="Dominio o IP" autoCapitalize="none" spellCheck={false} />
        <select value={mode} onChange={(e) => setMode(e.target.value)} aria-label="Tipo di test">
          {MODES.map((m) => <option key={m.v} value={m.v}>{m.label}</option>)}
        </select>
        {mode === "dns" && (
          <select value={record} onChange={(e) => setRecord(e.target.value)} aria-label="Tipo di record">
            {["A", "AAAA", "MX", "NS", "TXT", "CNAME"].map((r) => <option key={r}>{r}</option>)}
          </select>
        )}
        <button disabled={loading}>{loading ? "SONDE IN VOLO…" : "CONTROLLA"}</button>
      </form>
      {loading && <p className="tools-lead">Sto interrogando sonde reali in 26 paesi. Ci vogliono 5-15 secondi.</p>}
      {error && <p className="tool-err">{error}</p>}

      {data && (
        <>
          <div className="tool-card">
            <h2>{data.target} — {okCount}/{data.rows.length} paesi ok{data.cached ? " · risultato di pochi minuti fa" : ""}</h2>
            <WorldMap points={points} />
          </div>
          <div className="tool-card tool-scroll">
            <table className="tool-table">
              <thead><tr><th>Paese</th><th>Città / rete</th><th>Risultato</th><th>Esito</th></tr></thead>
              <tbody>
                {data.rows.slice().sort((a, b) => countryName(a.country).localeCompare(countryName(b.country))).map((r, i) => {
                  const s = state(r);
                  return (
                    <tr key={i}>
                      <td>{flag(r.country)} {countryName(r.country)}</td>
                      <td>{r.city}<br /><small style={{ color: "#818cf8" }}>{r.network} (AS{r.asn})</small></td>
                      <td className="mono">{data.type === "traceroute"
                        ? <details><summary>{r.values.length} salti</summary>{r.values.map((h, j) => <div key={j}>{j + 1}. {h}</div>)}</details>
                        : r.values.join(" · ") || "—"}</td>
                      <td className={s === "ok" ? "tool-ok" : s === "diff" ? "tool-warn" : "tool-bad"}>{s === "ok" ? "✓" : s === "diff" ? "≠" : "✗"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
