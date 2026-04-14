"use client";

import { motion } from "framer-motion";
import {
  MoveRight, Car, Cpu, Shield, Zap, Terminal,
  GitBranch, Layers, Network, ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ─── Animated Background ───────────────────────────── */
function HeroBackground() {
  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Deep mesh gradients */}
      <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] rounded-[100%] bg-violet-600/6 blur-[180px]" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-[100%] bg-blue-600/7 blur-[150px]" />
      <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-[100%] bg-cyan-600/5 blur-[120px]" />

      {/* Fine grid */}
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

      {/* Floating domain icons — desktop decorative */}
      <div className="absolute inset-0 opacity-[0.12] hidden lg:block">
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 12, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[8%] left-[4%] text-violet-400/50"
        >
          <Shield size={72} aria-hidden="true" />
          <span className="block text-[9px] mt-2 font-mono opacity-60 uppercase tracking-[0.2em] text-violet-300/50">Safety Critical</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 22, 0], x: [0, -14, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[18%] left-[6%] text-cyan-400/40"
        >
          <Cpu size={64} aria-hidden="true" />
          <span className="block text-[9px] mt-1 font-mono opacity-60 uppercase tracking-[0.2em] text-cyan-300/50">Firmware</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -28, 0], x: [0, 16, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[12%] right-[4%] text-amber-400/40"
        >
          <Car size={72} aria-hidden="true" />
          <span className="block text-[9px] mt-2 font-mono opacity-60 uppercase tracking-[0.2em] text-amber-300/50">Automotive</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -20, 0], x: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[20%] right-[5%] text-emerald-400/35"
        >
          <Network size={64} aria-hidden="true" />
          <span className="block text-[9px] mt-1 font-mono opacity-60 uppercase tracking-[0.2em] text-emerald-300/50">IoT</span>
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-[45%] left-[1%] text-zinc-500/15"
        >
          <GitBranch size={88} aria-hidden="true" />
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Highlighter Effect ────────────────────────────── */
function Highlight({ children, color = "violet" }: { children: React.ReactNode; color?: "violet" | "cyan" | "amber" | "emerald" | "blue" }) {
  const colorMap = {
    violet: "bg-violet-500/15 text-violet-200 border-b border-violet-500/40",
    cyan: "bg-cyan-500/12 text-cyan-200 border-b border-cyan-500/35",
    amber: "bg-amber-500/12 text-amber-200 border-b border-amber-500/35",
    emerald: "bg-emerald-500/12 text-emerald-200 border-b border-emerald-500/35",
    blue: "bg-blue-500/12 text-blue-200 border-b border-blue-500/35",
  };
  return (
    <span className={`inline px-1.5 py-0.5 rounded-sm ${colorMap[color]} font-semibold`}>
      {children}
    </span>
  );
}

/* ─── Specialization Pills Bento ────────────────────── */
const specializations = [
  { label: "Lead QA / SDET", color: "violet" },
  { label: "Firmware Validation", color: "cyan" },
  { label: "Automation Architect", color: "amber" },
  { label: "IoT Systems", color: "emerald" },
  { label: "Automotive / EV / AV", color: "blue" },
  { label: "Safety Critical", color: "violet" },
  { label: "AI/ML QA", color: "cyan" },
  { label: "Mobile Handsets", color: "amber" },
];

const pillColors: Record<string, string> = {
  violet: "bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400/50",
  cyan: "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50",
  amber: "bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/50",
  emerald: "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/50",
  blue: "bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50",
};

