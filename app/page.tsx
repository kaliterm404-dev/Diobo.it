"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { Monitor, Globe, Palette, Layout } from "lucide-react";
import dynamic from "next/dynamic";

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

const services = [
  { icon: Monitor, title: "Consulenza IT", desc: "Assistenza informatica completa. Dal server al singolo dispositivo." },
  { icon: Globe, title: "Domini", desc: "Registrazione domini semplici da ricordare." },
  { icon: Palette, title: "Grafica & Logo", desc: "Logo distintivo, rappresentativo ed unico. Grafica semplice ed elegante." },
  { icon: Layout, title: "Siti Web", desc: "Pagine web di facile accesso, personalizzabili e dal design spettacolare." },
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.8 }}
            style={{ marginTop: "4rem" }}
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
        <div style={{ height: "100vh" }} />

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
            href="mailto:dioboinfo@gmail.com"
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
