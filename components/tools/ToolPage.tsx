import type { ToolMeta } from "@/lib/tools";

export default function ToolPage({ meta, children }: { meta: ToolMeta; children: React.ReactNode }) {
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: meta.title,
        url: `https://www.diobo.it/strumenti/${meta.slug}`,
        description: meta.description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        inLanguage: "it-IT",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        provider: { "@id": "https://www.diobo.it/#organization" },
      },
      {
        "@type": "FAQPage",
        mainEntity: meta.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h1 className="tools-title">{meta.title}</h1>
      <p className="tools-lead">{meta.description}</p>
      {children}
      <section className="tool-card" style={{ marginTop: "2rem" }}>
        <h2>Domande frequenti</h2>
        {meta.faq.map(([q, a]) => (
          <div key={q} style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1rem", color: "#fff", margin: "0 0 .3rem" }}>{q}</h3>
            <p style={{ margin: 0, color: "#c7d2fe", lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
      </section>
    </>
  );
}
