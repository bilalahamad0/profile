"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, Github, ExternalLink, Sparkles, Star, GitFork,
  Filter, Monitor, Smartphone, Database, Globe, ArrowRight, BookOpen,
  Zap
} from "lucide-react";
import { NavbarV2 } from "@/components/v2/NavbarV2";
import { projectsData, type ProjectCategory } from "@/data/portfolio";

const CATEGORIES: ProjectCategory[] = ["All", "IoT & Automation", "Data & Analytics", "AI-Powered", "Web & DevOps"];

type RepoData = { stars: number; forks: number };

function AIContributionBar({ pct, color }: { pct: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 400);
    return () => clearTimeout(timer);
  }, [pct]);

  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    pink: "bg-pink-500",
    violet: "bg-violet-500",
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">AI Contribution</span>
        <span className="text-[10px] font-black text-white/60">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorMap[color] ?? "bg-blue-500"}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [active, setActive] = useState<ProjectCategory>("All");
  const [repos, setRepos] = useState<Record<string, RepoData>>({});

  useEffect(() => {
    const targets = ["warn", "adhan-api", "tmo", "profile"];
    Promise.all(
      targets.map((r) =>
        fetch(`https://api.github.com/repos/bilalahamad0/${r}`)
          .then((res) => res.json())
          .catch(() => null)
      )
    ).then((results) => {
      const map: Record<string, RepoData> = {};
      targets.forEach((name, i) => {
        if (results[i]?.id) {
          map[name] = { stars: results[i].stargazers_count, forks: results[i].forks_count };
        }
      });
      setRepos(map);
    });
  }, []);

  const filtered =
    active === "All" ? projectsData : projectsData.filter((p) => p.category === active);

  const accentBorder: Record<string, string> = {
    blue: "hover:border-blue-500/30",
    emerald: "hover:border-emerald-500/30",
    pink: "hover:border-pink-500/30",
    violet: "hover:border-violet-500/30",
  };

  const repoKey: Record<string, string> = {
    warn: "warn",
    adhan: "adhan-api",
    tmo: "tmo",
    profile: "profile",
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <NavbarV2 />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 lg:px-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-8">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-blue-500/50" />
              <span className="text-blue-500 font-mono text-xs uppercase tracking-widest">Open Source</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Projects</span>
            </h1>
            <p className="text-xl text-zinc-400 font-light max-w-2xl">
              Production-grade systems built at the intersection of automation, data engineering, and AI-native development.
            </p>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap gap-8"
          >
            {[
              { label: "Public Repos", value: "4+" },
              { label: "AI-Augmented", value: "100%" },
              { label: "Languages", value: "5+" },
              { label: "Deployed Live", value: "3" },
            ].map(({ label, value }) => (
              <div key={label}>
                <span className="text-2xl md:text-3xl font-black text-white">{value}</span>
                <span className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 px-6 lg:px-24 border-b border-white/5 sticky top-[60px] z-30 bg-[#09090b]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-zinc-600 shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                active === cat
                  ? "bg-white text-black"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Project Grid */}
      <section className="py-16 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => {
                const rKey = repoKey[project.id] ?? project.id;
                const repoData = repos[rKey];

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`relative rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden group transition-all duration-500 ${accentBorder[project.accent]}`}
                  >
                    {/* Gradient BG */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

                    {/* Visual Artifact Window — type-aware preview */}
                    {"previewType" in project && project.previewSrc && (
                      <div className="relative w-full overflow-hidden bg-black/40 border-b border-white/5" style={{ height: "220px" }}>
                        {(project as any).previewType === "iframe" ? (
                          <>
                            <iframe
                              src={(project as any).previewSrc}
                              className="w-full h-full border-0 scale-[0.85] origin-top-left"
                              style={{ width: "117%", height: "280px", pointerEvents: "auto" }}
                              loading="lazy"
                              title={`${project.name} live preview`}
                              sandbox="allow-scripts allow-same-origin"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]/50 pointer-events-none" />
                            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-emerald-600/80 border border-emerald-500/40 text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1 pointer-events-none">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Live
                            </div>
                          </>
                        ) : (project as any).previewType === "gif" ? (
                          <>
                            <img
                              src={(project as any).previewSrc}
                              alt={`${project.name} system flow`}
                              className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]/50 pointer-events-none" />
                            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/60 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/70 pointer-events-none">System Flow</div>
                          </>
                        ) : (
                          <>
                            <img
                              src={(project as any).previewSrc}
                              alt={(project as any).thumbnailAlt ?? project.name}
                              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]/50 pointer-events-none" />
                          </>
                        )}
                      </div>
                    )}

                    <div className="relative z-10 p-8 flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          {project.isAI && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3">
                              <Sparkles className="w-3 h-3 text-purple-400 fill-purple-400/30" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">AI-Built</span>
                            </div>
                          )}
                          <h2 className="text-xl font-black text-white tracking-tight">{project.name}</h2>
                          <p className="text-sm text-zinc-400 mt-1">{project.tagline}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <a
                            href={project.repo}
                            target="_blank"
                            rel="noreferrer"
                            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                          {project.demo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noreferrer"
                              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-500 transition-all"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-zinc-400 leading-relaxed mb-6">{project.description}</p>

                      {/* Tech Tags — all shown, no truncation */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((t) => (
                          <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* AI Contribution Bar */}
                      {project.isAI && (
                        <AIContributionBar pct={project.aiContribution} color={project.accent} />
                      )}


                      {/* Footer */}
                      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-zinc-600">
                          {repoData && (
                            <>
                              <span className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/80" />
                                {repoData.stars}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <GitFork className="w-3.5 h-3.5" />
                                {repoData.forks}
                              </span>
                            </>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-emerald-500" />
                            {project.impact}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          {project.blogSlug && (
                            <Link
                              href={`/blog/${project.blogSlug}`}
                              className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 hover:text-blue-400 transition-colors"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              Story
                            </Link>
                          )}
                          <Link
                            href="/ai"
                            className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 hover:text-violet-400 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* GitHub CTA */}
      <section className="py-24 px-6 text-center border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-black tracking-tighter">See All Repositories</h2>
          <p className="text-zinc-400">Explore the complete collection of public work, contributions, and experiments.</p>
          <a
            href="https://github.com/bilalahamad0"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all hover:scale-105 shadow-2xl"
          >
            <Github className="w-5 h-5" />
            View GitHub Profile
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </main>
  );
}
