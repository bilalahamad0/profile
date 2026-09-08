"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Car, Cpu, Shield, Zap, Terminal,
  ChevronRight, Network, CheckSquare, Download,
  Sparkles, UserCheck, Wrench, Layers
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SystemsConsole } from "@/components/v3/SystemsConsole";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/utils";

type PersonaMode = "recruiter" | "architect" | "lead";

interface PersonaConfig {
  id: PersonaMode;
  label: string;
  icon: React.ElementType;
  pitch: string;
  badge: string;
}

const PERSONAS: PersonaConfig[] = [
  {
    id: "recruiter",
    label: "Hiring Executive / Recruiter",
    icon: UserCheck,
    pitch: "18+ years leading firmware quality and systems test engineering across Amazon, Google, Rivian, Cruise, and Samsara. Track record of $3.0M+ in cost reductions and zero-escape product launches.",
    badge: "Staff / Principal / Director Ready",
  },
  {
    id: "architect",
    label: "Systems Architect",
    icon: Layers,
    pitch: "Architect of hardware-in-the-loop (HIL) and software-in-the-loop (SIL) simulation benches, QEMU/Docker virtual-ECU harnesses, and automated release gates for safety-critical systems.",
    badge: "HIL / SIL & Virtual ECU",
  },
  {
    id: "lead",
    label: "Technical QA Lead",
    icon: Wrench,
    pitch: "Engineering high-throughput Pytest automation, CAN/Ethernet/UART protocol verification, optical bench image quality, and edge-to-cloud AI validation pipelines.",
    badge: "Firmware & Automation Architecture",
  },
];

/* ─── Domain specialisms ─────────────────────────── */
type Specialism = {
  label: string;
  Icon: LucideIcon;
  size: number;
  anchor: string;
  iconTone: string;
  labelTone: string;
  labelGap: string;
  drift: { y: number[]; x: number[]; rotate: number[] };
  duration: number;
  delay: number;
  chipTone: string;
};

const specialisms: Specialism[] = [
  {
    label: "Safety Critical",
    Icon: Shield,
    size: 72,
    anchor: "top-[25%] right-[5%]",
    iconTone: "text-cyan-600/30 dark:text-cyan-400/25",
    labelTone: "text-cyan-800 dark:text-cyan-300",
    labelGap: "mt-2",
    drift: { y: [0, -25, 0], x: [0, 15, 0], rotate: [0, 8, 0] },
    duration: 12,
    delay: 2,
    chipTone: "text-cyan-700 dark:text-cyan-400",
  },
  {
    label: "Firmware",
    Icon: Cpu,
    size: 64,
    anchor: "bottom-[20%] right-[3%]",
    iconTone: "text-violet-600/30 dark:text-violet-400/25",
    labelTone: "text-violet-800 dark:text-violet-300",
    labelGap: "mt-1",
    drift: { y: [0, 25, 0], x: [0, -15, 0], rotate: [0, -5, 0] },
    duration: 15,
    delay: 2,
    chipTone: "text-violet-700 dark:text-violet-400",
  },
  {
    label: "Automotive",
    Icon: Car,
    size: 72,
    anchor: "top-[8%] right-[10%]",
    iconTone: "text-amber-600/30 dark:text-amber-400/25",
    labelTone: "text-amber-800 dark:text-amber-300",
    labelGap: "mt-2",
    drift: { y: [0, -30, 0], x: [0, 20, 0], rotate: [0, -10, 0] },
    duration: 14,
    delay: 0,
    chipTone: "text-amber-700 dark:text-amber-400",
  },
  {
    label: "IoT Systems",
    Icon: Network,
    size: 64,
    anchor: "bottom-[5%] right-[22%]",
    iconTone: "text-emerald-600/30 dark:text-emerald-400/25",
    labelTone: "text-emerald-800 dark:text-emerald-300",
    labelGap: "mt-1",
    drift: { y: [0, -25, 0], x: [0, -10, 0], rotate: [0, 5, 0] },
    duration: 16,
    delay: 1,
    chipTone: "text-emerald-700 dark:text-emerald-400",
  },
  {
    label: "Quality",
    Icon: CheckSquare,
    size: 64,
    anchor: "bottom-[2%] right-[8%]",
    iconTone: "text-blue-600/30 dark:text-blue-400/25",
    labelTone: "text-blue-800 dark:text-blue-300",
    labelGap: "mt-2",
    drift: { y: [0, -20, 0], x: [0, 10, 0], rotate: [0, -12, 0] },
    duration: 13,
    delay: 1,
    chipTone: "text-blue-700 dark:text-blue-400",
  },
];

