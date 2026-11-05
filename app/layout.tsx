import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
  description: "Siti web veloci e sicuri da 390 €, assistenza IT da 49 €/mese, domini ed email pro, grafica e logo a Bologna. Un sistemista vero che costruisce anche il web.",
  keywords: ["diobo", "siti web bologna", "assistenza informatica bologna", "sistemista bologna", "email professionale", "web design bologna", "grafica bologna", "logo aziendale", "consulenza IT", "domini web", "realizzazione siti"],
  authors: [{ name: "DIOBO.IT" }],
  openGraph: {
    title: "DIOBO.IT — Siti Web, Domini, Grafica",
    description: "Creiamo esperienze digitali che lasciano il segno. Siti web, domini, grafica e consulenza IT a Bologna.",
    url: "https://www.diobo.it",
    siteName: "DIOBO.IT",
    type: "website",
    locale: "it_IT",
    images: [{ url: "https://www.diobo.it/logo.png", width: 660, height: 740, alt: "DIOBO.IT Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DIOBO.IT — Siti Web, Domini, Grafica",
    description: "Creiamo esperienze digitali che lasciano il segno. Bologna.",
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
                "description": "Creiamo siti web spettacolari, registriamo domini facili da ricordare, progettiamo loghi unici e offriamo consulenza informatica completa.",
                "email": "dioboinfo@gmail.com",
                "areaServed": {
                  "@type": "City",
                  "name": "Bologna",
                  "containedInPlace": { "@type": "Country", "name": "Italia" }
                },
                "knowsAbout": [
                  "Web Design", "Sviluppo Siti Web", "Consulenza IT",
                  "Registrazione Domini", "Grafica", "Logo Design",
                  "Assistenza Informatica", "Web Development"
                ],
                "sameAs": []
              },
              {
                "@type": "LocalBusiness",
                "@id": "https://www.diobo.it/#localbusiness",
                "name": "DIOBO.IT",
                "url": "https://www.diobo.it",
                "email": "dioboinfo@gmail.com",
                "image": "https://www.diobo.it/logo.png",
                "description": "Siti web, domini, grafica e consulenza IT a Bologna. Creiamo esperienze digitali che lasciano il segno.",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Bologna",
                  "addressRegion": "Emilia-Romagna",
                  "addressCountry": "IT"
                },
                "priceRange": "€€",
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Servizi Digitali",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": { "@type": "Service", "name": "Realizzazione Siti Web", "description": "Dal one-page al sito completo, veloci e sicuri" }, "priceSpecification": { "@type": "PriceSpecification", "minPrice": "390", "priceCurrency": "EUR" }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": { "@type": "Service", "name": "Registrazione Domini", "description": "Domini semplici da ricordare" }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": { "@type": "Service", "name": "Grafica e Logo Design", "description": "Logo distintivo, rappresentativo ed unico. Grafica semplice ed elegante" }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": { "@type": "Service", "name": "Assistenza IT e sistemistica", "description": "Reti, server, backup e sicurezza. Dal server al singolo dispositivo" }, "priceSpecification": { "@type": "UnitPriceSpecification", "price": "49", "priceCurrency": "EUR", "unitText": "mese" }
                    }
                  ]
                }
              },
              {
                "@type": "WebSite",
                "@id": "https://www.diobo.it/#website",
                "name": "DIOBO.IT",
                "url": "https://www.diobo.it",
                "description": "Il tuo universo digitale",
                "publisher": { "@id": "https://www.diobo.it/#organization" },
                "inLanguage": "it-IT"
              }
            ]
          }) }}
        />
        {children}<Analytics />
      </body>
    </html>
  );
}
