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

  // ===== NAV (mobile) =====
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("navopen", navOpen);
  }, [navOpen]);
  useEffect(() => {
    const onHash = () => setNavOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // ===== NAVBAR glass on scroll =====
  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      root.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ===== SHAPES (fewer on mobile for perf) =====
  const shapes = useMemo(() => {
    const isPhone =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 480px), (pointer: coarse)").matches;
    const COUNT = isPhone ? 14 : 26;

    return Array.from({ length: COUNT }).map((_, i) => ({
      id: i,
      top: rand(0, 100),
      left: rand(0, 100),
      size: rand(isPhone ? 10 : 12, isPhone ? 40 : 52),
      blur: rand(0, isPhone ? 6 : 8),
      hue: rand(0, 360),
      opacity: rand(0.35, 0.85),
      rotate: rand(-30, 30),
      parallax: rand(0.02, 0.14),
      floatDuration: rand(12, 26),
      floatDelay: rand(-10, 10),
      z: Math.random() < 0.6 ? 0 : 1,
      borderRadius:
        Math.random() < 0.5 ? "999px" : `${rand(10, 40)}% / ${rand(25, 80)}%`,
    }));
  }, []);

  // Cursor parallax (desktop), gentle auto-drift (touch)
  useEffect(() => {
    const root = document.documentElement;
    let targetX = 0,
      targetY = 0;
    let currentX = 0,
      currentY = 0;
    let raf = 0;

    const onMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (e.clientX - w / 2) / w;
      const y = (e.clientY - h / 2) / h;
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
          <a href="#sākums" className="brand" aria-label="Uz sākumu">
            Portfolio
          </a>

          <nav className="nav" aria-label="Galvenā navigācija">
            <a href="#par-mani" className="nav__link">
              Par mani
            </a>
            <a href="#projekti" className="nav__link">
              Projekti
            </a>
            <a href="#kontakti" className="nav__link">
              Kontakti
            </a>
          </nav>

          {/* Theme + mobile burger (icons only) */}
          <div className="nav-buttons">
            <button
              className="btn toggle"
              type="button"
              onClick={() => setIsDark((v) => !v)}
              aria-pressed={isDark}
              title={isDark ? "Gaišais režīms" : "Tumšais režīms"}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              className="btn burger"
              type="button"
              aria-label="Atvērt izvēlni"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              <BurgerIcon open={navOpen} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className="mobile-nav" aria-hidden={!navOpen}>
          <a href="#par-mani" className="mnav__link" onClick={() => setNavOpen(false)}>
            Par mani
          </a>
          <a href="#projekti" className="mnav__link" onClick={() => setNavOpen(false)}>
            Projekti
          </a>
          <a href="#kontakti" className="mnav__link" onClick={() => setNavOpen(false)}>
            Kontakti
          </a>
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
          Šeit drīzumā pievienošu savus projektus un aprakstus.
        </p>
      </section>

      {/* ===== KONTAKTI ===== */}
      <section id="kontakti" className="section section-kontakti" aria-label="Kontakti">
        <h2 className="section__title">Kontakti</h2>
        <div className="contact-grid">
          <a className="contact-item" href="tel:+37126927763" title="+371 26927763">
            <PhoneIcon />
            <span className="contact-text">+371 26927763</span>
          </a>
           <a
            className="contact-item"
            href="mailto:ralfscd@gmail.com"
            title="ralfscd@gmail.com"
          >
            <GmailIcon />
            <span className="contact-text">ralfscd@gmail.com</span>
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

          {/* NEW: Gmail contact */}
         
        </div>
      </section>

      {/* vignette */}
      <div className="vignette" />
    </div>
  );
}

/** Icons */
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

/* Sun/Moon stroke icons (icons only) */
function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      strokeWidth="1.5"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      strokeWidth="1.5"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  );
}
function BurgerIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      {open ? (
        <path
          fill="currentColor"
          d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"
        />
      ) : (
        <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
      )}
    </svg>
  );
}

/** Gmail-style mail icon (monochrome to match the rest) */
function GmailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" className="icon">
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12c0 1.105.895 2 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm-.4 3.2-7.2 5.4a1 1 0 0 1-1.2 0L4.4 7.2A1 1 0 0 1 5.6 5.8l6.4 4.8 6.4-4.8a1 1 0 1 1 1.2 1.4Z"
      />
    </svg>
  );
}
