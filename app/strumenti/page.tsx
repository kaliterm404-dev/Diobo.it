import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Strumenti di rete gratuiti: DNS, IP, SPF/DMARC, SSL, subnet | DIOBO.IT",
  description: "La cassetta del sistemista: propagazione DNS dal mondo, il mio IP, DNS lookup, verifica SPF/DKIM/DMARC, certificato SSL e calcolatore subnet. Gratis, senza pubblicità.",
  alternates: { canonical: "https://www.diobo.it/strumenti" },
  openGraph: { title: "La cassetta del sistemista: strumenti di rete gratuiti", description: "Propagazione DNS dal mondo, il mio IP, DNS lookup, SPF/DKIM/DMARC, certificato SSL, calcolatore subnet. Gratis e senza pubblicità.", url: "/strumenti", type: "website", locale: "it_IT" },
};

export default function Page() {
  return (
    <>
      <h1 className="tools-title">La cassetta del sistemista</h1>
      <p className="tools-lead">Gli strumenti di rete che cerchi sempre e non trovi mai. Gratis, senza pubblicità, senza registrazione. Funzionano anche dentro gli assistenti AI come Claude e ChatGPT: li abbiamo collegati via MCP, lo standard che fa parlare l'intelligenza artificiale con gli strumenti esterni.</p>
      <div className="tool-grid">
        {TOOLS.map((t) => (
          <Link key={t.slug} href={`/strumenti/${t.slug}`}>
            <div className="tool-card" style={{ height: "100%" }}>
              <h2>{t.name}</h2>
              <p style={{ margin: 0, color: "#c7d2fe" }}>{t.short}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
