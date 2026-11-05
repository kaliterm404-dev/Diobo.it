"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { Monitor, Globe, Palette, Layout } from "lucide-react";
import dynamic from "next/dynamic";

import Checkup from "@/components/Checkup";

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
  "mailto:dioboinfo@gmail.com?subject=" +
  encodeURIComponent("Richiesta informazioni da diobo.it") +
  "&body=" +
  encodeURIComponent("Ciao, vorrei informazioni su:\n\n- Servizio (sito / assistenza IT / dominio ed email / grafica):\n- Due righe sul progetto:\n- Come preferite ricontattarmi:\n");

const services = [
  { icon: Layout, title: "Siti Web", desc: "Dal one-page al sito completo. Veloci, sicuri e su hosting moderno, di serie.", price: "da 390 €" },
  { icon: Monitor, title: "Assistenza IT", desc: "Reti, server, backup e sicurezza. Dal server al singolo dispositivo, a intervento o in canone.", price: "da 49 €/mese" },
  { icon: Globe, title: "Dominio + Email pro", desc: "Un nome facile da ricordare e caselle email professionali @tuonome, configurate a regola d'arte.", price: "su preventivo" },
  { icon: Palette, title: "Grafica & Logo", desc: "Un'identità visiva distintiva, semplice ed elegante. Riconoscibile al primo sguardo.", price: "su preventivo" },
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
            <span style={{
              display: "inline-block",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#6366f1",
              opacity: 0.4,
            }} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}


const universes = [
  {
    slug: "elegante",
    title: "Elegante",
    tag: "Aurora",
    desc: "Tipografia leggera, calma premium. Il lusso del silenzio.",
  },
  {
    slug: "wow",
    title: "Wow",
    tag: "Viaggio interstellare",
    desc: "Un volo 3D tra pianeti, stargate e iperspazio.",
  },
  {
    slug: "ipnotico",
    title: "Ipnotico",
    tag: "Galassia",
    desc: "22.000 stelle che respirano mentre le navighi.",
  },
];

