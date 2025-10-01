import { useEffect, useMemo, useState } from "react";
import "./App.css";

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export default function App() {
  // ===== THEME =====
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("theme-dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("theme-dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Add/remove "scrolled" class for navbar glass effect
  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      root.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ===== SHAPES =====
  const shapes = useMemo(() => {
    const COUNT = 26;
    return Array.from({ length: COUNT }).map((_, i) => ({
      id: i,
      top: rand(0, 100),     // %
      left: rand(0, 100),    // %
      size: rand(12, 52),    // px
      blur: rand(0, 8),      // px
      hue: rand(0, 360),     // deg
      opacity: rand(0.35, 0.85),
      rotate: rand(-30, 30), // deg
      parallax: rand(0.02, 0.14),
      floatDuration: rand(12, 26), // s
      floatDelay: rand(-10, 10),   // s
      z: Math.random() < 0.6 ? 0 : 1,
      borderRadius:
        Math.random() < 0.5 ? "999px" : `${rand(10, 40)}% / ${rand(25, 80)}%`,
    }));
  }, []);

  // kursora parallax mainīgie
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
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      root.style.setProperty("--mx", String(currentX));
      root.style.setProperty("--my", String(currentY));
      raf =
        Math.abs(currentX - targetX) + Math.abs(currentY - targetY) > 0.001
          ? requestAnimationFrame(tick)
          : 0;
    };

    window.addEventListener("mousemove", onMove);
    // neliels auto drifts skārienierīcēs
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
      {/* plūstošās formas */}
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
              ["--h"]: `${s.hue}deg`,
              ["--parallax"]: s.parallax,
              ["--base-rot"]: `${s.rotate}deg`,
              ["--float-dur"]: `${s.floatDuration}s`,
              ["--float-delay"]: `${s.floatDelay}s`,
            }}
          />
        ))}
      </div>

      {/* ===== NAVBAR ===== */}
      <header className="navbar" aria-label="Navigācija">
        <div className="navbar__inner">
          <a href="#sākums" className="brand" aria-label="Uz sākumu">Portfolio</a>

          <nav className="nav" aria-label="Galvenā navigācija">
            <a href="#par-mani" className="nav__link">Par mani</a>
            <a href="#projekti" className="nav__link">Projekti</a>
            <a href="#kontakti" className="nav__link">Kontakti</a>
          </nav>

          <button
            className="btn toggle"
            type="button"
            onClick={() => setIsDark((v) => !v)}
            aria-pressed={isDark}
            title={isDark ? "Gaišāks režīms" : "Tumšais režīms"}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
            <span className="toggle-text">{isDark ? "Gaišāks" : "Tumšais"}</span>
          </button>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <main id="sākums" className="hero">
        <h1 className="title">Portfolio</h1>
      </main>

      {/* ===== PAR MANI ===== */}
      <section id="par-mani" className="section section-about" aria-label="Par mani">
        <h2 className="section__title">Par mani</h2>
        <p className="about-text">
          Šī sadaļa būs īss apraksts par mani, prasmēm un
          tehnoloģijām, ar kurām strādāju.
        </p>
      </section>

      {/* ===== PROJEKTI (vietturis) ===== */}
      <section id="projekti" className="section section-projects" aria-label="Projekti">
        <div className="section-head">
          <h2 className="section__title">Projekti</h2>
          <span className="badge soon">Drīzumā</span>
        </div>

        <div className="projects-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="project-card skeleton" aria-hidden="true">
              <div className="skel-thumb" />
              <div className="skel-lines">
                <span className="skel-line" />
                <span className="skel-line short" />
              </div>
            </div>
          ))}
        </div>

        <p className="projects-note">
          Šeit drīzumā pievienošu savus projektus
        </p>
      </section>

      {/* ===== KONTAKTI ===== */}
      <section id="kontakti" className="section section-kontakti" aria-label="Kontakti">
        <h2 className="section__title">Kontakti</h2>
        <div className="contact-grid">
          <a className="contact-item" href="tel:+37126927763" title="+371 2692 7763">
            <PhoneIcon />
            <span className="contact-text">+371 26927763</span>
          </a>
          <a
            className="contact-item"
            href="https://github.com/RalfsCD"
            target="_blank"
            rel="noreferrer"
            title="github.com/RalfsCD"
          >
            <GithubIcon />
            <span className="contact-text">github.com/RalfsCD</span>
          </a>
        </div>
      </section>

      {/* vinjete */}
      <div className="vignette" />
    </div>
  );
}

/** Ikona: GitHub */
function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" className="icon">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.162 19.492c.5.092.683-.217.683-.482 0-.237-.009-.868-.013-1.703-2.781.604-3.369-1.342-3.369-1.342-.455-1.156-1.11-1.465-1.11-1.465-.907-.62.069-.607.069-.607 1.003.07 1.53 1.03 1.53 1.03.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.339-2.22-.254-4.555-1.11-4.555-4.942 0-1.091.39-1.985 1.029-2.684-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.56 9.56 0 0 1 12 6.844c.851.004 1.706.115 2.506.338 1.908-1.294 2.747-1.025 2.747-1.025.546 1.378.203 2.397.1 2.65.64.699 1.027 1.593 1.027 2.684 0 3.842-2.339 4.685-4.566 4.933.359.31.678.92.678 1.854 0 1.338-.012 2.417-.012 2.746 0 .267.18.579.688.481A10 10 0 0 0 12 2Z"
      />
    </svg>
  );
}

/** Ikona: Telefons */
function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" className="icon">
      <path
        fill="currentColor"
        d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1.5 1.5 0 011.56-.36c1.11.37 2.31.57 3.58.57a1.5 1.5 0 011.5 1.5V20a1.5 1.5 0 01-1.5 1.5C11.29 21.5 2.5 12.71 2.5 2.5A1.5 1.5 0 014 1h3.21A1.5 1.5 0 018.71 2.5c0 1.27.2 2.47.57 3.58.2.52.08 1.11-.36 1.56l-2.3 2.3z"
      />
    </svg>
  );
}

/** Ikonas tumšā/gaišā režīma pārslēgšanai */
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.76 4.84l-1.8-1.79L3.17 4.84 4.96 6.63 6.76 4.84zm10.48 14.32l1.79 1.8 1.79-1.8-1.79-1.79-1.79 1.79zM12 4V1h0v3h0zm0 19v-3h0v3h0zM4 12H1v0h3v0zm19 0h-3v0h3v0zM6.76 19.16l-1.8 1.79 1.79 1.79 1.79-1.79-1.79-1.79zM17.24 4.84l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM12 7a5 5 0 100 10 5 5 0 000-10z"
      />
    </svg>
  );
}
