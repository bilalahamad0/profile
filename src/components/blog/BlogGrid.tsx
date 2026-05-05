"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Linkedin, Clock, ArrowRight, Filter, FileText, Tag } from "lucide-react";
import type { mdxPosts as MdxPostsType } from "@/app/blog/page";
import type { LinkedInPost } from "@/data/portfolio";

type MdxPost = (typeof MdxPostsType)[number];
type FilterType = "All" | "Project Story" | "Whitepaper" | "LinkedIn";

const FILTERS: FilterType[] = ["All", "Project Story", "Whitepaper", "LinkedIn"];

const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
  "Project Story": { text: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
  "Whitepaper":    { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  "LinkedIn":      { text: "text-sky-400",    bg: "bg-sky-500/10",    border: "border-sky-500/20"    },
  "Tutorial":      { text: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20"},
};

interface BlogGridProps {
  mdxPosts: MdxPost[];
  linkedInPosts: LinkedInPost[];
}

export function BlogGrid({ mdxPosts, linkedInPosts }: BlogGridProps) {
  const [active, setActive] = useState<FilterType>("All");

  const allItems = [
    ...mdxPosts.map((p) => ({ ...p, type: "mdx" as const, url: undefined as string | undefined })),
    ...linkedInPosts.map((p) => ({
      slug: p.id,
      title: p.title,
      date: p.date,
      description: p.excerpt,
      tags: p.tags,
      category: "LinkedIn" as const,
      readingTime: 2,
      featured: false,
      type: "linkedin" as const,
      url: p.url,
      thumbnail: p.thumbnail,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = active === "All" ? allItems : allItems.filter((i) => i.category === active);

  return (
    <>
      {/* Filter Bar */}
      <section
        className="filter-bar py-5 px-6 lg:px-24 sticky z-30"
        style={{ top: "var(--navbar-h, 68px)" }}
        aria-label="Filter posts"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-zinc-600 shrink-0" aria-hidden="true" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              aria-pressed={active === f}
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
      <section className="py-10 md:py-12 lg:py-16 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Use a simple CSS grid without motion.div layout — avoids expensive layout recalculations on mobile */}
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => {
                const colors = categoryColors[post.category] ?? categoryColors["Project Story"];
                const isLinkedIn = post.type === "linkedin";

                const cardInner = (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group relative rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-all duration-300 cursor-pointer h-full flex flex-col"
                  >
                    {/* Top accent line */}
                    <div className={`h-[2px] w-full ${colors.bg}`} />

                    {/* Thumbnail */}
                    {post.thumbnail && (
                      <div className="relative w-full h-44 overflow-hidden bg-black/40">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
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
                            {String(tag).replace("#", "")}
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

                if (isLinkedIn && post.url) {
                  return (
                    <a key={post.slug} href={post.url} target="_blank" rel="noreferrer" className="block h-full">
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
            </div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
