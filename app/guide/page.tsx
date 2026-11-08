import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide tecniche: DNS, email, comandi Windows | DIOBO.IT",
  description: "Guide pratiche scritte da un sistemista: comandi utili di Windows, propagazione DNS, SPF, DKIM e DMARC, con esempi reali e strumenti gratuiti.",
  alternates: { canonical: "https://www.diobo.it/guide" },
  openGraph: { title: "Guide tecniche di DIOBO.IT", description: "DNS, email, Windows, sicurezza del sito: guide pratiche con esempi reali.", url: "/guide", type: "website", locale: "it_IT" },
};

const GUIDE = [
  { href: "/guide/comandi-windows", title: "Comandi utili di Windows", desc: "Esegui, console .msc, pannello .cpl, cartelle rapide, ms-settings e comandi di rete e riparazione per Windows 10 e 11. Con ricerca e copia.", tool: { href: "/strumenti/ip", label: "Il mio IP" } },
  { href: "/guide/propagazione-dns", title: "Propagazione DNS: quanto dura e come controllarla", desc: "TTL, nameserver, registro .it, comandi per verificare e come cambiare senza disservizio.", tool: { href: "/strumenti/mondo", label: "Test dal mondo" } },
  { href: "/guide/spf-dkim-dmarc", title: "SPF, DKIM e DMARC: perché le email finiscono in spam", desc: "Cosa sono, errori comuni (doppio SPF, limite dei 10 lookup, p=none) e sequenza giusta per attivarli.", tool: { href: "/strumenti/mail", label: "Controllo email" } },
];

export default function Page() {
  return (
    <main className="tools-page">
      <h1 className="tools-title">Guide</h1>
      <p className="tools-lead">Guide pratiche scritte da un sistemista, con esempi reali presi dal nostro lavoro. Ogni guida ha il suo strumento gratuito per verificare subito.</p>
      <div className="tool-grid">
        {GUIDE.map((g) => (
          <div key={g.href} className="tool-card" style={{ display: "flex", flexDirection: "column" }}>
            <h2><Link href={g.href} style={{ color: "#a5b4fc", textDecoration: "none" }}>{g.title}</Link></h2>
            <p style={{ margin: "0 0 1rem", color: "#c7d2fe", flex: 1 }}>{g.desc}</p>
            <p style={{ margin: 0, fontSize: ".9rem" }}>
              <Link href={g.href} style={{ color: "#fff" }}>Leggi la guida →</Link>
              <span style={{ color: "#64748b" }}> · </span>
              <Link href={g.tool.href} style={{ color: "#818cf8" }}>{g.tool.label}</Link>
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
