import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chi c'è dietro DIOBO.IT — un sistemista, non un'agenzia | DIOBO.IT",
  description: "DIOBO.IT è il progetto di un sistemista di Bologna con oltre vent'anni di esperienza su server, reti, virtualizzazione e Microsoft 365, che costruisce anche siti web.",
  alternates: { canonical: "https://www.diobo.it/chi-siamo" },
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "1rem", letterSpacing: ".08em", color: "#a5b4fc", margin: "2.2rem 0 .7rem", textTransform: "uppercase" }}>{children}</h2>
);
const L = ({ items }: { items: string[] }) => (
  <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#e0e7ff" }}>{items.map((i) => <li key={i} style={{ marginBottom: ".35rem" }}>{i}</li>)}</ul>
);

const ld = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://www.diobo.it/chi-siamo",
  name: "Chi c'è dietro DIOBO.IT",
  about: { "@id": "https://www.diobo.it/#organization" },
  inLanguage: "it-IT",
};

export default function Page() {
  return (
    <main className="tools-page" style={{ lineHeight: 1.75 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Link href="/" style={{ color: "#818cf8", textDecoration: "none", fontFamily: "var(--font-orbitron)", letterSpacing: ".15em", fontSize: ".85rem" }}>
        DIOBO<span style={{ color: "#6366f1" }}>.IT</span>
      </Link>
      <h1 className="tools-title">Chi c&apos;è dietro DIOBO</h1>
      <p className="tools-lead">
        Un sistemista di Bologna con oltre vent&apos;anni su server, reti e infrastrutture: laboratori, impianti, CED e lavoro sul campo, in aziende e per clienti in tutta Italia. DIOBO nasce per portare lo stesso metodo a chi ha un&apos;attività e un sito da far funzionare davvero.
      </p>

      <H>Di cosa mi occupo ogni giorno</H>
      <L items={[
        "Virtualizzazione: VMware vSphere, Proxmox VE, cluster HA, ZFS, migrazioni a caldo",
        "Reti: VLAN, routing, firewall, DMZ, VPN IPSec, SSL e WireGuard, Wi-Fi aziendale",
        "Sistemi: Windows Server, Active Directory, Linux, Microsoft 365 ed Entra ID",
        "Backup e disaster recovery, storage NAS e SAN",
        "Monitoraggio con Zabbix, inventario e gestione asset",
        "Documentazione completa dell'infrastruttura: procedure, schemi di rete, configurazioni",
      ]} />

      <H>Sul campo</H>
      <L items={[
        "Installazione e manutenzione di reti e apparati presso clienti",
        "Diagnosi di guasti intermittenti di rete con analisi dei log e test sui cavi",
        "Supporto a macchinari di produzione e pannelli operatore",
      ]} />

      <H>Perché un sistemista fa siti web</H>
      <p>
        Un sito non è solo grafica: è un dominio, un DNS, un certificato, una casella di posta che non finisce in spam, un server che risponde in fretta. Chi fa siti di solito si ferma alla pagina; chi fa il sistemista sa cosa c&apos;è sotto. DIOBO mette insieme le due cose: il sito, e tutto quello che serve perché funzioni e resti sicuro.
      </p>

      <H>Come lavoriamo con l&apos;intelligenza artificiale</H>
      <p>
        L&apos;AI fa parte degli strumenti di lavoro, come un terminale o un analizzatore di rete. La usiamo per scrivere script, rivedere documentazione e configurazioni, e per sviluppare: questo sito, i suoi strumenti di rete e il server MCP sono stati costruiti insieme a più assistenti AI, ognuno con un ruolo (sviluppo, revisione dei testi, coordinamento). Le decisioni, le verifiche e la responsabilità restano umane.
      </p>

      <H>Contatti</H>
      <p>
        Scrivi a <a href="mailto:info@diobo.it">info@diobo.it</a>. Bologna e provincia di persona, il resto d&apos;Italia da remoto. Prima di contattarci puoi fare il <Link href="/#checkup">check-up gratuito del tuo sito</Link> o usare gli <Link href="/strumenti">strumenti di rete</Link>.
      </p>
    </main>
  );
}
