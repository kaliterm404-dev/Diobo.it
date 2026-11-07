import Link from "next/link";
import { TOOLS } from "@/lib/tools";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tools-page">
      <Link href="/" style={{ color: "#818cf8", textDecoration: "none", fontFamily: "var(--font-orbitron)", letterSpacing: ".15em", fontSize: ".85rem" }}>
        DIOBO<span style={{ color: "#6366f1" }}>.IT</span>
      </Link>
      <nav className="tools-nav" aria-label="Strumenti">
        <Link href="/strumenti">Tutti gli strumenti</Link>
        {TOOLS.map((t) => <Link key={t.slug} href={`/strumenti/${t.slug}`}>{t.name}</Link>)}
      </nav>
      {children}
      <p className="tool-cta">
        Problemi con DNS, posta o certificati? <Link href="/#checkup">Fai il check-up completo del tuo sito</Link> oppure scrivici a <a href="mailto:info@diobo.it">info@diobo.it</a>. · <Link href="/privacy">Privacy</Link>
      </p>
    </div>
  );
}
