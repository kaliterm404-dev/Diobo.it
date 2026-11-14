"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { Monitor, Globe, Palette, Layout } from "lucide-react";
import dynamic from "next/dynamic";

import Checkup from "@/components/Checkup";
import ContactForm from "@/components/ContactForm";
import { TOOLS } from "@/lib/tools";

const SpaceScene = dynamic(() => import("@/components/SpaceScene"), { ssr: false });

function CursorGlow() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 25, stiffness: 200 });
  const springY = useSpring(y, { damping: 25, stiffness: 200 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [x, y]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 40%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 2,
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
}

const CONTACT_MAILTO =
  "mailto:info@diobo.it?subject=" +
  encodeURIComponent("Richiesta informazioni da diobo.it") +
  "&body=" +
  encodeURIComponent("Ciao, vorrei informazioni su:\n\n- Servizio (sito / assistenza IT / dominio ed email / grafica):\n- Due righe sul progetto:\n- Come preferite ricontattarmi:\n");

const services = [
  { icon: Layout, title: "Siti Web", desc: "Dal one-page al sito completo. Veloci, sicuri e su hosting moderno, di serie.",
    includes: ["Sito one-page adatto a smartphone, tablet e PC", "HTTPS con certificato automatico", "Dominio e DNS configurati", "Ottimizzazione Google: titoli, descrizioni, dati strutturati, sitemap, Search Console", "Header di sicurezza", "Check-up DIOBO con report alla consegna", "Un giro di revisioni incluso"],
  },
  { icon: Monitor, title: "Assistenza IT", desc: "Reti, server, backup e sicurezza. Dal server al singolo dispositivo.",
    includes: ["Monitoraggio di sito e servizi", "Controllo mensile di backup, certificati, DNS e posta", "Aggiornamenti di sicurezza programmati", "Supporto via email, con risposte veloci", "Report mensile"],
    note: "Di persona a Bologna e provincia, da remoto nel resto d'Italia." },
  { icon: Globe, title: "Dominio + Email pro", desc: "Un nome facile da ricordare e caselle email professionali @tuonome, configurate a regola d'arte.",
    includes: ["Registrazione o trasferimento del dominio", "Caselle email @tuonome", "SPF, DKIM e DMARC configurati e verificati", "Migrazione della posta esistente"] },
  { icon: Palette, title: "Grafica & Logo", desc: "Un'identità visiva distintiva, semplice ed elegante. Riconoscibile al primo sguardo.",
    includes: ["Logo con varianti", "Palette colori e tipografia", "File pronti per web e stampa"] },
];

const whyPoints = [
  { title: "Dal server al sito", desc: "Non un'agenzia che subappalta: progettiamo l'infrastruttura e costruiamo anche il web, di persona." },
  { title: "Sicuro di default", desc: "HTTPS, header di sicurezza, backup e aggiornamenti non sono optional: sono il punto di partenza." },
  { title: "Un solo referente", desc: "Sito, dominio, email e assistenza in un unico posto. Una persona che risponde, non un ticket." },
];

const missionPoints = [
  "Un sito dal nome facile",
  "Grafica semplice ed elegante",
  "Un logo distintivo ed unico",
];

const marqueeItems = ["CONSULENZA IT", "DOMINI", "GRAFICA & LOGO", "SITI WEB", "DESIGN", "STRATEGIA DIGITALE"];

function GlowSeparator() {
  return (
    <div style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      padding: "2rem 0",
    }}>
      <motion.div
        animate={{
          opacity: [0.3, 0.7, 0.3],
          boxShadow: [
            "0 0 10px rgba(99,102,241,0.2), 0 0 30px rgba(99,102,241,0.1)",
            "0 0 20px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.2)",
            "0 0 10px rgba(99,102,241,0.2), 0 0 30px rgba(99,102,241,0.1)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "min(80%, 600px)",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #6366f1, transparent)",
        }}
      />
    </div>
  );
}

