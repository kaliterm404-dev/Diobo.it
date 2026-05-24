"use client";

import { useEffect, useRef } from "react";

const layers = [
  { src: "/4-earth.jpg", depthStart: 0, depthEnd: 0.55, scaleStart: 0.75, scaleEnd: 2.5, opacityStart: 1, opacityEnd: 0 },
  { src: "/5-pyramids.jpg", depthStart: 0.4, depthEnd: 1.0, scaleStart: 0.8, scaleEnd: 1.3, opacityStart: 0, opacityEnd: 1 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export default function SpaceScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // Particle canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars: { x: number; y: number; z: number; size: number; baseAlpha: number; twinkleSpeed: number; twinkleOffset: number; color: [number, number, number] }[] = [];
    const starColors: [number, number, number][] = [
      [255, 255, 255],
      [200, 210, 255],
      [255, 220, 180],
      [180, 200, 255],
      [255, 200, 200],
      [220, 255, 255],
    ];
    for (let i = 0; i < 500; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(),
        size: Math.random() < 0.05 ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.2,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 3 + 1,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    let scrollSpeed = 0;
    let lastScroll = 0;

    const onScroll = () => {
      const s = window.scrollY;
      scrollSpeed = (s - lastScroll) * 0.2;
      lastScroll = s;
    };
    window.addEventListener("scroll", onScroll);

    let animId: number;

    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      scrollSpeed *= 0.93;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const time = performance.now() * 0.001;

      for (const s of stars) {
        if (Math.abs(scrollSpeed) > 0.3) {
          const dx = s.x - cx;
          const dy = s.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          s.x += (dx / dist) * scrollSpeed * s.z * 2;
          s.y += (dy / dist) * scrollSpeed * s.z * 2;
        }

        s.x -= mx * s.z * 0.5;
        s.y -= my * s.z * 0.5;

        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.4 + 0.6;
        const alpha = s.baseAlpha * twinkle;
        const [r, g, b] = s.color;

        if (s.size > 2) {
          // Bright stars with cross flare
          const flareLen = s.size * 6 * twinkle;
          const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
          gradient.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
          gradient.addColorStop(0.3, `rgba(${r},${g},${b},${alpha * 0.3})`);
          gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - flareLen, s.y);
          ctx.lineTo(s.x + flareLen, s.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - flareLen);
          ctx.lineTo(s.x, s.y + flareLen);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      // Update image layers
      const layerEls = containerRef.current?.querySelectorAll<HTMLElement>(".journey-layer");
      if (layerEls) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

        layerEls.forEach((el, i) => {
          const L = layers[i];
          const range = L.depthEnd - L.depthStart;
          const localProgress = (progress - L.depthStart) / range;
          const fadeIn = Math.max(0, Math.min(1, localProgress * 3));
          const fadeOut = L.opacityEnd > 0 ? 1 : Math.max(0, Math.min(1, (1 - localProgress) * 3));
          const opacity = Math.min(fadeIn, fadeOut);
          const scale = lerp(L.scaleStart, L.scaleEnd, localProgress);
          const mouseParallax = (1 - i * 0.15);

          el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
          el.style.transform = `translate(${mx * mouseParallax * 20}px, ${my * mouseParallax * 15}px) scale(${Math.max(0.5, scale)})`;
        });
      }

      animId = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: "#000005" }}>
      {layers.map((L, i) => (
        <div
          key={i}
          className="journey-layer"
          style={{
            position: "absolute",
            inset: "-5%",
            backgroundImage: `url(${L.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === 0 ? 1 : 0,
            willChange: "transform, opacity",
            transition: "opacity 0.1s linear",
          }}
        />
      ))}

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,5,0.3) 100%)",
        pointerEvents: "none",
      }} />

      {/* Particles */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
    </div>
  );
}
