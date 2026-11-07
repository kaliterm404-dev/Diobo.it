import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools";

const BASE = "https://www.diobo.it";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/strumenti`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...TOOLS.map((t) => ({ url: `${BASE}/strumenti/${t.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...["elegante", "wow", "ipnotico"].map((s) => ({ url: `${BASE}/stili/${s}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
