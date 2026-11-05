"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Mail, Gauge, Search, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";

type Status = "ok" | "warn" | "bad";
type Check = { id: string; area: string; label: string; status: Status; detail: string; why: string; weight: number };
type Result = { host: string; score: number; checks: Check[] };

const AREAS = [
  { key: "Sicurezza", icon: ShieldCheck },
  { key: "Email", icon: Mail },
  { key: "Velocità", icon: Gauge },
  { key: "Visibilità", icon: Search },
];

const STEPS = [
  "Interrogo i DNS…",
  "Controllo il certificato HTTPS…",
  "Analizzo gli header di sicurezza…",
  "Verifico se la tua email è falsificabile…",
  "Misuro i tempi di risposta…",
  "Leggo il sito come lo legge Google…",
];

const COLOR: Record<Status, string> = { ok: "#4ade80", warn: "#fbbf24", bad: "#f87171" };

function scoreColor(s: number) {
  return s >= 80 ? "#4ade80" : s >= 55 ? "#fbbf24" : "#f87171";
}

function verdict(s: number) {
  if (s >= 85) return "Ottimo lavoro. Pochi ritocchi e sei a prova di bomba.";
  if (s >= 65) return "Buona base, ma ci sono falle che un attaccante noterebbe.";
  if (s >= 45) return "Il tuo sito sta perdendo clienti e sicurezza. Si sistema in fretta.";
  return "Allarme rosso: sito ed email sono esposti. Parliamone subito.";
}

function StatusIcon({ s }: { s: Status }) {
  const p = { size: 18, color: COLOR[s], style: { flexShrink: 0, marginTop: 2 } };
  return s === "ok" ? <CheckCircle2 {...p} /> : s === "warn" ? <AlertTriangle {...p} /> : <XCircle {...p} />;
}