function Marquee() {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div style={{
      overflow: "hidden",
      padding: "2rem 0",
      position: "relative",
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "100px",
        background: "linear-gradient(to right, #000005, transparent)",
        zIndex: 1,
      }} />
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "100px",
        background: "linear-gradient(to left, #000005, transparent)",
        zIndex: 1,
      }} />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          display: "flex",
          gap: "3rem",
          whiteSpace: "nowrap",
          width: "fit-content",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-orbitron)",
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: "rgba(99,102,241,0.6)",
              display: "flex",
              alignItems: "center",
              gap: "3rem",
            }}
          >
            {item}
            <span style={{ color: "#6366f1", opacity: 0.5 }}> · </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}


function UniversiSection() {
  return (
    <div style={{
      minHeight: "90vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "4rem 2rem",
    }}>
      <style>{`
        @media (max-width: 900px) {
          .case-card { grid-template-columns: 1fr !important; max-width: 380px !important; }
        }
      `}</style>
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring", damping: 20 }}
        style={{
          fontFamily: "var(--font-orbitron)",
          fontSize: "clamp(1.5rem, 4vw, 3rem)",
          fontWeight: 700, textAlign: "center", marginBottom: "1rem",
          textShadow: "0 0 20px rgba(99,102,241,0.3)",
        }}
      >
        I NOSTRI <span style={{ color: "#6366f1" }}>LAVORI</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontFamily: "var(--font-exo2)", fontSize: "1.05rem", color: "#e0e7ff",
          opacity: 0.8, textAlign: "center", maxWidth: "560px", marginBottom: "3rem",
          lineHeight: 1.7,
        }}
      >
        Progetti reali, online e mantenuti. Ogni sito parte dal dominio e arriva alla posta: tutto configurato e verificato.
      </motion.p>

      <motion.a
        href="https://www.freedombonsai.com"
        target="_blank"
        rel="noopener"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        whileHover={{ y: -6, boxShadow: "0 10px 50px rgba(34,197,94,0.25)" }}
        className="case-card"
        style={{
          display: "grid", gridTemplateColumns: "200px 1fr", alignItems: "stretch",
          marginTop: "1.5rem", maxWidth: "1000px", width: "100%",
          textDecoration: "none", background: "rgba(5,5,20,0.9)",
          border: "1px solid rgba(34,197,94,0.3)", borderRadius: "16px", overflow: "hidden",
        }}
      >
        <div style={{
          minHeight: "150px",
          background: "radial-gradient(circle at 50% 70%, rgba(34,197,94,0.55), transparent 65%), radial-gradient(circle at 30% 30%, rgba(132,204,22,0.3), transparent 60%), #03100a",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "3.5rem",
        }} aria-hidden="true">
          🌱
        </div>
        <div style={{ padding: "1.5rem" }}>
          <p style={{
            fontFamily: "var(--font-orbitron)", fontSize: "0.62rem",
            letterSpacing: "0.3em", color: "#4ade80", marginBottom: "0.5rem",
            textTransform: "uppercase",
          }}>
            Progetto reale · online
          </p>
          <h3 style={{
            fontFamily: "var(--font-orbitron)", fontSize: "1.25rem", fontWeight: 700,
            color: "#e0e7ff", marginBottom: "0.6rem",
          }}>
            FreedomBonsai
          </h3>
          <p style={{
            fontFamily: "var(--font-exo2)", fontSize: "0.9rem", lineHeight: 1.6,
            color: "#e0e7ff", opacity: 0.75, marginBottom: "1rem",
          }}>
            Sito del movimento di liberazione dei bonsai: dominio, DNS, sito e hosting, tutto configurato da DIOBO dalla A alla Z.
          </p>
          <span style={{
            fontFamily: "var(--font-orbitron)", fontSize: "0.7rem",
            letterSpacing: "0.2em", color: "#4ade80",
          }}>
            VISITA IL SITO →
          </span>
        </div>
      </motion.a>
    </div>
  );
}

