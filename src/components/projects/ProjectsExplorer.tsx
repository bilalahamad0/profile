"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Github, ExternalLink, Sparkles, Star, GitFork,
  Filter, BookOpen, Zap, ChevronUp, Network, MapPin,
} from "lucide-react";
import { projectsData, type ProjectCategory } from "@/data/portfolio";
import { DashboardFacade } from "@/components/projects/DashboardFacade";
import { AIBuildBreakdown } from "@/components/projects/AIBuildBreakdown";
import { LazyLoopVideo } from "@/components/media/LazyLoopVideo";
import type { AIMetrics } from "@/lib/ai-metrics";

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
        <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">AI Contribution</span>
        <span className="text-xs font-bold text-ink-muted">{pct}%</span>
      </div>
      {/* Meter track: 5% ink is invisible on the white card, so the light base
          is 10%; dark keeps the original 5% (ink === white there). */}
      <div className="h-1.5 w-full rounded-full bg-ink/10 dark:bg-ink/5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorMap[color] ?? "bg-blue-500"}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

/**
 * The interactive half of /projects: header, filter bar and the animated card
 * grid. Split out of `app/projects/page.tsx` when the AI Lab page was merged in,
 * so the page itself can be a Server Component that awaits `getAIMetricsMap()`
 * and hands the result down as `metrics` (per-project AI build data, keyed by
 * project id). Everything here still prerenders to static HTML.
 */
