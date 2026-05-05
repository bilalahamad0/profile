"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Github, ExternalLink, Sparkles, Star, GitFork,
  Filter, ArrowRight, BookOpen, Zap, ChevronUp,
} from "lucide-react";
import { projectsData, type ProjectCategory } from "@/data/portfolio";

const CATEGORIES: ProjectCategory[] = ["All", "IoT & Automation", "Data & Analytics", "AI-Powered", "Web & DevOps"];

type RepoData = { stars: number; forks: number };

function AIContributionBar({ pct, color }: { pct: number; color: string }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(pct), 400);
    return () => clearTimeout(timer);
  }, [pct]);

  const colorMap: Record<string, string> = {
    blue:    "bg-blue-500",
    emerald: "bg-emerald-500",
    pink:    "bg-pink-500",
    violet:  "bg-violet-500",
  };

  return (
    <div className="mt-4" role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`AI contribution: ${pct}%`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">AI Contribution</span>
        <span className="text-xs font-bold text-zinc-400">{pct}%</span>
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
  const [failedPreviews, setFailedPreviews] = useState<Record<string, boolean>>({});
  const [videoLightbox, setVideoLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const playId = searchParams.get("play");
      if (playId) {
        const projectToPlay = projectsData.find(p => p.id === playId);
        if (projectToPlay && (projectToPlay as any).previewType === "youtube") {
          // Add a small delay to allow the page scroll to finish before opening modal
          setTimeout(() => {
            setVideoLightbox((projectToPlay as any).previewSrc);
          }, 500);
          // Clean up the URL
          window.history.replaceState({}, "", `/projects#${playId}`);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (videoLightbox) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [videoLightbox]);

  useEffect(() => {
    fetch("/api/repos")
      .then((r) => r.json())
      .then((data: Array<{ name: string; stargazers_count: number; forks_count: number }>) => {
        const map: Record<string, RepoData> = {};
        data.forEach((r) => {
          map[r.name] = { stars: r.stargazers_count, forks: r.forks_count };
        });
        setRepos(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const filtered =
    active === "All" ? projectsData : projectsData.filter((p) => p.category === active);

  const accentBorder: Record<string, string> = {
    blue:    "hover:border-blue-500/30",
    emerald: "hover:border-emerald-500/30",
    pink:    "hover:border-pink-500/30",
    violet:  "hover:border-violet-500/30",
  };

  const repoKey: Record<string, string> = {
    warn:    "warn",
    adhan:   "adhan-api",
    tmo:     "tmo",
    profile: "profile",
  };

  const videoLightboxPortal = videoLightbox && typeof document !== 'undefined'
    ? createPortal(
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(0,0,0,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          touchAction: 'none',
        }}
        onClick={() => setVideoLightbox(null)}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            height: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src={`${videoLightbox}?autoplay=1&mute=0`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video Preview"
          />
          <button
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              padding: '8px',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
            onClick={() => setVideoLightbox(null)}
          >
            <ChevronUp style={{ width: 24, height: 24, transform: 'rotate(180deg)' }} />
          </button>
        </div>
      </div>,
      document.body
    )
    : null;

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {videoLightboxPortal}
      {/* Header */}
      <section className="pt-24 pb-10 md:pt-28 md:pb-12 lg:pt-36 lg:pb-16 px-6 lg:px-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Github className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">Open Source</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                Projects
              </span>
            </h1>
            <p className="text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
              Production-grade systems built at the intersection of automation, data engineering, and
              AI-native development.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl"
          >
            {[
              { label: "Public Repos",  value: `${projectsData.length}+` },
              { label: "AI-Augmented",  value: `${Math.round(projectsData.reduce((acc, p) => acc + (p.aiContribution || 0), 0) / projectsData.filter(p => p.aiContribution).length)}%` },
              { label: "Languages",     value: "5+" },
              { label: "Deployed Live", value: "3" },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <span className="block text-2xl md:text-3xl font-black text-white mb-1">{value}</span>
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top Mask Overlay — darkens content (0% opacity) behind filter bar and navbar */}
      <div className="mask-top-dark" aria-hidden="true" />

      {/* Filter bar — backdrop-blur + dynamic sticky offset */}
      <section
        className="filter-bar py-5 px-6 lg:px-24 sticky z-30"
        style={{ top: "var(--navbar-h, 68px)" }}
        aria-label="Filter projects"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-zinc-600 shrink-0" aria-hidden="true" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
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

      {/* Project grid */}
      <section className="py-10 md:py-12 lg:py-16 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => {
                const rKey = repoKey[project.id] ?? project.id;
                const repoData = repos[rKey];
                const previewFailed = !!failedPreviews[project.id];

                return (
                  <motion.article
                    key={project.id}
                    id={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className={`relative rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden group transition-all duration-500 scroll-mt-32 ${accentBorder[project.accent]}`}
                  >
                    {/* Gradient bg */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
                      aria-hidden="true"
                    />

                    <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          {project.isAI && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-3">
                              <Sparkles className="w-3 h-3 text-violet-400 fill-violet-400/30" aria-hidden="true" />
                              <span className="text-xs font-bold uppercase tracking-wider text-violet-300">AI-Built</span>
                            </div>
                          )}
                          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                            {project.name}
                          </h2>
                          <p className="text-sm text-zinc-400 mt-1">{project.tagline}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-zinc-400 leading-relaxed mb-6">{project.description}</p>

                      {/* Previews (Video & Dashboard Sub-cards) */}
                      {((project as any).previewType !== "none" || (project as any).dashboardSrc) && (
                        <div className="flex flex-col gap-4 mb-6">
                          {/* Video Sub-card */}
                          {(project as any).previewType !== "none" && (
                            <div className={`relative w-full overflow-hidden bg-black/40 rounded-2xl border border-white/5 ${
                              (project as any).dashboardSrc ? "h-[200px] sm:h-[250px]" : "h-[250px] sm:h-[300px]"
                            }`}>
                              {!previewFailed && ((project as any).previewType === "youtube" || (project as any).thumbnailType === "video" || project.thumbnail?.endsWith('.mp4')) ? (
                                <div 
                                  className="relative w-full h-full cursor-pointer group/vid"
                                  onClick={() => setVideoLightbox((project as any).previewSrc)}
                                >
                                  <video
                                    src={project.thumbnail!}
                                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]/40 pointer-events-none" />
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                     <div className="px-6 py-3 rounded-full bg-blue-500/80 backdrop-blur-md border border-white/20 font-black uppercase tracking-widest text-white shadow-xl flex items-center gap-2 group-hover/vid:scale-105 group-hover/vid:bg-blue-500 transition-all">
                                       <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                       Play Full Video
                                     </div>
                                  </div>
                                </div>
                              ) : !previewFailed && (project as any).previewType === "iframe" ? (
                                <>
                                  <iframe
                                    src={(project as any).previewSrc}
                                    className="w-full h-full border-0 scale-[0.85] origin-top-left"
                                    style={{ width: "117%", height: "117%", pointerEvents: "auto" }}
                                    loading="lazy"
                                    title={`${project.name} live preview`}
                                    sandbox="allow-scripts allow-same-origin"
                                    onError={() => {
                                      setFailedPreviews((prev) => ({ ...prev, [project.id]: true }));
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]/40 pointer-events-none" />
                                </>
                              ) : !previewFailed ? (
                                <>
                                  <img
                                    src={(project as any).previewSrc}
                                    alt={(project as any).thumbnailAlt ?? `${project.name} preview`}
                                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    onError={() => {
                                      setFailedPreviews((prev) => ({ ...prev, [project.id]: true }));
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]/40 pointer-events-none" />
                                </>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-800">
                                  <div className="text-center px-4">
                                    <p className="text-sm font-bold text-zinc-200">{project.name}</p>
                                    <p className="text-xs text-zinc-500 mt-1">Preview unavailable - open repo for details</p>
                                  </div>
                                </div>
                              )}
                              
                              {project.demo && !(project as any).dashboardSrc && !previewFailed && (
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/80 border border-emerald-500/40 text-xs font-bold text-white hover:bg-emerald-500 transition-colors z-10"
                                >
                                  <span className="pulse-dot" aria-hidden="true" />
                                  {project.demoLabel || "Live"}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Dashboard Sub-card */}
                          {(project as any).dashboardSrc && (
                            <div className={`relative w-full overflow-hidden ${
                              project.id === 'adhan' ? 'bg-transparent' : 'bg-black/40'
                            } rounded-2xl border border-white/5 ${
                              (project as any).previewType !== "none" ? "h-[200px] sm:h-[250px]" : "h-[416px] sm:h-[516px]"
                            }`}>
                              {project.id === 'adhan' ? (
                                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                                  <iframe
                                    src={(project as any).dashboardSrc}
                                    className="border-0 origin-top-left"
                                    style={{ 
                                      width: '133%', 
                                      height: '180%', 
                                      transform: 'scale(0.75) translateY(-80px)',
                                      transformOrigin: 'top left',
                                      pointerEvents: 'auto',
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                    }}
                                    loading="lazy"
                                    title={`${project.name} live dashboard`}
                                    sandbox="allow-scripts allow-same-origin"
                                    onError={() => {
                                      setFailedPreviews((prev) => ({ ...prev, [`${project.id}-dash`]: true }));
                                    }}
                                  />
                                </div>
                              ) : (
                                <iframe
                                  src={(project as any).dashboardSrc}
                                  className={`w-full h-full border-0 origin-top-left ${
                                    project.id === 'warn' ? '' : 'scale-[0.75] sm:scale-[0.80]'
                                  }`}
                                  style={project.id === 'warn' ? { width: "117%", height: "100%", minHeight: "1200px", pointerEvents: "auto", transform: "scale(0.85) translateY(-675px)" } : { width: "133%", height: "133%", pointerEvents: "auto" }}
                                  loading="lazy"
                                  title={`${project.name} live dashboard`}
                                  sandbox="allow-scripts allow-same-origin"
                                  onError={() => {
                                    setFailedPreviews((prev) => ({ ...prev, [`${project.id}-dash`]: true }));
                                  }}
                                />
                              )}
                              {project.id !== 'adhan' && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]/20 pointer-events-none" />}
                              {project.demo && (
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/80 border border-emerald-500/40 text-xs font-bold text-white hover:bg-emerald-500 transition-colors z-10 shadow-lg backdrop-blur-md"
                                >
                                  <span className="pulse-dot" aria-hidden="true" />
                                  {project.demoLabel || "Live Dashboard"}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-2 mb-6" role="list" aria-label="Technologies used">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            role="listitem"
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 uppercase tracking-widest"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* AI bar */}
                      {project.isAI && (
                        <AIContributionBar pct={project.aiContribution} color={project.accent} />
                      )}

                      {/* Footer */}
                      <div className="mt-6 pt-6 border-t border-white/5 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 flex items-start gap-4 text-xs text-zinc-500">
                          <span className="flex items-start gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                            <span className="leading-relaxed text-justify sm:text-left">{project.impact}</span>
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-end sm:items-center justify-end gap-2 sm:gap-3 shrink-0">
                          <a
                            href={project.repo}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors whitespace-nowrap"
                          >
                            <Github className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> GitHub
                          </a>
                          {project.blogSlug && (
                            <Link
                              href={`/blog/${project.blogSlug}`}
                              className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-blue-400 transition-colors whitespace-nowrap"
                            >
                              <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Story
                            </Link>
                          )}
                          <Link
                            href="/ai"
                            className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-violet-400 transition-colors whitespace-nowrap"
                          >
                            <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> AI Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* GitHub CTA */}
      <section className="py-12 md:py-20 lg:py-24 px-6 text-center border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-black tracking-tighter">See All Repositories</h2>
          <p className="text-zinc-400">
            Explore the complete collection of public work, contributions, and experiments.
          </p>
          <a
            href="https://github.com/bilalahamad0"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all hover:scale-105 shadow-2xl"
          >
            <Github className="w-5 h-5" aria-hidden="true" />
            View GitHub Profile
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
