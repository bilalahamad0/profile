"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Globe,
  Cloud,
  Server,
  MousePointerClick,
  Database,
  Network,
  Webhook,
  FileCode,
  Send,
  GitBranch,
  Activity,
  ArrowRight,
  Type,
  Layers3,
  Gauge,
  Accessibility,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   ACCENT SYSTEM — full static class strings (Tailwind v4 JIT)
   ============================================================ */
type Accent = "blue" | "sky" | "emerald" | "violet" | "amber" | "zinc";

const ACCENT: Record<
  Accent,
  { icon: string; iconBox: string; chip: string; card: string; dot: string; ring: string }
> = {
  blue: {
    icon: "text-blue-300",
    iconBox: "bg-blue-500/10 border-blue-400/25 text-blue-300",
    chip: "bg-blue-500/10 border-blue-400/20 text-blue-100/90",
    card: "hover:border-blue-400/40 hover:shadow-[0_0_45px_-10px_rgba(59,130,246,0.5)]",
    dot: "bg-blue-400 shadow-[0_0_14px_3px_rgba(96,165,250,0.65)]",
    ring: "ring-blue-400/60 shadow-[0_0_28px_-6px_rgba(59,130,246,0.6)]",
  },
  sky: {
    icon: "text-sky-300",
    iconBox: "bg-sky-500/10 border-sky-400/25 text-sky-300",
    chip: "bg-sky-500/10 border-sky-400/20 text-sky-100/90",
    card: "hover:border-sky-400/40 hover:shadow-[0_0_45px_-10px_rgba(56,189,248,0.5)]",
    dot: "bg-sky-400 shadow-[0_0_14px_3px_rgba(56,189,248,0.65)]",
    ring: "ring-sky-400/60 shadow-[0_0_28px_-6px_rgba(56,189,248,0.6)]",
  },
  emerald: {
    icon: "text-emerald-300",
    iconBox: "bg-emerald-500/10 border-emerald-400/25 text-emerald-300",
    chip: "bg-emerald-500/10 border-emerald-400/20 text-emerald-100/90",
    card: "hover:border-emerald-400/40 hover:shadow-[0_0_45px_-10px_rgba(16,185,129,0.5)]",
    dot: "bg-emerald-400 shadow-[0_0_14px_3px_rgba(52,211,153,0.65)]",
    ring: "ring-emerald-400/60 shadow-[0_0_28px_-6px_rgba(16,185,129,0.6)]",
  },
  violet: {
    icon: "text-violet-300",
    iconBox: "bg-violet-500/10 border-violet-400/25 text-violet-300",
    chip: "bg-violet-500/10 border-violet-400/20 text-violet-100/90",
    card: "hover:border-violet-400/40 hover:shadow-[0_0_45px_-10px_rgba(139,92,246,0.5)]",
    dot: "bg-violet-400 shadow-[0_0_14px_3px_rgba(167,139,250,0.65)]",
    ring: "ring-violet-400/60 shadow-[0_0_28px_-6px_rgba(139,92,246,0.6)]",
  },
  amber: {
    icon: "text-amber-300",
    iconBox: "bg-amber-500/10 border-amber-400/25 text-amber-300",
    chip: "bg-amber-500/10 border-amber-400/20 text-amber-100/90",
    card: "hover:border-amber-400/40 hover:shadow-[0_0_45px_-10px_rgba(245,158,11,0.5)]",
    dot: "bg-amber-400 shadow-[0_0_14px_3px_rgba(251,191,36,0.65)]",
    ring: "ring-amber-400/60 shadow-[0_0_28px_-6px_rgba(245,158,11,0.6)]",
  },
  zinc: {
    icon: "text-zinc-300",
    iconBox: "bg-white/[0.04] border-white/10 text-zinc-300",
    chip: "bg-white/[0.03] border-white/10 text-zinc-300",
    card: "hover:border-white/25 hover:shadow-[0_0_45px_-12px_rgba(255,255,255,0.25)]",
    dot: "bg-zinc-200 shadow-[0_0_12px_3px_rgba(212,212,216,0.5)]",
    ring: "ring-white/40 shadow-[0_0_28px_-8px_rgba(255,255,255,0.3)]",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   SHARED PRIMITIVES
   ============================================================ */
function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  id,
  kicker,
  title,
  blurb,
}: {
  id: string;
  kicker: string;
  title: string;
  blurb: string;
}) {
  return (
    <Reveal className="mb-9 sm:mb-12">
      <p className="t-label font-semibold uppercase tracking-[0.25em] text-zinc-500">
        {kicker}
      </p>
      <h2 id={id} className="t-h2 mt-2.5 text-white">
        {title}
      </h2>
      <p className="t-body mt-3 max-w-2xl text-secondary">{blurb}</p>
    </Reveal>
  );
}

