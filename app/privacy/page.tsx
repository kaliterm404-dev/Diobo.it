import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy | DIOBO.IT",
  description: "Come DIOBO.IT tratta i dati: cosa raccogliamo quando usi gli strumenti e il check-up, cosa non facciamo, a chi ci appoggiamo e come esercitare i tuoi diritti.",
  alternates: { canonical: "https://www.diobo.it/privacy" },
  robots: { index: true, follow: true },
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "1rem", letterSpacing: ".08em", color: "#a5b4fc", margin: "2rem 0 .6rem" }}>{children}</h2>
);

export default function Page() {
  return (
    <main className="tools-page" style={{ lineHeight: 1.7 }}>
      <h1 className="tools-title">Privacy</h1>
      <p className="tools-lead">Informativa breve ai sensi del Regolamento UE 2016/679 (GDPR). Ultimo aggiornamento: 7 novembre 2026.</p>

      <H>Titolare del trattamento</H>
      <p>Il gestore del sito diobo.it, contattabile a <a href="mailto:info@diobo.it">info@diobo.it</a>.</p>

      <H>Cosa raccogliamo</H>
      <p>Quando usi il check-up o gli strumenti di rete, riceviamo il dominio o l&apos;indirizzo IP che inserisci e lo usiamo solo per eseguire il controllo che hai chiesto. Per farlo vediamo anche, come ogni sito, l&apos;indirizzo IP da cui ti colleghi: lo usiamo per limitare gli abusi (numero massimo di richieste al minuto) e per lo strumento &quot;Qual è il mio IP&quot;.</p>

      <H>Cosa non facciamo</H>
      <p>Nessuna registrazione, nessuna profilazione, nessuna pubblicità, nessun cookie di tracciamento. Non vendiamo né cediamo i tuoi dati a nessuno.</p>

      <H>Servizi tecnici di cui ci avvaliamo</H>
      <ul>
        <li><b>Vercel</b>: hosting del sito e statistiche di visita aggregate e anonime, senza cookie.</li>
        <li><b>Cloudflare</b>: DNS del dominio e ricezione della posta su info@diobo.it.</li>
        <li><b>Globalping</b> (rete aperta di sonde): esegue i test &quot;dal mondo&quot;. Riceve solo il dominio o l&apos;IP da testare, non i tuoi dati.</li>
        <li><b>Brevo</b>: invio delle email da info@diobo.it.</li>
      </ul>

      <H>Log tecnici</H>
      <p>I sistemi di hosting conservano log essenziali di sicurezza e diagnostica (indirizzo IP, pagina richiesta, orario) per un periodo limitato, poi vengono cancellati automaticamente.</p>

      <H>Email</H>
      <p>Se ci scrivi a info@diobo.it, anche tramite i pulsanti &quot;Contattaci&quot; o &quot;Sistematemelo&quot;, usiamo i tuoi dati solo per risponderti e gestire la tua richiesta.</p>

      <H>I tuoi diritti</H>
      <p>Puoi chiedere accesso, rettifica o cancellazione dei tuoi dati scrivendo a <a href="mailto:info@diobo.it">info@diobo.it</a>. Hai anche diritto di proporre reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).</p>
    </main>
  );
}
