"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Github, BookOpen, ArrowRight, Terminal, ExternalLink, Trophy, Briefcase } from "lucide-react";
import { NavbarV2 } from "@/components/v2/NavbarV2";
import { HeroPortfolio } from "@/components/v3/HeroPortfolio";
import { projectsData, skills } from "@/data/portfolio";

// Lazy-load the ResumeReel — heavy Framer Motion + IntersectionObserver component,
// excluded from SSR and initial bundle so the hero renders instantly on mobile.
const ResumeReel = dynamic(
  () => import("@/components/v3/ResumeReel").then((m) => ({ default: m.ResumeReel })),
  { ssr: false, loading: () => <div className="md:hidden h-20" /> }
);


function FeaturedProjectCard({ project }: { project: typeof projectsData[0] }) {
  const accentBorder: Record<string, string> = {
    blue: "group-hover:border-blue-500/30",
    emerald: "group-hover:border-emerald-500/30",
    pink: "group-hover:border-pink-500/30",
    violet: "group-hover:border-violet-500/30",
  };
  const accentText: Record<string, string> = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    pink: "text-pink-400",
    violet: "text-violet-400",
  };

  return (
    <div className={`group relative rounded-3xl border border-white/5 bg-white/[0.02] p-6 overflow-hidden hover:bg-white/[0.04] transition-all duration-500 ${accentBorder[project.accent]}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          {project.isAI && (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-300">AI-Built</span>
            </div>
          )}
          {/* Live tag on ALL projects */}
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-300">Live</span>
          </div>
        </div>

        <h3 className="text-base font-black text-white/90 mb-1">{project.name}</h3>
        <p className={`text-xs ${accentText[project.accent]} mb-3`}>{project.tagline}</p>
        <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <span className="flex items-center gap-1 text-[10px] text-zinc-500">
              {project.tech.slice(0, 2).join(" · ")}
            </span>
          </div>
          <div className="flex gap-3">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className={`text-[10px] font-bold ${accentText[project.accent]} hover:opacity-80 transition-opacity flex items-center gap-1`}>
                <ExternalLink className="w-3 h-3" /> Live
              </a>
            )}
            <a href={project.repo} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
              <Github className="w-3 h-3" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const featuredProjects = projectsData.slice(0, 3);

  return (
    <div className="flex flex-col gap-0 pb-24 dark md:overflow-x-hidden" id="top">
      <NavbarV2 />

      {/* Hero — keep as-is */}
      <HeroPortfolio />

      {/* Mobile-Only Career Reel — shown only on phones, Instagram-style swipeable story */}
      <ResumeReel />

      {/* Featured Projects — compact cards */}

      <section className="px-6 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-blue-500 font-mono text-xs uppercase tracking-widest mb-2">
                <div className="h-px w-6 bg-blue-500/50" />
                Open Source
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                Featured Projects
              </h2>
            </div>
            <Link href="/projects" className="hidden md:flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-white transition-colors">
              All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <FeaturedProjectCard key={p.id} project={p} />
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link href="/projects" className="flex items-center justify-center gap-2 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-zinc-300 hover:bg-white/10 transition-all">
              All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Strip — Career → AI Lab → Blog (matching nav order and recruiter priority) */}
      <section className="px-6 lg:px-24 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* 1. Career Roadmap — first, highest recruiter priority */}
            <Link href="/experience" className="group relative rounded-3xl border border-blue-500/20 bg-blue-500/[0.04] p-8 hover:border-blue-500/40 hover:bg-blue-500/[0.08] transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] group-hover:bg-blue-500/20 transition-all pointer-events-none" />
              <Briefcase className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-black text-white mb-2">Career Roadmap</h3>
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed">18+ years across Amazon, Google, Rivian, Cruise, Samsara.</p>
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:gap-2.5 transition-all">
                Full Timeline <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* 2. AI Lab */}
            <Link href="/ai" className="group relative rounded-3xl border border-purple-500/20 bg-purple-500/[0.04] p-8 hover:border-purple-500/40 hover:bg-purple-500/[0.08] transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px] group-hover:bg-purple-500/20 transition-all pointer-events-none" />
              <Sparkles className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-black text-white mb-2">AI Lab</h3>
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed">Production systems built AI-native from architecture to deployment.</p>
              <span className="flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:gap-2.5 transition-all">
                Visit AI Lab <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* 3. Blog */}
            <Link href="/blog" className="group relative rounded-3xl border border-indigo-500/20 bg-indigo-500/[0.04] p-8 hover:border-indigo-500/40 hover:bg-indigo-500/[0.08] transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
              <BookOpen className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-lg font-black text-white mb-2">Lab Notes</h3>
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed">Project stories, whitepapers, and LinkedIn thought leadership.</p>
              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:gap-2.5 transition-all">
                Read Blog <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}
