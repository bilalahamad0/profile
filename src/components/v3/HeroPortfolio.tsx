"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Car, Cpu, Shield, Zap, Terminal,
  ChevronRight, Network, GitBranch, CheckSquare, Download
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ─── Domain specialisms — ONE source, TWO renderings ────────────────────────
   These five domains are the only enumeration of Bilal's specialisms on the
   home page, so they must never live only inside decoration. They render as:
     1. the floating illustrated icons (lg and up) — signature, decorative,
        aria-hidden, and now motion-preference aware;
     2. <SpecialismChips /> — a real list in the document flow, visible below
        lg and announced to assistive tech at every width.
   Both read this array, so the two renderings can never drift apart. ───────── */
type Specialism = {
  label: string;
  Icon: LucideIcon;
  /* Float layer (decorative, lg+) */
  size: number;
  anchor: string;
  iconTone: string;
  labelTone: string;
  labelGap: string;
  drift: { y: number[]; x: number[]; rotate: number[] };
  duration: number;
  delay: number;
  /* Chip row (in-flow) — 700/400 pairs, the weights that clear AA on both grounds */
  chipTone: string;
};

const specialisms: Specialism[] = [
  {
    label: "Safety Critical",
    Icon: Shield,
    size: 72,
    anchor: "top-[28%] right-[32%]",
    iconTone: "text-cyan-600/40 dark:text-cyan-400/40",
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
    anchor: "bottom-[38%] right-[20%]",
    iconTone: "text-violet-600/40 dark:text-violet-400/40",
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
    anchor: "top-[18%] right-[16%]",
    iconTone: "text-amber-600/40 dark:text-amber-400/40",
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
    anchor: "bottom-[11%] right-[36%]",
    iconTone: "text-emerald-600/40 dark:text-emerald-400/40",
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
    anchor: "bottom-[10%] right-[14%]",
    iconTone: "text-blue-600/40 dark:text-blue-400/40",
    labelTone: "text-blue-800 dark:text-blue-300",
    labelGap: "mt-2",
    drift: { y: [0, -20, 0], x: [0, 10, 0], rotate: [0, -12, 0] },
    duration: 13,
    delay: 1,
    chipTone: "text-blue-700 dark:text-blue-400",
  },
];

/* The resting frame each float snaps to under prefers-reduced-motion. These are
   the identity transform values, i.e. exactly what the server already renders,
   so the reduced branch is a no-op on the markup — no hydration drift. */
const AT_REST = { y: 0, x: 0, rotate: 0 };
const AT_REST_PULSE = { scale: 1, opacity: 0.5 };
const NO_MOTION = { duration: 0 };

