import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";

const BASE = "https://www.diobo.it";

// Date di ultima modifica REALI per pagina: aggiornarle quando cambia il contenuto.
const UPDATED: Record<string, string> = {
  "/": "2026-11-14",
  "/mappa-realtime": "2026-11-14",
  "/strumenti": "2026-11-08",
  "/guide": "2026-11-08",
  "/guide/spf-dkim-dmarc": "2026-11-07",
  "/guide/propagazione-dns": "2026-11-08",
  "/guide/comandi-windows": "2026-11-08",
  "/chi-siamo": "2026-11-07",
  "/privacy": "2026-11-08",
};
const TOOLS_UPDATED = "2026-11-07";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) =>
    ({ url: `${BASE}${path === "/" ? "" : path}`, lastModified: new Date(UPDATED[path]), changeFrequency, priority });
  return [
    page("/", 1, "weekly"),
    page("/mappa-realtime", 0.9, "monthly"),
    page("/strumenti", 0.9, "monthly"),
    ...TOOLS.map((t) => ({ url: `${BASE}/strumenti/${t.slug}`, lastModified: new Date(TOOLS_UPDATED), changeFrequency: "monthly" as const, priority: 0.8 })),
    page("/guide", 0.7, "monthly"),
    page("/guide/spf-dkim-dmarc", 0.8, "yearly"),
    page("/guide/propagazione-dns", 0.8, "yearly"),
    page("/guide/comandi-windows", 0.8, "monthly"),
    page("/chi-siamo", 0.6, "yearly"),
    page("/privacy", 0.2, "yearly"),
  ];
}
