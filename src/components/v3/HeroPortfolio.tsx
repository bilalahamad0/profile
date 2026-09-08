"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Car, Cpu, Shield, Zap, Terminal,
  ChevronRight, Network, CheckSquare,
  BookOpen, ArrowDown
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

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


const coreCards = [
  {
    icon: Cpu,
    label: "Systems Leadership",
    sub: "18+ Years Across Global Programs",
    iconColor: "text-cyan-700 dark:text-cyan-400",
    spotlight: "rgba(6, 182, 212, 0.15)",
  },
  {
    icon: Zap,
    label: "Firmware & Silicon",
    sub: "Bring-Up & Low-Level Kernels",
    iconColor: "text-amber-700 dark:text-amber-400",
    spotlight: "rgba(245, 158, 11, 0.15)",
  },
  {
    icon: Car,
    label: "Autonomous & Safety",
    sub: "ASIL-D Multi-ECU Simulation",
    iconColor: "text-violet-700 dark:text-violet-400",
    spotlight: "rgba(139, 92, 246, 0.15)",
  },
  {
    icon: Shield,
    label: "Edge Intelligence",
    sub: "Fleet Telematics & AI Quality",
    iconColor: "text-emerald-700 dark:text-emerald-400",
    spotlight: "rgba(16, 185, 129, 0.15)",
  },
];

function CoreSpecCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full">
      {coreCards.map((card) => {
        const Icon = card.icon;
        return (
          <SpotlightCard
            key={card.label}
            spotlightColor={card.spotlight}
            className="p-5 sm:p-6 flex flex-col items-start gap-4 rounded-2xl border-line/10 hover:border-line/20 bg-surface-card/90 dark:bg-black/40"
          >
            <div className="p-2.5 rounded-xl border border-line/10 bg-ink/[0.04] dark:bg-ink/[0.03]">
              <Icon className={`w-5 h-5 ${card.iconColor}`} aria-hidden="true" />
            </div>
            <div>
              <p className="t-small font-bold text-ink leading-tight">{card.label}</p>
              <p className="t-caption text-ink-muted mt-1 leading-snug">{card.sub}</p>
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
  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center items-start px-6 lg:px-24 pt-24 md:pt-32 lg:pt-36 pb-16 md:pb-24 overflow-hidden"
      aria-label="Hero introduction"
    >
      <HeroBackground />

      <div className="w-full max-w-7xl z-10 space-y-10 md:space-y-12">
        {/* ── Status Pills & Architectural Positioning ── */}
        <div className="flex flex-wrap items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 t-label font-mono uppercase text-violet-700 dark:text-violet-300"
          >
            <Terminal className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Systems Validation Architect · Sunnyvale, CA</span>
            <span className="sm:hidden">Systems Validation Architect</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ink/[0.04] border border-line/10 t-label font-mono uppercase text-ink-muted"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Safety-Critical &amp; Autonomous Systems</span>
            <span className="sm:hidden">Safety-Critical Systems</span>
          </motion.div>
        </div>

        {/* ── Headline & Architectural Introduction ── */}
        <div className="space-y-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="t-display text-ink"
          >
            Architecting Systems <br />
            at the Edge of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-cyan-600 to-blue-600 dark:from-violet-400 dark:via-cyan-400 dark:to-blue-400">
              Silicon, Software &amp; Safety.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="t-lead text-body font-light max-w-3xl leading-relaxed">
              For over 18 years, I have architected the validation systems, simulation harnesses, and release foundations that allow mission-critical firmware, autonomous compute, and edge IoT devices to operate reliably in the physical world.
            </p>
          </motion.div>

          <SpecialismChips />
        </div>

        {/* ── High-Level Architectural Foundations ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full pt-2"
        >
          <CoreSpecCards />
        </motion.div>

        {/* ── Direct Executive Action Links ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-4 items-center pt-2"
        >
          <a
            href="#who-i-am"
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-ink text-surface font-semibold t-small hover:bg-ink/85 dark:hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95"
          >
            <span>Explore Philosophy &amp; Mindset</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
          </a>

          <Link
            href="/blog"
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-line/15 bg-ink/5 text-ink font-semibold t-small hover:bg-ink/10 transition-all hover:scale-105 active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Read Lab Notes</span>
          </Link>

          <Link
            href="/contact"
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-line/15 bg-ink/5 text-ink font-semibold t-small hover:bg-ink/10 transition-all hover:scale-105 active:scale-95"
          >
            <span>Get in Touch</span>
            <ChevronRight className="w-4 h-4 text-ink-muted group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>

          <Link
            href="/experience"
            className="group inline-flex items-center gap-1.5 t-small font-mono text-ink-muted hover:text-ink transition-colors ml-1"
          >
            <span>View Career Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* ── Trusted-by logos ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-8 border-t border-line/10 dark:border-line/[0.05] w-full"
        >
          <p className="t-label font-bold uppercase tracking-[0.2em] text-ink-muted mb-6 relative inline-block">
            Engineering experience across industry leaders
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
