"use client";

import UniverseSwitcher from "@/components/UniverseSwitcher";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

const GalaxyScene = dynamic(() => import("@/components/GalaxyScene"), { ssr: false });

const services = [
  { num: "01", title: "Consulenza IT", desc: "Assistenza informatica completa. Dal server al singolo dispositivo." },
  { num: "02", title: "Domini", desc: "Registrazione domini semplici da ricordare." },
  { num: "03", title: "Grafica & Logo", desc: "Logo distintivo, rappresentativo ed unico. Grafica semplice ed elegante." },
  { num: "04", title: "Siti Web", desc: "Pagine web di facile accesso, personalizzabili e dal design spettacolare." },
];

export default function DemoIpnotico() {
  return (
    <>
      <GalaxyScene />
      <UniverseSwitcher active="ipnotico" />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HERO — sospeso sopra la galassia */}
        <div style={{
          height: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "2rem",
        }}>
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.12em" }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-orbitron)",
              fontSize: "clamp(1.8rem, 5.5vw, 4.5rem)",
              fontWeight: 900, textAlign: "center", color: "#f1f5f9",
              textShadow: "0 0 50px rgba(99,102,241,0.6)",
            }}
          >
            DIOBO<span style={{ color: "#818cf8" }}>.IT</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 2, delay: 1.2 }}
            style={{
              fontFamily: "var(--font-exo2)", fontWeight: 300,
              fontSize: "clamp(0.95rem, 1.8vw, 1.3rem)", color: "#c7d2fe",
              letterSpacing: "0.3em", textTransform: "uppercase", marginTop: "1.5rem",
              textAlign: "center",
            }}
          >
            Il tuo universo digitale
          </motion.p>
          <motion.p
            animate={{ opacity: [0.25, 0.7, 0.25] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", bottom: "3rem",
              fontFamily: "var(--font-exo2)", fontSize: "0.75rem",
              letterSpacing: "0.35em", color: "#818cf8", textTransform: "uppercase",
            }}
          >
            Lasciati attrarre
          </motion.p>
        </div>

        {/* SERVIZI — frammenti sospesi mentre si scende nella galassia */}
        {services.map((s, i) => (
          <div key={i} style={{
            height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            padding: "2rem",
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                textAlign: "center", maxWidth: "min(560px, 85vw)",
                padding: "3rem 2.5rem",
                background: "radial-gradient(ellipse at center, rgba(10,10,30,0.55), rgba(5,5,20,0.2) 70%, transparent)",
                borderRadius: "24px",
                backdropFilter: "blur(2px)",
              }}
            >
              <p style={{
                fontFamily: "var(--font-orbitron)", fontSize: "0.7rem",
                letterSpacing: "0.45em", color: "#818cf8", marginBottom: "1.2rem",
              }}>
                {s.num}
              </p>
              <h2 style={{
                fontFamily: "var(--font-exo2)", fontWeight: 250,
                fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)", color: "#f1f5f9",
                marginBottom: "1rem", textShadow: "0 0 40px rgba(99,102,241,0.4)",
              }}>
                {s.title}
              </h2>
              <p style={{
                fontFamily: "var(--font-exo2)", fontSize: "1.05rem", lineHeight: 1.75,
                color: "#cbd5e1", opacity: 0.85,
              }}>
                {s.desc}
              </p>
            </motion.div>
          </div>
        ))}

        {/* CTA — nel cuore della galassia */}
        <div style={{
          height: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center",
        }}>
          <motion.h2
            initial={{ opacity: 0, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.6 }}
            style={{
              fontFamily: "var(--font-exo2)", fontWeight: 200,
              fontSize: "clamp(1.8rem, 5vw, 3.6rem)", color: "#f1f5f9",
              lineHeight: 1.3, maxWidth: "20ch", marginBottom: "2.5rem",
              textShadow: "0 0 60px rgba(165,180,252,0.5)",
            }}
          >
            Raccontaci la tua idea.
            <br />
            <span style={{ color: "#a5b4fc", fontWeight: 400 }}>
              Noi la rendiamo gravità.
            </span>
          </motion.h2>
          <motion.a
            href="mailto:info@diobo.it"
            whileHover={{ scale: 1.06, boxShadow: "0 0 70px rgba(129,140,248,0.6)" }}
            whileTap={{ scale: 0.96 }}
            className="cta-button"
            style={{
              padding: "1.1rem 3.5rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontFamily: "var(--font-orbitron)", fontWeight: 700,
              fontSize: "1rem", borderRadius: "50px", textDecoration: "none",
              letterSpacing: "0.12em",
            }}
          >
            CONTATTACI
          </motion.a>
        </div>
      </div>
    </>
  );
}