function UniversePreview({ slug }: { slug: string }) {
  if (slug === "elegante") {
    return (
      <div style={{
        height: "150px", position: "relative", overflow: "hidden",
        background: "radial-gradient(circle at 30% 40%, rgba(99,102,241,0.45), transparent 60%), radial-gradient(circle at 75% 75%, rgba(139,92,246,0.35), transparent 60%), #05050f",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "var(--font-exo2)", fontWeight: 200, fontSize: "3rem",
          color: "#e2e8f0", letterSpacing: "0.05em",
        }}>
          Aa
        </span>
      </div>
    );
  }
  if (slug === "wow") {
    return (
      <div style={{
        height: "150px", position: "relative", overflow: "hidden", background: "#000010",
      }}>
        <div style={{
          position: "absolute", inset: "-30%",
          background: "repeating-linear-gradient(105deg, transparent 0px, transparent 16px, rgba(99,102,241,0.55) 16px, rgba(99,102,241,0.55) 17px, transparent 17px, transparent 46px)",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "26px", height: "26px", borderRadius: "50%",
          background: "radial-gradient(circle, #fff, #c4b5fd 40%, transparent 70%)",
          boxShadow: "0 0 30px #a78bfa, 0 0 60px rgba(167,139,250,0.5)",
        }} />
      </div>
    );
  }
  return (
    <div style={{
      height: "150px", position: "relative", overflow: "hidden", background: "#010108",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div className="universe-galaxy-spin" style={{
        width: "120px", height: "120px", borderRadius: "50%",
        background: "conic-gradient(from 0deg, #6366f1, #8b5cf6, #22d3ee, #312e81, #6366f1)",
        filter: "blur(10px)", opacity: 0.85,
      }} />
      <div style={{
        position: "absolute", width: "14px", height: "14px", borderRadius: "50%",
        background: "radial-gradient(circle, #fff, #c7d2fe 50%, transparent 80%)",
        boxShadow: "0 0 20px #a5b4fc",
      }} />
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
        @keyframes universe-spin { to { transform: rotate(360deg); } }
        .universe-galaxy-spin { animation: universe-spin 14s linear infinite; }
        @media (max-width: 900px) {
          .universes-grid { grid-template-columns: 1fr !important; max-width: 380px !important; }
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
        I NOSTRI <span style={{ color: "#6366f1" }}>UNIVERSI</span>
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
        Tre stili, tre esperienze dal vivo — più un progetto reale già online. Entra e scegli il tuo.
      </motion.p>

      <div className="universes-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.5rem", maxWidth: "1000px", width: "100%",
      }}>
        {universes.map((u, i) => (
          <motion.a
            key={u.slug}
            href={`/stili/${u.slug}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.12, type: "spring", damping: 20 }}
            whileHover={{
              y: -8, scale: 1.02,
              boxShadow: "0 10px 50px rgba(99,102,241,0.35)",
              borderColor: "rgba(99,102,241,0.6)",
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "block", textDecoration: "none",
              background: "rgba(5,5,20,0.9)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "16px", overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <UniversePreview slug={u.slug} />
            <div style={{ padding: "1.5rem" }}>
              <p style={{
                fontFamily: "var(--font-orbitron)", fontSize: "0.62rem",
                letterSpacing: "0.3em", color: "#818cf8", marginBottom: "0.5rem",
                textTransform: "uppercase",
              }}>
                {u.tag}
              </p>
              <h3 style={{
                fontFamily: "var(--font-orbitron)", fontSize: "1.25rem", fontWeight: 700,
                color: "#e0e7ff", marginBottom: "0.6rem",
              }}>
                {u.title}
              </h3>
              <p style={{
                fontFamily: "var(--font-exo2)", fontSize: "0.9rem", lineHeight: 1.6,
                color: "#e0e7ff", opacity: 0.75, marginBottom: "1rem",
              }}>
                {u.desc}
              </p>
              <span style={{
                fontFamily: "var(--font-orbitron)", fontSize: "0.7rem",
                letterSpacing: "0.2em", color: "#6366f1",
              }}>
                ESPLORA →
              </span>
            </div>
          </motion.a>
        ))}
      </div>

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
            Sito del movimento di liberazione dei bonsai: dominio, sito, hosting ed email, tutto configurato da DIOBO dalla A alla Z.
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
          <p style={{
            marginTop: "1rem",
            fontFamily: "var(--font-orbitron)",
            fontSize: "0.8rem",
            letterSpacing: "0.15em",
            color: "#a5b4fc",
            textTransform: "uppercase",
            position: "relative",
          }}>
            {service.price}
          </p>
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

          <motion.p
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
            }}
          >
            Dal server al sito. Siti web, assistenza IT, domini ed email professionali a Bologna —
            da un sistemista vero che costruisce anche il web.
          </motion.p>

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
              href={CONTACT_MAILTO}
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

        <GlowSeparator />

        {/* SERVIZI */}
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

        {/* UNIVERSI — portfolio concept */}
        <UniversiSection />

        <GlowSeparator />

        {/* CTA */}
        <div style={{
          minHeight: "80vh",
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
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 900,
              textAlign: "center",
              marginBottom: "2rem",
              textShadow: "0 0 30px rgba(99,102,241,0.4)",
            }}
          >
            CHIEDI E TI <span style={{ color: "#6366f1" }}>SARÀ DATO</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              color: "#e0e7ff",
              fontSize: "1.3rem",
              textAlign: "center",
              maxWidth: "500px",
              marginBottom: "3rem",
              fontFamily: "var(--font-exo2)",
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            Raccontaci la tua idea.<br />Noi la trasformiamo in qualcosa di spettacolare.
          </motion.p>

          <motion.a
            href={CONTACT_MAILTO}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(139,92,246,0.3), 0 0 120px rgba(99,102,241,0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="cta-button"
            style={{
              display: "inline-block",
              padding: "1.2rem 4rem",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontSize: "1.1rem",
              fontWeight: 700,
              fontFamily: "var(--font-orbitron)",
              borderRadius: "50px",
              textDecoration: "none",
              letterSpacing: "0.1em",
              boxShadow: "0 0 30px rgba(99,102,241,0.3)",
              cursor: "pointer",
              position: "relative",
            }}
          >
            CONTATTACI
          </motion.a>
        </div>

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
            © 2026 — Il tuo universo digitale
          </p>
        </footer>
      </div>
    </>
  );
}
