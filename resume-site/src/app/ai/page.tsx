import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles, Github, ExternalLink, BookOpen,
  ChevronRight, Cpu, Zap, Clock, TrendingUp, ArrowRight,
  Bot, Coins, GitCommit, FileCode2
} from "lucide-react";
import { projectsData } from "@/data/portfolio";
import type { AIMetrics } from "@/app/api/ai-metrics/route";

export const metadata: Metadata = {
  title: "AI Lab",
  description: "Production systems built through AI pair programming — AI-native from architecture to deployment.",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bilalahamad.com";

async function getDynamicMetrics(): Promise<Record<string, AIMetrics>> {
  try {
    const res = await fetch(`${SITE_URL}/api/ai-metrics`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    return (await res.json()) as Record<string, AIMetrics>;
  } catch {
    return {};
  }
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

function NeuralBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-600/8 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/6 blur-[100px]" />
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-purple-500/15 animate-[ping_8s_ease-in-out_infinite]" style={{ animationDuration: '8s' }} />
    </div>
  );
}

type ProjectWithMetrics = typeof projectsData[0] & { dynamic?: AIMetrics };

function AIProjectCard({ project, index }: { project: ProjectWithMetrics; index: number }) {
  const accentColors: Record<string, { text: string; bg: string; border: string; bar: string }> = {
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-500" },
    blue:    { text: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    bar: "bg-blue-500"    },
    pink:    { text: "text-pink-400",    bg: "bg-pink-500/10",    border: "border-pink-500/20",    bar: "bg-pink-500"    },
    violet:  { text: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20",  bar: "bg-violet-500"  },
  };
  const colors = accentColors[project.accent] ?? accentColors.blue;
  const dm = project.dynamic;

  const contribution = dm?.aiContribution ?? project.aiContribution;
  const impactText = dm?.impact ?? project.impact;
  const toolsText = dm
    ? dm.agents.map(a => a.name).join(", ")
    : project.aiTools.join(", ");
  const cycleText = dm?.cycle
    ?? (project.id === "adhan" ? "4 days" : project.id === "warn" ? "2 days" : "~3 days");

  const beforeAfterFallback: Record<string, { before: string; after: string }> = {
    warn:    { before: "Manual Excel download, no monitoring",  after: "Fully automated pipeline, runs twice daily"   },
    adhan:   { before: "No automation, manual device control",  after: "Zero-touch IoT orchestration system"           },
    tmo:     { before: "Manual Python script, ran per request", after: "Event-driven E2E billing automation"           },
    profile: { before: "Static HTML/CSS resume site",           after: "AI-native Next.js portfolio with analytics"    },
  };
  const timeline = dm
    ? { before: dm.beforeAI, after: dm.afterAI }
    : beforeAfterFallback[project.id];

  const metrics = [
    { icon: Cpu,        label: "AI Tools",  value: toolsText },
    { icon: Zap,        label: "Impact",    value: impactText },
    { icon: TrendingUp, label: "AI Code %", value: `${contribution}%` },
    { icon: Clock,      label: "Cycle",     value: cycleText },
  ];

  return (
    <div
      className={`relative rounded-3xl border ${colors.border} bg-white/[0.02] overflow-hidden group transition-all duration-300 hover:bg-white/[0.04]`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-50 pointer-events-none`} />

      <div className="relative z-10 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border} mb-3`}>
              <Sparkles className={`w-3.5 h-3.5 ${colors.text}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>
                {contribution}% AI-Contributed
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

        {/* Dynamic stats row — only when sidecar data is available */}
        {dm && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className={`p-3 rounded-2xl ${colors.bg} border ${colors.border}`}>
              <Coins className={`w-4 h-4 ${colors.text} mb-1.5`} />
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tokens</span>
              <span className="block text-xs font-semibold text-zinc-300 mt-0.5">{formatTokens(dm.totalTokens)}</span>
            </div>
            <div className={`p-3 rounded-2xl ${colors.bg} border ${colors.border}`}>
              <GitCommit className={`w-4 h-4 ${colors.text} mb-1.5`} />
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Commits</span>
              <span className="block text-xs font-semibold text-zinc-300 mt-0.5">{dm.totalCommits}</span>
            </div>
            <div className={`p-3 rounded-2xl ${colors.bg} border ${colors.border}`}>
              <FileCode2 className={`w-4 h-4 ${colors.text} mb-1.5`} />
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lines of Code</span>
              <span className="block text-xs font-semibold text-zinc-300 mt-0.5">{dm.linesOfCode.toLocaleString()}</span>
            </div>
            <div className={`p-3 rounded-2xl ${colors.bg} border ${colors.border}`}>
              <Clock className={`w-4 h-4 ${colors.text} mb-1.5`} />
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Saved</span>
              <span className="block text-xs font-semibold text-zinc-300 mt-0.5">{dm.manualEstimateDays - dm.devCycleDays} days</span>
            </div>
          </div>
        )}

        {/* Agent Cards — only when sidecar data is available */}
        {dm && dm.agents.length > 0 && (
          <div className="mb-6">
            <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">AI Agents</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dm.agents.map((agent) => (
                <div key={agent.name} className={`p-4 rounded-2xl ${colors.bg} border ${colors.border}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className={`w-4 h-4 ${colors.text}`} />
                    <span className="text-sm font-bold text-white">{agent.name}</span>
                    <span className="text-[9px] text-zinc-500 ml-auto">{agent.period}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mb-1">{agent.provider}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {agent.models.map((m) => (
                      <span key={m} className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${colors.text} bg-white/5`}>
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{formatTokens(agent.tokens)} tokens</span>
                    <span>{agent.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Contribution Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">AI Contribution</span>
            <span className="text-[10px] font-black text-zinc-400">{contribution}% generated or AI-assisted</span>
          </div>
          <div className="h-2 rounded-full bg-white/5">
            <div
              className={`h-full rounded-full ${colors.bar} transition-all duration-1000`}
              style={{ width: `${contribution}%` }}
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

        {/* Last updated badge from sidecar */}
        {dm && (
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[9px] text-zinc-600">
              Dynamic data from <code className="text-zinc-500">ai-metrics.json</code>
            </span>
            <span className="text-[9px] text-zinc-600">Updated {dm.lastUpdated}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function AILabPage() {
  const dynamicMetrics = await getDynamicMetrics();
  const aiProjects = projectsData.filter((p) => p.isAI);

  const enriched: ProjectWithMetrics[] = aiProjects.map((p) => ({
    ...p,
    dynamic: dynamicMetrics[p.id] ?? undefined,
  }));

  const totalTokens = Object.values(dynamicMetrics).reduce((sum, m) => sum + m.totalTokens, 0);
  const totalCommits = Object.values(dynamicMetrics).reduce((sum, m) => sum + m.totalCommits, 0);

  const heroStats = [
    { label: "Dev Cycle Reduction", value: "75%+" },
    { label: "Production Systems",  value: String(aiProjects.length) },
    { label: "AI Tokens Processed", value: totalTokens > 0 ? `${formatTokens(totalTokens)}+` : "500k+" },
    { label: "Total Commits",       value: totalCommits > 0 ? String(totalCommits) : "400+" },
  ];

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

          {/* Hero Stats — dynamic from sidecar aggregation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            {heroStats.map(({ label, value }) => (
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
            {enriched.map((project, i) => (
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
