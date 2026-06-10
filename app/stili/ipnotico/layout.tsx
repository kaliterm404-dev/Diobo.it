import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stile Ipnotico — Galassia | DIOBO.IT",
  description: "Concept di sito web immersivo firmato DIOBO: una galassia di 22.000 stelle che respira mentre la navighi. Esempio dal vivo di cosa possiamo creare.",
  alternates: { canonical: "https://www.diobo.it/stili/ipnotico" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
