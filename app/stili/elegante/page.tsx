"use client";

import UniverseSwitcher from "@/components/UniverseSwitcher";
import { motion, useScroll, useTransform } from "motion/react";

const services = [
  { num: "01", title: "Consulenza IT", desc: "Assistenza informatica completa. Dal server al singolo dispositivo." },
  { num: "02", title: "Domini", desc: "Registrazione domini semplici da ricordare." },
  { num: "03", title: "Grafica & Logo", desc: "Logo distintivo, rappresentativo ed unico. Grafica semplice ed elegante." },
  { num: "04", title: "Siti Web", desc: "Pagine web di facile accesso, personalizzabili e dal design spettacolare." },
];

function Aurora() {
  return (
    <>
      <style>{`
        @keyframes aurora-a {
          0%, 100% { transform: translate(-20%, -10%) scale(1); }
          50% { transform: translate(10%, 15%) scale(1.25); }
        }
        @keyframes aurora-b {
          0%, 100% { transform: translate(15%, 10%) scale(1.1); }
          50% { transform: translate(-15%, -15%) scale(0.9); }
        }
        @keyframes aurora-c {
          0%, 100% { transform: translate(0%, 20%) scale(1); }
          50% { transform: translate(5%, -10%) scale(1.3); }
        }
      `}</style>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: "#020208" }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-10%", width: "70vw", height: "70vw",
          borderRadius: "50%", filter: "blur(120px)", opacity: 0.16,
          background: "radial-gradient(circle, #6366f1, transparent 65%)",
          animation: "aurora-a 24s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-30%", right: "-15%", width: "65vw", height: "65vw",
          borderRadius: "50%", filter: "blur(130px)", opacity: 0.12,
          background: "radial-gradient(circle, #8b5cf6, transparent 65%)",
          animation: "aurora-b 30s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "30%", left: "40%", width: "45vw", height: "45vw",
          borderRadius: "50%", filter: "blur(110px)", opacity: 0.07,
          background: "radial-gradient(circle, #22d3ee, transparent 65%)",
          animation: "aurora-c 36s ease-in-out infinite",
        }} />
      </div>
    </>
  );
}

