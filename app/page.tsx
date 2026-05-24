"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import dynamic from "next/dynamic";

const SpaceScene = dynamic(() => import("@/components/SpaceScene"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll(".hero-el"),
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, stagger: 0.3, ease: "power4.out", delay: 0.5 }
      );
    }

    const sections = [servicesRef, storyRef, ctaRef];
    sections.forEach((ref) => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current.querySelectorAll(".fade-in"),
        { opacity: 0, y: 80 },
        {
          opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none reverse" },
        }
      );
    });
  }, []);

  return (
    <>
      <SpaceScene />

      {/* CONTENT OVERLAY */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HERO — 100vh, logo + tagline */}
        <div ref={heroRef} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <h1 className="hero-el" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(2rem, 6vw, 5rem)", fontWeight: 900, textAlign: "center", letterSpacing: "0.1em", opacity: 0, textShadow: "0 0 40px rgba(99,102,241,0.5)" }}>
            DIOBO<span style={{ color: "#6366f1" }}>.IT</span>
          </h1>
          <p className="hero-el" style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)", color: "#a0a0c0", textAlign: "center", maxWidth: "600px", marginTop: "1rem", opacity: 0, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Il tuo universo digitale
          </p>
          <div className="hero-el" style={{ marginTop: "4rem", opacity: 0 }}>
            <div style={{ width: "1px", height: "60px", background: "linear-gradient(to bottom, transparent, #6366f1, transparent)", margin: "0 auto" }} />
            <p style={{ color: "#555", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: "1rem" }}>Scrolla per esplorare</p>
          </div>
        </div>

        {/* SPACER — zona zoom */}
        <div style={{ height: "100vh" }} />

        {/* SERVIZI */}
        <div ref={servicesRef} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem" }}>
          <h2 className="fade-in" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.5rem, 4vw, 3rem)", fontWeight: 700, textAlign: "center", marginBottom: "1rem", textShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
            Cosa <span style={{ color: "#6366f1" }}>facciamo</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", maxWidth: "1000px", width: "100%" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", width: "100%" }}>
              {[
                { icon: "🛠️", title: "Consulenza IT", desc: "Assistenza informatica completa. Dal server al singolo dispositivo." },
                { icon: "🔗", title: "Domini", desc: "Registrazione domini semplici da ricordare." },
                { icon: "🎨", title: "Grafica & Logo", desc: "Logo distintivo, rappresentativo ed unico. Grafica semplice ed elegante." },
              ].map((s, i) => (
                <div className="fade-in" key={i} style={{
                  background: "rgba(99,102,241,0.05)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: "16px",
                  padding: "2rem",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.4s",
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{s.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.8rem", color: "#e0e7ff" }}>{s.title}</h3>
                  <p style={{ color: "#e0e7ff", fontSize: "0.95rem", lineHeight: 1.6, fontFamily: "var(--font-orbitron)", fontWeight: 400 }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="fade-in" style={{
              background: "rgba(99,102,241,0.05)",
              border: "1px solid rgba(99,102,241,0.15)",
              borderRadius: "16px",
              padding: "2rem",
              textAlign: "center",
              backdropFilter: "blur(10px)",
              transition: "all 0.4s",
              maxWidth: "300px",
              width: "100%",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌐</div>
              <h3 style={{ fontFamily: "var(--font-orbitron)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.8rem", color: "#e0e7ff" }}>Siti Web</h3>
              <p style={{ color: "#e0e7ff", fontSize: "0.95rem", lineHeight: 1.6, fontFamily: "var(--font-orbitron)", fontWeight: 400 }}>Pagine web di facile accesso, personalizzabili e dal design spettacolare.</p>
            </div>
          </div>
        </div>

        {/* SPACER */}
        <div style={{ height: "50vh" }} />

        {/* MISSION */}
        <div ref={storyRef} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem" }}>
          <h2 className="fade-in" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(1.5rem, 4vw, 3rem)", fontWeight: 700, textAlign: "center", marginBottom: "3rem", textShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
            LA NOSTRA <span style={{ color: "#6366f1" }}>MISSION</span>
          </h2>
          <div style={{ maxWidth: "800px" }}>
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "2.5rem", alignItems: "center", margin: "2rem 0" }}>
              {["Un sito dal nome facile", "Grafica semplice ed elegante", "Un logo distintivo ed unico"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  <div style={{
                    width: "14px", height: "14px", borderRadius: "50%",
                    background: "radial-gradient(circle, #fff 0%, #a5b4fc 30%, #6366f1 50%, transparent 70%)",
                    boxShadow: "0 0 20px #818cf8, 0 0 40px #6366f1, 0 0 80px rgba(99,102,241,0.5), 0 0 120px rgba(99,102,241,0.3)",
                    animation: `twinkle${i} ${1.5 + i * 0.5}s ease-in-out infinite alternate`,
                  }} />
                  <span style={{ color: "#e0e7ff", fontSize: "1.3rem", fontFamily: "var(--font-orbitron)", fontWeight: 500, letterSpacing: "0.05em" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes twinkle0 { from { opacity: 0.6; transform: scale(0.8); } to { opacity: 1; transform: scale(1.3); } }
            @keyframes twinkle1 { from { opacity: 0.5; transform: scale(0.7); } to { opacity: 1; transform: scale(1.4); } }
            @keyframes twinkle2 { from { opacity: 0.7; transform: scale(0.9); } to { opacity: 1; transform: scale(1.2); } }
          `}</style>
        </div>

        {/* SPACER */}
        <div style={{ height: "50vh" }} />

        {/* CTA */}
        <div ref={ctaRef} style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem" }}>
          <h2 className="fade-in" style={{ fontFamily: "var(--font-orbitron)", fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 900, textAlign: "center", marginBottom: "2rem", textShadow: "0 0 30px rgba(99,102,241,0.4)" }}>
            CHIEDI E TI <span style={{ color: "#6366f1" }}>SARÀ DATO</span>
          </h2>
          <p className="fade-in" style={{ color: "#e0e7ff", fontSize: "1.3rem", textAlign: "center", maxWidth: "500px", marginBottom: "3rem", fontFamily: "var(--font-orbitron)", fontWeight: 500, letterSpacing: "0.05em" }}>
            Raccontaci la tua idea.<br/><span style={{ whiteSpace: "nowrap" }}>Noi la trasformiamo in qualcosa di spettacolare.</span>
          </p>
          <a className="fade-in" href="mailto:dioboinfo@gmail.com" style={{
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
            transition: "all 0.4s",
            boxShadow: "0 0 30px rgba(99,102,241,0.3)",
          }}>
            CONTATTACI
          </a>
        </div>

        {/* FOOTER */}
        <footer style={{ padding: "3rem 2rem", borderTop: "1px solid rgba(99,102,241,0.1)", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-orbitron)", fontSize: "1rem", color: "#e0e7ff", letterSpacing: "0.2em" }}>
            DIOBO<span style={{ color: "#6366f1" }}>.IT</span>
          </div>
          <p style={{ color: "#e0e7ff", fontSize: "0.75rem", marginTop: "0.5rem" }}>
            © 2026 — Il tuo universo digitale
          </p>
        </footer>
      </div>
    </>
  );
}