/* ─── Animated & Breathing Background ───────────────── */
function HeroBackground() {
  /* framer-motion drives these loops from JavaScript, so the
     `@media (prefers-reduced-motion: reduce)` block in globals.css — which only
     zeroes CSS animations — can never reach them. Read the preference here and
     render the resting frame instead of the loop. Belt-and-braces with the
     <MotionConfig reducedMotion="user"> in app/layout.tsx: MotionConfig alone
     freezes transforms but keeps opacity animating, which would leave the
     GitBranch mark pulsing forever. */
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Deep mesh gradients that breathe life into the dark mode.
          Damped in light mode so the pale ground stays clean, full strength in dark. */}
      <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] rounded-[100%] bg-violet-600/15 blur-[180px] opacity-40 dark:opacity-100" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-[100%] bg-blue-600/15 blur-[150px] opacity-40 dark:opacity-100" />
      <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-[100%] bg-cyan-600/10 blur-[120px] opacity-50 dark:opacity-100" />

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

      {/* Floating domain icons — desktop decorative with breathing animation.
          Kept aria-hidden on purpose: <SpecialismChips /> carries the same five
          labels into the accessibility tree, so announcing them here too would
          read them twice. */}
      <div className="absolute inset-0 hidden lg:block opacity-100">
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

        <motion.div
          animate={shouldReduceMotion ? AT_REST_PULSE : { scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={
            shouldReduceMotion
              ? NO_MOTION
              : { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
          }
          className="absolute top-[40%] left-[1.5%] text-ink-muted/30"
        >
          <GitBranch size={88} aria-hidden="true" />
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Specialism chips — the evidence twin of the floating icons ─────────────
   The float layer is desktop-only decoration, so on its own it hides the five
   domains from every phone/tablet visitor and from every screen reader. This
   list is real content in the document flow: visible below `lg` (where the
   floats are display:none) and `lg:sr-only` at desktop (where the floats say it
   visually) — so exactly one of the two is on screen at any width, while the
   accessibility tree and the static HTML always carry the five labels. ─────── */
function SpecialismChips() {
  return (
    <ul
      aria-label="Core specialisms"
      className="flex flex-wrap gap-2 lg:sr-only"
    >
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

/* ─── Premium Highlighter ───────────────────────────── */
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

/* ─── Vibrant Core Specialization Cards ─────────────── */
const coreCards = [
  {
    icon: Cpu,
    label: "18+ Years",
    sub: "Industry Experience",
    iconColor: "text-cyan-700 dark:text-cyan-400",
    bgAccent: "bg-cyan-500/20",
    borderAccent: "group-hover:border-cyan-500/50",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.03)] group-hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]",
  },
  {
    icon: Zap,
    label: "IoT & Firmware",
    sub: "Systems Validation",
    iconColor: "text-amber-700 dark:text-amber-400",
    bgAccent: "bg-amber-500/20",
    borderAccent: "group-hover:border-amber-500/50",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.03)] group-hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]",
  },
  {
    icon: Car,
    label: "Automotive",
    sub: "Infotainment & EV/AV",
    iconColor: "text-violet-700 dark:text-violet-400",
    bgAccent: "bg-violet-500/20",
    borderAccent: "group-hover:border-violet-500/50",
    glow: "shadow-[0_0_20px_rgba(139,92,246,0.03)] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]",
  },
  {
    icon: Shield,
    label: "Safety Critical",
    sub: "High Integrity Data",
    iconColor: "text-emerald-700 dark:text-emerald-400",
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
            className={`group relative flex flex-col items-start gap-4 p-5 rounded-2xl bg-surface-card/80 dark:bg-black/60 backdrop-blur-xl border border-line/12 dark:border-line/[0.08] transition-all duration-500 cursor-default ${card.borderAccent} ${card.glow} overflow-hidden`}
          >
            {/* Ambient Background Glow on Hover */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${card.bgAccent} pointer-events-none`} />

            <div className={`relative z-10 p-2.5 rounded-xl border border-line/10 dark:border-line/[0.06] group-hover:border-line/15 bg-ink/[0.05] dark:bg-ink/[0.03] group-hover:bg-ink/[0.08] transition-all duration-500`}>
              <Icon className={`w-5 h-5 ${card.iconColor} filter drop-shadow-[0_0_8px_currentColor]`} aria-hidden="true" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-ink leading-tight">{card.label}</p>
              <p className="t-label text-ink-muted mt-1 leading-snug">{card.sub}</p>
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
  // `invert` marks the logos that are solid black artwork: they need inverting to be
  // legible on the dark ground, but must show their original form on the light one.
  { name: "Samsara", path: "/logos/samsara.png", w: 88, h: 28, invert: true, brightness: "dark:brightness-[1.8]" },
  { name: "Cruise", path: "/logos/cruise.png", w: 72, h: 28, invert: false, brightness: "" },
  { name: "Rivian", path: "/logos/rivian.png", w: 72, h: 28, invert: false, brightness: "" },
  { name: "Motorola", path: "/logos/motorola.png", w: 88, h: 28, invert: true, brightness: "dark:brightness-[2.0]" },
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20"
        >
          <Terminal className="w-4 h-4 text-violet-700 dark:text-violet-400" aria-hidden="true" />
          <span className="text-violet-700 dark:text-violet-300 t-label font-black uppercase tracking-[0.2em]">
            <span className="hidden sm:inline">Lead Embedded Firmware &amp; Systems QA Engineer</span>
            <span className="sm:hidden">
              Lead Embedded Firmware<br />
              &amp; Systems QA Engineer
            </span>
          </span>
        </motion.div>

        {/* ── Headline & Narrative ── */}
        <div className="space-y-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="t-display text-ink"
          >
            {/* The .text-shimmer utility is a hardcoded white gradient (invisible on the
                light ground) and, living in @layer utilities, cannot take a `dark:` variant —
                so the same animation is expressed inline with a theme-aware stop set.
                The dark stops reproduce .text-shimmer exactly (90deg, 40%/80%/40% white, via 40%). */}
            Architecting <br className="sm:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-600 via-zinc-900 via-40% to-zinc-600 dark:from-white/40 dark:via-white/80 dark:to-white/40 bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]">Quality</span> &amp; <br />
            Automating <br className="sm:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-cyan-700 to-blue-600 dark:from-violet-400 dark:via-cyan-400 dark:to-blue-400">Complexity.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="t-lead text-body font-light max-w-3xl">
              Building specialized test architectures and firmware validation frameworks for
              <Highlight>global industry leaders</Highlight>.
              Currently focusing on hardware-in-the-loop and automation systems.
            </p>
          </motion.div>

          {/* Last child of the space-y-6 stack: below `lg` it picks up the
              stack's 24px rhythm under the lead paragraph; at `lg` sr-only
              takes it out of flow entirely, so the desktop composition is
              byte-for-byte what it was. */}
          <SpecialismChips />
        </div>

        {/* ── Capabilities Sub-grid ── */}
        <div className="space-y-6">
          <CoreSpecCards />
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
            rel="noreferrer"
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
          transition={{ duration: 0.8, delay: 0.6 }}
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
                className={`h-7 w-auto object-contain transition-all duration-500 grayscale hover:grayscale-0 ${logo.invert
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
