"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, Linkedin, Sparkles, Clock, ArrowRight, Filter, FileText, Tag } from "lucide-react";
import { NavbarV2 } from "@/components/v2/NavbarV2";
import { linkedInPosts } from "@/data/portfolio";
import { getAllPosts } from "@/lib/blog";

const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
  "Project Story": { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  "Whitepaper": { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  "LinkedIn": { text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  "Tutorial": { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

type FilterType = "All" | "Project Story" | "Whitepaper" | "LinkedIn";

const FILTERS: FilterType[] = ["All", "Project Story", "Whitepaper", "LinkedIn"];

export default function BlogPage() {
  // MDX posts are fetched server-side; for client rendering we use the static import
  // We import the data statically here — SSR would be cleaner but this works for client component
  const [active, setActive] = useState<FilterType>("All");

  // Static MDX posts metadata (populated at server side ideally)
  // For client component, we embed the post metadata directly
  const mdxPosts = [
    {
      slug: "ai-driven-development",
      title: "AI-Driven Development: Compressing 3 Weeks into 4 Days",
      date: "August 26, 2025",
      description: "A technical whitepaper on AI-native software engineering: methodology, toolchain, metrics, and a framework for measuring engineering velocity gains.",
      tags: ["AI", "Software Engineering", "Productivity"],
      category: "Whitepaper" as const,
      readingTime: 8,
      featured: true,
    },
    {
      slug: "california-warn-story",
      title: "Building California WARN Pipeline: Live Layoff Intelligence from Scratch",
      date: "August 20, 2025",
      description: "How I built a fully automated data pipeline that transforms raw California WARN Act filings into live, actionable layoff intelligence — running twice daily with zero human intervention.",
      tags: ["Python", "GitHub Actions", "Data Engineering"],
      category: "Project Story" as const,
      readingTime: 6,
      featured: false,
    },
    {
      slug: "adhan-caster-story",
      title: "Adhan Audio Caster: Engineering IoT Automation with AI",
      date: "August 12, 2025",
      description: "A deep dive into building a prayer-time IoT orchestration system with Raspberry Pi, ADB, and Sony Android TV — compressed from 3 weeks to 4 days using AI pair programming.",
      tags: ["IoT", "Raspberry Pi", "ADB", "Node.js"],
      category: "Project Story" as const,
      readingTime: 5,
      featured: false,
    },
  ];

  // Merge MDX posts and LinkedIn post cards
  const allItems = [
    ...mdxPosts.map((p) => ({ ...p, type: "mdx" as const, thumbnail: undefined as string | undefined })),
    ...linkedInPosts.map((p) => ({
      slug: p.id,
      title: p.title,
      date: p.date,
      description: p.excerpt,
      tags: p.tags,
      category: "LinkedIn" as const,
      readingTime: 2,
      featured: false,
      url: p.url,
      type: "linkedin" as const,
      thumbnail: p.thumbnail,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = active === "All" ? allItems : allItems.filter((i) => i.category === active);
  const featured = mdxPosts.find((p) => p.featured);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <NavbarV2 />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 lg:px-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-8">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-indigo-500/50" />
              <span className="text-indigo-400 font-mono text-xs uppercase tracking-widest">Writing & Insights</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Lab Notes</span>
            </h1>
            <p className="text-xl text-zinc-400 font-light max-w-2xl">
              Project stories, technical whitepapers, and thoughts on AI-native engineering. Published posts from LinkedIn and original deep-dives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post Hero */}
      {featured && (
        <section className="px-6 lg:px-24 py-16 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Featured Post</p>
            <Link href={`/blog/${featured.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group relative rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 via-white/[0.02] to-transparent overflow-hidden p-10 md:p-14 hover:border-violet-500/40 transition-all duration-500 cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-violet-500/10 transition-all" />
                <div className="relative z-10 max-w-3xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                      <FileText className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-violet-300">Whitepaper</span>
                    </div>
                    <span className="text-xs text-zinc-500">{featured.date}</span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readingTime} min read
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4 group-hover:text-violet-200 transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-8">{featured.description}</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-violet-400 group-hover:gap-3 transition-all">
                    Read Whitepaper <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>
      )}

      {/* Filter Tabs */}
      <section className="py-6 px-6 lg:px-24 border-b border-white/5 sticky top-0 z-30 bg-[#09090b]/90 backdrop-blur-xl transform translate-z-0">
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-zinc-600 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                active === f
                  ? "bg-white text-black"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {f}
              {f === "LinkedIn" && <span className="ml-1.5 text-sky-400">↗</span>}
            </button>
          ))}
          <span className="ml-auto text-xs text-zinc-600">{filtered.length} posts</span>
        </div>
      </section>

      {/* Post Grid */}
      <section className="py-16 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((post) => {
                const colors = categoryColors[post.category] ?? categoryColors["Project Story"];
                const isLinkedIn = post.type === "linkedin";

                const cardInner = (
                  <motion.div
                    key={post.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group relative rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-all duration-300 cursor-pointer h-full flex flex-col"
                  >
                    {/* Top accent line */}
                    <div className={`h-[2px] w-full ${colors.bg}`} />

                    {/* Thumbnail — shown for LinkedIn posts and when available */}
                    {post.thumbnail && (
                      <div className="relative w-full h-44 overflow-hidden bg-black/40">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]/70" />
                        {isLinkedIn && (
                          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-sky-600/80 border border-sky-500/40 text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1">
                            <Linkedin className="w-2.5 h-2.5" />
                            LinkedIn
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-grow">
                      {/* Category + Date */}

                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors.bg} border ${colors.border} text-[10px] font-black uppercase tracking-wider ${colors.text}`}>
                          {isLinkedIn ? <Linkedin className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          {post.category}
                        </span>
                        {isLinkedIn && (
                          <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">↗ LinkedIn</span>
                        )}
                        <span className="ml-auto text-[10px] text-zinc-600">{post.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-black text-white/90 leading-tight mb-3 group-hover:text-white transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-zinc-500 leading-relaxed mb-4 flex-grow line-clamp-3">
                        {post.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="flex items-center gap-1 text-[10px] font-semibold text-zinc-600 px-2 py-0.5 rounded-md bg-white/[0.04]">
                            <Tag className="w-2.5 h-2.5" />
                            {tag.replace("#", "")}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readingTime} min read
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-bold ${colors.text} group-hover:gap-2 transition-all`}>
                          {isLinkedIn ? "View on LinkedIn" : "Read Post"}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );

                if (isLinkedIn && "url" in post) {
                  return (
                    <a key={post.slug} href={(post as any).url} target="_blank" rel="noreferrer" className="block h-full">
                      {cardInner}
                    </a>
                  );
                }
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
                    {cardInner}
                  </Link>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
