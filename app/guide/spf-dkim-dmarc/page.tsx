import type { Metadata } from "next";
import Link from "next/link";

const URL = "https://www.diobo.it/guide/spf-dkim-dmarc";
const TITLE = "SPF, DKIM e DMARC: come verificarli e perché le tue email finiscono in spam";
const DESC = "Guida pratica a SPF, DKIM e DMARC: cosa sono, come leggerli, gli errori più comuni (doppio SPF, limite dei 10 lookup, DMARC p=none) e come verificarli gratis.";

export const metadata: Metadata = {
  title: `${TITLE} | DIOBO.IT`,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: URL, type: "article", locale: "it_IT" },
};

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      headline: TITLE,
      description: DESC,
      url: URL,
      inLanguage: "it-IT",
      datePublished: "2026-11-07",
      dateModified: "2026-11-07",
      author: { "@id": "https://www.diobo.it/#organization" },
      publisher: { "@id": "https://www.diobo.it/#organization" },
      about: ["SPF", "DKIM", "DMARC", "email deliverability", "email spoofing"],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        ["Posso avere due record SPF?", "No. Un dominio deve avere un solo record TXT che inizia con v=spf1. Con due record il controllo fallisce (permerror). Le varie sorgenti vanno unite in un unico record con più include."],
        ["Cosa succede se supero 10 lookup SPF?", "Il record diventa non valido (permerror) e molti server lo trattano come assente: le email possono finire in spam o essere rifiutate."],
        ["DMARC p=none protegge?", "No: con p=none i provider segnalano ma consegnano comunque le email false. Serve per osservare; la protezione arriva con quarantine o reject."],
      ].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
};

const P = ({ children }: { children: React.ReactNode }) => <p style={{ margin: "0 0 1rem", color: "#e0e7ff" }}>{children}</p>;
const H = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "1.15rem", letterSpacing: ".04em", color: "#a5b4fc", margin: "2.4rem 0 .8rem" }}>{children}</h2>
);
const Code = ({ children }: { children: React.ReactNode }) => (
  <pre className="mono" style={{ background: "rgba(5,5,20,.9)", border: "1px solid rgba(99,102,241,.25)", borderRadius: 10, padding: "1rem", overflowX: "auto", whiteSpace: "pre-wrap", color: "#c7d2fe", margin: "0 0 1rem" }}>{children}</pre>
);