/** Cycles an active index on an interval; returns -1 when disabled. */
function useActiveStep(count: number, ms: number, enabled: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!enabled || count <= 1) return;
    const id = setInterval(() => setI((p) => (p + 1) % count), ms);
    return () => clearInterval(id);
  }, [count, ms, enabled]);
  return enabled ? i : -1;
}

/* ============================================================
   1 · LAYERED STACK — a vertical "bus" with flowing data dots
   ============================================================ */
type Layer = {
  icon: LucideIcon;
  title: string;
  sub: string;
  accent: Accent;
  items: string[];
};

const LAYERS: Layer[] = [
  {
    icon: Globe,
    title: "Client & Crawlers",
    sub: "Recruiters, browsers, ATS bots and social scrapers",
    accent: "zinc",
    items: ["Desktop & mobile", "Googlebot / ATS", "OG link previews", "RSS · sitemap"],
  },
  {
    icon: Cloud,
    title: "Vercel Edge & CDN",
    sub: "Global edge network with response caching",
    accent: "blue",
    items: ["Edge routing", "s-maxage 1h cache", "next/image optimization", "Speed Insights"],
  },
  {
    icon: Server,
    title: "Next.js 16 · App Router",
    sub: "React Server Components render HTML on the server",
    accent: "blue",
    items: [
      "Server Components",
      "Metadata API",
      "JSON-LD: Person + Breadcrumbs",
      "sitemap.xml · robots.txt",
    ],
  },
  {
    icon: MousePointerClick,
    title: "Client Islands",
    sub: "Hydrated interactivity layered over static HTML",
    accent: "sky",
    items: ["NavbarV2", "BentoGridV2 · ssr:false", "Framer Motion", "Theme + analytics"],
  },
  {
    icon: Database,
    title: "Data & Content",
    sub: "A single, typed source of truth feeds every view",
    accent: "emerald",
    items: ["portfolio.ts", "MDX blog · gray-matter", "ai-metrics.json", "9 roles · 5 projects"],
  },
  {
    icon: Network,
    title: "API Routes",
    sub: "Serverless endpoints for dynamic + form data",
    accent: "emerald",
    items: ["/api/contact", "/api/repos", "/api/badges", "/api/ai-metrics", "/api/visitors"],
  },
  {
    icon: Webhook,
    title: "External Services",
    sub: "Third-party integrations behind the API layer",
    accent: "zinc",
    items: ["SMTP · nodemailer", "GitHub API", "GA4 Data API", "Upstash KV", "LinkedIn API"],
  },
];

