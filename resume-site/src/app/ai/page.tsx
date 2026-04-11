"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Sparkles, Github, ExternalLink, BookOpen,
  ChevronRight, Cpu, Zap, Clock, TrendingUp, ArrowRight
} from "lucide-react";
import { NavbarV2 } from "@/components/v2/NavbarV2";
import { projectsData } from "@/data/portfolio";

// Pulsing neural-node SVG background
function NeuralBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep purple/indigo ambient glows */}
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-600/8 blur-[150px]" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/6 blur-[120px]" />
      <div className="absolute top-[40%] left-[-5%] w-[300px] h-[300px] rounded-full bg-violet-500/5 blur-[100px]" />

      {/* Animated SVG network */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Network lines */}
        {[
          [100, 150, 350, 280], [350, 280, 600, 180], [600, 180, 800, 380],
          [800, 380, 1000, 200], [1000, 200, 1200, 350], [350, 280, 550, 450],
          [550, 450, 800, 380], [100, 350, 350, 280], [600, 180, 550, 450],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(168,85,247)" strokeWidth="1" />
        ))}
        {/* Nodes */}
        {[
          [100, 150], [350, 280], [600, 180], [800, 380],
          [1000, 200], [1200, 350], [550, 450], [100, 350],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="rgb(168,85,247)" filter="url(#glow)" />
        ))}
      </svg>

      {/* Animated pulsing ring */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-purple-500/20"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-indigo-500/15"
      />
    </div>
  );
}

// Project card for AI page — more detailed than /projects version
function AIProjectCard({ project, index }: { project: typeof projectsData[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const accentColors: Record<string, { text: string; bg: string; border: string; bar: string }> = {
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "bg-emerald-500" },
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", bar: "bg-blue-500" },
    pink: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", bar: "bg-pink-500" },
    violet: { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", bar: "bg-violet-500" },
  };
  const colors = accentColors[project.accent] ?? accentColors.blue;

  const beforeAfter: Record<string, { before: string; after: string }> = {
    warn: { before: "Manual Excel download, no monitoring", after: "Fully automated pipeline, runs twice daily" },
    adhan: { before: "No automation, manual device control", after: "Zero-touch IoT orchestration system" },
    tmo: { before: "Manual Python script, ran per request", after: "Event-driven E2E billing automation" },
    profile: { before: "Static HTML/CSS resume site", after: "AI-native Next.js portfolio with analytics" },
  };
  const timeline = beforeAfter[project.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative rounded-3xl border ${colors.border} bg-white/[0.02] overflow-hidden group backdrop-blur-sm`}
    >
      {/* Glow accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-50 pointer-events-none`} />

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border} mb-4`}>
              <Sparkles className={`w-3.5 h-3.5 ${colors.text}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>
                {project.aiContribution}% AI-Contributed
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{project.name}</h2>
            <p className={`text-sm mt-1 ${colors.text}`}>{project.tagline}</p>
          </div>
          <div className="flex gap-2">
            <a href={project.repo} target="_blank" rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <Github className="w-4 h-4" />
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer"
                className={`w-10 h-10 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center hover:scale-110 transition-all`}>
                <ExternalLink className={`w-4 h-4 ${colors.text}`} />
              </a>
            )}
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Cpu, label: "AI Tools", value: project.aiTools.join(", ") },
            { icon: Zap, label: "Impact", value: project.impact },
            { icon: TrendingUp, label: "AI Code %", value: `${project.aiContribution}%` },
            { icon: Clock, label: "Cycle", value: project.id === "adhan" ? "4 days" : project.id === "warn" ? "2 days" : "~3 days" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className={`p-3 rounded-2xl ${colors.bg} border ${colors.border}`}>
              <Icon className={`w-4 h-4 ${colors.text} mb-1.5`} />
              <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
              <span className="block text-xs font-semibold text-white/80 mt-0.5 leading-tight">{value}</span>
            </div>
          ))}
        </div>

        {/* AI Contribution Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">AI Contribution</span>
            <span className="text-[10px] font-black text-white/60">{project.aiContribution}% generated or AI-assisted</span>
          </div>
          <div className="h-2 rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${project.aiContribution}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.15 + 0.4 }}
              className={`h-full rounded-full ${colors.bar} relative`}
            >
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${colors.bar} blur-[3px]`} />
            </motion.div>
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-white/20">0%</span>
            <span className="text-[9px] text-white/20">100%</span>
          </div>
        </div>

        {/* Before / After */}
        {timeline && (
          <div className="mb-8 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/15">
              <span className="text-[9px] font-black uppercase tracking-widest text-red-400/70 block mb-2">Before AI</span>
              <p className="text-xs text-white/50 leading-relaxed">{timeline.before}</p>
            </div>
            <div className={`p-4 rounded-2xl ${colors.bg} border ${colors.border}`}>
              <span className={`text-[9px] font-black uppercase tracking-widest ${colors.text} opacity-70 block mb-2`}>After AI</span>
              <p className="text-xs text-white/70 leading-relaxed">{timeline.after}</p>
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
    </motion.div>
  );
}

export default function AILabPage() {
  const aiProjects = projectsData.filter((p) => p.isAI);

  return (
    <main className="min-h-screen bg-[#09090b] text-white relative">
      <NeuralBackground />
      <NavbarV2 />

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 lg:px-24 text-center">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400/30" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-300">AI Lab</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8">
              Where{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
                AI Meets
              </span>
              <br />Engineering
            </h1>

            <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto mb-12">
              A showcase of production systems built through AI pair programming — not AI-assisted, but{" "}
              <span className="text-white font-medium">AI-native from architecture to deployment</span>.
            </p>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { label: "Dev Cycle Reduction", value: "75%+" },
                { label: "Production Systems", value: "4" },
                { label: "AI Tokens Processed", value: "255k+" },
                { label: "Uptime Achieved", value: "99.9%" },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="block text-2xl md:text-3xl font-black text-white mb-1">{value}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Strip */}
      <section className="py-12 px-6 border-y border-white/5 bg-purple-500/[0.03]">
        <div className="max-w-5xl mx-auto">
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-lg md:text-2xl font-light text-zinc-300 leading-relaxed italic max-w-4xl mx-auto">
              &ldquo;AI doesn&apos;t replace engineering judgment. It accelerates the parts that are research-heavy and repetitive,
              freeing you to focus on the judgment calls that actually matter:
              <span className="text-white font-medium not-italic"> system design, edge case handling, and knowing when something is &apos;good enough for production.&apos;</span>&rdquo;
            </p>
            <cite className="block mt-6 text-sm text-zinc-500 not-italic">— Bilal Ahamad, from the AI-Driven Development Whitepaper</cite>
          </motion.blockquote>
        </div>
      </section>

      {/* AI Projects */}
      <section className="py-24 px-6 lg:px-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest mb-3">
                <Sparkles className="w-4 h-4" />
                PRODUCTION DEPLOYMENTS
              </div>
              <h2 className="text-4xl font-black tracking-tighter">AI-Augmented Systems</h2>
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
      <section className="py-24 px-6 text-center border-t border-white/5 bg-white/[0.01] relative z-10">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-black tracking-tighter">
            Read the Full <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Whitepaper</span>
          </h2>
          <p className="text-zinc-400">
            A deep technical analysis on AI-native development methodology, metrics, and the framework I use to measure engineering velocity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/blog/ai-driven-development"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold hover:scale-105 transition-all shadow-2xl shadow-purple-600/20">
              <BookOpen className="w-5 h-5" />
              Read Whitepaper
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-bold hover:bg-white/10 transition-all">
              Discuss AI Consulting
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