export default function Page() {
  return (
    <main className="tools-page" style={{ lineHeight: 1.75, maxWidth: 820 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p style={{ color: "#818cf8", fontSize: ".85rem", margin: "0" }}><Link href="/guide" style={{ color: "#818cf8" }}>Guide</Link> · posta elettronica · 7 novembre 2026</p>
      <h1 className="tools-title">{TITLE}</h1>
      <p className="tools-lead">
        Se le tue email arrivano in spam, o un cliente ti dice di aver ricevuto una mail &quot;tua&quot; che non hai mai scritto, il problema quasi sempre è in tre record DNS: SPF, DKIM e DMARC. Qui trovi cosa fanno, come leggerli e gli errori che vediamo più spesso.
      </p>
      <p style={{ background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.35)", borderRadius: 12, padding: "1rem" }}>
        Vuoi solo la risposta? Inserisci il tuo dominio nel <Link href="/strumenti/mail">controllo SPF, DKIM e DMARC</Link>: ti dice in pochi secondi cosa manca.
      </p>

      <H>Il problema: chiunque può scrivere &quot;da&quot; il tuo dominio</H>
      <P>Il protocollo della posta (SMTP) è nato senza controlli sul mittente: chiunque può spedire una mail con scritto <code>info@tuaazienda.it</code> nel campo &quot;Da&quot;. SPF, DKIM e DMARC sono le tre aggiunte che permettono a Gmail, Outlook e agli altri provider di verificare se una mail viene davvero da te.</P>

      <H>SPF: chi è autorizzato a spedire</H>
      <P>SPF è un record TXT sul dominio che elenca i server autorizzati a inviare posta a suo nome. Esempio reale, quello di diobo.it:</P>
      <Code>v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com -all</Code>
      <P>Si legge così: possono spedire i server di Cloudflare e di Brevo; tutti gli altri no (<code>-all</code>). La parte finale conta: <code>~all</code> chiede di considerare sospette le altre mail, <code>-all</code> di rifiutarle, <code>?all</code> e <code>+all</code> di fatto non proteggono.</P>
      <P><b>Errori comuni:</b></P>
      <ul>
        <li><b>Due record SPF</b>: succede quando si aggiunge un servizio (newsletter, gestionale) e si crea un secondo <code>v=spf1</code> invece di aggiungere un <code>include</code> al primo. Con due record SPF il controllo fallisce.</li>
        <li><b>Più di 10 lookup DNS</b>: ogni <code>include</code>, <code>a</code>, <code>mx</code>, <code>exists</code> e <code>redirect</code> costa un&apos;interrogazione, e anche gli include annidati contano. Oltre 10 il record è considerato non valido. Il nostro strumento li conta e mostra l&apos;albero degli include.</li>
        <li><b>Servizio dimenticato</b>: il sito che manda le notifiche, il gestionale che invia le fatture. Se spediscono a nome del dominio e non sono nel record, le loro mail falliscono.</li>
      </ul>

      <H>DKIM: la firma digitale della mail</H>
      <P>Con DKIM il server che spedisce firma ogni messaggio con una chiave privata; la chiave pubblica sta nel DNS, sotto un &quot;selettore&quot;. Chi riceve verifica la firma e sa che il messaggio non è stato alterato e viene da un server autorizzato dal dominio.</P>
      <Code>brevo1._domainkey.diobo.it  CNAME  →  chiave pubblica DKIM pubblicata da Brevo</Code>
      <P>Il nome prima di <code>._domainkey</code> è il selettore e lo sceglie il servizio di posta: <code>google</code> per Google Workspace, <code>selector1</code> e <code>selector2</code> per Microsoft 365, nomi propri per gli altri. Se il nostro strumento non trova DKIM, indica il selettore del tuo provider nel campo apposito.</P>

      <H>DMARC: cosa fare quando i controlli falliscono</H>
      <P>DMARC è il record che lega tutto insieme. Dice ai provider cosa fare con una mail che usa il tuo dominio ma non supera SPF o DKIM, e dove mandarti i report.</P>
      <Code>_dmarc.diobo.it   v=DMARC1; p=reject; adkim=r; aspf=r; rua=mailto:…</Code>
      <ul>
        <li><code>p=none</code>: osserva soltanto. Le mail false vengono consegnate. Utile solo come primo passo.</li>
        <li><code>p=quarantine</code>: le mail false finiscono in spam.</li>
        <li><code>p=reject</code>: le mail false vengono respinte. È la protezione vera.</li>
      </ul>
      <P>Un dettaglio che sfugge spesso: per DMARC non basta che SPF o DKIM passino, devono essere <b>allineati</b> al dominio nel campo &quot;Da&quot;. Una mail inviata da Gmail come <code>info@tuaazienda.it</code> passa SPF e DKIM per <i>gmail.com</i>, ma per DMARC del tuo dominio non vale nulla.</P>

      <H>La sequenza giusta per attivarli</H>
      <ol>
        <li>Elenca tutti i servizi che spediscono a nome del dominio: posta, sito, newsletter, gestionale.</li>
        <li>Unisci tutto in un solo record SPF e controlla di restare sotto i 10 lookup.</li>
        <li>Attiva DKIM su ogni servizio che lo supporta.</li>
        <li>Pubblica DMARC con <code>p=none</code> e un indirizzo per i report.</li>
        <li>Manda mail vere e verifica nelle intestazioni (&quot;Mostra originale&quot; in Gmail) che compaia <code>dmarc=pass</code>.</li>
        <li>Solo allora passa a <code>quarantine</code> e poi a <code>reject</code>.</li>
      </ol>
      <P>È esattamente la sequenza usata per diobo.it: DMARC è passato a <code>reject</code> solo dopo aver visto <code>dmarc=pass</code> su una mail reale.</P>

      <H>Verifica il tuo dominio</H>
      <P>
        Il <Link href="/strumenti/mail">controllo email</Link> mostra MX, SPF con il conteggio dei lookup, DKIM e DMARC, con le spiegazioni dei problemi trovati. Per un quadro completo del sito c&apos;è il <Link href="/#checkup">check-up gratuito</Link>. Se preferisci che ci pensiamo noi: <a href="mailto:info@diobo.it">info@diobo.it</a>.
      </P>
    </main>
  );
}
