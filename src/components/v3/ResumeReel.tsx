"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Play, Pause, RefreshCw, ChevronRight,
  Zap, Car, Shield, Globe, Award, Code, Cpu,
  Sparkles, Briefcase, ArrowRight
} from "lucide-react";
import { experienceData } from "@/data/portfolio";

/* ─── Slide Definitions ─────────────────────────────── */
// Note: experienceData indices after adding Stealth at [0]:
// [0]=Stealth, [1]=Samsara, [2]=Cruise, [3]=Rivian, [4]=Amazon, [5]=Google
// [6]=Cisco, [7]=Wistron, [8]=Motorola, [9]=Luminous
const slides = [
  /* 0 — Intro */
  {
    id: "intro",
    accent: "#06b6d4",
    bg: "from-cyan-950 via-slate-950 to-black",
    label: "18+ YEARS",
    title: "Engineering\nExcellence",
    body: "From startups to FAANG — a decade-and-a-half journey building hardware, AI, and automation systems.",
    icon: <Sparkles className="w-10 h-10 text-cyan-400" />,
    cta: null,
    stat: null,
  },
  /* 1 — Samsara */
  {
    id: "samsara",
    accent: "#f59e0b",
    bg: "from-amber-950 via-slate-950 to-black",
    label: "SAMSARA · DEC 2023 – JUL 2025",
    title: "Samsara\nIoT & AI/ML QA",
    body: experienceData[1]?.highlights?.[0] ?? experienceData[1]?.desc,
    icon: <Zap className="w-10 h-10 text-amber-400" />,
    stat: { value: "50%", label: "Regression Cycles Reduced" },
    cta: null,
  },
  /* 2 — Amazon */
  {
    id: "amazon",
    accent: "#f97316",
    bg: "from-orange-950 via-slate-950 to-black",
    label: "AMAZON LAB126 · 2018–2021",
    title: "Amazon\nAlexa IoT Lead",
    body: experienceData[4]?.highlights?.[0] ?? experienceData[4]?.desc,
    icon: <Shield className="w-10 h-10 text-orange-400" />,
    stat: { value: "$3M", label: "Manual Testing Cost Saved" },
    cta: null,
  },
  /* 3 — Google */
  {
    id: "google",
    accent: "#3b82f6",
    bg: "from-blue-950 via-slate-950 to-black",
    label: "GOOGLE / DAYDREAM VR · 2016–2018",
    title: "Google\nVR Systems",
    body: experienceData[5]?.highlights?.[0] ?? experienceData[5]?.desc,
    icon: <Globe className="w-10 h-10 text-blue-400" />,
    stat: { value: "80%", label: "Execution Hours Cut via Robot Arm" },
    cta: null,
  },
  /* 4 — Rivian */
  {
    id: "rivian",
    accent: "#10b981",
    bg: "from-emerald-950 via-slate-950 to-black",
    label: "RIVIAN AUTOMOTIVE · 2021–2022",
    title: "Rivian\nInfotainment QA",
    body: experienceData[3]?.highlights?.[0] ?? experienceData[3]?.desc,
    icon: <Car className="w-10 h-10 text-emerald-400" />,
    stat: { value: "R1T / R1S", label: "EV Models Shipped" },
    cta: null,
  },
  /* 5 — Motorola / L&T */
  {
    id: "motorola",
    accent: "#8b5cf6",
    bg: "from-violet-950 via-slate-950 to-black",
    label: "MOTOROLA / L&T INFOTECH · 2009–2014",
    title: "Motorola\nBluetooth Automation",
    body: experienceData[8]?.highlights?.[0] ?? experienceData[8]?.desc,
    icon: <Cpu className="w-10 h-10 text-violet-400" />,
    stat: { value: "$2.1M", label: "Revenue via Automation Framework" },
    cta: null,
  },
  /* 6 — Tech / Skills */
  {
    id: "skills",
    accent: "#ec4899",
    bg: "from-pink-950 via-slate-950 to-black",
    label: "FULL-STACK SYSTEMS",
    title: "Mastery &\nTools",
    body: "Python · JavaScript · Shell · C/C++ · Android · QNX · Linux · Selenium · Appium · Jenkins · Git · Raspberry Pi · Arduino · Splunk",
    icon: <Code className="w-10 h-10 text-pink-400" />,
    stat: null,
    cta: null,
  },
  /* 7 — Certifications / Awards */
  {
    id: "certs",
    accent: "#f59e0b",
    bg: "from-yellow-950 via-slate-950 to-black",
    label: "CERTIFIED",
    title: "Expertise\nValidated",
    body: "AI Coding Agents (2025) · Software Testing Foundations: AI Integration (2026) · ISTQB CTFL · Scrum Advanced · Annual Best Performer · Excellent Performance Award",
    icon: <Award className="w-10 h-10 text-yellow-400" />,
    stat: null,
    cta: null,
  },
  /* 8 — CTA */
  {
    id: "cta",
    accent: "#06b6d4",
    bg: "from-cyan-950 via-indigo-950 to-black",
    label: "LET'S BUILD",
    title: "Open to\nOpportunities",
    body: "Explore the full career timeline, projects, and AI lab — or reach out directly.",
    icon: <Briefcase className="w-10 h-10 text-cyan-400" />,
    stat: null,
    cta: { label: "View Full Portfolio", href: "/experience" },
  },
];

