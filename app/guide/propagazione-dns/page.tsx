import type { Metadata } from "next";
import Link from "next/link";

const URL = "https://www.diobo.it/guide/propagazione-dns";
const TITLE = "Propagazione DNS: quanto dura e come controllarla dopo un cambio";
const DESC = "Cos'è davvero la propagazione DNS, perché dopo un cambio alcuni vedono il sito vecchio e altri il nuovo, quanto dura (TTL, nameserver, registro .it) e come controllarla paese per paese.";

export const metadata: Metadata = {
  title: `${TITLE} | DIOBO.IT`,
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESC, url: "/guide/propagazione-dns", type: "article", locale: "it_IT" },
};

const FAQ: [string, string][] = [
  ["Quanto dura la propagazione DNS?", "Per un record (A, MX, TXT…) dipende dal suo TTL: se era 1 ora, entro 1 ora tutti vedono il valore nuovo. Per un cambio di nameserver serve anche l'aggiornamento del registro del dominio: di solito da pochi minuti a qualche ora, al massimo 24-48 ore."],
  ["Posso accelerarla?", "Sì, preparandola: abbassa il TTL dei record a 5 minuti uno o due giorni prima del cambio. Dopo il cambio non si può forzare la cache dei resolver altrui."],
  ["Durante la propagazione il sito va giù?", "No, se il vecchio e il nuovo DNS rispondono entrambi correttamente: chi usa il dato vecchio arriva al server vecchio, chi usa il nuovo al nuovo. Il sito va giù solo se si spegne il vecchio server troppo presto."],
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "TechArticle", headline: TITLE, description: DESC, url: URL, inLanguage: "it-IT", datePublished: "2026-11-08", dateModified: "2026-11-08", author: { "@id": "https://www.diobo.it/#organization" }, publisher: { "@id": "https://www.diobo.it/#organization" }, about: ["DNS", "propagazione DNS", "TTL", "nameserver"] },
    { "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
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
      <p style={{ color: "#818cf8", fontSize: ".85rem", margin: "0" }}><Link href="/guide" style={{ color: "#818cf8" }}>Guide</Link> · DNS · 8 novembre 2026</p>
      <h1 className="tools-title">{TITLE}</h1>
      <p className="tools-lead">Hai cambiato l&apos;IP del sito, spostato la posta o cambiato i nameserver, e qualcuno vede ancora il vecchio? Non è un guasto: è la cache del DNS. Ecco come funziona, quanto dura e come vederla con i tuoi occhi.</p>
      <p style={{ background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.35)", borderRadius: 12, padding: "1rem" }}>
        Vuoi solo vedere a che punto sei? Usa la <Link href="/strumenti/mondo">propagazione DNS dal mondo</Link>: interroga sonde reali in 26 paesi e ti mostra su una mappa chi vede già il valore nuovo.
      </p>

      <H>Non si &quot;propaga&quot;: scade</H>
      <P>Il termine è fuorviante. Quando cambi un record, il nuovo valore è subito sui nameserver del dominio. Il problema sono i <b>resolver</b> (quelli del tuo operatore, di Google, di Cloudflare…), che tengono in cache la risposta vecchia finché non scade il suo <b>TTL</b> (time to live). Ogni resolver l&apos;ha messa in cache in un momento diverso, quindi la vede scadere in un momento diverso: per questo per un po&apos; il mondo è diviso a metà.</P>

      <H>Quanto dura: dipende da cosa hai cambiato</H>
      <ul>
        <li><b>Un record</b> (A, AAAA, CNAME, MX, TXT): al massimo il TTL che aveva <i>prima</i> del cambio. Con TTL di 1 ora, dopo 1 ora tutti vedono il nuovo.</li>
        <li><b>I nameserver</b> (lo spostamento del DNS da un provider all&apos;altro): prima il registrar deve comunicarlo al registro del dominio (per i <code>.it</code> il Registro .it), poi scade la cache dei record NS, che spesso ha TTL di ore. Di solito da minuti a qualche ora, al massimo 24-48 ore.</li>
      </ul>
      <P>Esempio reale: diobo.it ha spostato il DNS da Vercel a Cloudflare. Cambio dei nameserver sul pannello del registrar alle 19:17, Registro .it aggiornato alle 20:06, Cloudflare attivo alle 20:09. Il sito non si è mai fermato, perché vecchio e nuovo DNS davano le stesse risposte.</P>

      <H>Come controllarla da riga di comando</H>
      <P>Chiedi lo stesso record a resolver diversi e confronta:</P>
      <Code>{`dig +short A esempio.it @1.1.1.1      # Cloudflare
dig +short A esempio.it @8.8.8.8      # Google
dig +short A esempio.it @9.9.9.9      # Quad9
dig +noall +answer A esempio.it       # mostra anche il TTL residuo`}</Code>
      <P>Per un cambio di nameserver la verità è nel registro: chiedi i NS direttamente a un server del TLD, senza cache.</P>
      <Code>{`dig +norec NS esempio.it @a.dns.it   # per i domini .it`}</Code>
      <P>Da Windows: <code>nslookup -type=A esempio.it 1.1.1.1</code>. Il limite di questi test è che partono tutti dalla tua rete: per vedere cosa succede in altri paesi serve un controllo distribuito come il nostro <Link href="/strumenti/mondo">test dal mondo</Link>.</P>

      <H>Come fare un cambio senza disservizio</H>
      <ol>
        <li><b>Uno o due giorni prima</b> abbassa il TTL dei record che cambierai (es. 300 secondi).</li>
        <li><b>Prepara la destinazione</b>: nuovo server pronto, oppure, se cambi nameserver, la zona già completa sul nuovo provider. Interroga direttamente i nuovi nameserver (<code>dig @nuovo-ns esempio.it</code>) prima di attivarli.</li>
        <li><b>Fai il cambio</b> e controlla con la mappa dal mondo.</li>
        <li><b>Tieni acceso il vecchio</b> finché tutti vedono il nuovo: almeno il vecchio TTL, meglio un giorno per i nameserver.</li>
        <li><b>Rialza il TTL</b> (es. 1 ora) a cambio concluso.</li>
      </ol>
      <P>Per la posta vale lo stesso, con un rischio in più: durante il cambio degli MX alcune mail possono arrivare al vecchio server. Tieni attiva la vecchia casella per qualche giorno.</P>

      <H>Domande frequenti</H>
      {FAQ.map(([q, a]) => (
        <div key={q} style={{ marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1rem", color: "#fff", margin: "0 0 .3rem" }}>{q}</h3>
          <p style={{ margin: 0, color: "#c7d2fe" }}>{a}</p>
        </div>
      ))}

      <H>Devi spostare un dominio o un sito?</H>
      <P>Lo facciamo noi, dal DNS alla posta, senza fermare niente: <Link href="/#contatti">scrivici</Link> o usa il <Link href="/#checkup">check-up gratuito</Link> per vedere come sei messo oggi.</P>
    </main>
  );
}