function StackDiagram() {
  const reduce = useReducedMotion() ?? false;
  return (
    <div className="relative overflow-hidden rounded-3xl glass-card">
      {/* spine — passes through every icon centre (px-5 + 24px) */}
      <div
        aria-hidden
        className="absolute left-11 top-6 bottom-6 w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0"
      />
      {/* flowing data dots travelling down the bus */}
      {!reduce &&
        [0, 1, 2].map((k) => (
          <motion.span
            key={k}
            aria-hidden
            className="absolute left-11 z-0 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_12px_3px_rgba(96,165,250,0.6)]"
            initial={{ top: "3%", opacity: 0 }}
            animate={{ top: ["2%", "98%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "linear", delay: k * 1.25 }}
          />
        ))}

      <ul className="relative z-10 divide-y divide-white/[0.06]">
        {LAYERS.map((l) => {
          const a = ACCENT[l.accent];
          const Icon = l.icon;
          return (
            <li key={l.title} className="flex items-start gap-4 px-5 py-4 sm:py-5">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border backdrop-blur-md",
                  a.iconBox
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="t-h3 text-white">{l.title}</h3>
                <p className="t-caption mt-0.5 text-secondary">{l.sub}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {l.items.map((it) => (
                    <span
                      key={it}
                      className={cn(
                        "rounded-md border px-2 py-1 t-caption font-medium",
                        a.chip
                      )}
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ============================================================
   2 · REQUEST LIFECYCLE — a packet travelling along the track
   ============================================================ */
type Step = { icon: LucideIcon; title: string; sub: string; accent: Accent };

const LIFECYCLE: Step[] = [
  { icon: Globe, title: "Request", sub: "GET /experience hits the edge", accent: "zinc" },
  { icon: Cloud, title: "Edge & cache", sub: "CDN serves or forwards", accent: "blue" },
  { icon: Server, title: "RSC render", sub: "HTML built on the server", accent: "blue" },
  { icon: FileCode, title: "Stream HTML", sub: "Static markup + JSON-LD", accent: "emerald" },
  { icon: MousePointerClick, title: "Hydrate", sub: "Client islands wake up", accent: "sky" },
  { icon: Activity, title: "Interactive", sub: "Animations + analytics live", accent: "violet" },
];

function FlowTrack({
  steps,
  orientation,
  className,
}: {
  steps: Step[];
  orientation: "horizontal" | "vertical";
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const horizontal = orientation === "horizontal";
  return (
    <div className={cn("relative", className)}>
      {/* rail (icons are h-14/w-14 → centre at 28px = 7) */}
      <div
        aria-hidden
        className={cn(
          "absolute from-white/0 via-white/15 to-white/0",
          horizontal
            ? "left-0 right-0 top-7 h-px bg-gradient-to-r"
            : "bottom-0 left-7 top-0 w-px bg-gradient-to-b"
        )}
      />
      {/* travelling packet */}
      {!reduce && (
        <motion.span
          aria-hidden
          className={cn(
            "absolute z-0 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_16px_4px_rgba(255,255,255,0.7)]",
            horizontal ? "top-7 -translate-x-1/2 -translate-y-1/2" : "left-7 -translate-x-1/2 -translate-y-1/2"
          )}
          initial={horizontal ? { left: "0%" } : { top: "0%" }}
          animate={horizontal ? { left: ["0%", "100%"] } : { top: ["0%", "100%"] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <ol
        className={cn(
          "relative z-10 flex",
          horizontal ? "flex-row items-start justify-between gap-3" : "flex-col gap-7"
        )}
      >
        {steps.map((s, i) => {
          const a = ACCENT[s.accent];
          const Icon = s.icon;
          return (
            <li
              key={s.title}
              className={cn(
                "flex",
                horizontal
                  ? "min-w-0 flex-1 flex-col items-center text-center"
                  : "flex-row items-start gap-4"
              )}
            >
              <div
                className={cn(
                  "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border backdrop-blur-md",
                  a.iconBox
                )}
              >
                <Icon className="h-6 w-6" aria-hidden />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#09090b] t-label font-bold text-zinc-400 ring-1 ring-white/10">
                  {i + 1}
                </span>
              </div>
              <div className={cn(horizontal ? "mt-3" : "pt-1.5")}>
                <p className="t-small font-semibold text-white">{s.title}</p>
                <p className="t-caption mt-0.5 max-w-[12rem] text-secondary">{s.sub}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ============================================================
   3 · CONTENT & DELIVERY PIPELINES — sequential illumination
   ============================================================ */
type Pipeline = {
  id: string;
  icon: LucideIcon;
  title: string;
  sub: string;
  accent: Accent;
  steps: string[];
};

const PIPELINES: Pipeline[] = [
  {
    id: "blog",
    icon: FileCode,
    title: "Blog publishing",
    sub: "MDX in, static HTML out — no client JS to read a post",
    accent: "emerald",
    steps: ["MDX file", "gray-matter parse", "Server render", "Static HTML", "ATS-indexed route"],
  },
  {
    id: "linkedin",
    icon: Send,
    title: "Blog → LinkedIn (/post)",
    sub: "One command cross-publishes to the blog and LinkedIn",
    accent: "violet",
    steps: [
      "Topic",
      "Draft + infographic",
      "MDX article",
      "npm run build",
      "LinkedIn API",
      "Backfill URL",
      "Commit + push",
    ],
  },
  {
    id: "ci",
    icon: GitBranch,
    title: "CI/CD quality gates",
    sub: "Every push is linted, tested and visually checked before deploy",
    accent: "amber",
    steps: ["git push", "Lint", "Unit + e2e", "Visual regression", "Vercel build", "Production"],
  },
];

function PipelineRow({ p }: { p: Pipeline }) {
  const reduce = useReducedMotion() ?? false;
  const active = useActiveStep(p.steps.length, 1100, !reduce);
  const a = ACCENT[p.accent];
  const Icon = p.icon;
  return (
    <Reveal className={cn("rounded-3xl glass-card p-5 transition-all duration-300 sm:p-6", a.card)}>
      <div className="mb-5 flex items-center gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
            a.iconBox
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <h3 className="t-h3 text-white">{p.title}</h3>
          <p className="t-caption mt-0.5 text-secondary">{p.sub}</p>
        </div>
      </div>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2.5">
        {p.steps.map((label, i) => (
          <li key={label} className="flex items-center gap-1.5">
            <motion.span
              className={cn(
                "inline-flex items-center rounded-lg border px-2.5 py-1.5 t-caption font-medium",
                i === active
                  ? cn(a.chip, "ring-1", a.ring)
                  : "border-white/10 bg-white/[0.03] text-zinc-400"
              )}
              animate={!reduce && i === active ? { scale: 1.06 } : { scale: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {label}
            </motion.span>
            {i < p.steps.length - 1 && (
              <ArrowRight
                className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-colors duration-300",
                  i === active ? a.icon : "text-zinc-700"
                )}
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/* ============================================================
   4 · DESIGN PRINCIPLES — entrance stagger + hover glow
   ============================================================ */
type Principle = { icon: LucideIcon; title: string; body: string; accent: Accent };

const PRINCIPLES: Principle[] = [
  {
    icon: Server,
    accent: "blue",
    title: "SSR-first for ATS",
    body: "Every job title, company and metric ships as static HTML — applicant-tracking crawlers read it without running a line of JS.",
  },
  {
    icon: Database,
    accent: "emerald",
    title: "Single source of truth",
    body: "All career data lives in one typed module, portfolio.ts. Components only read from it, so content never drifts out of sync.",
  },
  {
    icon: Type,
    accent: "sky",
    title: "Fluid type system",
    body: "Nine semantic t-* tokens built on clamp() scale text smoothly from phone to desktop — no responsive class soup.",
  },
  {
    icon: Layers3,
    accent: "violet",
    title: "Glassmorphism system",
    body: "A small set of glass utilities and design tokens keeps every surface visually consistent and on-brand.",
  },
  {
    icon: Gauge,
    accent: "amber",
    title: "Edge caching",
    body: "GitHub-backed API routes cache at the CDN for an hour via s-maxage, so repeat visits feel instant.",
  },
  {
    icon: Accessibility,
    accent: "emerald",
    title: "Accessible by default",
    body: "WCAG-AA contrast, visible focus rings, a skip-link and full prefers-reduced-motion support are baked in.",
  },
  {
    icon: ShieldCheck,
    accent: "blue",
    title: "Type-safe & linted",
    body: "TypeScript strict mode, zero any types, and a clean build + lint gate run on every single commit.",
  },
  {
    icon: Workflow,
    accent: "violet",
    title: "Automated publishing",
    body: "A /post pipeline cross-publishes to the blog and LinkedIn — draft, build, API publish and commit in one flow.",
  },
];

function PrincipleCard({ p, index }: { p: Principle; index: number }) {
  const a = ACCENT[p.accent];
  const Icon = p.icon;
  return (
    <Reveal delay={index * 0.05}>
      <div
        className={cn(
          "h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300",
          a.card
        )}
      >
        <div
          className={cn(
            "mb-4 flex h-10 w-10 items-center justify-center rounded-lg border",
            a.iconBox
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <h3 className="t-h3 text-white">{p.title}</h3>
        <p className="t-small mt-2 text-secondary">{p.body}</p>
      </div>
    </Reveal>
  );
}

/* ============================================================
   DECORATIVE — schematic blueprint grid (static, masked)
   ============================================================ */
function SchematicGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(ellipse_75%_60%_at_50%_20%,black,transparent)]"
    >
      <svg className="h-full w-full">
        <defs>
          <pattern id="arch-grid" width="46" height="46" patternUnits="userSpaceOnUse">
            <path
              d="M46 0H0V46"
              fill="none"
              className="stroke-white/[0.05]"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arch-grid)" />
      </svg>
    </div>
  );
}

/* ============================================================
   ROOT
   ============================================================ */
export function ArchitectureDiagramClient() {
  return (
    <div className="relative">
      <SchematicGrid />
      <div className="mx-auto max-w-6xl space-y-20 px-6 pb-10 sm:space-y-28 lg:px-8">
        {/* 1 · STACK */}
        <section aria-labelledby="arch-stack-h">
          <SectionHeading
            id="arch-stack-h"
            kicker="The Stack"
            title="A layered, server-first architecture"
            blurb="Requests flow down from the visitor through the edge into server-rendered React, then back up as static HTML enriched with hydrated client islands. The data dots trace that path through every layer."
          />
          <Reveal>
            <StackDiagram />
          </Reveal>
        </section>

        {/* 2 · REQUEST LIFECYCLE */}
        <section aria-labelledby="arch-flow-h">
          <SectionHeading
            id="arch-flow-h"
            kicker="Request Lifecycle"
            title="From URL to interactive"
            blurb="What happens between a click and a fully interactive page — the packet follows a single request through the rendering pipeline."
          />
          <Reveal>
            <FlowTrack steps={LIFECYCLE} orientation="vertical" className="lg:hidden" />
            <FlowTrack steps={LIFECYCLE} orientation="horizontal" className="hidden lg:block" />
          </Reveal>
        </section>

        {/* 3 · PIPELINES */}
        <section aria-labelledby="arch-pipes-h">
          <SectionHeading
            id="arch-pipes-h"
            kicker="Workflows"
            title="Automated content & delivery pipelines"
            blurb="Three pipelines keep the site fresh and trustworthy — watch each one light up stage by stage as work moves through it."
          />
          <div className="space-y-4">
            {PIPELINES.map((p) => (
              <PipelineRow key={p.id} p={p} />
            ))}
          </div>
        </section>

        {/* 4 · PRINCIPLES */}
        <section aria-labelledby="arch-principles-h">
          <SectionHeading
            id="arch-principles-h"
            kicker="System Design"
            title="The principles holding it together"
            blurb="Eight decisions that make the site fast, accessible, recruiter-ready and cheap to maintain."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <PrincipleCard key={p.title} p={p} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
