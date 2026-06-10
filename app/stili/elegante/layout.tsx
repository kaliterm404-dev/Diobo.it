import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stile Elegante — Concept | DIOBO.IT",
  description: "Concept di sito web elegante e tipografico firmato DIOBO: aurora, tipografia leggera, design premium e sobrio. Esempio dal vivo di cosa possiamo creare.",
  alternates: { canonical: "https://www.diobo.it/stili/elegante" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
