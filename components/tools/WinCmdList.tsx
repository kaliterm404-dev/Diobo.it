"use client";

import { useMemo, useState } from "react";
import { GROUPS, OBSOLETE } from "@/lib/wincmd";

const TAG: Record<string, [string, string]> = {
  pro: ["Pro", "Non disponibile su Windows Home"],
  admin: ["Admin", "Richiede i privilegi di amministratore"],
  rsat: ["RSAT", "Richiede gli Strumenti di amministrazione remota del server"],
};

// Tutti i comandi in un'unica lista, in ordine alfabetico del comando
const ALL = GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.id, groupTitle: g.title })))
  .sort((a, b) => a.cmd.replace(/^[^a-z0-9]+/i, "").localeCompare(b.cmd.replace(/^[^a-z0-9]+/i, ""), "it", { sensitivity: "base" }));

const short = (t: string) => t.replace(/\s*\(.*\)$/, "");

export default function WinCmdList() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const needle = q.trim().toLowerCase();

  const rows = useMemo(
    () => ALL.filter((i) => (!cat || i.group === cat) && (!needle || `${i.cmd} ${i.en} ${i.desc}`.toLowerCase().includes(needle))),
    [needle, cat],
  );

  const copy = (c: string) => {
    navigator.clipboard?.writeText(c).then(() => { setCopied(c); setTimeout(() => setCopied(null), 1500); }).catch(() => {});
  };

  const chip = (active: boolean) => ({
    padding: ".35rem .8rem", borderRadius: 999, cursor: "pointer", fontSize: ".82rem",
    border: "1px solid rgba(99,102,241,.45)", background: active ? "rgba(99,102,241,.35)" : "transparent", color: active ? "#fff" : "#c7d2fe",
  });

  return (
    <>
      <form className="tool-form" onSubmit={(e) => e.preventDefault()} role="search">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca in italiano o in inglese: rete, disk, criteri, firewall…" aria-label="Cerca un comando" />
      </form>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", margin: "-.4rem 0 1rem" }}>
        <button type="button" style={chip(!cat)} onClick={() => setCat(null)}>Tutti</button>
        {GROUPS.map((g) => <button key={g.id} type="button" style={chip(cat === g.id)} onClick={() => setCat(cat === g.id ? null : g.id)}>{short(g.title)}</button>)}
      </div>
      <p style={{ color: "#818cf8", fontSize: ".85rem", margin: "0 0 1rem" }}>
        {rows.length} comandi in ordine alfabetico · clic sul comando per copiarlo · <a href="#non-funzionano" style={{ color: "#c7d2fe" }}>comandi che non funzionano più</a>
      </p>

      <div className="tool-card tool-scroll">
        <table className="tool-table">
          <thead><tr><th>Comando</th><th>In inglese</th><th>In italiano</th></tr></thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i.cmd}>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button type="button" onClick={() => copy(i.cmd)} className="mono" title="Copia" style={{ background: "none", border: 0, color: copied === i.cmd ? "#4ade80" : "#fff", cursor: "pointer", padding: 0, textAlign: "left", font: "inherit" }}>
                    {copied === i.cmd ? "✓ copiato" : i.cmd}
                  </button>
                </td>
                <td style={{ color: "#a5b4fc" }} lang="en">{i.en}</td>
                <td>
                  {i.desc}
                  {i.tags?.map((t) => (
                    <span key={t} title={TAG[t][1]} style={{ marginLeft: ".5rem", fontSize: ".7rem", padding: ".1rem .45rem", borderRadius: 6, border: "1px solid rgba(251,191,36,.5)", color: "#fbbf24", whiteSpace: "nowrap" }}>{TAG[t][0]}</span>
                  ))}
                  <span style={{ display: "block", fontSize: ".72rem", color: "#64748b" }}>{short(i.groupTitle)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p style={{ color: "#a0a0c0" }}>Nessun comando trovato.</p>}
      </div>

      <section id="non-funzionano" className="tool-card tool-scroll">
        <h2>Non funzionano più su Windows 10 e 11</h2>
        <p style={{ margin: "-.3rem 0 .8rem", color: "#a0a0c0", fontSize: ".9rem" }}>Si trovano ancora in tante liste online, ma risalgono a Windows XP. Ecco cosa usare oggi.</p>
        <table className="tool-table">
          <thead><tr><th>Comando</th><th>Cos&apos;era</th><th>Oggi</th></tr></thead>
          <tbody>
            {[...OBSOLETE].sort((a, b) => a.cmd.localeCompare(b.cmd, "it")).map((o) => (
              <tr key={o.cmd}><td className="mono" style={{ color: "#f87171" }}>{o.cmd}</td><td>{o.what}</td><td className="mono">{o.instead}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
