import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stile Wow — Viaggio Interstellare | DIOBO.IT",
  description: "Concept di sito web spettacolare firmato DIOBO: un viaggio 3D nello spazio tra pianeti, stargate e iperspazio. Esempio dal vivo di cosa possiamo creare.",
  alternates: { canonical: "https://www.diobo.it/stili/wow" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
