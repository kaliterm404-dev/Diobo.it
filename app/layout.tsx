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
  title: "DIOBO.IT — Siti Web, Domini, Grafica",
  description: "Siti web dal nome facile, grafica elegante, logo unico. Consulenza informatica a Bologna.",
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