const AT_REST = { y: 0, x: 0, rotate: 0 };
const NO_MOTION = { duration: 0 };

function HeroBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] rounded-[100%] bg-violet-600/15 blur-[180px] opacity-40 dark:opacity-100" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-[100%] bg-blue-600/15 blur-[150px] opacity-40 dark:opacity-100" />
      <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-[100%] bg-cyan-600/10 blur-[120px] opacity-50 dark:opacity-100" />

      {/* Tactical grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
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

      {/* Floating domain icons in background */}
      <div className="absolute inset-0 hidden xl:block opacity-60 pointer-events-none">
        {specialisms.map((s) => (
          <motion.div
            key={s.label}
            animate={shouldReduceMotion ? AT_REST : s.drift}
            transition={
              shouldReduceMotion
                ? NO_MOTION
                : { duration: s.duration, repeat: Infinity, ease: "easeInOut", delay: s.delay }
            }
            className={`absolute ${s.anchor} ${s.iconTone}`}
          >
            <s.Icon size={s.size} aria-hidden="true" />
            <span className={`block t-label ${s.labelGap} font-mono opacity-80 uppercase tracking-[0.2em] ${s.labelTone}`}>
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SpecialismChips() {
  return (
    <ul aria-label="Core specialisms" className="flex flex-wrap gap-2 xl:sr-only">
      {specialisms.map((s) => (
        <li
          key={s.label}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-card/80 dark:bg-black/60 backdrop-blur-xl border border-line/12 dark:border-line/[0.08]"
        >
          <s.Icon className={`w-3.5 h-3.5 ${s.chipTone}`} aria-hidden="true" />
          <span className="t-label font-mono uppercase text-ink-muted">{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Highlight({ children, color = "violet" }: { children: React.ReactNode; color?: "violet" | "cyan" }) {
  const colorMap = {
    violet: "bg-violet-500/15 border border-violet-500/40 text-violet-800 dark:text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.2)]",
    cyan: "bg-cyan-500/15 border border-cyan-500/40 text-cyan-800 dark:text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.2)]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 mx-0.5 rounded-md ${colorMap[color]} font-semibold tracking-wide backdrop-blur-sm`}>
      {children}
    </span>
  );
}

const coreCards = [
  {
    icon: Cpu,
    label: "18+ Years",
    sub: "Systems & QA Leadership",
    iconColor: "text-cyan-700 dark:text-cyan-400",
    spotlight: "rgba(6, 182, 212, 0.15)",
  },
  {
    icon: Zap,
    label: "IoT & Firmware",
    sub: "Embedded Systems Validation",
    iconColor: "text-amber-700 dark:text-amber-400",
    spotlight: "rgba(245, 158, 11, 0.15)",
  },
  {
    icon: Car,
    label: "Automotive & AV",
    sub: "ASIL-D & Multi-ECU HIL",
    iconColor: "text-violet-700 dark:text-violet-400",
    spotlight: "rgba(139, 92, 246, 0.15)",
  },
  {
    icon: Shield,
    label: "Safety Critical",
    sub: "Zero Fail-Open Tolerances",
    iconColor: "text-emerald-700 dark:text-emerald-400",
    spotlight: "rgba(16, 185, 129, 0.15)",
  },
];

function CoreSpecCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      {coreCards.map((card) => {
        const Icon = card.icon;
        return (
          <SpotlightCard
            key={card.label}
            spotlightColor={card.spotlight}
            className="p-4 sm:p-5 flex flex-col items-start gap-3.5 border-line/10 hover:border-line/20"
          >
            <div className="p-2.5 rounded-xl border border-line/10 bg-ink/[0.04] dark:bg-ink/[0.03]">
              <Icon className={`w-5 h-5 ${card.iconColor}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink leading-tight">{card.label}</p>
              <p className="t-label text-ink-muted mt-1 leading-snug">{card.sub}</p>
            </div>
          </SpotlightCard>
        );
      })}
    </div>
  );
}

const logos = [
  { name: "Amazon", path: "/logos/amazon.png", w: 80, h: 28, invert: false, brightness: "" },
  { name: "Google", path: "/logos/google.png", w: 72, h: 28, invert: false, brightness: "" },
  { name: "Samsara", path: "/logos/samsara.png", w: 88, h: 28, invert: true, brightness: "dark:brightness-[1.8]" },
  { name: "Cruise", path: "/logos/cruise.png", w: 72, h: 28, invert: false, brightness: "" },
  { name: "Rivian", path: "/logos/rivian.png", w: 72, h: 28, invert: false, brightness: "" },
  { name: "Motorola", path: "/logos/motorola.png", w: 88, h: 28, invert: true, brightness: "dark:brightness-[2.0]" },
];

export function HeroPortfolio() {
  const [persona, setPersona] = useState<PersonaMode>("recruiter");
  const activePersona = PERSONAS.find((p) => p.id === persona) ?? PERSONAS[0];

  return (
    <section
      className="relative min-h-[95vh] flex flex-col justify-center items-start px-6 lg:px-24 pt-28 pb-16 md:py-24 overflow-hidden"
      aria-label="Hero introduction"
    >
      <HeroBackground />

      <div className="w-full max-w-7xl z-10 space-y-12">
        {/* ── Status Pills & Availability ── */}
        <div className="flex flex-wrap items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 t-label font-mono uppercase text-emerald-800 dark:text-emerald-300"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span>Available for Staff &amp; Principal Roles</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 t-label font-mono uppercase text-violet-700 dark:text-violet-300"
          >
            <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Systems Validation Architect · Sunnyvale, CA</span>
          </motion.div>
        </div>

        {/* ── Headline & Narrative ── */}
        <div className="space-y-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="t-display text-ink"
          >
            Architecting <br className="sm:hidden" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-600 via-zinc-900 via-40% to-zinc-600 dark:from-white/40 dark:via-white/80 dark:to-white/40 bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]">
              Quality
            </span>{" "}
            &amp; <br />
            Automating <br className="sm:hidden" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-cyan-700 to-blue-600 dark:from-violet-400 dark:via-cyan-400 dark:to-blue-400">
              Complexity.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="t-lead text-body font-light max-w-3xl leading-relaxed">
              Building specialized test architectures and firmware validation frameworks for{" "}
              <Highlight>global industry leaders</Highlight>.
              18+ years validating autonomous vehicles, IoT telematics, and edge AI systems.
            </p>
          </motion.div>

          {/* ── Persona Perspective Switcher ── */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-2 t-label font-mono uppercase text-ink-muted">
              <span>View Profile As:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PERSONAS.map((p) => {
                const Icon = p.icon;
                const isSelected = p.id === persona;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPersona(p.id)}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer",
                      isSelected
                        ? "bg-ink text-surface border-ink shadow-sm"
                        : "bg-ink/5 border-line/10 text-ink-muted hover:text-ink hover:bg-ink/10"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Persona Callout Pitch */}
            <div className="p-4 rounded-xl bg-ink/[0.03] border border-line/10 max-w-3xl">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" aria-hidden="true" />
                <span className="t-label font-mono uppercase text-violet-700 dark:text-violet-400 font-bold">
                  {activePersona.badge}
                </span>
              </div>
              <p className="t-body text-ink-muted">{activePersona.pitch}</p>
            </div>
          </div>

          <SpecialismChips />
        </div>

        {/* ── Interactive Systems Validation Workbench Simulator ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="pt-2"
        >
          <SystemsConsole />
        </motion.div>

        {/* ── Capabilities Sub-grid ── */}
        <div className="space-y-6 pt-2">
          <CoreSpecCards />
        </div>

        {/* ── CTA Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 items-center pt-4"
        >
          <Link
            href="/experience"
            className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-ink text-surface font-bold hover:bg-ink/85 dark:hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95"
          >
            Full Career Roadmap
            <Terminal className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>

          <a
            href="/Bilal_Ahamad_Resume.pdf"
            download
            className="group flex items-center gap-3 px-8 py-3.5 rounded-full border border-line/15 bg-ink/5 text-ink font-bold hover:bg-ink/10 transition-all hover:scale-105 active:scale-95"
          >
            Download Resume
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
          </a>

          <a
            href="https://linkedin.com/in/bilalahamad"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink transition-colors ml-2"
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
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-10 mt-8 border-t border-line/10 dark:border-line/[0.05]"
        >
          <p className="t-label font-bold uppercase tracking-[0.2em] text-ink-muted mb-6 relative inline-block">
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
                className={`h-7 w-auto object-contain transition-all duration-500 grayscale hover:grayscale-0 ${
                  logo.invert
                    ? `opacity-50 dark:invert ${logo.brightness} hover:opacity-100 hover:scale-105`
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
