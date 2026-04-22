"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, ShieldCheck, Box, Activity, Cpu, Cloud, Settings, Layers, Briefcase,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Code2, Database, Wrench, Smartphone, Server, Github, GitFork, Star,
  ExternalLink, Monitor, Layout, Eye, FileCode, Check, MapPin, Sparkles
} from "lucide-react";

import Link from "next/link";


import { experienceData, skills, certs } from "@/data/portfolio";

export interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

const WARN_SNIPPET = `def download_xlsx(force: bool = False):
    """Download WARN XLSX with ETag caching."""
    meta = _load_meta()
    headers = {"User-Agent": "WARNMonitor/2.0"}
    if not force and meta.get("etag"):
        headers["If-None-Match"] = meta["etag"]
    
    resp = requests.get(WARN_XLSX_URL, headers=headers)
    if resp.status_code == 304: 
        return False, str(LOCAL_XLSX)

    LOCAL_XLSX.write_bytes(resp.content)
    new_hash = _file_hash(LOCAL_XLSX)
    
    meta.update({
        "etag": resp.headers.get("ETag", ""),
        "file_hash": new_hash,
        "last_checked": datetime.utcnow().isoformat()
    })
    _save_meta(meta)
    return True, str(LOCAL_XLSX)`;

const CORE_FOCUS_TAGS = [
  "FIRMWARE QUALITY GOVERNANCE",
  "TEST AUTOMATION ARCHITECTURE",
  "TOTAL COST OF QUALITY (CoQ) OPTIMIZATION",
  "SDLC TRANSFORMATION",
  "AI-AUGMENTED TEST FRAMEWORKS",
  "CROSS-FUNCTIONAL ORCHESTRATION",
  "SCALABLE VALIDATION SYSTEMS",
  "CONTINUOUS HARDWARE INTEGRATION",
  "PRODUCT SECURITY & INTEGRITY",
  "TECHNICAL MENTORSHIP",
];

