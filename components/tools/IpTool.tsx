"use client";
import { useEffect, useState } from "react";
import { countryName, flag } from "./countries";

type Res = { ip: string; version: number; ptr: string[]; country: string | null; region: string | null; city: string | null; timezone: string | null; userAgent: string | null; acceptLanguage: string | null };

export default function IpTool() {
  const [d, setD] = useState<Res | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => { fetch("/api/tools/ip").then((r) => r.json()).then(setD).catch(() => setErr(true)); }, []);
  if (err) return <p className="tool-err">Non riesco a leggere il tuo IP. Riprova.</p>;
  if (!d) return <p className="tools-lead">Leggo il tuo indirizzo…</p>;
  const rows: [string, string][] = [
    ["Tipo", `IPv${d.version}`],
    ["Reverse DNS (PTR)", d.ptr.join(", ") || "—"],
    ["Posizione indicativa", [d.city, d.region, d.country ? `${flag(d.country)} ${countryName(d.country)}` : null].filter(Boolean).join(", ") || "—"],
    ["Fuso orario", d.timezone || "—"],
    ["Browser (User-Agent)", d.userAgent || "—"],
    ["Lingue del browser", d.acceptLanguage || "—"],
  ];
  return (
    <div className="tool-card">
      <h2>Il tuo IP pubblico</h2>
      <p className="mono" style={{ fontSize: "clamp(1.4rem,4vw,2.2rem)", color: "#fff", margin: "0 0 1rem" }}>{d.ip}</p>
      <button className="tools-copy" onClick={() => navigator.clipboard?.writeText(d.ip)} style={{ marginBottom: "1rem", background: "none", border: "1px solid rgba(99,102,241,.5)", color: "#c7d2fe", borderRadius: 8, padding: ".35rem .8rem", cursor: "pointer" }}>Copia</button>
      <table className="tool-table"><tbody>{rows.map(([k, v]) => <tr key={k}><th>{k}</th><td className="mono">{v}</td></tr>)}</tbody></table>
    </div>
  );
}
