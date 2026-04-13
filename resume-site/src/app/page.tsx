// Server Component — no "use client" needed.
// All interactive children (NavbarV2, HeroPortfolio, ResumeReelClient) carry their own "use client" boundary.

import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Github, BookOpen, ArrowRight, ExternalLink, Briefcase } from "lucide-react";
import { HeroPortfolio } from "@/components/v3/HeroPortfolio";
import { ResumeReelClient } from "@/components/v3/ResumeReelClient";
import { projectsData } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Bilal Ahamad — Technical QA Lead & IoT Engineer. 18+ years at Amazon, Google, Rivian, Cruise, Samsara. Portfolio of production-grade automation, IoT, and AI systems.",
};

const ACCENT_BORDER: Record<string, string> = {
  blue:    "group-hover:border-blue-500/30",
  emerald: "group-hover:border-emerald-500/30",
  pink:    "group-hover:border-pink-500/30",
  violet:  "group-hover:border-violet-500/30",
};
const ACCENT_TEXT: Record<string, string> = {
  blue:    "text-blue-400",
  emerald: "text-emerald-400",
  pink:    "text-pink-400",
  violet:  "text-violet-400",
};

function FeaturedProjectCard({ project }: { project: typeof projectsData[0] }) {
  return (
    <div
      className={`group relative rounded-3xl border border-white/5 bg-white/[0.02] p-6 overflow-hidden hover:bg-white/[0.04] transition-all duration-500 ${ACCENT_BORDER[project.accent]}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
      />
      <div className="relative z-10">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {project.isAI && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300">AI-Built</span>
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="pulse-dot" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Live</span>
          </div>
        </div>

        <h3 className="text-base font-bold text-white mb-1">{project.name}</h3>
        <p className={`text-sm font-medium ${ACCENT_TEXT[project.accent]} mb-3`}>{project.tagline}</p>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-xs text-zinc-500">
            {project.tech.slice(0, 2).join(" · ")}
          </span>
          <div className="flex gap-3">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className={`text-xs font-bold ${ACCENT_TEXT[project.accent]} hover:opacity-80 transition-opacity flex items-center gap-1`}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Live
              </a>
            )}
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" /> GitHub
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
    <div className="flex flex-col pb-24 overflow-x-hidden dark" id="top">
      {/* Hero */}
      <HeroPortfolio />

      {/* Mobile Career Reel — lazy, SSR disabled */}
      <ResumeReelClient />

      {/* ── Featured Projects ────────────────────────────── */}
      <section className="px-6 lg:px-24 py-20" id="featured-projects" aria-labelledby="proj-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-blue-500 font-mono text-xs uppercase tracking-widest mb-2">
                <div className="h-px w-6 bg-blue-500/50" />
                Open Source
              </div>
              <h2 id="proj-heading" className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <FeaturedProjectCard key={p.id} project={p} />
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link
              href="/projects"
              className="flex items-center justify-center gap-2 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-zinc-300 hover:bg-white/10 transition-all"
            >
              All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────────── */}
      <section className="px-6 lg:px-24 py-8 border-t border-white/5" aria-label="Quick navigation">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Career Roadmap */}
            <Link
              href="/experience"
              className="group relative rounded-3xl border border-blue-500/20 bg-blue-500/[0.04] p-8 hover:border-blue-500/40 hover:bg-blue-500/[0.08] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] group-hover:bg-blue-500/20 transition-all pointer-events-none" />
              <Briefcase className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Career Roadmap</h3>
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed">18+ years across Amazon, Google, Rivian, Cruise, Samsara.</p>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:gap-2.5 transition-all">
                Full Timeline <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* AI Lab */}
            <Link
              href="/ai"
              className="group relative rounded-3xl border border-violet-500/20 bg-violet-500/[0.04] p-8 hover:border-violet-500/40 hover:bg-violet-500/[0.08] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-[60px] group-hover:bg-violet-500/20 transition-all pointer-events-none" />
              <Sparkles className="w-8 h-8 text-violet-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">AI Lab</h3>
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed">Production systems built AI-native from architecture to deployment.</p>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-violet-400 group-hover:gap-2.5 transition-all">
                Visit AI Lab <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Blog */}
            <Link
              href="/blog"
              className="group relative rounded-3xl border border-blue-500/10 bg-blue-500/[0.02] p-8 hover:border-blue-500/30 hover:bg-blue-500/[0.06] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[60px] group-hover:bg-blue-500/15 transition-all pointer-events-none" />
              <BookOpen className="w-8 h-8 text-blue-300 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Lab Notes</h3>
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed">Project stories, whitepapers, and LinkedIn thought leadership.</p>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-300 group-hover:gap-2.5 transition-all">
                Read Blog <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
