import type { Metadata } from "next";
import Link from "next/link";

const TITLE = "Mappa di rete in realtime su Zabbix, anche multisede | DIOBO.IT";
const DESC = "Dashboard visuale con mappa di rete (networking) in realtime sopra Zabbix: scalabile, multisede e personalizzabile. Cosa funziona, cosa si è rotto e chi è collegato. Esempio di mappa Zabbix in video.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://www.diobo.it/mappa-realtime" },
  openGraph: { title: "Mappa di rete in realtime su Zabbix, anche multisede", description: DESC, url: "/mappa-realtime", type: "website", locale: "it_IT", images: [{ url: "/mappa-realtime/copertina.jpg", width: 1280, height: 720 }] },
};

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: "var(--font-orbitron)", fontSize: "1rem", letterSpacing: ".08em", color: "#a5b4fc", margin: "2.4rem 0 .7rem", textTransform: "uppercase" }}>{children}</h2>
);
const L = ({ items }: { items: string[] }) => (
  <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#e0e7ff" }}>{items.map((i) => <li key={i} style={{ marginBottom: ".4rem" }}>{i}</li>)}</ul>
);

const ld = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mappa in realtime",
    serviceType: "Mappa di rete (networking) in tempo reale su Zabbix, multisede",
    description: DESC,
    url: "https://www.diobo.it/mappa-realtime",
    provider: { "@id": "https://www.diobo.it/#organization" },
    areaServed: "IT",
    inLanguage: "it-IT",
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Esempio di mappa Zabbix multisede in realtime: dal mondo al disco guasto",
    description: "Dimostrazione con un'azienda inventata di sedici sedi: nasce un allarme, la mappa lo mostra e si scende fino all'apparato che si è rotto.",
    thumbnailUrl: "https://www.diobo.it/mappa-realtime/copertina.jpg",
    contentUrl: "https://www.diobo.it/mappa-realtime/mappa-in-realtime.mp4",
    uploadDate: "2026-11-14",
    duration: "PT30S",
    inLanguage: "it-IT",
  },
];

export default function Page() {
  return (
    <main className="tools-page" style={{ lineHeight: 1.75 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h1 className="tools-title">Mappa in realtime</h1>
      <p className="tools-lead">
        Una dashboard visuale della tua rete, con mappa in realtime, costruita sopra Zabbix: cosa funziona, cosa si è rotto e chi è collegato, mentre succede. Scalabile, anche multisede, e personalizzabile.
      </p>

      <video
        controls
        playsInline
        muted
        preload="none"
        poster="/mappa-realtime/copertina.jpg"
        aria-label="Video dimostrativo della Mappa in realtime: nasce un allarme e si scende fino all'apparato guasto"
        style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: "14px", border: "1px solid rgba(124,131,255,.45)", background: "#060a16", boxShadow: "0 20px 70px rgba(0,0,0,.55)" }}
      >
        <source src="/mappa-realtime/mappa-in-realtime-720.mp4" type="video/mp4" media="(max-width: 900px)" />
        <source src="/mappa-realtime/mappa-in-realtime.mp4" type="video/mp4" />
      </video>
      <p style={{ color: "#818cf8", fontSize: ".85rem", marginTop: ".6rem" }}>
        Un esempio di mappa Zabbix multisede, trenta secondi senza audio. Azienda e dati sono inventati.
      </p>

      <H>La mappa di rete, dal vivo</H>
      <L items={[
        "Ogni apparato è sulla mappa: respira se risponde, si spegne se tace.",
        "Sulle linee scorre il traffico vero.",
        "Dischi, memoria e temperature degli apparati sotto controllo.",
        "Scalabile: da una sede sola a una mappa multisede.",
        "Personalizzabile: la mappa si disegna sulla tua rete.",
      ]} />

      <H>Quando qualcosa si rompe</H>
      <L items={[
        "L'allarme si vede nel momento in cui nasce, nel punto esatto della mappa.",
        "Un clic sull'apparato dice cosa è successo e da quanto.",
      ]} />

      <H>Chi c&apos;è in rete</H>
      <L items={[
        "Scrivi un nome e trovi la persona, il suo computer e il suo indirizzo.",
        "Indirizzi dei dispositivi sempre aggiornati, in realtime.",
        "Per i dispositivi in Wi-Fi: a quale access point sono collegati e, dove possibile, con che segnale.",
      ]} />

      <H>Il monitoraggio</H>
      <p>
        La mappa lavora sopra Zabbix, il sistema di monitoraggio open source. Se in azienda non c&apos;è, portiamo noi anche quello. Si apre da un browser: sui computer non si installa niente.
      </p>

      <H>Un esempio di mappa Zabbix multisede</H>
      <p>
        Due fermi immagine della mappa dimostrativa. Un clic li apre grandi.
      </p>
      <div className="mappa-fermi" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
        {[
          { f: "mappa-mondo", t: "Sedici sedi in una mappa", a: "Esempio di mappa di rete multisede su Zabbix: sedici sedi collegate, con un allarme acceso" },
          { f: "mappa-sede", t: "La sede e l'apparato guasto", a: "Esempio di mappa Zabbix: una sede da vicino, con il NAS in allarme e la scheda del guasto" },
        ].map((x) => (
          <a key={x.f} href={`/mappa-realtime/${x.f}.webp`} target="_blank" rel="noopener" style={{ textDecoration: "none", color: "inherit" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/mappa-realtime/${x.f}-anteprima.webp`} alt={x.a} width={1280} height={720} loading="lazy"
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px", border: "1px solid rgba(124,131,255,.45)" }} />
            <span style={{ display: "block", color: "#a5b4fc", fontSize: ".85rem", marginTop: ".45rem" }}>{x.t} · apri grande ↗</span>
          </a>
        ))}
      </div>
      <p style={{ marginTop: "1.2rem" }}>
        Per ingrandire fino al singolo apparato c&apos;è il <a href="/mappa-realtime/mappa-in-realtime.pdf">PDF con la mappa in vettoriale</a> (1,3 MB).
      </p>

      <H>Per informazioni</H>
      <p>
        Scrivi a <a href="mailto:info@diobo.it?subject=Mappa%20in%20realtime">info@diobo.it</a> oppure usa il <Link href="/#contatti">modulo di contatto</Link>. Bologna e provincia di persona, il resto d&apos;Italia da remoto.
      </p>
    </main>
  );
}
