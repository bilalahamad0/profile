"use client";

import { motion } from "framer-motion";
import {
  MoveRight, Car, Cpu, Shield, Zap, Terminal,
  ChevronRight, LayoutGrid
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ─── Minimalist Background ─────────────────────────── */
function HeroBackground() {
  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-zinc-500/5 blur-[100px]" />

      <svg
        className="absolute inset-0 w-full h-full opacity-[0.02]"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="heroGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" />
      </svg>
    </div>
  );
}

/* ─── Sophisticated Highlighter ─────────────────────── */
function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 mx-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-100 font-medium">
      {children}
    </span>
  );
}

/* ─── Core Specialization Cards ─────────────────────── */
const coreCards = [
  {
    icon: Cpu,
    label: "18+ Years",
    sub: "Industry Experience",
  },
  {
    icon: Zap,
    label: "IoT & Firmware",
    sub: "Systems Validation",
  },
  {
    icon: Car,
    label: "Automotive",
    sub: "Infotainment & EV/AV",
  },
  {
    icon: Shield,
    label: "Safety Critical",
    sub: "High Integrity Data",
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
            className="group flex flex-col items-start gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-white/[0.05] hover:bg-zinc-800/50 hover:border-white/[0.1] transition-all duration-300 cursor-default"
          >
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] group-hover:bg-white/[0.08] transition-colors">
              <Icon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100 transition-colors" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-100 leading-tight">{card.label}</p>
              <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

/* ─── Specialization Bento (Simplified) ─────────────── */
const specializations = [
  "Lead QA / SDET",
  "Automation Architect",
  "AI/ML Validation",
  "Mobile OS Handsets",
  "Test Strategy & Lab Setup"
];

function SpecializationBento() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-zinc-900/20 border border-white/[0.03]"
    >
      <div className="flex items-center gap-2 shrink-0">
        <LayoutGrid className="w-4 h-4 text-zinc-500" aria-hidden="true" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          Core Focus
        </span>
      </div>
      
      <div className="h-px w-full sm:h-4 sm:w-px bg-white/[0.05]" aria-hidden="true" />
      
      <div className="flex flex-wrap gap-2">
        {specializations.map((s) => (
          <span
            key={s}
            className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-white/[0.02] border border-white/[0.05] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] transition-colors cursor-default"
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
          <div className="h-px w-6 bg-zinc-600" aria-hidden="true" />
          <span className="text-zinc-400 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em]">
            Lead QA &amp; Systems Engineer · San Francisco Bay Area
          </span>
        </motion.div>

        {/* ── Headline & Narrative ── */}
        <div className="space-y-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white leading-[1.05] tracking-tight"
          >
            Architecting <span className="text-zinc-500">Quality.</span><br />
            Automating <span className="text-zinc-500">Complexity.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg sm:text-xl text-zinc-400 font-light leading-relaxed max-w-3xl">
              Building specialized test architectures and firmware validation frameworks for
              <Highlight>global industry leaders</Highlight>.
              Currently focusing on hardware-in-the-loop and <Highlight>mission-critical</Highlight> automation systems.
            </p>
          </motion.div>
        </div>

        {/* ── Capabilities Sub-grid ── */}
        <div className="space-y-4">
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
            href="#featured-projects"
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white text-zinc-900 font-bold hover:bg-zinc-200 transition-colors"
          >
            View Featured Work
            <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>

          <Link
            href="/experience"
            className="group flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900 border border-white/10 text-white font-bold hover:bg-zinc-800 transition-colors"
          >
            Full Career Roadmap
            <Terminal className="w-4 h-4 text-zinc-400" aria-hidden="true" />
          </Link>

          <a
            href="https://linkedin.com/in/bilalahamad"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-300 transition-colors ml-2"
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6">
            Engineering experience at
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
            {logos.map((logo) => (
              <Image
                key={logo.name}
                src={logo.path}
                alt={logo.name}
                width={logo.w}
                height={logo.h}
                className={`h-7 w-auto object-contain transition-all duration-300 grayscale hover:grayscale-0 ${logo.invert
                    ? `opacity-50 invert ${logo.brightness} hover:opacity-100`
                    : "opacity-40 hover:opacity-100"
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
