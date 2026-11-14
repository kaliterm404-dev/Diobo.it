import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import SiteNav from "@/components/SiteNav";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DIOBO.IT — Siti Web e Assistenza IT a Bologna | Dal server al sito",
  description: "Siti web, assistenza IT, domini ed email professionali a Bologna, da un sistemista vero che costruisce anche il web. Dal server al sito.",
  authors: [{ name: "DIOBO.IT" }],
  metadataBase: new URL("https://www.diobo.it"),
  openGraph: {
    title: "DIOBO.IT — Siti web e assistenza IT a Bologna, da un sistemista",
    description: "Siti web, assistenza IT, domini ed email professionali a Bologna, da un sistemista vero che costruisce anche il web. Dal server al sito.",
    url: "/",
    siteName: "DIOBO.IT",
    type: "website",
    locale: "it_IT",
    images: [{ url: "https://www.diobo.it/logo.png", width: 660, height: 740, alt: "DIOBO.IT Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DIOBO.IT — Siti web e assistenza IT a Bologna, da un sistemista",
    description: "Siti web, assistenza IT, domini ed email professionali a Bologna, da un sistemista vero che costruisce anche il web. Dal server al sito.",
    images: ["https://www.diobo.it/logo.png"],
  },
  verification: {
    google: "fVLBr-MgbWKs94q4YS-ECHI0O0LuWx-6U6ptuv_etm8",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.diobo.it",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${orbitron.variable} ${exo2.variable} h-full antialiased`}>
      <body className="min-h-full w-full bg-black text-white overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://www.diobo.it/#organization",
                "name": "DIOBO.IT",
                "url": "https://www.diobo.it",
                "logo": "https://www.diobo.it/logo.png",
                "description": "Siti web, assistenza IT, domini ed email professionali a Bologna, da un sistemista vero che costruisce anche il web. Dal server al sito.",
                "email": "info@diobo.it",
                "areaServed": {
                  "@type": "City",
                  "name": "Bologna",
                  "containedInPlace": { "@type": "Country", "name": "Italia" }
                },
                "knowsAbout": [
                  "Sviluppo siti web", "Next.js", "Hosting", "DNS", "Email deliverability", "SPF", "DKIM", "DMARC",
                  "Certificati SSL/TLS", "Assistenza informatica", "Amministrazione di sistema", "Virtualizzazione VMware e Proxmox",
                  "Reti aziendali e VLAN", "Firewall e VPN", "Windows Server e Active Directory", "Microsoft 365",
                  "Backup e disaster recovery", "Monitoraggio Zabbix", "Mappa in realtime della rete", "Grafica e logo design"
                ],
                "slogan": "Dal server al sito",
                "sameAs": []
              },
              {
                "@type": "LocalBusiness",
                "@id": "https://www.diobo.it/#localbusiness",
                "name": "DIOBO.IT",
                "url": "https://www.diobo.it",
                "email": "info@diobo.it",
                "image": "https://www.diobo.it/logo.png",
                "description": "Siti web, assistenza IT, domini ed email professionali a Bologna, da un sistemista vero che costruisce anche il web. Dal server al sito.",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Bologna",
                  "addressRegion": "Emilia-Romagna",
                  "addressCountry": "IT"
                },
                "areaServed": [
                  { "@type": "City", "name": "Bologna" },
                  { "@type": "AdministrativeArea", "name": "Emilia-Romagna" },
                  { "@type": "Country", "name": "Italia" }
                ],
                "knowsLanguage": "it",
                "contactPoint": { "@type": "ContactPoint", "email": "info@diobo.it", "contactType": "customer service", "availableLanguage": "Italian" }
              },
              {
                "@type": "WebSite",
                "@id": "https://www.diobo.it/#website",
                "name": "DIOBO.IT",
                "url": "https://www.diobo.it",
                "description": "Siti web, assistenza IT, domini ed email professionali a Bologna, da un sistemista vero che costruisce anche il web. Dal server al sito. Strumenti di rete gratuiti e server MCP pubblico.",
                "publisher": { "@id": "https://www.diobo.it/#organization" },
                "inLanguage": "it-IT"
              }
            ]
          }) }}
        />
        <SiteNav />
        {children}<Analytics />
      </body>
    </html>
  );
}
