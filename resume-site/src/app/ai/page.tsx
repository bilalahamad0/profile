// Server Component — no "use client" needed.
// Layout already provides NavbarV2 globally.

import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles, Github, ExternalLink, BookOpen,
  ChevronRight, Cpu, Zap, Clock, TrendingUp, ArrowRight
} from "lucide-react";
import { projectsData } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "AI Lab",
  description: "Production systems built through AI pair programming — AI-native from architecture to deployment.",
};

// ─── Static decorative background — CSS only, no Framer Motion ──────────────
function NeuralBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Ambient glows — CSS only, no JS */}
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-600/8 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/6 blur-[100px]" />
      {/* Pulsing rings via CSS animation — GPU-composited, no main thread */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-purple-500/15 animate-[ping_8s_ease-in-out_infinite]" style={{ animationDuration: '8s' }} />
    </div>
  );
}

// ─── Project card — pure HTML + CSS, zero Framer Motion ─────────────────────
function AIProjectCard({ project, index }: { project: typeof projectsData[0]; index: number }) {
  const accentColors: Record<string, { text: string; bg: string; border: string; bar: string }> = {
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-500" },
    blue:    { text: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    bar: "bg-blue-500"    },
    pink:    { text: "text-pink-400",    bg: "bg-pink-500/10",    border: "border-pink-500/20",    bar: "bg-pink-500"    },
    violet:  { text: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20",  bar: "bg-violet-500"  },
  };
  const colors = accentColors[project.accent] ?? accentColors.blue;

  const beforeAfter: Record<string, { before: string; after: string }> = {
    warn:    { before: "Manual Excel download, no monitoring",  after: "Fully automated pipeline, runs twice daily"   },
    adhan:   { before: "No automation, manual device control",  after: "Zero-touch IoT orchestration system"           },
    tmo:     { before: "Manual Python script, ran per request", after: "Event-driven E2E billing automation"           },
    profile: { before: "Static HTML/CSS resume site",           after: "AI-native Next.js portfolio with analytics"    },
  };
  const timeline = beforeAfter[project.id];

  const metrics = [
    { icon: Cpu,        label: "AI Tools",  value: project.aiTools.join(", ")    },
    { icon: Zap,        label: "Impact",    value: project.impact                },
    { icon: TrendingUp, label: "AI Code %", value: `${project.aiContribution}%`  },
    { icon: Clock,      label: "Cycle",     value: project.id === "adhan" ? "4 days" : project.id === "warn" ? "2 days" : "~3 days" },
  ];

  return (
    <div
      className={`relative rounded-3xl border ${colors.border} bg-white/[0.02] overflow-hidden group transition-all duration-300 hover:bg-white/[0.04]`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Glow accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-50 pointer-events-none`} />

      <div className="relative z-10 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border} mb-3`}>
              <Sparkles className={`w-3.5 h-3.5 ${colors.text}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>
                {project.aiContribution}% AI-Contributed
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{project.name}</h2>
            <p className={`text-sm mt-1 ${colors.text}`}>{project.tagline}</p>
          </div>
          <div className="flex gap-2 shrink-0 ml-4">
            <a href={project.repo} target="_blank" rel="noreferrer" aria-label={`${project.name} GitHub repository`}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <Github className="w-4 h-4" />
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" aria-label={`${project.name} live demo`}
                className={`w-9 h-9 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center hover:scale-110 transition-all`}>
                <ExternalLink className={`w-4 h-4 ${colors.text}`} />
              </a>
            )}
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {metrics.map(({ icon: Icon, label, value }) => (
            <div key={label} className={`p-3 rounded-2xl ${colors.bg} border ${colors.border}`}>
              <Icon className={`w-4 h-4 ${colors.text} mb-1.5`} />
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
              <span className="block text-xs font-semibold text-zinc-300 mt-0.5 leading-tight">{value}</span>
            </div>
          ))}
        </div>

        {/* AI Contribution Bar — CSS width, no JS animation */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">AI Contribution</span>
            <span className="text-[10px] font-black text-zinc-400">{project.aiContribution}% generated or AI-assisted</span>
          </div>
          <div className="h-2 rounded-full bg-white/5">
            <div
              className={`h-full rounded-full ${colors.bar} transition-all duration-1000`}
              style={{ width: `${project.aiContribution}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-zinc-600">0%</span>
            <span className="text-[9px] text-zinc-600">100%</span>
          </div>
        </div>

        {/* Before / After */}
        {timeline && (
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/15">
              <span className="text-[9px] font-black uppercase tracking-widest text-red-400/70 block mb-2">Before AI</span>
              <p className="text-xs text-zinc-400 leading-relaxed">{timeline.before}</p>
            </div>
            <div className={`p-4 rounded-2xl ${colors.bg} border ${colors.border}`}>
              <span className={`text-[9px] font-black uppercase tracking-widest ${colors.text} opacity-70 block mb-2`}>After AI</span>
              <p className="text-xs text-zinc-300 leading-relaxed">{timeline.after}</p>
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">{project.description}</p>

        {/* Tech + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className={`px-2.5 py-1 rounded-lg ${colors.bg} border ${colors.border} text-[10px] font-bold ${colors.text} opacity-80 uppercase tracking-widest`}>
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            {project.blogSlug && (
              <Link href={`/blog/${project.blogSlug}`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl ${colors.bg} border ${colors.border} text-xs font-bold ${colors.text} hover:scale-105 transition-all`}>
                <BookOpen className="w-3.5 h-3.5" />
                Read Story
              </Link>
            )}
            <a href={project.repo} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 hover:text-white hover:border-white/20 transition-all">
              <Github className="w-3.5 h-3.5" />
              Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AILabPage() {
  const aiProjects = projectsData.filter((p) => p.isAI);

  return (
    <main className="min-h-screen bg-[#09090b] text-white relative" id="top">
      <NeuralBackground />

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 lg:px-24 text-center" aria-labelledby="ai-heading">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400/30" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-300">AI Lab</span>
          </div>

          <h1 id="ai-heading" className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-none">
            Where{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
              AI Meets
            </span>
            <br />Engineering
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-2xl mx-auto mb-12">
            A showcase of production systems built through AI pair programming — not AI-assisted, but{" "}
            <span className="text-white font-medium">AI-native from architecture to deployment</span>.
          </p>

          {/* Hero Stats — static HTML, instant paint */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            {[
              { label: "Dev Cycle Reduction", value: "75%+" },
              { label: "Production Systems",  value: "4"    },
              { label: "AI Tokens Processed", value: "255k+" },
              { label: "Uptime Achieved",     value: "99.9%" },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <span className="block text-2xl md:text-3xl font-black text-white mb-1">{value}</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Strip */}
      <section className="py-12 px-6 border-y border-white/5 bg-purple-500/[0.03]">
        <div className="max-w-5xl mx-auto">
          <blockquote className="text-center">
            <p className="text-lg md:text-2xl font-light text-zinc-300 leading-relaxed italic max-w-4xl mx-auto">
              &ldquo;AI doesn&apos;t replace engineering judgment. It accelerates the parts that are research-heavy and
              repetitive, freeing you to focus on the judgment calls that actually matter:{" "}
              <span className="text-white font-medium not-italic">
                system design, edge case handling, and knowing when something is &apos;good enough for production.&apos;
              </span>&rdquo;
            </p>
            <cite className="block mt-6 text-sm text-zinc-500 not-italic">
              — Bilal Ahamad, from the AI-Driven Development Whitepaper
            </cite>
          </blockquote>
        </div>
      </section>

      {/* AI Projects */}
      <section className="py-20 px-6 lg:px-24 relative z-10" aria-labelledby="systems-heading">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest mb-3">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                PRODUCTION DEPLOYMENTS
              </div>
              <h2 id="systems-heading" className="text-3xl md:text-4xl font-black tracking-tighter">AI-Augmented Systems</h2>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors">
              View All Projects
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-8">
            {aiProjects.map((project, i) => (
              <AIProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center border-t border-white/5 bg-white/[0.01] relative z-10" aria-labelledby="cta-heading">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 id="cta-heading" className="text-3xl font-black tracking-tighter">
            Read the Full{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Whitepaper</span>
          </h2>
          <p className="text-zinc-400">
            A deep technical analysis on AI-native development methodology, metrics, and the framework I use to measure
            engineering velocity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/blog/ai-driven-development"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold hover:opacity-90 transition-opacity shadow-2xl shadow-purple-600/20"
            >
              <BookOpen className="w-5 h-5" />
              Read Whitepaper
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-bold hover:bg-white/10 transition-all"
            >
              Discuss AI Consulting
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
