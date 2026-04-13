"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, ShieldCheck, Box, Activity, Cpu, Cloud, Settings, Layers, 
  ChevronDown, ChevronUp, Code2, Database, Wrench, Smartphone, Server, Github, GitFork, Star,
  MessageSquareQuote, Linkedin, ExternalLink, Monitor, Layout, Eye, FileCode, Check, MapPin, Sparkles
} from "lucide-react";

import Link from "next/link";


import { experienceData, skills, certs, recommendations } from "@/data/portfolio";

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

export function BentoGridV2({ showOnlyResume = false }: { showOnlyResume?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(showOnlyResume);
  const [awardLightbox, setAwardLightbox] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [showWarnCode, setShowWarnCode] = useState(false);
  const [warnDashboardExpanded, setWarnDashboardExpanded] = useState(false);
  const [smartLimit, setSmartLimit] = useState(6);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  
  // Handle smart collapse based on right column height
  useEffect(() => {
    if (typeof window === 'undefined' || !rightColumnRef.current) return;

    const calculateLimit = () => {
      if (window.innerWidth < 1024) {
        setSmartLimit(6); // Default for mobile/stacked
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

  // Update visible experiences based on smart limit
  const visibleExperiences = isExpanded ? experienceData : experienceData.slice(0, smartLimit);

  const [badgeCount, setBadgeCount] = useState<number | string>("8+");

  useEffect(() => {
    // Fetch specific repositories in order
    // Fetch specific repositories in order - explicitly fetching warn and adhan-api first
    const targetRepos = ['warn', 'adhan-api', 'profile', 'tmo'];
    Promise.all(
      targetRepos.map(repo => 
        fetch(`https://api.github.com/repos/bilalahamad0/${repo}`).then(res => res.json())
      )
    )
      .then(data => {
        const validRepos = data.filter(repo => repo && repo.id);
        setRepos(validRepos);
      })
      .catch(console.error);

    // Fetch dynamic badge count from our internal API route
    fetch('/api/badges')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') {
          setBadgeCount(data.count.toString());
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section id="experience" className={`w-full max-w-7xl mx-auto px-4 sm:px-6 ${showOnlyResume ? 'py-10' : 'pt-24 pb-10'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {showOnlyResume && (
          <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN - EXPERIENCE TIMELINE */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-3xl p-8 relative flex flex-col transition-all duration-500 h-full"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Activity className="w-32 h-32" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 flex items-center gap-2">
                <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Professional Career Timeline
              </h2>
              <div className="space-y-6 relative z-10 flex-grow">
                <AnimatePresence>
                  {visibleExperiences.map((exp, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      key={exp.company + idx} 
                      className="flex gap-4 group overflow-hidden"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-xl flex shrink-0 items-center justify-center transition-colors border overflow-hidden p-2.5
                          ${exp.faang 
                            ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
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
                          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-tight">{exp.role}</h3>
                          <span className={`font-medium tracking-tight ${exp.faang ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {exp.company}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-2 mt-1 flex items-center gap-2">
                          {exp.duration}
                          <span className="opacity-30">•</span>
                          {/* @ts-ignore */}
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.location}</span>
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
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-6 flex items-center justify-center w-full py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 transition-colors gap-2 text-sm font-medium z-20 relative"
                >
                  {isExpanded ? (
                    <><ChevronUp className="w-4 h-4" /> Collapse Timeline</>
                  ) : (
                    <><ChevronDown className="w-4 h-4" /> View Full Journey</>
                  )}
                </button>
              )}
            </motion.div>

            {/* RIGHT COLUMN - ARSENAL, CERTS, RECOMMS, AWARDS */}
            <div className="flex flex-col h-full">
              <div ref={rightColumnRef} className="flex flex-col gap-6">
                {/* Technical Arsenal */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
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

              {/* Certifications — now categorized */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col h-fit"
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
                    {["AI Coding Agents with GitHub Copilot and Cursor (2025)", "Software Testing Foundations: Integrating AI into Quality Process (2026)"].map((cert, idx) => (
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
                {/* Leadership & Management */}
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

              {/* LinkedIn Recommendations */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card rounded-3xl p-8 relative flex flex-col flex-grow"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <MessageSquareQuote className="w-24 h-24" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-2 relative z-10">
                  <MessageSquareQuote className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  LinkedIn Recommendations
                </h2>
                <a href="https://www.linkedin.com/in/bilalahamad/" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-sky-500 hover:text-sky-400 mb-5 flex items-center gap-1.5 relative z-10 transition-colors">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  View on LinkedIn
                </a>
                <div className="flex flex-col gap-4 relative z-10">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-500/5">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic mb-4 font-light">&ldquo;{rec.review}&rdquo;</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/30 to-blue-400/30 flex items-center justify-center shrink-0 border border-emerald-500/30">
                          <UserIconPlaceholder />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{rec.name}</span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400/70">{rec.title}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Awards — L&T Infotech */}
              {awardLightbox && (
                <div
                  className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
                  onClick={() => setAwardLightbox(null)}
                >
                  <img src={awardLightbox} alt="Award expanded view" className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" />
                  <button className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl leading-none" onClick={(e) => { e.stopPropagation(); setAwardLightbox(null); }}>&times;</button>
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col"
              >
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2 relative z-10">
                  <span className="text-2xl">🏆</span>
                  Awards &amp; Recognition
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 relative z-10">L&amp;T Infotech (2010–2011)</p>

                {/* Ceremony Stage Photo — correct photo, clickable */}
                <div className="relative mb-6 rounded-2xl overflow-hidden border border-white/10 cursor-zoom-in group" onClick={() => setAwardLightbox("/awards/award_stage.jpg")}>
                  <img
                    src="/awards/award_stage.jpg"
                    alt="Bilal Ahamad receiving Excellent Performance Award on stage at L&T Infotech"
                    className="w-full h-52 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className="text-white font-bold text-sm">Annual Best Performer · 2010–11</span>
                    <span className="block text-zinc-300 text-xs mt-0.5">L&amp;T Infotech · Receiving Award on Stage</span>
                  </div>
                  <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 border border-white/20 text-[9px] font-bold text-white/70 uppercase tracking-wider">Click to expand</span>
                </div>

                {/* Two Award Certificates — clickable */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="group relative rounded-2xl overflow-hidden border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-zoom-in" onClick={() => setAwardLightbox("/awards/performance_award.jpeg")}>
                    <img src="/awards/performance_award.jpeg" alt="Excellent Performance Award Certificate" className="w-full h-52 object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3">
                      <span className="text-white text-[11px] font-black uppercase tracking-wider block">Annual Best Performer</span>
                      <span className="text-emerald-400 text-[10px] font-semibold">Excellent Performance Award</span>
                    </div>
                  </div>
                  <div className="group relative rounded-2xl overflow-hidden border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-zoom-in" onClick={() => setAwardLightbox("/awards/eagle_award.jpeg")}>
                    <img src="/awards/eagle_award.jpeg" alt="Eagle Award for Best Managed Project" className="w-full h-52 object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3">
                      <span className="text-white text-[11px] font-black uppercase tracking-wider block">Annual Best Managed Project</span>
                      <span className="text-blue-400 text-[10px] font-semibold">Eagle Award</span>
                    </div>
                  </div>
                </div>

                {/* Impact detail */}
                <div className="space-y-3 relative z-10">
                  <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400 text-lg shrink-0">⭐</span>
                      <div>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Annual Best Performer · Excellent Performance Award · L&amp;T Infotech 2010–11</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">Architected test automation infrastructure for Motorola ODC, validating multiple mobile platforms. Reduced man-hours by 25% through innovative automation of cumbersome stability testing procedures. Recognised as Annual Best Performer by EVP HR Sudhir Warde.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-400 text-lg shrink-0">⭐</span>
                      <div>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Annual Best Managed Project · Eagle Award · L&amp;T Infotech 2010–11</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">Led the Development project for Motorola Mobility System Testing, achieving remarkable productivity growth and significant business benefit.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
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
                      <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">California WARN Pipeline: Live Layoff Intelligence</h3>
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
                        title="California WARN Pipeline"
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
                      <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Adhan Audio Caster</h3>
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



        {/* RESUME PAGE ONLY - GOOGLE PROFILE */}
        {showOnlyResume && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="lg:col-span-4 glass-card rounded-3xl p-8 lg:p-12 relative flex flex-col xl:flex-row gap-12 items-center justify-between overflow-hidden"
          >
            {/* Watermark Logo */}
            <div className="absolute -left-10 -bottom-10 pointer-events-none opacity-[0.03] z-0">
              <img src="/logos/google.png" alt="" className="w-96 h-96 grayscale" />
            </div>

            {/* Subtle Blue Glow specific to Google section */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
            
            {/* LEFT COLUMN: Text Info & Badge Pills */}
            <div className="flex flex-col z-10 w-full xl:w-[35%] shrink-0">
              {/* 1. Header in one line */}
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-3 whitespace-nowrap">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <img src="/logos/google.png" alt="Google" className="w-5 h-5 object-contain" />
                </div>
                Google Developer Profile
              </h2>
              
              {/* 2. Link under */}
              <a href="https://developers.google.com/profile/u/bahamad" target="_blank" rel="noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:text-blue-400 font-medium mb-6 font-mono text-sm underline underline-offset-4 decoration-zinc-700 inline-block w-fit transition-colors">
                g.dev/bahamad
              </a>
              
              {/* 3. Paragraph under */}
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8">
                A recognized participant in the Google Developer Ecosystem. Attended multiple Google I/O flagship events in Mountain View, California, earning exclusive badges for technical integrations, Codelabs completions, and Android Platform Tool mastery.
              </p>

              {/* 4. I/O Attendance & Badges segment */}
              <h3 className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest mb-4">I/O Attendance & Badges</h3>
              <div className="flex flex-wrap gap-2.5">
                {/* <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400">I/O 2026 Registered</span> */}
                <span className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300">I/O 2025</span>
                <span className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300">I/O 2024</span>
                <span className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300">I/O 2023 Attendee</span>
                <span className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300">I/O 2022 Attendee</span>
                <span className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{badgeCount} Developer Badges</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Horizontal Reel */}
            <div className="w-full xl:w-[65%] z-10 box-border overflow-hidden rounded-2xl relative">
              {/* Fade gradient overlays for edge scrolling effect */}
              <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-white dark:from-[#09090b] to-transparent pointer-events-none z-30 hidden xl:block" />
              
              <div className="flex flex-row overflow-x-auto gap-4 snap-x snap-mandatory py-4 px-1 custom-scrollbar items-center">
                
                {/* 2026 (Archived for future use) */}
                {/* 
                <a href="https://developers.google.com/profile/badges/events/io/2026/registered" target="_blank" rel="noreferrer" className="relative w-48 h-64 min-w-[12rem] flex-shrink-0 rounded-2xl border border-blue-500/20 bg-[#0c1017] snap-center group hover:bg-[#121822] transition-colors flex flex-col items-center justify-center overflow-hidden shadow-lg">
                  <div className="absolute top-4 left-4 text-[10px] font-black text-blue-600 dark:text-blue-400/80 drop-shadow-md uppercase tracking-[0.2em] group-hover:text-blue-600 dark:text-blue-400 transition-colors z-20">2026</div>
                  <img src="/io/badge_2026.svg" alt="I/O 2026 Badge" className="w-28 h-28 object-contain group-hover:scale-110 transition-transform drop-shadow-xl" />
                  <span className="absolute bottom-4 inset-x-0 text-center text-[10px] font-bold text-blue-600 dark:text-blue-400/50 uppercase tracking-widest leading-snug px-2">Yet to Attend<br/>(Registered)</span>
                </a>
                */}

                {/* 2025 (Black T-shirt) */}
                <a href="https://developers.google.com/profile/badges/events/io/2025/registered" target="_blank" rel="noreferrer" className="relative w-48 h-64 min-w-[12rem] flex-shrink-0 rounded-2xl border-4 border-[#1c1c1f] bg-zinc-100 dark:bg-zinc-900 snap-center group shadow-xl overflow-hidden">
                  <img src="/io/1.jpg" alt="I/O 2025 Photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/10 to-transparent pointer-events-none"></div>
                  <div className="absolute top-4 left-4 text-[10px] font-black text-zinc-900 dark:text-white/90 drop-shadow-md uppercase tracking-[0.2em] group-hover:text-emerald-600 dark:text-emerald-400 z-20">2025 Live</div>
                  {/* SVG Overlap */}
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 z-20 group-hover:scale-110 transition-transform drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                    <img src="/io/badge_2025.svg" alt="2025 Badge" className="w-full h-full object-contain" />
                  </div>
                </a>

                {/* 2024 (Brown Jacket) */}
                <a href="https://developers.google.com/profile/badges/events/io/2024/registered" target="_blank" rel="noreferrer" className="relative w-48 h-64 min-w-[12rem] flex-shrink-0 rounded-2xl border-4 border-[#1c1c1f] bg-zinc-100 dark:bg-zinc-900 snap-center group shadow-xl overflow-hidden">
                  <img src="/io/2.jpg" alt="I/O 2024 Photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/10 to-transparent pointer-events-none"></div>
                  <div className="absolute top-4 left-4 text-[10px] font-black text-zinc-900 dark:text-white/90 drop-shadow-md uppercase tracking-[0.2em] group-hover:text-amber-600 dark:text-amber-400 z-20">2024 Live</div>
                  {/* SVG Overlap */}
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 z-20 group-hover:scale-110 transition-transform drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                    <img src="/io/badge_2024.svg" alt="2024 Badge" className="w-full h-full object-contain" />
                  </div>
                </a>

                {/* 2023 (Google Glass) */}
                <a href="https://developers.google.com/profile/badges/events/io/2023/attendee" target="_blank" rel="noreferrer" className="relative w-48 h-64 min-w-[12rem] flex-shrink-0 rounded-2xl border-4 border-[#1c1c1f] bg-zinc-100 dark:bg-zinc-900 snap-center group shadow-xl overflow-hidden">
                  <img src="/io/3.jpg" alt="I/O 2023 Photo" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/10 to-transparent pointer-events-none"></div>
                  <div className="absolute top-4 left-4 text-[10px] font-black text-zinc-900 dark:text-white/90 drop-shadow-md uppercase tracking-[0.2em] group-hover:text-pink-600 dark:text-pink-400 z-20">2023 Live</div>
                  {/* SVG Overlap */}
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 z-20 group-hover:scale-110 transition-transform drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                    <img src="/io/badge_2023.svg" alt="2023 Badge" className="w-full h-full object-contain" />
                  </div>
                </a>

                {/* 2022 */}
                <a href="https://developers.google.com/profile/badges/events/io/2022/attendee" target="_blank" rel="noreferrer" className="relative w-48 h-64 min-w-[12rem] flex-shrink-0 rounded-2xl border border-black/5 dark:border-white/5 bg-[#141416] snap-center group hover:bg-[#1a1a1c] transition-colors flex flex-col items-center justify-center overflow-hidden shadow-lg">
                  <div className="absolute top-4 left-4 text-[10px] font-black text-zinc-500 dark:text-zinc-500 drop-shadow-md uppercase tracking-[0.2em] group-hover:text-zinc-700 dark:text-zinc-300 transition-colors z-20">2022</div>
                  <img src="/io/badge_2022.svg" alt="I/O 2022 Badge" className="w-28 h-28 object-contain group-hover:scale-110 transition-transform drop-shadow-xl opacity-90 group-hover:opacity-100" />
                </a>

              </div>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}

function UserIconPlaceholder() {
  return (
    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
  );
}
