import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy | DIOBO.IT",
  description: "Come DIOBO.IT tratta i dati: cosa raccogliamo quando usi gli strumenti e il check-up, cosa non facciamo, a chi ci appoggiamo e come esercitare i tuoi diritti.",
  alternates: { canonical: "https://www.diobo.it/privacy" },
  openGraph: { title: "Privacy | DIOBO.IT", description: "Come DIOBO.IT tratta i dati di chi usa il sito, gli strumenti e il modulo di contatto.", url: "/privacy", type: "website", locale: "it_IT" },
  robots: { index: true, follow: true },
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "1rem", letterSpacing: ".08em", color: "#a5b4fc", margin: "2rem 0 .6rem" }}>{children}</h2>
);

export default function Page() {
  return (
    <main className="tools-page" style={{ lineHeight: 1.7 }}>
      <h1 className="tools-title">Privacy</h1>
      <p className="tools-lead">Informativa breve ai sensi del Regolamento UE 2016/679 (GDPR). Ultimo aggiornamento: 8 novembre 2026.</p>

      <H>Titolare del trattamento</H>
      <p>Il gestore del sito diobo.it, contattabile a <a href="mailto:info@diobo.it">info@diobo.it</a>.</p>

      <H>Cosa raccogliamo</H>
      <p>Quando usi il check-up o gli strumenti di rete, riceviamo il dominio o l&apos;indirizzo IP che inserisci e lo usiamo solo per eseguire il controllo che hai chiesto. Per farlo vediamo anche, come ogni sito, l&apos;indirizzo IP da cui ti colleghi: lo usiamo per limitare gli abusi (numero massimo di richieste al minuto) e per lo strumento &quot;Qual è il mio IP&quot;.</p>

      <H>Cosa non facciamo</H>
      <p>Nessuna registrazione, nessuna profilazione, nessuna pubblicità, nessun cookie di tracciamento. Non vendiamo né cediamo i tuoi dati a nessuno.</p>

      <H>Servizi tecnici di cui ci avvaliamo</H>
      <ul>
        <li><b>Vercel Inc.</b> (USA): hosting del sito e statistiche di visita aggregate e anonime, senza cookie.</li>
        <li><b>Cloudflare Inc.</b> (USA): DNS del dominio e ricezione della posta su info@diobo.it.</li>
        <li><b>Brevo SAS</b> (Francia, UE): invio delle email da info@diobo.it e dei messaggi del modulo di contatto.</li>
        <li><b>Globalping</b> (rete aperta di sonde in molti paesi): esegue i test &quot;dal mondo&quot;. Riceve solo il dominio o l&apos;IP da testare, non i tuoi dati personali.</li>
      </ul>

      <H>Trasferimenti fuori dall&apos;Unione Europea</H>
      <p>Vercel e Cloudflare hanno sede negli Stati Uniti: i dati tecnici che trattano (indirizzo IP, richieste al sito, email in transito) possono essere elaborati fuori dall&apos;UE. Entrambe aderiscono all&apos;EU-U.S. Data Privacy Framework e applicano le clausole contrattuali standard approvate dalla Commissione Europea. I test &quot;dal mondo&quot; partono per loro natura da sonde in paesi extra-UE, ma ricevono solo il nome di dominio o l&apos;IP pubblico da controllare.</p>

      <H>Log tecnici e conservazione</H>
      <p>Non teniamo log nostri delle ricerche fatte con gli strumenti. I fornitori conservano log tecnici di sicurezza e diagnostica (indirizzo IP, pagina richiesta, orario) per periodi brevi definiti nelle loro informative, di norma da poche ore a 30 giorni, poi li cancellano. Le email ricevute restano nella nostra casella finché servono a gestire la tua richiesta.</p>

      <H>Email</H>
      <p>Se ci scrivi a info@diobo.it, con il modulo di contatto o con i pulsanti &quot;Sistematemelo&quot; e &quot;Contattaci&quot;, usiamo nome, email e messaggio solo per risponderti e gestire la tua richiesta. Base giuridica: la tua richiesta (misure precontrattuali). Non li usiamo per newsletter né li cediamo a terzi.</p>

      <H>I tuoi diritti</H>
      <p>Puoi chiedere accesso, rettifica o cancellazione dei tuoi dati scrivendo a <a href="mailto:info@diobo.it">info@diobo.it</a>. Hai anche diritto di proporre reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).</p>
    </main>
  );
}