export function BentoGridV2({ showOnlyResume = false }: { showOnlyResume?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [awardLightbox, setAwardLightbox] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [showWarnCode, setShowWarnCode] = useState(false);
  const [warnDashboardExpanded, setWarnDashboardExpanded] = useState(false);
  const [smartLimit, setSmartLimit] = useState(6);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Stores the absolute page Y of the button at the moment collapse is triggered
  const collapseScrollTarget = useRef<number | null>(null);

  const handleToggleExpand = () => {
    if (isExpanded) {
      // Capture the button's absolute position in the document BEFORE the DOM changes
      if (typeof window !== 'undefined' && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        // The target scroll position that would keep the button at the same viewport Y
        collapseScrollTarget.current = window.scrollY + rect.top;
      }
      setIsExpanded(false);
    } else {
      collapseScrollTarget.current = null;
      setIsExpanded(true);
    }
  };

  const handleExitComplete = () => {
    // After ALL exit animations finish, do one single scroll correction
    if (collapseScrollTarget.current !== null && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const currentAbsY = window.scrollY + rect.top;
      const diff = currentAbsY - collapseScrollTarget.current;
      if (Math.abs(diff) > 1) {
        window.scrollBy({ top: diff, behavior: 'smooth' });
      }
      collapseScrollTarget.current = null;
    }
  };

  const checkScroll = () => {
    if (reelRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = reelRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const reel = reelRef.current;
    if (reel) {
      reel.addEventListener('scroll', checkScroll);
      // Initial check with a small delay to ensure content is rendered
      const timeout = setTimeout(checkScroll, 500);
      return () => {
        reel.removeEventListener('scroll', checkScroll);
        clearTimeout(timeout);
      };
    }
  }, []);

  const scrollReel = (direction: 'left' | 'right') => {
    if (reelRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      reelRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Mobile-first expansion logic: 
  // Collapse on mobile by default to show 5 jobs, but expand on Desktop Roadmap page
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024 && showOnlyResume) {
      setIsExpanded(true);
    }
  }, [showOnlyResume]);

  // Handle smart collapse based on right column height
  useEffect(() => {
    if (typeof window === 'undefined' || !rightColumnRef.current) return;

    const calculateLimit = () => {
      if (window.innerWidth < 1024) {
        setSmartLimit(5); // Default for mobile/stacked (User requested 5)
        return;
      }

      if (rightColumnRef.current) {
        const height = rightColumnRef.current.offsetHeight;
        // Estimated height per experience item is ~210px
        const estimatedItems = Math.max(3, Math.ceil(height / 210));
        setSmartLimit(estimatedItems);
      }
    };

    const observer = new ResizeObserver(calculateLimit);
    observer.observe(rightColumnRef.current);
    calculateLimit();

    return () => observer.disconnect();
  }, []);

  // Match right-column baseline to left column by inflating card internals (not outer gaps).
  // We preserve each card's natural proportion and only add extra top/bottom padding.
  useEffect(() => {
    if (typeof window === "undefined" || !showOnlyResume) return;
    if (!timelineRef.current || !rightColumnRef.current) return;

    const BASE_PAD = 32; // p-8 in px
    const INTER_CARD_GAP = 24; // gap-6

    const syncInternalSpacing = () => {
      if (!timelineRef.current || !rightColumnRef.current) return;
      const cards = Array.from(rightColumnRef.current.children) as HTMLElement[];
      if (cards.length === 0) return;

      // Mobile/stacked layout: reset to default padding.
      if (window.innerWidth < 1024) {
        cards.forEach((card) => {
          card.style.paddingTop = "";
          card.style.paddingBottom = "";
        });
        return;
      }

      // Reset to baseline before measuring natural heights.
      cards.forEach((card) => {
        card.style.paddingTop = "";
        card.style.paddingBottom = "";
      });

      const leftHeight = timelineRef.current.offsetHeight;
      const naturalHeights = cards.map((card) => card.offsetHeight);
      const naturalTotal = naturalHeights.reduce((sum, h) => sum + h, 0);
      const totalGaps = INTER_CARD_GAP * Math.max(0, cards.length - 1);
      const extraSpace = leftHeight - (naturalTotal + totalGaps);

      // If right side is already taller/equal, keep natural card spacing.
      if (extraSpace <= 0) return;

      const totalWeight = naturalHeights.reduce((sum, h) => sum + h, 0) || 1;
      cards.forEach((card, idx) => {
        const proportionalExtra = (extraSpace * naturalHeights[idx]) / totalWeight;
        const halfExtra = proportionalExtra / 2;
        card.style.paddingTop = `${BASE_PAD + halfExtra}px`;
        card.style.paddingBottom = `${BASE_PAD + halfExtra}px`;
      });
    };

    const observer = new ResizeObserver(syncInternalSpacing);
    observer.observe(timelineRef.current);
    observer.observe(rightColumnRef.current);
    Array.from(rightColumnRef.current.children).forEach((child) => observer.observe(child));

    syncInternalSpacing();
    window.addEventListener("resize", syncInternalSpacing);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncInternalSpacing);
    };
  }, [showOnlyResume, isExpanded, smartLimit]);

  // Update visible experiences based on smart limit
  const visibleExperiences = isExpanded ? experienceData : experienceData.slice(0, smartLimit);

  const [badgeCount, setBadgeCount] = useState<number | string>("8+");

  useEffect(() => {
    // Use the cached /api/repos route — avoids direct GitHub API calls & rate limiting
    fetch('/api/repos')
      .then(res => res.json())
      .then((data: Array<{ name: string; stargazers_count: number; forks_count: number; description: string; html_url: string; language: string | null }>) => {
        const validRepos = data.filter(r => r && r.name);
        setRepos(validRepos as any);
      })
      .catch(console.error);

    // Fetch dynamic badge count
    fetch('/api/badges')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') {
          setBadgeCount(data.count.toString());
        }
      })
      .catch(console.error);
  }, []);

  // Scroll Lock for Lightbox
  useEffect(() => {
    if (awardLightbox) {
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
  }, [awardLightbox]);

  // Portal-based lightbox: renders directly into document.body,
  // escaping ALL parent transforms, stacking contexts, and overflow.
  const lightboxPortal = awardLightbox && typeof document !== 'undefined'
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
        onClick={() => setAwardLightbox(null)}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            key={awardLightbox}
            src={awardLightbox}
            alt="Award expanded view"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '16px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'block',
            }}
          />
          <button
            style={{
              position: 'absolute',
              top: '-48px',
              right: 0,
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              padding: '8px',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setAwardLightbox(null)}
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
      {lightboxPortal}

      <section id="experience" className={`w-full max-w-7xl mx-auto px-4 sm:px-6 ${showOnlyResume ? 'py-10' : 'pt-24 pb-10'}`}>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {showOnlyResume && (
            <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT COLUMN - EXPERIENCE TIMELINE */}
              <motion.div
                ref={timelineRef}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-3xl p-8 relative flex flex-col"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Activity className="w-32 h-32" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Professional Career Timeline
                </h2>
                <div className="space-y-6 relative z-10 flex-grow">
                  <AnimatePresence onExitComplete={handleExitComplete}>
                    {visibleExperiences.map((exp, idx) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        key={exp.company + idx}
                        className="flex gap-4 group overflow-hidden"
                      >
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-xl flex shrink-0 items-center justify-center transition-colors border overflow-hidden p-2.5
                          ${exp.faang
                              ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                              : (exp as any).isStealth
                                ? 'bg-violet-500/10 border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                                : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/50'
                            }`}
                          >
                            <img
                              src={exp.file}
                              alt={exp.company}
                              className={`w-full h-full object-contain ${exp.invertLogo ? "filter invert brightness-200" : ""}`}
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          </div>
                          {/* Hide timeline connector on the absolute last item shown */}
                          {idx !== visibleExperiences.length - 1 && <div className="w-px h-full bg-gradient-to-b from-zinc-300 dark:from-zinc-600 to-transparent mt-2 pointer-events-none" />}
                        </div>
                        <div className="pb-4 pt-1">
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-tight whitespace-pre-line">{exp.role}</h3>
                            <span className="font-medium tracking-tight whitespace-pre-line text-emerald-600 dark:text-emerald-400">
                              {exp.company}
                            </span>
                          </div>
                          <p className="text-xs sm:text-xs text-zinc-500 dark:text-zinc-500 mb-2 mt-1 flex items-center gap-2 whitespace-nowrap">
                            <span className="shrink-0">{exp.duration}</span>
                            <span className="opacity-30 shrink-0">•</span>
                            {/* @ts-ignore */}
                            <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" /> {exp.location}</span>
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md mb-3">{exp.desc}</p>
                          {/* Achievement bullets */}
                          {"highlights" in exp && Array.isArray((exp as any).highlights) && (exp as any).highlights.length > 0 && (
                            <ul className="space-y-1.5 max-w-md">
                              {(exp as any).highlights.map((h: string, hi: number) => (
                                <li key={hi} className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                  <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {experienceData.length > smartLimit && (
                  <button
                    ref={buttonRef}
                    onClick={handleToggleExpand}
                    className="mt-6 flex items-center justify-center w-full py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors gap-2 text-sm font-medium z-20 relative"
                  >
                    {isExpanded ? (
                      <><ChevronUp className="w-4 h-4" /> Collapse Timeline</>
                    ) : (
                      <><ChevronDown className="w-4 h-4" /> View Full Summary</>
                    )}
                  </button>
                )}
              </motion.div>

              {/* RIGHT COLUMN - ARSENAL, CERTS, AWARDS, RECOMMS, GOOGLE PROFILE */}
              <div className="flex flex-col h-full">
                <div ref={rightColumnRef} className="flex flex-col gap-6 h-full">
                  {/* 1. Core Focus */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0 }}
                    className="glass-card rounded-3xl p-8 flex flex-col"
                  >
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
                      <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      Core Focus
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CORE_FOCUS_TAGS.map((tag, idx) => {
                        let tone = "bg-blue-500/10 border-blue-500/20 text-blue-300";
                        if (idx >= 3 && idx < 6) tone = "bg-emerald-500/10 border-emerald-500/20 text-emerald-300";
                        if (idx >= 6) tone = "bg-violet-500/10 border-violet-500/20 text-violet-300";
                        return (
                          <span
                            key={tag}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-[0.08em] border ${tone}`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* 2. Technical Arsenal */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.03 }}
                    className="glass-card rounded-3xl p-8 flex flex-col transition-all duration-500"
                  >
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
                      <Terminal className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      Technical Arsenal
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                      {skills.map((skill) => (
                        <span key={skill.name} className="px-3.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-black/10 dark:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 cursor-default group">
                          <skill.icon className={`w-4 h-4 ${skill.color} group-hover:scale-110 transition-transform`} />
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* 3. Certifications */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.06 }}
                    className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col"
                  >
                    <Settings className="absolute -right-8 -bottom-8 w-48 h-48 text-zinc-500 dark:text-zinc-500/5 pointer-events-none" />
                    <div className="flex items-center justify-between mb-5 relative z-10">
                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <Settings className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                        Certifications
                      </h2>
                      <Link href="/certifications" className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">
                        View All <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* AI / Machine Learning */}
                    <div className="mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 dark:text-purple-400 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> AI & Machine Learning
                      </span>
                      <ul className="space-y-2 mt-2">
                        {["Software Testing Foundations: Integrating AI into Quality Process (2026)", "AI Coding Agents with GitHub Copilot and Cursor (2025)", "AI for App building (2026)"].map((cert, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                              <Box className="w-3 h-3 text-purple-400" />
                            </div>
                            <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Testing & Standards */}
                    <div className="mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3" /> Testing &amp; Standards
                      </span>
                      <ul className="space-y-2 mt-2">
                        {["ISTQB Certified Tester Foundation Level (CTFL)"].map((cert, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                              <Box className="w-3 h-3 text-amber-400" />
                            </div>
                            <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                        <Box className="w-3 h-3" /> Leadership & Management
                      </span>
                      <ul className="space-y-2 mt-2">
                        {["How to Master Your Executive Presence (2023)", "Project Management Foundations (2023)", "Scrum: Advanced (2021)"].map((cert, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                              <Box className="w-3 h-3 text-blue-400" />
                            </div>
                            <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.09 }}
                    className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col"
                  >
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2 relative z-10">
                      <span className="text-2xl">🏆</span>
                      Awards &amp; Recognition
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 relative z-10">L&amp;T Infotech (2010–2011)</p>

                    <button
                      className="relative w-full mb-6 rounded-2xl overflow-hidden border border-white/10 cursor-zoom-in group text-left block"
                      onClick={() => setAwardLightbox("/awards/award_stage.jpg")}
                    >
                      <img
                        src="/awards/award_stage.jpg"
                        alt="Bilal Ahamad receiving Excellent Performance Award on stage at L&T Infotech"
                        className="w-full h-52 object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 left-0 p-4 pointer-events-none">
                        <span className="text-white font-bold text-sm">Annual Best Performer · 2010–11</span>
                        <span className="block text-zinc-300 text-xs mt-0.5">L&amp;T Infotech · Receiving Award on Stage</span>
                      </div>
                      <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 border border-white/20 text-[9px] font-bold text-white/70 uppercase tracking-wider pointer-events-none">Click to expand</span>
                    </button>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button
                        className="group relative rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-zoom-in text-left"
                        onClick={() => setAwardLightbox("/awards/performance_award.jpeg")}
                      >
                        <img src="/awards/performance_award.jpeg" alt="Excellent Performance Award Certificate" className="w-full h-52 object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 p-3 pointer-events-none">
                          <span className="text-white text-[11px] font-black uppercase tracking-wider block">Annual Best Performer</span>
                          <span className="text-emerald-400 text-[10px] font-semibold">Excellent Performance Award</span>
                        </div>
                      </button>
                      <button
                        className="group relative rounded-2xl overflow-hidden border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-zoom-in text-left"
                        onClick={() => setAwardLightbox("/awards/eagle_award.jpeg")}
                      >
                        <img src="/awards/eagle_award.jpeg" alt="Eagle Award for Best Managed Project" className="w-full h-52 object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 p-3 pointer-events-none">
                          <span className="text-white text-[11px] font-black uppercase tracking-wider block">Annual Best Managed Project</span>
                          <span className="text-blue-400 text-[10px] font-semibold">Eagle Award</span>
                        </div>
                      </button>
                    </div>

                    <div className="space-y-3 relative z-10">
                      <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
                        <div className="flex items-start gap-3">
                          <span className="text-yellow-400 text-lg shrink-0">⭐</span>
                          <div>
                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Annual Best Performer · Excellent Performance Award · L&amp;T Infotech 2010–11</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">Architected test automation infrastructure for Motorola ODC, validating multiple mobile platforms. Reduced man-hours by 25% through innovative automation of cumbersome stability testing procedures.</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                        <div className="flex items-start gap-3">
                          <span className="text-blue-400 text-lg shrink-0">⭐</span>
                          <div>
                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Annual Best Managed Project · Eagle Award · L&amp;T Infotech 2010–11</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">Led the Development project for Motorola Mobility System Testing, achieving remarkable productivity growth.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* 5. Google Developer Profile */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.12 }}
                    className="glass-card rounded-3xl p-8 relative flex flex-col gap-8 overflow-hidden"
                  >
                    <div className="absolute -left-6 -bottom-6 pointer-events-none opacity-[0.03] z-0">
                      <img src="/logos/google.png" alt="" className="w-64 h-64 grayscale" />
                    </div>
                    <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2" />
                    <div className="flex flex-col z-10 w-full relative">
                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                          <img src="/logos/google.png" alt="Google" className="w-5 h-5 object-contain" />
                        </div>
                        Google Developer Profile
                      </h2>
                      <a href="https://developers.google.com/profile/u/bahamad" target="_blank" rel="noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:text-blue-400 font-medium mb-6 font-mono text-sm underline underline-offset-4 decoration-zinc-700 inline-block w-fit transition-colors">
                        g.dev/bahamad
                      </a>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8">
                        Recognized participant in the Google Developer Ecosystem. Attended multiple flagship events in Mountain View, earning badges for technical integrations and Platform mastery.
                      </p>
                      <h3 className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest mb-4">I/O Attendance & Badges</h3>
                      <div className="flex flex-wrap gap-2.5 mb-8">
                        <span className="px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-medium text-zinc-700 dark:text-zinc-300">I/O 2023-25 Attendee</span>
                        <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{badgeCount} Badges</span>
                      </div>
                      <div className="w-full relative group/reel">
                        {/* Navigation Arrows */}
                        <AnimatePresence>
                          {canScrollLeft && (
                            <motion.button
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              onClick={() => scrollReel('left')}
                              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-blue-600/80 transition-all shadow-xl"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </motion.button>
                          )}
                          {canScrollRight && (
                            <motion.button
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              onClick={() => scrollReel('right')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-blue-600/80 transition-all shadow-xl"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </motion.button>
                          )}
                        </AnimatePresence>

                        <div
                          ref={reelRef}
                          className="flex flex-row overflow-x-auto gap-4 snap-x snap-mandatory py-2 custom-scrollbar items-center scroll-smooth"
                        >
                          {[
                            { yr: '2025', img: '/io/1.jpg', badge: 'badge_2025.svg', href: 'io/2025/registered' },
                            { yr: '2024', img: '/io/2.jpg', badge: 'badge_2024.svg', href: 'io/2024/registered' },
                            { yr: '2023', img: '/io/3.jpg', badge: 'badge_2023.svg', href: 'io/2023/attendee' }
                          ].map((item, i) => (
                            <a key={i} href={`https://developers.google.com/profile/badges/events/${item.href}`} target="_blank" rel="noreferrer" className="relative w-40 h-52 min-w-[10rem] flex-shrink-0 rounded-xl border-2 border-zinc-800 bg-zinc-900 snap-center group shadow-lg overflow-hidden">
                              <img src={item.img} alt={`I/O ${item.yr}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent pointer-events-none" />
                              <div className="absolute top-2 left-3 px-1.5 py-0.5 rounded-md bg-black/80 text-[9px] font-black text-white uppercase tracking-widest shadow-sm">
                                {item.yr}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-12 h-12 z-20">
                                <img src={`/io/${item.badge}`} alt="" className="w-full h-full object-contain" />
                              </div>
                            </a>
                          ))}
                          <a href="https://developers.google.com/profile/badges/events/io/2022/attendee" target="_blank" rel="noreferrer" className="relative w-40 h-52 min-w-[10rem] flex-shrink-0 rounded-xl border border-white/5 bg-[#141416] snap-center group flex flex-col items-center justify-center overflow-hidden shadow-lg">
                            <div className="absolute top-2 left-3 px-1.5 py-0.5 rounded-md bg-black/80 text-[9px] font-black text-white uppercase tracking-widest shadow-sm">
                              2022
                            </div>
                            <img src="/io/badge_2022.svg" alt="" className="w-20 h-20 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}



          {/* FEATURED PROJECTS SECTION - Spotlight on Main Page */}
          {!showOnlyResume && (
            <motion.div
              id="featured-projects"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="lg:col-span-4 space-y-10 py-12"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
                <div>
                  <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter flex items-center gap-3">
                    <Layout className="w-8 h-8 text-blue-500" />
                    Featured Public Projects
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Spotlight on high-impact open source tools and IoT orchestration.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-500 uppercase tracking-widest animate-pulse">
                    Live & Public
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">

                {/* 1. CALIFORNIA WARN MONITOR */}
                <div className="glass-card rounded-[2.5rem] p-8 flex flex-col gap-8 relative overflow-hidden group border-white/5 hover:border-blue-500/20 transition-all duration-700">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <Monitor className="w-64 h-64" />
                  </div>

                  <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <Monitor className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">California Live Layoff Monitoring Dashboard</h3>
                          <div className="flex gap-3 mt-1">
                            {repos.find(r => r.name === 'warn') && (
                              <div className="flex gap-3 text-xs text-zinc-500 font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {repos.find(r => r.name === 'warn')?.stargazers_count}</span>
                                <span className="flex items-center gap-1.5"><GitFork className="w-3.5 h-3.5" /> {repos.find(r => r.name === 'warn')?.forks_count}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <a href="https://github.com/bilalahamad0/warn" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                        <Github className="w-5 h-5" />
                      </a>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-xl">
                      A best-of-class, fully automated data pipeline for the <span className="text-zinc-900 dark:text-zinc-200 font-bold">California WARN Act</span>. Engineered for surgical precision, it transforms raw government filings into live actionable intelligence—leveraging ETag caching and MD5 verification to track economic trends as they happen.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {['Python', 'GitHub Actions', 'ETag Cache', 'Data Visualization', 'MD5 Verification'].map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{tag}</span>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        onClick={() => setWarnDashboardExpanded(!warnDashboardExpanded)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${warnDashboardExpanded ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                      >
                        <Eye className="w-4 h-4" />
                        {warnDashboardExpanded ? 'Minimize Dashboard' : 'View Full Dashboard'}
                      </button>
                      <button
                        onClick={() => setShowWarnCode(!showWarnCode)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${showWarnCode ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                      >
                        <FileCode className="w-4 h-4" />
                        {showWarnCode ? 'Hide Snippet' : 'View Core Logic'}
                      </button>
                    </div>
                  </div>

                  {/* Interactive Multi-View Container */}
                  <div className={`relative w-full overflow-hidden rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl transition-all duration-700 ease-in-out ${warnDashboardExpanded ? 'h-[800px]' : (showWarnCode ? 'h-[450px]' : 'h-[500px]')}`}>
                    <AnimatePresence mode="wait">
                      {showWarnCode ? (
                        <motion.div
                          key="code"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="absolute inset-0 p-8 overflow-auto custom-scrollbar"
                        >
                          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Robust Scraper Logic / Python</span>
                            <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                            </div>
                          </div>
                          <pre className="text-xs font-mono text-zinc-300 leading-relaxed">
                            <code className="language-python">
                              {WARN_SNIPPET.split('\n').map((line, i) => (
                                <div key={i} className="flex gap-4 hover:bg-white/5 transition-colors group px-2 py-0.5">
                                  <span className="text-zinc-700 w-4 select-none group-hover:text-zinc-500">{i + 1}</span>
                                  <span dangerouslySetInnerHTML={{
                                    __html: line
                                      .replace(/def |if |return |import /g, '<span className="text-purple-400">$&</span>')
                                      .replace(/""".*"""/g, '<span className="text-zinc-500">$&</span>')
                                      .replace(/requests|meta|LOCAL_XLSX/g, '<span className="text-blue-400">$&</span>')
                                      .replace(/'.*'/g, '<span className="text-emerald-400">$&</span>')
                                  }} />
                                </div>
                              ))}
                            </code>
                          </pre>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="dashboard"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="h-full w-full"
                        >
                          <iframe
                            src="https://bilalahamad0.github.io/warn/"
                            className="w-full h-full border-none transition-all duration-700"
                            style={{
                              transform: !warnDashboardExpanded ? 'translateY(-260px)' : 'translateY(0)',
                              height: !warnDashboardExpanded ? 'calc(100% + 260px)' : '100%'
                            }}
                            title="California Live Layoff Monitoring Dashboard"
                            loading="lazy"
                          />
                          {!warnDashboardExpanded && (
                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none flex items-end justify-center pb-6">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Scroll to explore or expand for full view</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 2. ADHAN API / AUDIO CASTER */}
                <div className="glass-card rounded-[2.5rem] p-8 flex flex-col gap-8 relative overflow-hidden group border-white/5 hover:border-emerald-500/20 transition-all duration-700">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <Check className="w-64 h-64" />
                  </div>

                  <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <Smartphone className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Smart-Home IoT Audio Caster</h3>
                          <div className="flex gap-3 mt-1">
                            {repos.find(r => r.name === 'adhan-api') && (
                              <div className="flex gap-3 text-xs text-zinc-500 font-bold uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {repos.find(r => r.name === 'adhan-api')?.stargazers_count}</span>
                                <span className="flex items-center gap-1.5"><GitFork className="w-3.5 h-3.5" /> {repos.find(r => r.name === 'adhan-api')?.forks_count}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <a href="https://github.com/bilalahamad0/adhan-api" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                        <Github className="w-5 h-5" />
                      </a>
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-xl">
                      An advanced <span className="text-zinc-900 dark:text-zinc-200 font-bold">IoT Orchestration Layer</span> for automated prayer-time notifications. It integrates Raspberry Pi with Sony Android TV via ADB, managing media states and low-level system commands for a seamless home-automation experience.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {['Node.js', 'ADB', 'Android TV', 'Raspberry Pi', 'IoT', 'Shell'].map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{tag}</span>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em]">
                      <Check className="w-4 h-4" /> Production Ready Output
                    </div>
                  </div>

                  <div className="relative w-full h-[500px] overflow-hidden rounded-3xl border border-white/5 bg-black/20 group/img shadow-2xl">
                    <img
                      src="https://raw.githubusercontent.com/bilalahamad0/adhan-api/main/images/system_flow/flow_animation.webp"
                      alt="Adhan System Flow Animation"
                      className="w-full h-full object-contain bg-zinc-950 group-hover:scale-105 transition-transform duration-1000 p-4"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                      <p className="text-xs text-white/60 font-medium">System Flow: Automated orchestration showing data moving from Adhan API to end-node devices via ADB.</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* Home Page Only: Additional Repositories */}
          {!showOnlyResume && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="lg:col-span-4 glass-card rounded-3xl p-8 flex flex-col h-full"
            >
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
                <Github className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                Additional Repositories
              </h2>
              <div className="flex flex-col gap-3 flex-grow">
                {repos.filter(r => !['warn', 'adhan-api'].includes(r.name)).length > 0 ?
                  repos.filter(r => !['warn', 'adhan-api'].includes(r.name)).map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-start sm:items-center justify-between mb-2 gap-4 flex-col sm:flex-row">
                        <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
                          <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:text-blue-300 transition-colors truncate">{repo.name}</h4>
                          {repo.language && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0 whitespace-nowrap">
                              {repo.language}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3 text-xs text-zinc-500 dark:text-zinc-500 font-medium shrink-0">
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-zinc-600" /> {repo.stargazers_count}</span>
                          <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks_count}</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{repo.description || "No description provided."}</p>
                    </a>
                  )) : (
                    <div className="flex items-center justify-center p-8 text-zinc-500 dark:text-zinc-500 text-sm border border-black/5 dark:border-white/5 rounded-xl border-dashed">
                      Loading community contributions...
                    </div>
                  )}
              </div>
            </motion.div>
          )}




        </div>
      </section>
    </>
  );
}
