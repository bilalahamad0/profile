"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MoveRight, Star, GitFork, Sparkles, Github, BookOpen, ArrowRight, Terminal, ExternalLink } from "lucide-react";
import { NavbarV2 } from "@/components/v2/NavbarV2";
import { HeroPortfolio } from "@/components/v3/HeroPortfolio";
import { projectsData, skills } from "@/data/portfolio";

type GitHubStats = {
  publicRepos: number;
  followers: number;
  totalStars: number;
  totalForks: number;
};

type RepoData = {
  id: string;
  stars: number;
  forks: number;
};

function GitHubStatsStrip({ stats }: { stats: GitHubStats | null }) {
  const items = [
    { label: "Public Repos", value: stats?.publicRepos ?? "—" },
    { label: "GitHub Stars", value: stats?.totalStars ?? "—" },
    { label: "Followers", value: stats?.followers ?? "—" },
    { label: "Years Active", value: "18+" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-6 md:gap-12">
      {items.map(({ label, value }) => (
        <div key={label}>
          <span className="block text-2xl md:text-3xl font-black text-white tabular-nums">{value}</span>
          <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-0.5">{label}</span>
        </div>
      ))}
      <a
        href="https://github.com/bilalahamad0"
        target="_blank"
        rel="noreferrer"
        className="ml-auto flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
      >
        <Github className="w-4 h-4" />
        @bilalahamad0
      </a>
    </div>
  );
}

function FeaturedProjectCard({ project, repoData }: { project: typeof projectsData[0]; repoData: RepoData | null }) {
  const accentBg: Record<string, string> = {
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
    <div className={`group relative rounded-3xl border border-white/5 bg-white/[0.02] p-6 overflow-hidden hover:bg-white/[0.04] transition-all duration-500 ${accentBg[project.accent]}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

      <div className="relative z-10">
        {project.isAI && (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span className="text-[9px] font-black uppercase tracking-wider text-purple-300">AI-Built</span>
          </div>
        )}
        <h3 className="text-base font-black text-white/90 mb-1">{project.name}</h3>
        <p className={`text-xs ${accentText[project.accent]} mb-3`}>{project.tagline}</p>
        <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-3 text-xs text-zinc-600">
            {repoData && (
              <>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" />{repoData.stars}</span>
                <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{repoData.forks}</span>
              </>
            )}
          </div>
          <div className="flex gap-3">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className={`text-[10px] font-bold ${accentText[project.accent]} hover:opacity-80 transition-opacity flex items-center gap-1`}>
                <ExternalLink className="w-3 h-3" /> Live
              </a>
            )}
            <a href={project.repo} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
              <Github className="w-3 h-3" /> Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [ghStats, setGhStats] = useState<GitHubStats | null>(null);
  const [repos, setRepos] = useState<Record<string, RepoData>>({});

  useEffect(() => {
    // Fetch user stats
    fetch("https://api.github.com/users/bilalahamad0")
      .then((r) => r.json())
      .then(async (user) => {
        // Fetch stars across known repos
        const targets = ["warn", "adhan-api", "tmo", "profile"];
        const repoData = await Promise.all(
          targets.map((r) =>
            fetch(`https://api.github.com/repos/bilalahamad0/${r}`)
              .then((res) => res.json())
              .catch(() => null)
          )
        );
        const totalStars = repoData.reduce((acc, r) => acc + (r?.stargazers_count ?? 0), 0);
        const totalForks = repoData.reduce((acc, r) => acc + (r?.forks_count ?? 0), 0);

        const map: Record<string, RepoData> = {};
        const keys = ["warn", "adhan-api", "tmo", "profile"];
        const idMap: Record<string, string> = { "warn": "warn", "adhan-api": "adhan", "tmo": "tmo", "profile": "profile" };
        keys.forEach((name, i) => {
          if (repoData[i]?.id) {
            map[idMap[name]] = { id: idMap[name], stars: repoData[i].stargazers_count, forks: repoData[i].forks_count };
          }
        });
        setRepos(map);
        setGhStats({ publicRepos: user.public_repos, followers: user.followers, totalStars, totalForks });
      })
      .catch(() => {});
  }, []);

  const featuredProjects = projectsData.slice(0, 3);

  return (
    <div className="flex flex-col gap-0 pb-24 dark md:overflow-x-hidden" id="top">
      <NavbarV2 />

      {/* Hero — unchanged, excellent as-is */}
      <HeroPortfolio />

      {/* GitHub Stats Strip */}
      <section className="px-6 lg:px-24 py-10 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <GitHubStatsStrip stats={ghStats} />
        </div>
      </section>

      {/* Featured Projects — compact cards, link to /projects */}
      <section className="px-6 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-blue-500 font-mono text-xs uppercase tracking-widest mb-2">
                <div className="h-px w-6 bg-blue-500/50" />
                Featured Work
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                Production Systems
              </h2>
            </div>
            <Link href="/projects" className="hidden md:flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-white transition-colors">
              All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <FeaturedProjectCard key={p.id} project={p} repoData={repos[p.id] ?? null} />
            ))}
          </div>

          <div className="mt-8 flex gap-4 md:hidden">
            <Link href="/projects" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-zinc-300 hover:bg-white/10 transition-all">
              All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Reel */}
      <section className="px-6 lg:px-24 py-16 border-y border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-zinc-600 font-mono text-xs uppercase tracking-widest mb-8">
            <Terminal className="w-4 h-4" />
            Technical Arsenal
          </div>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm font-medium text-zinc-400 hover:bg-white/[0.07] hover:text-white hover:border-white/10 transition-all flex items-center gap-2 cursor-default group"
              >
                <skill.icon className={`w-4 h-4 ${skill.color} group-hover:scale-110 transition-transform`} />
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="px-6 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/ai" className="group relative rounded-3xl border border-purple-500/20 bg-purple-500/[0.04] p-8 hover:border-purple-500/40 hover:bg-purple-500/[0.08] transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px] group-hover:bg-purple-500/20 transition-all pointer-events-none" />
              <Sparkles className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-black text-white mb-2">AI Lab</h3>
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed">Explore AI-native systems built at production scale.</p>
              <span className="flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:gap-2.5 transition-all">
                Visit AI Lab <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link href="/blog" className="group relative rounded-3xl border border-indigo-500/20 bg-indigo-500/[0.04] p-8 hover:border-indigo-500/40 hover:bg-indigo-500/[0.08] transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
              <BookOpen className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-lg font-black text-white mb-2">Lab Notes</h3>
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed">Project stories, whitepapers, and LinkedIn posts.</p>
              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:gap-2.5 transition-all">
                Read Blog <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link href="/experience" className="group relative rounded-3xl border border-blue-500/20 bg-blue-500/[0.04] p-8 hover:border-blue-500/40 hover:bg-blue-500/[0.08] transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] group-hover:bg-blue-500/20 transition-all pointer-events-none" />
              <Terminal className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-black text-white mb-2">Career Roadmap</h3>
              <p className="text-sm text-zinc-400 mb-5 leading-relaxed">18+ years across Amazon, Google, Rivian, Cruise, Samsara.</p>
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:gap-2.5 transition-all">
                Full Timeline <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
