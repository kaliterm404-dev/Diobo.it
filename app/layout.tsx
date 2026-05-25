import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DIOBO.IT — Siti Web, Domini, Grafica e Consulenza IT a Bologna",
  description: "Creiamo siti web spettacolari, registriamo domini facili da ricordare, progettiamo loghi unici e offriamo consulenza informatica completa. Bologna.",
  keywords: ["diobo", "siti web bologna", "web design bologna", "grafica bologna", "logo aziendale", "consulenza IT", "domini web", "realizzazione siti"],
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
    <html lang="it" className={`${orbitron.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full w-full bg-black text-white overflow-x-hidden">{children}<Analytics /></body>
    </html>
  );
}