function Ring({ score }: { score: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const col = scoreColor(score);
  return (
    <div style={{ position: "relative", width: 180, height: 180 }}>
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="90" cy="90" r={r} stroke="rgba(99,102,241,0.15)" strokeWidth="12" fill="none" />
        <motion.circle
          cx="90" cy="90" r={r} stroke={col} strokeWidth="12" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 10px ${col})` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: "spring" }}
          style={{ fontFamily: "var(--font-orbitron)", fontSize: "3rem", fontWeight: 900, color: col, lineHeight: 1 }}
        >
          {score}
        </motion.span>
        <span style={{ fontFamily: "var(--font-exo2)", fontSize: "0.8rem", color: "#a0a0c0", letterSpacing: "0.2em" }}>/ 100</span>
      </div>
    </div>
  );
}

function buildMailto(res: Result) {
  const problems = res.checks.filter((c) => c.status !== "ok");
  const lines = [
    `Ciao DIOBO, ho fatto il check-up di ${res.host}: punteggio ${res.score}/100.`,
    "",
    problems.length ? "Problemi trovati:" : "Nessun problema grave, ma vorrei un parere.",
    ...problems.map((c) => `- [${c.area}] ${c.label}: ${c.detail}`),
    "",
    "Vorrei una consulenza per sistemarli.",
    "Nome / azienda:",
    "Telefono (facoltativo):",
  ];
  return (
    "mailto:dioboinfo@gmail.com?subject=" +
    encodeURIComponent(`Check-up ${res.host} — ${res.score}/100`) +
    "&body=" +
    encodeURIComponent(lines.join("\n"))
  );
}

export default function Checkup() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setStep(0);
    const iv = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1100);
    try {
      const r = await fetch("/api/checkup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Qualcosa è andato storto. Riprova.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di rete. Riprova.");
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  }

  const problems = result?.checks.filter((c) => c.status !== "ok").length ?? 0;

  return (
    <section id="checkup" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6rem 1.5rem", scrollMarginTop: "2rem" }}>
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", letterSpacing: "0.35em", color: "#818cf8", marginBottom: "1rem", textTransform: "uppercase" }}
      >
        Check-up gratuito · 10 secondi
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring", damping: 20 }}
        style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.5rem, 4vw, 3rem)", fontWeight: 700, textAlign: "center", marginBottom: "1rem", textShadow: "0 0 20px rgba(99,102,241,0.3)", maxWidth: "900px" }}
      >
        IL TUO SITO È <span style={{ color: "#6366f1" }}>DAVVERO SICURO?</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
        style={{ fontFamily: "var(--font-exo2)", fontSize: "1.05rem", color: "#e0e7ff", opacity: 0.85, textAlign: "center", maxWidth: "620px", marginBottom: "2.5rem", lineHeight: 1.7 }}
      >
        Scrivi il tuo dominio: controlliamo sicurezza, email, velocità e visibilità su Google come farebbe un sistemista. Gratis, senza registrazione.
      </motion.p>

      <form onSubmit={run} className="checkup-form" style={{ display: "flex", gap: "0.75rem", width: "100%", maxWidth: "620px" }}>
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="tuaazienda.it"
          aria-label="Il tuo dominio"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          style={{
            flex: 1, minWidth: 0, padding: "1rem 1.4rem", borderRadius: "50px",
            background: "rgba(5,5,20,0.9)", border: "1px solid rgba(99,102,241,0.45)",
            color: "#fff", fontSize: "1.05rem", fontFamily: "var(--font-exo2)", outline: "none",
            boxShadow: "0 0 30px rgba(99,102,241,0.15) inset",
          }}
        />
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99,102,241,0.6)" }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "1rem 2rem", borderRadius: "50px", border: "none",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
            fontFamily: "var(--font-orbitron)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.1em",
            cursor: loading ? "wait" : "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center",
          }}
        >
          {loading ? <Loader2 size={18} className="checkup-spin" /> : null}
          {loading ? "ANALISI…" : "ANALIZZA"}
        </motion.button>
      </form>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ marginTop: "1.5rem", fontFamily: "var(--font-exo2)", color: "#a5b4fc", letterSpacing: "0.05em" }}
          >
            {STEPS[step]}
          </motion.p>
        )}
        {error && (
          <motion.p key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "1.5rem", color: "#fca5a5", fontFamily: "var(--font-exo2)" }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 20 }}
          style={{
            marginTop: "3rem", width: "100%", maxWidth: "1000px",
            background: "rgba(5,5,20,0.92)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "20px",
            padding: "clamp(1.25rem, 4vw, 2.5rem)", boxShadow: "0 0 60px rgba(99,102,241,0.15)",
          }}
        >
          <div className="checkup-head" style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem" }}>
            <Ring score={result.score} />
            <div>
              <p style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "#818cf8", marginBottom: "0.5rem" }}>
                RISULTATO PER {result.host.toUpperCase()}
              </p>
              <p style={{ fontFamily: "var(--font-exo2)", fontSize: "clamp(1.1rem, 2.4vw, 1.5rem)", color: "#fff", lineHeight: 1.4, marginBottom: "0.5rem" }}>
                {verdict(result.score)}
              </p>
              <p style={{ fontFamily: "var(--font-exo2)", color: "#a0a0c0" }}>
                {problems === 0 ? "Nessun punto critico trovato." : `${problems} ${problems === 1 ? "punto da sistemare" : "punti da sistemare"}.`}
              </p>
            </div>
          </div>

          <div className="checkup-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>
            {AREAS.map(({ key, icon: Icon }, ai) => {
              const items = result.checks.filter((c) => c.area === key);
              if (!items.length) return null;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + ai * 0.12 }}
                  style={{ border: "1px solid rgba(99,102,241,0.18)", borderRadius: "14px", padding: "1.25rem" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                    <Icon size={20} color="#818cf8" />
                    <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.95rem", color: "#e0e7ff", letterSpacing: "0.08em" }}>{key.toUpperCase()}</h3>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.9rem" }}>
                    {items.map((c) => (
                      <li key={c.id} style={{ display: "flex", gap: "0.6rem" }}>
                        <StatusIcon s={c.status} />
                        <div>
                          <p style={{ fontFamily: "var(--font-exo2)", color: "#fff", fontWeight: 600, fontSize: "0.95rem" }}>
                            {c.label} <span style={{ color: COLOR[c.status], fontWeight: 400 }}>— {c.detail}</span>
                          </p>
                          <p style={{ fontFamily: "var(--font-exo2)", color: "#a0a0c0", fontSize: "0.85rem", lineHeight: 1.55 }}>{c.why}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-exo2)", color: "#e0e7ff", fontSize: "1.1rem", marginBottom: "1.25rem" }}>
              {problems > 0 ? "Questi problemi li sistemiamo noi, dal server al sito." : "Vuoi mantenerlo così? Ci pensiamo noi."}
            </p>
            <motion.a
              href={buildMailto(result)}
              whileHover={{ scale: 1.06, boxShadow: "0 0 50px rgba(99,102,241,0.6)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "inline-block", padding: "1.1rem 2.6rem", borderRadius: "50px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", textDecoration: "none",
                fontFamily: "var(--font-orbitron)", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.95rem",
                boxShadow: "0 0 30px rgba(99,102,241,0.35)",
              }}
            >
              {problems > 0 ? "SISTEMATEMELO →" : "PARLIAMONE →"}
            </motion.a>
            <p style={{ fontFamily: "var(--font-exo2)", color: "#64748b", fontSize: "0.8rem", marginTop: "0.9rem" }}>
              Si apre una mail col tuo report già dentro: ti basta premere invio.
            </p>
          </div>
        </motion.div>
      )}
    </section>
  );
}
