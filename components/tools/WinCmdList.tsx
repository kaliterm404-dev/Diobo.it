"use client";

import { useMemo, useState } from "react";
import { GROUPS, OBSOLETE } from "@/lib/wincmd";

const TAG: Record<string, [string, string]> = {
  pro: ["Pro", "Non disponibile su Windows Home"],
  admin: ["Admin", "Richiede i privilegi di amministratore"],
  rsat: ["RSAT", "Richiede gli Strumenti di amministrazione remota del server"],
};

export default function WinCmdList() {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const needle = q.trim().toLowerCase();

  const groups = useMemo(
    () => GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => !needle || (i.cmd + " " + i.desc).toLowerCase().includes(needle)) })).filter((g) => g.items.length),
    [needle],
  );
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  const copy = (c: string) => {
    navigator.clipboard?.writeText(c).then(() => { setCopied(c); setTimeout(() => setCopied(null), 1500); }).catch(() => {});
  };

  return (
    <>
      <form className="tool-form" onSubmit={(e) => e.preventDefault()} role="search">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca: rete, disco, criteri, utenti, firewall…" aria-label="Cerca un comando" />
      </form>
      <p style={{ color: "#818cf8", fontSize: ".85rem", margin: "-.5rem 0 1.25rem" }}>
        {total} comandi{needle ? ` per “${q}”` : ""} · clic sul comando per copiarlo · <a href="#non-funzionano" style={{ color: "#c7d2fe" }}>comandi che non funzionano più</a>
      </p>

      {groups.map((g) => (
        <section key={g.id} id={g.id} className="tool-card tool-scroll">
          <h2>{g.title}</h2>
          <p style={{ margin: "-.3rem 0 .8rem", color: "#a0a0c0", fontSize: ".9rem" }}>{g.intro}</p>
          <table className="tool-table">
            <tbody>
              {g.items.map((i) => (
                <tr key={i.cmd}>
                  <td style={{ width: "38%" }}>
                    <button type="button" onClick={() => copy(i.cmd)} className="mono" title="Copia" style={{ background: "none", border: 0, color: copied === i.cmd ? "#4ade80" : "#fff", cursor: "pointer", padding: 0, textAlign: "left", font: "inherit" }}>
                      {copied === i.cmd ? "✓ copiato" : i.cmd}
                    </button>
                  </td>
                  <td>
                    {i.desc}
                    {i.tags?.map((t) => (
                      <span key={t} title={TAG[t][1]} style={{ marginLeft: ".5rem", fontSize: ".7rem", padding: ".1rem .45rem", borderRadius: 6, border: "1px solid rgba(251,191,36,.5)", color: "#fbbf24", whiteSpace: "nowrap" }}>{TAG[t][0]}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <section id="non-funzionano" className="tool-card tool-scroll">
        <h2>Non funzionano più su Windows 10 e 11</h2>
        <p style={{ margin: "-.3rem 0 .8rem", color: "#a0a0c0", fontSize: ".9rem" }}>Si trovano ancora in tante liste online, ma risalgono a Windows XP. Ecco cosa usare oggi.</p>
        <table className="tool-table">
          <thead><tr><th>Comando</th><th>Cos&apos;era</th><th>Oggi</th></tr></thead>
          <tbody>
            {OBSOLETE.map((o) => (
              <tr key={o.cmd}><td className="mono" style={{ color: "#f87171" }}>{o.cmd}</td><td>{o.what}</td><td className="mono">{o.instead}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