function GlowCard({ service, index }: { service: typeof services[0]; index: number }) {
  const Icon = service.icon;
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { damping: 20, stiffness: 300 });
  const springRotateY = useSpring(rotateY, { damping: 20, stiffness: 300 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = (e.clientX - cx) / (rect.width / 2);
    const py = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-py * 12);
    rotateY.set(px * 12);
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, [rotateX, rotateY]);

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setGlowPos({ x: 50, y: 50 });
  }, [rotateX, rotateY]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.12, type: "spring", damping: 20, stiffness: 100 }}
      style={{ perspective: "800px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          position: "relative",
          borderRadius: "16px",
          padding: "2px",
          cursor: "pointer",
          willChange: "transform",
          background: `conic-gradient(from var(--glow-angle, 0deg) at ${glowPos.x}% ${glowPos.y}%, #6366f1, #8b5cf6, #a78bfa, #6366f1)`,
        }}
        className="glow-card-outer"
      >
        <div style={{
          background: "rgba(5,5,20,0.92)",
          borderRadius: "14px",
          padding: "2rem",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(99,102,241,0.15), transparent 60%)`,
              pointerEvents: "none",
            }}
          />
          <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center", position: "relative" }}>
            <Icon size={40} strokeWidth={1.5} color="#818cf8" />
          </div>
          <h3 style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "1.1rem",
            fontWeight: 700,
            marginBottom: "0.8rem",
            color: "#e0e7ff",
            position: "relative",
          }}>
            {service.title}
          </h3>
          <p style={{
            color: "#e0e7ff",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            fontFamily: "var(--font-exo2)",
            fontWeight: 400,
            position: "relative",
          }}>
            {service.desc}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0", textAlign: "left", position: "relative" }}>
            {service.includes.map((it) => (
              <li key={it} style={{ fontFamily: "var(--font-exo2)", fontSize: "0.85rem", color: "#c7d2fe", lineHeight: 1.5, marginBottom: "0.3rem", paddingLeft: "1.1rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#818cf8" }}>✓</span>{it}
              </li>
            ))}
          </ul>
          {service.note && (
            <p style={{ fontFamily: "var(--font-exo2)", fontSize: "0.75rem", color: "#818cf8", marginTop: "0.6rem", position: "relative", textAlign: "left" }}>{service.note}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
      setShowCursor(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 600);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [started, text]);

  return <>{displayed}{showCursor && <span className="typewriter-cursor">|</span>}</>;
}

function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayed(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration) return text[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      iteration += 0.5;
      if (iteration >= text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [started, text]);

  return <>{started ? displayed : " "}</>;
}

function MissionTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} style={{ position: "relative", maxWidth: "600px", paddingLeft: "3rem" }}>
      {/* Linea base grigia */}
      <div style={{
        position: "absolute",
        left: "6px",
        top: 0,
        bottom: 0,
        width: "2px",
        background: "rgba(99,102,241,0.1)",
      }} />
      {/* Linea luminosa che si riempie */}
      <motion.div
        style={{
          position: "absolute",
          left: "6px",
          top: 0,
          width: "2px",
          height: lineHeight,
          background: "linear-gradient(to bottom, #6366f1, #8b5cf6, #a78bfa)",
          boxShadow: "0 0 10px #6366f1, 0 0 20px rgba(99,102,241,0.5)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
        {missionPoints.map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.7, delay: i * 0.15, type: "spring", damping: 18 }}
            style={{ display: "flex", alignItems: "center", gap: "1.5rem", position: "relative" }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 15px #818cf8, 0 0 30px #6366f1",
                  "0 0 25px #818cf8, 0 0 50px #6366f1, 0 0 80px rgba(99,102,241,0.4)",
                  "0 0 15px #818cf8, 0 0 30px #6366f1",
                ],
                scale: [0.9, 1.3, 0.9],
              }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                left: "-2.65rem",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #fff 0%, #a5b4fc 30%, #6366f1 60%, transparent 80%)",
                flexShrink: 0,
              }}
            />
            <span style={{
              color: "#e0e7ff",
              fontSize: "1.3rem",
              fontFamily: "var(--font-orbitron)",
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}>
              {text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SpaceScene />
      <CursorGlow />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HERO */}
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}>
          <motion.div role="presentation"
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
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, type: "spring", damping: 18 }}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.5rem)",
              color: "#a0a0c0",
              textAlign: "center",
              maxWidth: "600px",
              marginTop: "1rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "var(--font-exo2)",
            }}
          >
            Il tuo universo digitale
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
            style={{
              fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)",
              color: "#e0e7ff",
              textAlign: "center",
              maxWidth: "620px",
              marginTop: "1.5rem",
              lineHeight: 1.7,
              fontFamily: "var(--font-exo2)",
              fontWeight: 400,
            }}
          >
            Dal server al sito. Siti web, assistenza IT, domini ed email professionali a Bologna —
            da un sistemista vero che costruisce anche il web.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2 }}
            className="hero-ctas"
            style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap", justifyContent: "center" }}
          >
            <motion.a
              href="#checkup"
              whileHover={{ scale: 1.06, boxShadow: "0 0 40px rgba(99,102,241,0.6)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "1rem 2.2rem", borderRadius: "50px", textDecoration: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
                fontFamily: "var(--font-orbitron)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em",
                boxShadow: "0 0 30px rgba(99,102,241,0.35)",
              }}
            >
              CHECK-UP GRATUITO DEL TUO SITO
            </motion.a>
            <motion.a
              href="/strumenti"
              whileHover={{ scale: 1.06, borderColor: "rgba(165,180,252,0.9)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "1rem 2.2rem", borderRadius: "50px", textDecoration: "none",
                border: "1px solid rgba(99,102,241,0.5)", color: "#e0e7ff", background: "rgba(5,5,20,0.6)",
                fontFamily: "var(--font-orbitron)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em",
              }}
            >
              STRUMENTI DI RETE
            </motion.a>
            <motion.a
              href="#contatti"
              whileHover={{ scale: 1.06, borderColor: "rgba(165,180,252,0.9)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "1rem 2.2rem", borderRadius: "50px", textDecoration: "none",
                border: "1px solid rgba(99,102,241,0.5)", color: "#e0e7ff", background: "rgba(5,5,20,0.6)",
                fontFamily: "var(--font-orbitron)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em",
              }}
            >
              CONTATTACI
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.8 }}
            style={{ marginTop: "3rem" }}
          >
            <motion.div
              animate={{ scaleY: [0.8, 1.2, 0.8], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "1px",
                height: "60px",
                background: "linear-gradient(to bottom, transparent, #6366f1, transparent)",
                margin: "0 auto",
              }}
            />
            <p style={{
              color: "#555",
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginTop: "1rem",
              fontFamily: "var(--font-exo2)",
            }}>
              Scrolla per esplorare
            </p>
          </motion.div>
        </div>

        {/* SPACER */}
        <div style={{ height: "60vh" }} />

        <GlowSeparator />

        {/* CHECK-UP GRATUITO */}
        <Checkup />

        {/* CASSETTA DEL SISTEMISTA */}
        <section style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem 1.5rem 6rem" }}>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", letterSpacing: "0.35em", color: "#818cf8", marginBottom: "1rem", textTransform: "uppercase", textAlign: "center" }}
          >
            Gratis · senza registrazione · senza pubblicità
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", damping: 20 }}
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.5rem, 4vw, 3rem)", fontWeight: 700, textAlign: "center", marginBottom: "1rem", textShadow: "0 0 20px rgba(99,102,241,0.3)" }}
          >
            LA CASSETTA DEL <span style={{ color: "#6366f1" }}>SISTEMISTA</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            style={{ fontFamily: "var(--font-exo2)", fontSize: "1.05rem", color: "#e0e7ff", opacity: 0.85, textAlign: "center", maxWidth: "640px", marginBottom: "2.5rem", lineHeight: 1.7 }}
          >
            Gli stessi strumenti che usiamo ogni giorno per tenere in piedi reti, domini e posta. Aperti a tutti, gratis: perché dietro DIOBO c&apos;è un sistemista, non un template.
          </motion.p>
          <div className="tool-grid" style={{ maxWidth: "1000px", width: "100%" }}>
            {TOOLS.map((t, i) => (
              <motion.a
                key={t.slug}
                href={`/strumenti/${t.slug}`}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="tool-card" style={{ height: "100%", marginBottom: 0 }}>
                  <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.85rem", letterSpacing: "0.1em", color: "#a5b4fc", margin: "0 0 0.6rem", textTransform: "uppercase" }}>{t.name}</h3>
                  <p style={{ margin: 0, color: "#c7d2fe", fontFamily: "var(--font-exo2)", lineHeight: 1.6 }}>{t.short}</p>
                </div>
              </motion.a>
            ))}
            <motion.a
              href="/guide/comandi-windows"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.36 }}
              whileHover={{ y: -6 }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="tool-card" style={{ height: "100%", marginBottom: 0 }}>
                <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.85rem", letterSpacing: "0.1em", color: "#a5b4fc", margin: "0 0 0.6rem", textTransform: "uppercase" }}>Comandi utili di Windows</h3>
                <p style={{ margin: 0, color: "#c7d2fe", fontFamily: "var(--font-exo2)", lineHeight: 1.6 }}>Esegui, .msc, .cpl e riga di comando per Windows 10 e 11, con ricerca e copia</p>
              </div>
            </motion.a>
          </div>
          <p style={{ marginTop: "1.5rem", fontFamily: "var(--font-exo2)", color: "#a0a0c0", textAlign: "center", maxWidth: "640px", lineHeight: 1.6 }}>
            Funzionano anche dentro gli assistenti AI come Claude e ChatGPT: li abbiamo collegati via MCP, lo standard che fa parlare l&apos;intelligenza artificiale con gli strumenti esterni.
          </p>
          <motion.a
            href="/strumenti"
            whileHover={{ scale: 1.06, boxShadow: "0 0 40px rgba(99,102,241,0.6)" }}
            whileTap={{ scale: 0.95 }}
            style={{ marginTop: "1.5rem", padding: "1rem 2.4rem", borderRadius: "50px", textDecoration: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontFamily: "var(--font-orbitron)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em" }}
          >
            APRI LA CASSETTA →
          </motion.a>
        </section>

        <GlowSeparator />

        {/* SERVIZI */}
        <div id="servizi" style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 2rem",
        }}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", damping: 20 }}
            style={{
              fontFamily: "var(--font-orbitron)",
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "3rem",
              textShadow: "0 0 20px rgba(99,102,241,0.3)",
            }}
          >
            Cosa <span style={{ color: "#6366f1" }}>facciamo</span>
          </motion.h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
            maxWidth: "800px",
            width: "100%",
          }} className="services-grid">
            {services.map((s, i) => (
              <GlowCard key={i} service={s} index={i} />
            ))}
          </div>

          {/* Mappa in realtime: un servizio a parte, con la sua pagina e il video */}
          <motion.a
            href="/mappa-realtime"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring", damping: 20 }}
            whileHover={{ y: -6, boxShadow: "0 10px 50px rgba(99,102,241,0.35)" }}
            className="mappa-card"
            style={{
              display: "grid", gridTemplateColumns: "minmax(0, 300px) 1fr", alignItems: "stretch", gap: 0,
              maxWidth: "800px", width: "100%", marginTop: "1.5rem", textDecoration: "none", color: "inherit",
              borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(129,140,248,0.55)",
              background: "rgba(13,16,38,0.92)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mappa-realtime/copertina.jpg" alt="Esempio di mappa di rete su Zabbix: un allarme sulla Mappa in realtime" loading="lazy"
              style={{ width: "100%", height: "100%", minHeight: "170px", objectFit: "cover", display: "block" }} />
            <div style={{ padding: "1.4rem 1.6rem" }}>
              <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.62rem", letterSpacing: "0.2em", color: "#818cf8", marginBottom: "0.5rem" }}>
                NOVITÀ
              </div>
              <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                Mappa in realtime
              </div>
              <p style={{ fontFamily: "var(--font-exo2)", fontSize: "0.9rem", lineHeight: 1.6, color: "#e0e7ff", opacity: 0.8, marginBottom: "0.9rem" }}>
                Dashboard visuale con mappa di rete in realtime su Zabbix: scalabile, multisede e personalizzabile.
              </p>
              <span style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.7rem", letterSpacing: "0.1em", color: "#a5b4fc" }}>
                GUARDA IL VIDEO →
              </span>
            </div>
          </motion.a>
        </div>

        <Marquee />

        <GlowSeparator />

        {/* PERCHÉ DIOBO */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "6rem 2rem",
        }}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", damping: 20 }}
            style={{
              fontFamily: "var(--font-orbitron)",
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "3rem",
              textShadow: "0 0 20px rgba(99,102,241,0.3)",
            }}
          >
            PERCHÉ <span style={{ color: "#6366f1" }}>DIOBO</span>
          </motion.h2>
          <div className="why-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            maxWidth: "1000px",
            width: "100%",
          }}>
            {whyPoints.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.12, type: "spring", damping: 20 }}
                style={{
                  background: "rgba(5,5,20,0.85)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: "16px",
                  padding: "1.8rem",
                }}
              >
                <h3 style={{
                  fontFamily: "var(--font-orbitron)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#a5b4fc",
                  marginBottom: "0.8rem",
                  letterSpacing: "0.05em",
                }}>
                  {w.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-exo2)",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  color: "#e0e7ff",
                }}>
                  {w.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <GlowSeparator />

        {/* MISSION */}
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 2rem",
        }}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", damping: 20 }}
            style={{
              fontFamily: "var(--font-orbitron)",
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "3rem",
              textShadow: "0 0 20px rgba(99,102,241,0.3)",
            }}
          >
            LA NOSTRA <span style={{ color: "#6366f1" }}>MISSION</span>
          </motion.h2>

          <MissionTimeline />
        </div>

        <GlowSeparator />

        {/* LAVORI — portfolio */}
        <UniversiSection />

        <GlowSeparator />

        {/* CONTATTI */}
        <section id="contatti" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "5rem 1.5rem 6rem",
          scrollMarginTop: "4.5rem",
        }}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", damping: 20 }}
            style={{
              fontFamily: "var(--font-orbitron)",
              fontSize: "clamp(1.8rem, 5vw, 3.4rem)",
              fontWeight: 900,
              textAlign: "center",
              marginBottom: "1.2rem",
              textShadow: "0 0 30px rgba(99,102,241,0.4)",
            }}
          >
            CHIEDI E TI <span style={{ color: "#6366f1" }}>SARÀ DATO</span>
          </motion.h2>
          <p style={{ color: "#e0e7ff", fontSize: "1.1rem", textAlign: "center", maxWidth: "560px", margin: "0 0 0.6rem", fontFamily: "var(--font-exo2)", lineHeight: 1.7 }}>
            Raccontaci cosa ti serve, oppure scrivici direttamente:
          </p>
          <p style={{ textAlign: "center", margin: "0 0 2rem", fontFamily: "var(--font-exo2)" }}>
            <a href={CONTACT_MAILTO} style={{ color: "#a5b4fc", fontSize: "1.2rem", textDecoration: "none", borderBottom: "1px solid rgba(165,180,252,0.5)" }}>info@diobo.it</a>
            <span style={{ display: "block", color: "#818cf8", fontSize: "0.9rem", marginTop: "0.5rem" }}>Bologna e provincia di persona · tutta Italia da remoto</span>
          </p>
          <ContactForm />
        </section>

        {/* FOOTER */}
        <footer style={{
          padding: "3rem 2rem",
          borderTop: "1px solid rgba(99,102,241,0.1)",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "1rem",
            color: "#e0e7ff",
            letterSpacing: "0.2em",
          }}>
            DIOBO<span style={{ color: "#6366f1" }}>.IT</span>
          </div>
          <p style={{
            color: "#64748b",
            fontSize: "0.75rem",
            marginTop: "0.5rem",
            fontFamily: "var(--font-exo2)",
          }}>
            © 2026 DIOBO.IT · Bologna e provincia · da remoto in tutta Italia · <a href="/strumenti" style={{ color: "#818cf8" }}>Strumenti di rete</a> · <a href="mailto:info@diobo.it" style={{ color: "#818cf8" }}>info@diobo.it</a> · <a href="/chi-siamo" style={{ color: "#818cf8" }}>Chi siamo</a> · <a href="/guide" style={{ color: "#818cf8" }}>Guide</a> · <a href="/guide/comandi-windows" style={{ color: "#818cf8" }}>Comandi Windows</a> · <a href="/privacy" style={{ color: "#818cf8" }}>Privacy</a>
          </p>
        </footer>
      </div>
    </>
  );
}
