"use client";

import UniverseSwitcher from "@/components/UniverseSwitcher";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

const WowScene = dynamic(() => import("@/components/WowScene"), { ssr: false });

const stations = [
  { num: "01", title: "Consulenza IT", desc: "Assistenza informatica completa. Dal server al singolo dispositivo.", side: "right", color: "#6366f1" },
  { num: "02", title: "Domini", desc: "Registrazione domini semplici da ricordare.", side: "left", color: "#8b5cf6" },
  { num: "03", title: "Grafica & Logo", desc: "Logo distintivo, rappresentativo ed unico. Grafica semplice ed elegante.", side: "right", color: "#22d3ee" },
  { num: "04", title: "Siti Web", desc: "Pagine web di facile accesso, personalizzabili e dal design spettacolare.", side: "left", color: "#a78bfa" },
];

export default function DemoWow() {
  return (
    <>
      <WowScene />
      <UniverseSwitcher active="wow" />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HERO */}
        <div style={{
          height: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "2rem",
        }}>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="hero-gradient-text"
            style={{
              fontFamily: "var(--font-orbitron)",
              fontSize: "clamp(2rem, 6vw, 5rem)",
              fontWeight: 900,
              textAlign: "center",
              letterSpacing: "0.1em",
              textShadow: "0 0 40px rgba(99,102,241,0.5)",
            }}
          >
            DIOBO<span style={{ color: "#6366f1" }}>.IT</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.4rem)", color: "#a0a0c0", textAlign: "center",
              marginTop: "1rem", letterSpacing: "0.25em", textTransform: "uppercase",
              fontFamily: "var(--font-exo2)",
            }}
          >
            Il tuo universo digitale
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 1] }}
            transition={{ duration: 2.5, delay: 1.6 }}
            style={{
              position: "absolute", bottom: "3rem",
              color: "#6366f1", fontSize: "0.75rem", letterSpacing: "0.4em",
              textTransform: "uppercase", fontFamily: "var(--font-orbitron)",
            }}
          >
            ▼ Scrolla per iniziare il viaggio ▼
          </motion.p>
        </div>

        {/* STAZIONI */}
        {stations.map((s, i) => (
          <div key={i} style={{
            height: "100vh", display: "flex", alignItems: "center",
            justifyContent: s.side === "right" ? "flex-end" : "flex-start",
            padding: "0 8vw",
          }}>
            <motion.div
              initial={{ opacity: 0, x: s.side === "right" ? 80 : -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.9, type: "spring", damping: 22 }}
              style={{ maxWidth: "min(440px, 80vw)", position: "relative" }}
            >
              <div style={{
                fontFamily: "var(--font-orbitron)", fontSize: "clamp(4rem, 10vw, 8rem)",
                fontWeight: 900, color: s.color, opacity: 0.12,
                position: "absolute", top: "-4.5rem", [s.side === "right" ? "right" : "left"]: "-1rem",
                lineHeight: 1, pointerEvents: "none",
              }}>
                {s.num}
              </div>
              <p style={{
                fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", letterSpacing: "0.35em",
                color: s.color, marginBottom: "0.8rem", textTransform: "uppercase",
              }}>
                Tappa {s.num}
              </p>
              <h2 style={{
                fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                fontWeight: 700, color: "#e0e7ff", marginBottom: "1rem",
                textShadow: `0 0 30px ${s.color}66`,
              }}>
                {s.title}
              </h2>
              <p style={{
                fontFamily: "var(--font-exo2)", fontSize: "1.05rem", lineHeight: 1.7,
                color: "#e0e7ff", opacity: 0.85,
              }}>
                {s.desc}
              </p>
            </motion.div>
          </div>
        ))}

        {/* CTA — verso il sole */}
        <div style={{
          height: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center",
        }}>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1 }}
            style={{
              fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
              fontWeight: 900, color: "#fff",
              textShadow: "0 0 60px rgba(196,181,253,0.8)",
              marginBottom: "1.5rem",
            }}
          >
            CHIEDI E TI <span style={{ color: "#a78bfa" }}>SARÀ DATO</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{
              fontFamily: "var(--font-exo2)", fontSize: "1.2rem", color: "#e0e7ff",
              maxWidth: "480px", lineHeight: 1.7, marginBottom: "2.5rem",
            }}
          >
            Raccontaci la tua idea.<br />Noi la trasformiamo in qualcosa di spettacolare.
          </motion.p>
          <motion.a
            href="mailto:info@diobo.it"
            whileHover={{ scale: 1.08, boxShadow: "0 0 60px rgba(167,139,250,0.7)" }}
            whileTap={{ scale: 0.95 }}
            className="cta-button"
            style={{
              padding: "1.1rem 3.5rem",
              background: "linear-gradient(135deg, #6366f1, #a78bfa)",
              color: "#fff", fontFamily: "var(--font-orbitron)", fontWeight: 700,
              fontSize: "1rem", borderRadius: "50px", textDecoration: "none",
              letterSpacing: "0.12em",
            }}
          >
            CONTATTACI
          </motion.a>
        </div>

        {/* Coda warp finale */}
        <div style={{ height: "100vh" }} />
      </div>
    </>
  );
}
