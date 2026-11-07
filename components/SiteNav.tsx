"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/#servizi", label: "Servizi" },
  { href: "/#checkup", label: "Check-up" },
  { href: "/strumenti", label: "Strumenti" },
  { href: "/guide/spf-dkim-dmarc", label: "Guide" },
  { href: "/chi-siamo", label: "Chi siamo" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);

  const active = (href: string) => {
    if (href.startsWith("/#")) return false;
    const root = "/" + href.split("/")[1];
    return path === href || path.startsWith(root + "/") || path === root;
  };

  return (
    <header className={`site-nav${scrolled || open ? " site-nav--solid" : ""}`}>
      <div className="site-nav__inner">
        <Link href="/" className="site-nav__logo" aria-label="DIOBO.IT, home">
          DIOBO<span>.IT</span>
        </Link>
        <button className="site-nav__burger" aria-expanded={open} aria-controls="site-menu" aria-label={open ? "Chiudi menu" : "Apri menu"} onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
        <nav id="site-menu" className={`site-nav__links${open ? " is-open" : ""}`} aria-label="Menu principale">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}>{l.label}</Link>
          ))}
          <a href="mailto:info@diobo.it" className="site-nav__cta">Contatti</a>
        </nav>
      </div>
    </header>
  );
}