const DURATION = 5000; // ms per slide

/* ─── Component ─────────────────────────────────────── */
export function ResumeReel() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false); // Don't auto-play until in view
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer — start from slide 0 when first scrolled into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasEnteredView) {
          setHasEnteredView(true);
          setIndex(0);
          setProgress(0);
          setPlaying(true);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEnteredView]);

  const advance = useCallback((dir: 1 | -1 = 1) => {
    setDirection(dir);
    setProgress(0);
    setIndex((prev) => (prev + dir + slides.length) % slides.length);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          advance(1);
          return 0;
        }
        return p + (100 / (DURATION / 100));
      });
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, index, advance]);

  const slide = slides[index];

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { advance(dx < 0 ? 1 : -1); }
    touchStartX.current = null;
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    // Only visible on mobile
    <div ref={containerRef} className="md:hidden w-full flex flex-col items-center py-12 px-6 gap-6">
      {/* Label */}
      <div className="text-center">
        <p className="t-label font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">Career Reel</p>
        <h2 className="t-small text-white/80 tracking-tight">Tap sides · Auto-plays · Swipe</h2>
      </div>

      {/* Phone Frame */}
      <div
        className="relative w-full max-w-[320px] rounded-[40px] overflow-hidden shadow-2xl border-[6px] border-zinc-800 bg-black mx-auto"
        style={{ height: "calc(min(75vh, 600px))", touchAction: "pan-y" }}
      >
        {/* Progress bars at top */}
        <div className="absolute top-4 left-3 right-3 z-20 flex gap-1">
          {slides.map((_, i) => (
            <div key={i} className="h-[3px] flex-1 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white"
                animate={{
                  width: i === index ? `${progress}%` :
                         i < index ? "100%" : "0%",
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          ))}
        </div>

        {/* Slide content */}
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const offsetX = info.offset.x;
              const velocityX = info.velocity.x;
              if (offsetX < -100 || velocityX < -500) {
                advance(1);
              } else if (offsetX > 100 || velocityX > 500) {
                advance(-1);
              }
            }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-b ${slide.bg} flex flex-col pt-16 pb-40 px-7`}
          >
            {/* Decorative glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
              style={{ backgroundColor: slide.accent }}
            />

            {/* Icon — bouncing */}
            <div className="flex items-center justify-center mb-6 mt-2">
              <motion.div
                animate={{ y: [0, -8, 0], scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="relative"
              >
                <div
                  className="absolute inset-0 blur-2xl rounded-full scale-150 opacity-40"
                  style={{ backgroundColor: slide.accent }}
                />
                <div className="relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  {slide.icon}
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 relative z-10 mt-auto">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="t-label font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full w-fit"
                style={{ backgroundColor: `${slide.accent}22`, color: slide.accent, border: `1px solid ${slide.accent}40` }}
              >
                {slide.label}
              </motion.span>

              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-black text-white tracking-tighter leading-none whitespace-pre-line"
              >
                {slide.title}
              </motion.h3>

              {slide.stat && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-baseline gap-2 py-2 px-3 rounded-2xl w-fit"
                  style={{ backgroundColor: `${slide.accent}15`, border: `1px solid ${slide.accent}30` }}
                >
                  <span className="text-2xl font-black" style={{ color: slide.accent }}>{slide.stat.value}</span>
                  <span className="t-label font-bold text-white/50 uppercase tracking-wider">{slide.stat.label}</span>
                </motion.div>
              )}

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-white/55 leading-relaxed line-clamp-4"
              >
                {slide.body}
              </motion.p>

              {slide.cta && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href={slide.cta.href}
                    className="mt-2 flex items-center gap-2 font-black text-sm px-4 py-2.5 rounded-full w-fit transition-all active:scale-95"
                    style={{ backgroundColor: slide.accent, color: "#000" }}
                  >
                    {slide.cta.label} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tap zone overlay — left/right halves, below controls */}
        <div className="absolute inset-0 z-10 flex pointer-events-auto" style={{ bottom: "80px" }}>
          <div className="w-1/2 h-full cursor-pointer" onClick={() => advance(-1)} />
          <div className="w-1/2 h-full cursor-pointer" onClick={() => advance(1)} />
        </div>

        {/* Controls — positioned to avoid overlap with body text */}
        <div className="absolute bottom-14 left-0 right-0 z-20 flex justify-center gap-8">
          <button
            onClick={(e) => { e.stopPropagation(); setPlaying((p) => !p); }}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white active:scale-95 transition-transform"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIndex(0); setProgress(0); setPlaying(true); }}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white active:scale-95 transition-transform"
            aria-label="Restart from beginning"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>


        {/* Slide counter */}
        <p className="absolute bottom-3 left-0 right-0 z-20 text-center text-xs font-semibold text-white/50 uppercase tracking-widest pointer-events-none">
          {index + 1} / {slides.length} · tap to navigate
        </p>
      </div>

      {/* CTA below reel */}
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs text-zinc-400">Desktop view has the full interactive experience</p>
        <Link href="/experience" className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          Full Timeline <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