export default function DemoElegante() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);

  return (
    <>
      <Aurora />
      <UniverseSwitcher active="elegante" />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HERO */}
        <div style={{
          height: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "2rem",
        }}>
          <motion.div style={{ opacity: heroOpacity, y: heroY, textAlign: "center" }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              style={{
                fontFamily: "var(--font-orbitron)", fontSize: "0.8rem",
                letterSpacing: "0.5em", color: "#818cf8", marginBottom: "2.5rem",
                textTransform: "uppercase",
              }}
            >
              DIOBO.IT
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-exo2)", fontWeight: 200,
                fontSize: "clamp(2.4rem, 7vw, 6rem)", lineHeight: 1.1,
                color: "#f1f5f9", letterSpacing: "-0.01em", maxWidth: "16ch",
              }}
            >
              Il tuo universo
              <br />
              <span style={{
                fontWeight: 500,
                background: "linear-gradient(90deg, #818cf8, #a78bfa)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                digitale.
              </span>
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, delay: 1.4, ease: "easeOut" }}
              style={{
                width: "60px", height: "1px", margin: "3rem auto 0",
                background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
              }}
            />
          </motion.div>
        </div>

        {/* SERVIZI — lista editoriale */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "10vh 6vw" }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            style={{
              fontFamily: "var(--font-orbitron)", fontSize: "0.7rem",
              letterSpacing: "0.4em", color: "#818cf8", marginBottom: "4rem",
              textTransform: "uppercase",
            }}
          >
            Cosa facciamo
          </motion.p>

          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover="hover"
              style={{
                display: "flex", alignItems: "baseline", gap: "clamp(1rem, 4vw, 3rem)",
                padding: "clamp(2.5rem, 6vh, 4.5rem) 0",
                borderTop: "1px solid rgba(148,163,184,0.12)",
                cursor: "default",
              }}
            >
              <span style={{
                fontFamily: "var(--font-orbitron)", fontSize: "0.85rem",
                color: "#6366f1", opacity: 0.7, flexShrink: 0,
              }}>
                {s.num}
              </span>
              <div style={{ flex: 1 }}>
                <motion.h2
                  variants={{ hover: { x: 16, color: "#c7d2fe" } }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{
                    fontFamily: "var(--font-exo2)", fontWeight: 250,
                    fontSize: "clamp(1.8rem, 5vw, 3.6rem)", color: "#e2e8f0",
                    lineHeight: 1.15,
                  }}
                >
                  {s.title}
                </motion.h2>
                <motion.p
                  variants={{ hover: { opacity: 0.9 } }}
                  style={{
                    fontFamily: "var(--font-exo2)", fontSize: "1rem", lineHeight: 1.7,
                    color: "#94a3b8", opacity: 0.7, maxWidth: "52ch", marginTop: "0.8rem",
                  }}
                >
                  {s.desc}
                </motion.p>
              </div>
              <motion.span
                variants={{ hover: { opacity: 1, x: 0 } }}
                initial={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4 }}
                style={{ color: "#818cf8", fontSize: "1.4rem", flexShrink: 0 }}
              >
                →
              </motion.span>
            </motion.div>
          ))}
          <div style={{ borderTop: "1px solid rgba(148,163,184,0.12)" }} />
        </div>

        {/* MISSION — statement */}
        <div style={{
          minHeight: "80vh", display: "flex", alignItems: "center",
          justifyContent: "center", padding: "10vh 6vw",
        }}>
          <motion.blockquote
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-exo2)", fontWeight: 200,
              fontSize: "clamp(1.6rem, 4vw, 3rem)", lineHeight: 1.4,
              color: "#cbd5e1", textAlign: "center", maxWidth: "24ch",
            }}
          >
            Un nome facile, una grafica elegante,
            {" "}
            <span style={{ color: "#a5b4fc", fontWeight: 400 }}>un segno che resta.</span>
          </motion.blockquote>
        </div>

        {/* CTA */}
        <div style={{
          minHeight: "70vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "10vh 6vw",
          textAlign: "center",
        }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{
              fontFamily: "var(--font-orbitron)", fontSize: "0.7rem",
              letterSpacing: "0.4em", color: "#818cf8", marginBottom: "2rem",
              textTransform: "uppercase",
            }}
          >
            Iniziamo
          </motion.p>
          <motion.a
            href="mailto:info@diobo.it"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover="hover"
            style={{
              fontFamily: "var(--font-exo2)", fontWeight: 200,
              fontSize: "clamp(2rem, 6vw, 4.5rem)", color: "#f1f5f9",
              textDecoration: "none", position: "relative", lineHeight: 1.2,
            }}
          >
            Raccontaci la tua idea
            <motion.span
              variants={{ hover: { scaleX: 1 } }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute", left: 0, bottom: "-0.15em",
                width: "100%", height: "1px", transformOrigin: "left",
                background: "linear-gradient(90deg, #6366f1, #a78bfa)",
                display: "block",
              }}
            />
            <span style={{ color: "#818cf8" }}> →</span>
          </motion.a>
        </div>

        {/* FOOTER */}
        <footer style={{
          padding: "3rem 6vw", borderTop: "1px solid rgba(148,163,184,0.1)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "1rem",
        }}>
          <span style={{
            fontFamily: "var(--font-orbitron)", fontSize: "0.85rem",
            color: "#e0e7ff", letterSpacing: "0.25em",
          }}>
            DIOBO<span style={{ color: "#6366f1" }}>.IT</span>
          </span>
          <span style={{ fontFamily: "var(--font-exo2)", fontSize: "0.75rem", color: "#64748b" }}>
            © 2026 — Il tuo universo digitale
          </span>
        </footer>
      </div>
    </>
  );
}
