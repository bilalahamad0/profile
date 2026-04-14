"use client";

import { motion } from "framer-motion";
import {
  MoveRight, Car, Cpu, Shield, Zap, Terminal,
  ChevronRight, LayoutGrid, Network, GitBranch
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ─── Animated & Breathing Background ───────────────── */
function HeroBackground() {
  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Deep mesh gradients that breathe life into the dark mode */}
      <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] rounded-[100%] bg-violet-600/15 blur-[180px]" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-[100%] bg-blue-600/15 blur-[150px]" />
      <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-[100%] bg-cyan-600/10 blur-[120px]" />

      {/* Fine tactical grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035]"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="heroGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </svg>

      {/* Floating domain icons — desktop decorative with breathing animation */}
      <div className="absolute inset-0 hidden lg:block opacity-100">
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, 15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[28%] right-[32%] text-cyan-400/40"
        >
          <Shield size={72} aria-hidden="true" />
          <span className="block text-[9px] mt-2 font-mono opacity-80 uppercase tracking-[0.2em] text-cyan-300">Safety Critical</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[38%] right-[20%] text-violet-400/40"
        >
          <Cpu size={64} aria-hidden="true" />
          <span className="block text-[9px] mt-1 font-mono opacity-80 uppercase tracking-[0.2em] text-violet-300">Firmware</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[18%] right-[16%] text-amber-400/40"
        >
          <Car size={72} aria-hidden="true" />
          <span className="block text-[9px] mt-2 font-mono opacity-80 uppercase tracking-[0.2em] text-amber-300">Automotive</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -25, 0], x: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[11%] right-[36%] text-emerald-400/40"
        >
          <Network size={64} aria-hidden="true" />
          <span className="block text-[9px] mt-1 font-mono opacity-80 uppercase tracking-[0.2em] text-emerald-300">IoT Systems</span>
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-[45%] left-[1.5%] text-zinc-500/30"
        >
          <GitBranch size={88} aria-hidden="true" />
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Premium Highlighter ───────────────────────────── */
function Highlight({ children, color = "violet" }: { children: React.ReactNode; color?: "violet" | "cyan" }) {
  const colorMap = {
    violet: "bg-violet-500/15 border border-violet-500/40 text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.2)]",
    cyan: "bg-cyan-500/15 border border-cyan-500/40 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.2)]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 mx-0.5 rounded-md ${colorMap[color]} font-semibold tracking-wide backdrop-blur-sm`}>
      {children}
    </span>
  );
}

/* ─── Vibrant Core Specialization Cards ─────────────── */
const coreCards = [
  {
    icon: Cpu,
    label: "18+ Years",
    sub: "Industry Experience",
    iconColor: "text-cyan-400",
    bgAccent: "bg-cyan-500/20",
    borderAccent: "group-hover:border-cyan-500/50",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.03)] group-hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]",
  },
  {
    icon: Zap,
    label: "IoT & Firmware",
    sub: "Systems Validation",
    iconColor: "text-amber-400",
    bgAccent: "bg-amber-500/20",
    borderAccent: "group-hover:border-amber-500/50",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.03)] group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]",
  },
  {
    icon: Car,
    label: "Automotive",
    sub: "Infotainment & EV/AV",
    iconColor: "text-violet-400",
    bgAccent: "bg-violet-500/20",
    borderAccent: "group-hover:border-violet-500/50",
    glow: "shadow-[0_0_20px_rgba(139,92,246,0.03)] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]",
  },
  {
    icon: Shield,
    label: "Safety Critical",
    sub: "High Integrity Data",
    iconColor: "text-emerald-400",
    bgAccent: "bg-emerald-500/20",
    borderAccent: "group-hover:border-emerald-500/50",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.03)] group-hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]",
  },
];

function CoreSpecCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {coreCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`group relative flex flex-col items-start gap-4 p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/[0.08] transition-all duration-500 cursor-default ${card.borderAccent} ${card.glow} overflow-hidden`}
          >
            {/* Ambient Background Glow on Hover */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${card.bgAccent} pointer-events-none`} />

            <div className={`relative z-10 p-2.5 rounded-xl border border-white/[0.06] group-hover:border-white/[0.15] bg-white/[0.03] group-hover:bg-white/[0.08] transition-all duration-500`}>
              <Icon className={`w-5 h-5 ${card.iconColor} filter drop-shadow-[0_0_8px_currentColor]`} aria-hidden="true" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-white leading-tight">{card.label}</p>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ─── Specialization Bento (Vibrant) ────────────────── */
const specializations = [
  "Technical Leadership & Innovation",
  "Automation Architect",
  "End-to-End Product QA Ownership",
  "Firmware Test & Release Management",
  "Strategic Planning & Execution",
  "AI/ML Validation",
  "Cross-Functional Leadership",
  "Stakeholder Management",
  "Mentorship & Team Building",
];

function SpecializationBento() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-violet-950/40 border border-blue-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.08)]"
    >
      <div className="flex items-center gap-2 shrink-0">
        <LayoutGrid className="w-4 h-4 text-blue-400" aria-hidden="true" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
          Core Focus
        </span>
      </div>

      <div className="h-px w-full sm:h-5 sm:w-px bg-blue-500/30" aria-hidden="true" />

      <div className="flex flex-wrap gap-2">
        {specializations.map((s) => (
          <span
            key={s}
            className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-blue-500/15 border border-blue-500/30 text-blue-100 hover:text-white hover:bg-blue-500/30 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.15)] cursor-default"
          >
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Company Logos ─────────────────────────────────── */
const logos = [
  { name: "Amazon", path: "/logos/amazon.png", w: 80, h: 28, invert: false, brightness: "" },
  { name: "Google", path: "/logos/google.png", w: 72, h: 28, invert: false, brightness: "" },
  { name: "Samsara", path: "/logos/samsara.png", w: 88, h: 28, invert: true, brightness: "brightness-[1.8]" },
  { name: "Cruise", path: "/logos/cruise.png", w: 72, h: 28, invert: false, brightness: "" },
  { name: "Rivian", path: "/logos/rivian.png", w: 72, h: 28, invert: false, brightness: "" },
  { name: "Motorola", path: "/logos/motorola.png", w: 88, h: 28, invert: true, brightness: "brightness-[2.0]" },
];

/* ─── Main Component ────────────────────────────────── */
export function HeroPortfolio() {
  return (
    <section
      className="relative min-h-[95vh] flex flex-col justify-center items-start px-6 lg:px-24 py-20 overflow-hidden"
      aria-label="Hero introduction"
    >
      <div className="hidden lg:block">
        <HeroBackground />
      </div>

      <div className="w-full max-w-5xl z-10 space-y-12">

        {/* ── Top Header ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-1.5">
            <div className="h-px w-6 bg-violet-500/60" aria-hidden="true" />
          </div>
          <span className="text-violet-300 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em]">
            Lead Embedded Firmware &amp; <br className="sm:hidden" /> Systems QA Engineer
          </span>
        </motion.div>

        {/* ── Headline & Narrative ── */}
        <div className="space-y-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white leading-[1.05] tracking-tight"
          >
            Architecting <br className="sm:hidden" /> <span className="text-shimmer">Quality</span> &amp; <br />
            Automating <br className="sm:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400">Complexity.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg sm:text-xl text-zinc-300 font-light leading-relaxed max-w-3xl">
              Building specialized test architectures and firmware validation frameworks for
              <Highlight>global industry leaders</Highlight>.
              Currently focusing on hardware-in-the-loop and automation systems.
            </p>
          </motion.div>
        </div>

        {/* ── Capabilities Sub-grid ── */}
        <div className="space-y-6">
          <CoreSpecCards />
          <SpecializationBento />
        </div>

        {/* ── CTA Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap gap-4 items-center pt-4"
        >
          <Link
            href="/experience"
            className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-white text-zinc-900 font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95"
          >
            Full Career Roadmap
            <Terminal className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>

          <Link
            href="/projects"
            className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-zinc-900/50 backdrop-blur-md border border-white/10 text-white font-bold hover:bg-zinc-800 transition-all hover:border-white/20"
          >
            View Featured Work
            <MoveRight className=" w-4 h-4 text-zinc-400" aria-hidden="true" />
          </Link>

          <a
            href="https://linkedin.com/in/bilalahamad"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors ml-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            bilalahamad
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* ── Trusted-by logos ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-10 mt-8 border-t border-white/[0.05]"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 relative inline-block">
            Engineering experience at
            <span className="absolute -bottom-2 left-0 w-8 h-px bg-violet-500/50" />
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
            {logos.map((logo) => (
              <Image
                key={logo.name}
                src={logo.path}
                alt={logo.name}
                width={logo.w}
                height={logo.h}
                className={`h-7 w-auto object-contain transition-all duration-500 grayscale hover:grayscale-0 ${logo.invert
                  ? `opacity-50 invert ${logo.brightness} hover:opacity-100 hover:scale-105`
                  : "opacity-40 hover:opacity-100 hover:scale-105"
                  }`}
                loading="lazy"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