function SpecializationBento() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="relative rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-950/60 to-black/60 border border-violet-500/15 p-5 overflow-hidden"
    >
      {/* Subtle glow */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-violet-600/12 rounded-full blur-[60px] pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-violet-400" aria-hidden="true" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-violet-300">Specialization</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {specializations.map((s) => (
            <span
              key={s.label}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-200 cursor-default ${pillColors[s.color]}`}
            >
              {s.label}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
          System Integrity // Quality Assurance // Innovation
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Core Specialization Cards ─────────────────────── */
const coreCards = [
  {
    icon: Cpu,
    label: "18+",
    sub: "Years Industry Experience",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-950/80 border-cyan-500/30",
    glow: "bg-cyan-500/10",
    border: "border-cyan-500/15 hover:border-cyan-500/35",
  },
  {
    icon: Zap,
    label: "IoT &\nFirmware",
    sub: "Specialization",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-950/80 border-amber-500/30",
    glow: "bg-amber-500/10",
    border: "border-amber-500/15 hover:border-amber-500/35",
  },
  {
    icon: Car,
    label: "Automotive",
    sub: "Systems Validation",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-950/80 border-violet-500/30",
    glow: "bg-violet-500/10",
    border: "border-violet-500/15 hover:border-violet-500/35",
  },
  {
    icon: Shield,
    label: "Safety\nCritical",
    sub: "High Integrity Systems",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-950/80 border-emerald-500/30",
    glow: "bg-emerald-500/10",
    border: "border-emerald-500/15 hover:border-emerald-500/35",
  },
];

function CoreSpecCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="grid grid-cols-4 gap-3"
    >
      {coreCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`relative flex flex-col items-start gap-3 p-4 rounded-2xl bg-[#0c0c10]/80 border transition-all duration-300 overflow-hidden group cursor-default ${card.border}`}
          >
            {/* Glow blob */}
            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-60 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 ${card.glow}`} />
            <div className={`relative z-10 p-2.5 rounded-xl border ${card.iconBg}`}>
              <Icon className={`w-5 h-5 ${card.iconColor}`} aria-hidden="true" />
            </div>
            <div className="relative z-10">
              <p className="text-base font-black text-white leading-tight whitespace-pre-line">{card.label}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{card.sub}</p>
            </div>
          </div>
        );
      })}
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

      <div className="w-full max-w-6xl z-10 space-y-10">

        {/* ── Tag line ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-1.5">
            <div className="h-px w-6 bg-violet-500/60" aria-hidden="true" />
            <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
          </div>
          <span className="text-violet-400 font-mono text-xs uppercase tracking-[0.25em]">
            Lead QA &amp; Systems Engineer · 18+ Years · San Francisco Bay Area
          </span>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-[clamp(2.6rem,7vw,5.5rem)] font-black text-zinc-100 leading-[1.06] tracking-tighter max-w-4xl"
        >
          Architecting{" "}
          <span className="text-shimmer">Quality</span>{" "}
          Across{" "}
          <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400">
            Hardware &amp; Systems
          </span>
          .
        </motion.h1>

        {/* ── Narrative with highlighter ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl"
        >
          <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
            For 18+ years, I&apos;ve built specialized test architectures and IoT solutions for{" "}
            <Highlight color="violet">global industry leaders</Highlight>. Currently
            focusing on high-integrity data pipelines and automated production systems.
          </p>

          <p className="text-sm md:text-base text-zinc-500 font-light leading-relaxed mt-4">
            Deep expertise across{" "}
            <Highlight color="cyan">firmware validation</Highlight>,{" "}
            <Highlight color="amber">automotive &amp; EV/AV infotainment</Highlight>,{" "}
            <Highlight color="emerald">safety-critical systems</Highlight>, and{" "}
            <Highlight color="blue">AI/ML QA</Highlight> — from proof-of-concept to mission-critical release.
          </p>
        </motion.div>

        {/* ── Core Specialization Cards ── */}
        <div className="hidden md:block">
          <CoreSpecCards />
        </div>

        {/* ── Specialization Bento ── */}
        <div className="hidden md:block">
          <SpecializationBento />
        </div>

        {/* ── CTA Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4 items-center"
        >
          {/* Primary: View Featured Work */}
          <Link
            href="#featured-projects"
            className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-zinc-100 text-black font-bold transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
          >
            View Featured Work
            <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>

          {/* Secondary: Full Career Roadmap */}
          <Link
            href="/experience"
            className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-bold transition-all hover:bg-white/10 hover:border-white/20"
          >
            Full Career Roadmap
            <Terminal className="w-5 h-5" aria-hidden="true" />
          </Link>

          {/* Tertiary: LinkedIn CTA */}
          <a
            href="https://linkedin.com/in/bilalahamad"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            bilalahamad
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* ── Mobile: compact spec pills ── */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {["Lead QA/SDET", "Firmware", "IoT", "Automotive", "Safety Critical", "AI/ML"].map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] bg-violet-500/10 border border-violet-500/25 text-violet-300">
                {s}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Trusted-by logos ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-8 border-t border-white/[0.06]"
        >
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-600 mb-6">
            Engineering experience at
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
            {logos.map((logo) => (
              <Image
                key={logo.name}
                src={logo.path}
                alt={logo.name}
                width={logo.w}
                height={logo.h}
                className={`h-7 w-auto object-contain transition-all duration-300 grayscale hover:grayscale-0 ${logo.invert
                    ? `opacity-60 invert ${logo.brightness} hover:opacity-100`
                    : "opacity-50 hover:opacity-100"
                  }`}
                loading="lazy"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Decorative large background element ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.025, scale: 1 }}
        transition={{ duration: 2.5, delay: 0.6 }}
        className="absolute right-[-8%] top-[20%] w-[520px] h-[520px] hidden xl:block pointer-events-none"
        aria-hidden="true"
      >
        <Layers className="w-full h-full text-violet-400 rotate-12" />
      </motion.div>
    </section>
  );
}
