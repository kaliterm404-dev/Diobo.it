import type { MetadataRoute } from "next";

// Aperto a motori di ricerca e assistenti AI: vogliamo essere letti, citati e usati.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider", "meta-externalagent", "DuckAssistBot", "MistralAI-User"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt"] },
    ],
    sitemap: "https://www.diobo.it/sitemap.xml",
    host: "https://www.diobo.it",
  };
}
