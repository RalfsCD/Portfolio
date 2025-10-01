import { useEffect, useMemo } from "react";
import "./App.css";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export default function App() {
  // Generate shapes once
  const shapes = useMemo(() => {
    const COUNT = 26;
    return Array.from({ length: COUNT }).map((_, i) => ({
      id: i,
      // place shapes by percentages to keep them responsive
      top: rand(0, 100),     // %
      left: rand(0, 100),    // %
      size: rand(12, 52),    // px
      blur: rand(0, 8),      // px
      hue: rand(0, 360),     // deg
      opacity: rand(0.35, 0.85),
      rotate: rand(-30, 30), // deg (base tilt)
      parallax: rand(0.02, 0.14), // how much it reacts to cursor
      floatDuration: rand(12, 26), // seconds
      floatDelay: rand(-10, 10),   // seconds
      z: Math.random() < 0.6 ? 0 : 1, // some shapes “closer”
      borderRadius: Math.random() < 0.5 ? "999px" : `${rand(10, 40)}% / ${rand(25, 80)}%`,
    }));
  }, []);

  // Cursor parallax (sets CSS vars on the root)
  useEffect(() => {
    const root = document.documentElement;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let raf = 0;

    const onMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (e.clientX - w / 2) / w; // -0.5 .. 0.5
      const y = (e.clientY - h / 2) / h; // -0.5 .. 0.5
      targetX = x;
      targetY = y;
      if (!raf) tick();
    };

    const tick = () => {
      // ease toward target for smoothness
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      root.style.setProperty("--mx", String(currentX));
      root.style.setProperty("--my", String(currentY));
      raf = Math.abs(currentX - targetX) + Math.abs(currentY - targetY) > 0.001 ? requestAnimationFrame(tick) : 0;
    };

    window.addEventListener("mousemove", onMove);
    // subtle auto drift on touch devices
    let drift = 0;
    const auto = () => {
      drift += 0.005;
      targetX = Math.sin(drift) * 0.15;
      targetY = Math.cos(drift * 0.9) * 0.12;
      if (!raf) tick();
      requestAnimationFrame(auto);
    };
    if (window.matchMedia("(pointer: coarse)").matches) auto();

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="page">
      {/* floating shapes */}
      <div className="shapes">
        {shapes.map((s) => (
          <div
            key={s.id}
            className={`shape ${s.z ? "z1" : "z0"}`}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              filter: `blur(${s.blur}px)`,
              opacity: s.opacity,
              borderRadius: s.borderRadius,
              // custom vars for per-shape behavior
              ["--h"]: `${s.hue}deg`,
              ["--parallax"]: s.parallax,
              ["--base-rot"]: `${s.rotate}deg`,
              ["--float-dur"]: `${s.floatDuration}s`,
              ["--float-delay"]: `${s.floatDelay}s`,
            }}
          />
        ))}
      </div>

      {/* center content */}
      <main className="hero">
        <h1 className="title">Portfolio</h1>
        <p className="subtitle">
          Par mani • Projekti • Kontakti
        </p>

        <div className="cta">
          <a href="#" className="btn primary">Projekti</a>
          <a href="#" className="btn ghost">Kontakti</a>
        </div>
      </main>

      {/* soft vignette for depth */}
      <div className="vignette" />
    </div>
  );
}
