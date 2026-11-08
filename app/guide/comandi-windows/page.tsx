import type { Metadata } from "next";
import Link from "next/link";
import WinCmdList from "@/components/tools/WinCmdList";
import { GROUPS } from "@/lib/wincmd";

const URL = "https://www.diobo.it/guide/comandi-windows";
const H1 = "Comandi utili di Windows";
const TITLE = "Comandi utili di Windows 10 e 11: Esegui, .msc, .cpl e riga di comando";
const DESC = "I comandi utili di Windows 10 e 11 verificati da un sistemista: casella Esegui (Win+R), console .msc, pannello .cpl, cartelle rapide, ms-settings e comandi di rete e riparazione. Con ricerca e copia.";

export const metadata: Metadata = {
  title: `${TITLE} | DIOBO.IT`,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: "/guide/comandi-windows", type: "article", locale: "it_IT" },
};

const FAQ: [string, string][] = [
  ["Come si apre la finestra Esegui?", "Con la scorciatoia Win+R. Scrivi il comando e premi Invio; con Ctrl+Maiusc+Invio lo avvii come amministratore."],
  ["Perché gpedit.msc non si apre?", "Editor Criteri di gruppo, Utenti e gruppi locali e Criteri di sicurezza locali non sono inclusi in Windows Home: servono le edizioni Pro, Enterprise o Education."],
  ["Qual è la differenza tra .msc e .cpl?", "I file .msc sono console di amministrazione (snap-in MMC), i .cpl sono le finestre del Pannello di controllo. Si avviano entrambi dalla casella Esegui."],
  ["Perché alcuni comandi trovati online non funzionano?", "Molte liste risalgono a Windows XP: comandi come syskey, wupdmgr, nusrmgr.cpl o dfrg.msc non esistono più. In fondo alla pagina trovi cosa usare al loro posto."],
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "TechArticle", headline: TITLE, description: DESC, url: URL, inLanguage: "it-IT", datePublished: "2026-11-08", dateModified: "2026-11-08", author: { "@id": "https://www.diobo.it/#organization" }, publisher: { "@id": "https://www.diobo.it/#organization" }, about: ["Windows 10", "Windows 11", "comandi Esegui", "MMC", "Pannello di controllo"] },
    { "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ],
};

export default function Page() {
  const n = GROUPS.reduce((s, g) => s + g.items.length, 0);
  return (
    <main className="tools-page" style={{ lineHeight: 1.65 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p style={{ color: "#818cf8", fontSize: ".85rem", margin: 0 }}><Link href="/guide" style={{ color: "#818cf8" }}>Guide</Link> · Windows · 8 novembre 2026</p>
      <h1 className="tools-title">{H1}</h1>
      <p className="tools-lead">
        {n} comandi per Windows 10 e 11, scelti e verificati da un sistemista: quelli da scrivere nella casella <b>Esegui</b>{" "}(Win+R), le console di amministrazione, le cartelle rapide e i comandi da terminale che risolvono davvero i problemi. Niente comandi di Windows XP spacciati per attuali: quelli sono in fondo, con l&apos;alternativa di oggi.
      </p>
      <p style={{ color: "#a0a0c0", fontSize: ".9rem", margin: "0 0 1.5rem" }}>
        Vai a: {GROUPS.map((g, i) => <span key={g.id}>{i ? " · " : ""}<a href={`#${g.id}`} style={{ color: "#c7d2fe" }}>{g.title}</a></span>)}
      </p>
      <WinCmdList />
      <section className="tool-card" style={{ marginTop: "2rem" }}>
        <h2>Domande frequenti</h2>
        {FAQ.map(([q, a]) => (
          <div key={q} style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1rem", color: "#fff", margin: "0 0 .3rem" }}>{q}</h3>
            <p style={{ margin: 0, color: "#c7d2fe" }}>{a}</p>
          </div>
        ))}
      </section>
      <p className="tool-cta">PC lenti, rete che salta, criteri che non si applicano? <Link href="/#contatti">Scrivici</Link>: l&apos;assistenza IT è il nostro mestiere.</p>
    </main>
  );
}