export function ProjectsExplorer({ metrics }: { metrics: Record<string, AIMetrics> }) {
  const [active, setActive] = useState<ProjectCategory>("All");
  const [repos, setRepos] = useState<Record<string, RepoData>>({});
  const [failedPreviews, setFailedPreviews] = useState<Record<string, boolean>>({});
  const [videoLightbox, setVideoLightbox] = useState<string | null>(null);
  const [pendingHash, setPendingHash] = useState<string | null>(null);

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

  // Deep links land here from three places: the AI metrics table further down
  // this page, the `/ai` -> `/projects` redirect (browsers carry the original
  // fragment across, so `/ai#adhan-ce` becomes `/projects#adhan-ce`), and the
  // published blog posts. `hashchange` is listened to as well as read once,
  // because the metrics table's rows are same-page anchors.
  useEffect(() => {
    const readHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash) return;
      // The target card may be hidden behind the current category filter —
      // widen back to "All" so the anchor has something to scroll to.
      if (projectsData.some((p) => p.id === hash)) setActive("All");
      setPendingHash(hash);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  // Runs after the filter change above has been committed, so the element exists.
  useEffect(() => {
    if (!pendingHash) return;
    const raf = requestAnimationFrame(() => {
      document.getElementById(pendingHash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingHash(null);
    });
    return () => cancelAnimationFrame(raf);
  }, [pendingHash, active]);

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
    <>
      {videoLightboxPortal}
      {/* Header */}
      <section className="pt-24 pb-10 md:pt-28 md:pb-12 lg:pt-36 lg:pb-16 px-6 lg:px-24 border-b border-line/10 dark:border-line/5 relative overflow-hidden">
        {/* Decorative glow — held back on the light ground so it does not tint
            the page grey-blue; dark is untouched. */}
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-100" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Github className="w-4 h-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">Open Source</span>
            </div>
            <h1 className="t-h1 mb-6">
              Featured{" "}
              {/* Gradient TEXT — the stops are the type colour, so light gets its
                  own 600 ramp; dark keeps the original 400s verbatim. */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                Projects
              </span>
            </h1>
            <p className="t-lead text-ink-muted font-light max-w-2xl">
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
              { label: "Deployed Live", value: "5" },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 rounded-2xl bg-surface-card dark:bg-ink/[0.03] border border-line/10 dark:border-line/[0.06]">
                <span className="block text-2xl md:text-3xl font-black text-ink mb-1">{value}</span>
                <span className="block t-label font-bold text-ink-muted uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top Mask Overlay — hides content behind the filter bar and navbar.
          .mask-top-dark still hard-codes rgb(9 9 11); bg-surface! re-points it at
          the theme ground (identical in dark, correct in light). */}
      <div className="mask-top-dark bg-surface!" aria-hidden="true" />

      {/* The filter bar sticks only for as long as there is a grid to filter.
          This wrapper is its containing block, so it releases at the end of the
          cards instead of riding over the AI Lab section and the CTA below —
          content-driven, no measured heights. */}
      <div>
      {/* Filter bar — backdrop-blur + dynamic sticky offset */}
      <section
        className="filter-bar py-5 px-6 lg:px-24 sticky z-30"
        style={{ top: "var(--navbar-h, 68px)" }}
        aria-label="Filter projects"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-ink-muted shrink-0" aria-hidden="true" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                active === cat
                  ? "bg-ink text-surface"
                  : "bg-ink/5 text-ink-muted hover:bg-ink/10 hover:text-ink"
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
                const projectMetrics = metrics[project.id];
                const previewFailed = !!failedPreviews[project.id];
                // Extended sub-group (e.g. California nested under the national US WARN tracker).
                const subDashboards = project.subDashboards ?? [];
                // Marketplace availability (browser extensions published to stores).
                const storeListings = project.storeListings ?? [];

                return (
                  <motion.article
                    key={project.id}
                    id={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className={`relative rounded-3xl border border-line/10 dark:border-line/5 bg-surface-card dark:bg-ink/[0.02] overflow-hidden group transition-all duration-500 scroll-mt-32 ${accentBorder[project.accent]}`}
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
                              <Sparkles className="w-3 h-3 text-violet-700 fill-violet-700/30 dark:text-violet-400 dark:fill-violet-400/30" aria-hidden="true" />
                              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">AI-Built</span>
                            </div>
                          )}
                          <h2 className="t-h3 text-ink">
                            {project.name}
                          </h2>
                          <p className="text-sm text-ink-muted mt-1">{project.tagline}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-ink-muted leading-relaxed mb-6">{project.description}</p>

                      {/* Previews (Video & Dashboard Sub-cards) */}
                      {((project as any).previewType !== "none" || (project as any).dashboardSrc) && (
                        <div className="flex flex-col gap-4 mb-6">
                          {/* Video Sub-card */}
                          {(project as any).previewType !== "none" && (
                            <div className={`relative w-full overflow-hidden bg-ink/5 dark:bg-black/40 rounded-2xl border border-line/10 dark:border-line/5 ${
                              (project as any).dashboardSrc ? "h-[200px] sm:h-[250px]" : "h-[250px] sm:h-[300px]"
                            }`}>
                              {!previewFailed && ((project as any).previewType === "youtube" || (project as any).thumbnailType === "video" || project.thumbnail?.endsWith('.mp4')) ? (
                                (project as any).previewType === "youtube" ? (
                                  <div
                                    className="relative w-full h-full cursor-pointer group/vid"
                                    onClick={() => setVideoLightbox((project as any).previewSrc)}
                                  >
                                    <LazyLoopVideo
                                      src={project.thumbnail!}
                                      poster={(project as unknown as { thumbnailPoster?: string }).thumbnailPoster}
                                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/40 pointer-events-none" />
                                    {/* Play pill: text-white and border-white/20 are
                                        fixed contrast against the opaque blue fill
                                        it sits on (over video, not the page ground),
                                        so both stay as-is in either theme. */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                       <div className="px-6 py-3 rounded-full bg-blue-500/80 backdrop-blur-md border border-white/20 font-black uppercase tracking-widest text-white shadow-xl flex items-center gap-2 group-hover/vid:scale-105 group-hover/vid:bg-blue-500 transition-all">
                                         <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                         Play Full Video
                                       </div>
                                    </div>
                                  </div>
                                ) : (
                                  // MP4 thumbnail with no full-length video behind it — loop inline, no lightbox
                                  <div className="relative w-full h-full">
                                    <LazyLoopVideo
                                      src={project.thumbnail!}
                                      poster={(project as unknown as { thumbnailPoster?: string }).thumbnailPoster}
                                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/40 pointer-events-none" />
                                  </div>
                                )
                              ) : !previewFailed && (project as any).previewType === "iframe" ? (
                                <DashboardFacade
                                  title={project.name}
                                  label="Load live preview"
                                  note="Interactive site embed — loads on demand"
                                >
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
                                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/40 pointer-events-none" />
                                </DashboardFacade>
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
                                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/40 pointer-events-none" />
                                </>
                              ) : (
                                /* Media-well placeholder. Same treatment as
                                   DashboardFacade: an ink wash on the light
                                   ground, the original zinc-900 ramp in dark,
                                   so the label reads on both (14.7:1 / 14.0:1). */
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink/[0.07] via-ink/[0.05] to-ink/[0.03] dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-800">
                                  <div className="text-center px-4">
                                    <p className="text-sm font-bold text-ink dark:text-zinc-200">{project.name}</p>
                                    <p className="text-xs text-ink-muted mt-1">Preview unavailable - open repo for details</p>
                                  </div>
                                </div>
                              )}
                              
                              {project.demo && !(project as any).dashboardSrc && !previewFailed && (
                                /* text-white stays: it labels a filled emerald
                                   badge floating over the media, not the page. */
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-700 dark:bg-emerald-600/80 border border-emerald-500/40 text-xs font-bold text-white hover:bg-emerald-500 transition-colors z-10"
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
                              project.id === 'adhan' ? 'bg-transparent' : 'bg-ink/5 dark:bg-black/40'
                            } rounded-2xl border border-line/10 dark:border-line/5 ${
                              (project as any).previewType !== "none" ? "h-[200px] sm:h-[250px]" : "h-[416px] sm:h-[516px]"
                            }`}>
                              {project.id === 'adhan' ? (
                                <DashboardFacade
                                  title={project.name}
                                  label="Load live dashboard"
                                  note="Live Plotly + Firestore dashboard — loads on demand"
                                >
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
                                </DashboardFacade>
                              ) : (
                                // `--warn-shift` parks the crop window on the national choropleth of the
                                // US WARN tracker. That dashboard reflows below 640px (taller stat stack
                                // pushes the map down), hence the two measured offsets.
                                <DashboardFacade
                                  title={project.name}
                                  label="Load live dashboard"
                                  note="Live Plotly dashboard — loads on demand"
                                >
                                  <iframe
                                    src={(project as any).dashboardSrc}
                                    className={`w-full h-full border-0 origin-top-left ${
                                      project.id === 'warn' ? '[--warn-shift:-790px] sm:[--warn-shift:-675px]' : 'scale-[0.75] sm:scale-[0.80]'
                                    }`}
                                    style={project.id === 'warn' ? { width: "117%", height: "100%", minHeight: "1200px", pointerEvents: "auto", transform: "scale(0.85) translateY(var(--warn-shift))" } : { width: "133%", height: "133%", pointerEvents: "auto" }}
                                    loading="lazy"
                                    title={`${project.name} live dashboard`}
                                    sandbox="allow-scripts allow-same-origin"
                                    onError={() => {
                                      setFailedPreviews((prev) => ({ ...prev, [`${project.id}-dash`]: true }));
                                    }}
                                  />
                                </DashboardFacade>
                              )}
                              {project.id !== 'adhan' && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/20 pointer-events-none" />}
                              {project.demo && (
                                /* text-white stays — filled emerald badge over the dashboard. */
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-700 dark:bg-emerald-600/80 border border-emerald-500/40 text-xs font-bold text-white hover:bg-emerald-500 transition-colors z-10 shadow-lg backdrop-blur-md"
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

                      {/* Extended sub-group — regional deep-dives nested inside this project */}
                      {subDashboards.length > 0 && (
                        <div className="mb-6 pl-4 border-l-2 border-blue-500/30 flex flex-col gap-2">
                          <span className="t-label font-black uppercase tracking-[0.2em] text-ink-muted">
                            Extended Coverage
                          </span>
                          {subDashboards.map((sub) => (
                            <a
                              key={sub.id}
                              href={sub.href}
                              target="_blank"
                              rel="noreferrer"
                              className="group/sub flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 rounded-2xl border border-line/10 dark:border-line/5 bg-ink/[0.03] px-4 py-3 hover:border-blue-500/30 hover:bg-ink/[0.06] transition-all"
                            >
                              <span className="min-w-0">
                                <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
                                  <MapPin className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 shrink-0" aria-hidden="true" />
                                  {sub.region}
                                </span>
                                <span className="block text-xs text-ink-muted mt-0.5">{sub.tagline}</span>
                              </span>
                              <span className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-blue-700 group-hover/sub:text-blue-800 dark:text-blue-300 dark:group-hover/sub:text-blue-200 transition-colors">
                                <span className="pulse-dot" aria-hidden="true" />
                                {sub.demoLabel}
                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                              </span>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Marketplace availability — one row per browser store.
                          Twin of the Extended sub-group above: accent rail, t-label
                          caption, stacked rows; emerald to match this card's accent. */}
                      {storeListings.length > 0 && (
                        <div className="mb-6 pl-4 border-l-2 border-emerald-500/30 flex flex-col gap-2">
                          <span className="t-label font-black uppercase tracking-[0.2em] text-ink-muted">
                            Available On
                          </span>
                          <ul role="list" className="flex flex-col gap-2">
                            {storeListings.map((listing) =>
                              listing.status === "live" ? (
                                <li key={listing.browser}>
                                  <a
                                    href={listing.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={`${listing.listingName} — v${listing.version} on ${listing.store}`}
                                    className="group/store flex items-center gap-2 rounded-2xl border border-line/10 dark:border-line/5 bg-ink/[0.03] px-3 py-2 hover:border-emerald-500/30 hover:bg-ink/[0.06] transition-all"
                                  >
                                    <span className="min-w-0 flex-1 truncate t-small font-semibold text-ink underline-offset-2 group-hover/store:underline">
                                      {listing.store}
                                    </span>
                                    <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap t-label font-bold text-emerald-700 group-hover/store:text-emerald-800 dark:text-emerald-300 dark:group-hover/store:text-emerald-200 transition-colors">
                                      <span className="pulse-dot" aria-hidden="true" />
                                      Live · v{listing.version}
                                      {/* Below 375px the arrow costs the store name its last
                                          ~12px and truncates it — measured; drop it there. */}
                                      <ExternalLink className="w-3 h-3 max-[374px]:hidden" aria-hidden="true" />
                                      <span className="sr-only">
                                        {" "}— {listing.listingName}, opens in a new tab
                                      </span>
                                    </span>
                                  </a>
                                </li>
                              ) : (
                                <li key={listing.browser}>
                                  <div
                                    title={listing.note}
                                    className="flex items-center gap-2 rounded-2xl border border-dashed border-line/15 dark:border-line/10 bg-ink/[0.03] dark:bg-ink/[0.015] px-3 py-2"
                                  >
                                    <span className="min-w-0 flex-1 truncate t-small font-semibold text-ink-muted">
                                      {listing.store}
                                    </span>
                                    <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap t-label font-bold text-amber-700 dark:text-amber-300">
                                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600/80 dark:bg-amber-400/80" aria-hidden="true" />
                                      In review
                                      <span className="sr-only">— {listing.note}</span>
                                    </span>
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-2 mb-6" role="list" aria-label="Technologies used">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            role="listitem"
                            className="px-2.5 py-1 rounded-lg bg-ink/5 border border-line/10 text-xs font-bold text-ink-muted uppercase tracking-widest"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* AI bar — prefers the live sidecar figure so the bar and the
                          AI metrics table below can never disagree on the same page. */}
                      {project.isAI && (
                        <AIContributionBar
                          pct={projectMetrics?.aiContribution ?? project.aiContribution}
                          color={project.accent}
                        />
                      )}

                      {/* AI build detail — the former /ai card for this project */}
                      {project.isAI && projectMetrics && (
                        <AIBuildBreakdown
                          metrics={projectMetrics}
                          accent={project.accent}
                          projectName={project.name}
                        />
                      )}

                      {/* Footer */}
                      <div className="mt-6 pt-6 border-t border-line/10 dark:border-line/5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0 flex items-start gap-4 text-xs text-ink-muted">
                          <span className="flex items-start gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                            <span className="leading-relaxed text-left">{project.impact}</span>
                          </span>
                        </div>
                        <div className="flex flex-col items-start gap-1.5 shrink-0">
                          <a
                            href={project.repo}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 py-1 text-xs font-bold text-ink-muted hover:text-ink transition-colors whitespace-nowrap"
                          >
                            <Github className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> GitHub
                          </a>
                          <a
                            href={project.architecture}
                            target="_blank"
                            rel="noreferrer"
                            title="Architecture & system design diagram"
                            className="flex items-center gap-1.5 py-1 text-xs font-bold text-ink-muted hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors whitespace-nowrap"
                          >
                            <Network className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Architecture
                          </a>
                          {project.relatedPosts?.map((post) => (
                            <Link
                              key={post.slug}
                              href={`/blog/${post.slug}`}
                              className="flex items-center gap-1.5 py-1 text-xs font-bold text-ink-muted hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                            >
                              <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> {post.label}
                            </Link>
                          ))}
                          {project.isAI && (
                            <a
                              href="#ai-lab"
                              className="flex items-center gap-1.5 py-1 text-xs font-bold text-ink-muted hover:text-violet-700 dark:hover:text-violet-400 transition-colors whitespace-nowrap"
                            >
                              <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> AI Metrics
                            </a>
                          )}
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
      </div>
    </>
  );
}
