"use client";

const universes = [
  { slug: "elegante", label: "ELEGANTE" },
  { slug: "wow", label: "WOW" },
  { slug: "ipnotico", label: "IPNOTICO" },
];

export default function UniverseSwitcher({ active }: { active: string }) {
  return (
    <>
      {/* Switcher universi */}
      <div style={{
        position: "fixed", top: "1rem", right: "1rem", zIndex: 50,
        display: "flex", gap: "0.5rem", alignItems: "center",
        fontFamily: "var(--font-orbitron)", fontSize: "0.65rem", letterSpacing: "0.15em",
      }}>
        <span style={{ color: "#475569", fontSize: "0.6rem", marginRight: "0.3rem", display: "inline-block" }}>
          CAMBIA UNIVERSO
        </span>
        {universes.map((u) => (
          <a
            key={u.slug}
            href={`/stili/${u.slug}`}
            style={u.slug === active ? {
              color: "#e0e7ff", textDecoration: "none", padding: "0.5rem 0.9rem",
              border: "1px solid rgba(99,102,241,0.6)", borderRadius: "20px",
              background: "rgba(99,102,241,0.15)",
            } : {
              color: "#64748b", textDecoration: "none", padding: "0.5rem 0.9rem",
              border: "1px solid rgba(99,102,241,0.2)", borderRadius: "20px",
            }}
          >
            {u.label}
          </a>
        ))}
      </div>

      {/* Home + badge concept */}
      <div style={{
        position: "fixed", top: "1rem", left: "1rem", zIndex: 50,
        display: "flex", flexDirection: "column", gap: "0.4rem",
        fontFamily: "var(--font-orbitron)",
      }}>
        <a href="/" style={{
          color: "#e0e7ff", textDecoration: "none", fontSize: "0.8rem",
          letterSpacing: "0.2em",
        }}>
          ← DIOBO<span style={{ color: "#6366f1" }}>.IT</span>
        </a>
        <span style={{
          fontSize: "0.55rem", letterSpacing: "0.25em", color: "#475569",
        }}>
          CONCEPT DIOBO
        </span>
      </div>
    </>
  );
}
