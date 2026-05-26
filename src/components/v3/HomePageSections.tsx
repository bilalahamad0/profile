"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Sparkles, BookOpen, Terminal,
  FileText, Linkedin,
} from "lucide-react";
import { linkedInPosts } from "@/data/portfolio";

/* ================================================================
   Shared animation variants
   ================================================================ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ================================================================
   Section label (reused across every section)
   ================================================================ */
function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  const bar: Record<string, string> = {
    blue: "bg-blue-500/50",
    violet: "bg-violet-500/50",
    emerald: "bg-emerald-500/50",
    amber: "bg-amber-500/50",
  };
  const text: Record<string, string> = {
    blue: "text-blue-500",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  };
  return (
    <div className={`flex items-center gap-2 ${text[color] ?? "text-blue-500"} font-mono text-xs uppercase tracking-widest mb-3`}>
      <div className={`h-px w-6 ${bar[color] ?? "bg-blue-500/50"}`} />
      {children}
    </div>
  );
}

/* ================================================================
   AI LAB PREVIEW
   ================================================================ */
export function AILabPreview() {
  return (
    <section className="px-6 lg:px-24 py-12 md:py-20 lg:py-24 relative overflow-hidden" aria-labelledby="ai-preview-heading">
      {/* Neural-style background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-15%] left-[25%] w-[500px] h-[500px] rounded-full bg-violet-600/[0.07] blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[400px] h-[400px] rounded-full bg-indigo-600/[0.05] blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <SectionLabel color="violet">AI-Native Engineering</SectionLabel>
            <h2 id="ai-preview-heading" className="sr-only">AI-Native Engineering</h2>
          </motion.div>

          {/* Philosophy quote */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mb-6 md:mb-8 lg:mb-10">
            <blockquote className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-500/15">
              <div className="absolute top-4 left-6 text-violet-500/20 text-6xl font-serif leading-none" aria-hidden="true">&ldquo;</div>
              <p className="relative z-10 text-lg md:text-xl text-zinc-200 font-light leading-relaxed italic pl-8">
                AI pair programming reduces development cycles by 65–90% for experienced engineers, with quality metrics that meet or exceed manual baselines.
              </p>
              <cite className="block mt-4 text-sm text-violet-400 not-italic font-semibold pl-8">
                — From the AI-Driven Development Whitepaper
              </cite>
            </blockquote>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex justify-center">
            <Link
              href="/ai"
              className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-white font-bold hover:bg-violet-500/20 hover:border-violet-500/40 transition-all"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              Explore AI Lab
              <ArrowRight className="w-4 h-4 text-violet-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   4. BLOG / THOUGHT LEADERSHIP PREVIEW
   ================================================================ */
export type BlogPostPreview = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  readingTime: number;
  featured?: boolean;
};

export function BlogPreview({ posts }: { posts: BlogPostPreview[] }) {
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const recent = posts.filter((p) => p.slug !== featured?.slug).slice(0, 2);
  const latestLinkedIn = linkedInPosts.slice(0, 2);
  const hasRecentPosts = recent.length > 0;

  return (
    <section className="px-6 lg:px-24 py-12 md:py-20 lg:py-24 relative overflow-hidden" aria-labelledby="blog-preview-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <SectionLabel color="blue">Writing &amp; Insights</SectionLabel>
            <h2 id="blog-preview-heading" className="t-h2 text-white mb-4">
              Lab{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Notes</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mb-8 md:mb-12 lg:mb-14 leading-relaxed">
              Project deep-dives, whitepapers, and thought leadership on engineering quality and AI-native development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Featured post (larger) */}
            {featured && (
              <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="lg:col-span-3">
                <Link
                  href={`/blog/${encodeURIComponent(featured.slug)}`}
                  className="group relative block rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-950/30 to-indigo-950/20 p-8 hover:border-violet-500/30 transition-all duration-500 h-full overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/25 t-label font-bold uppercase tracking-widest text-violet-300">
                        {featured.category}
                      </span>
                      <span className="text-xs text-zinc-500">{featured.readingTime} min read</span>
                    </div>
                    <h3 className="t-h3 text-white mb-3 group-hover:text-violet-200 transition-colors">
                      {featured.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-3">{featured.description}</p>
                    <span className="flex items-center gap-2 text-sm font-semibold text-violet-400 group-hover:gap-3 transition-all">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Secondary posts */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="lg:col-span-2 flex flex-col gap-4">
              {hasRecentPosts && recent.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${encodeURIComponent(post.slug)}`}
                  className="group flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-500"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span className="t-label font-bold uppercase tracking-widest text-blue-400">{post.category}</span>
                    <span className="t-label text-zinc-600 ml-auto">{post.readingTime} min</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{post.description}</p>
                </Link>
              ))}
              {!hasRecentPosts && latestLinkedIn.map((post) => (
                <a
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-500"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                    <span className="t-label font-bold uppercase tracking-widest text-blue-400">LinkedIn</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{post.excerpt}</p>
                </a>
              ))}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-6 md:mt-8 lg:mt-10 flex justify-center">
            <Link
              href="/blog"
              className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/[0.05] border border-white/10 text-white font-bold hover:bg-white/[0.1] hover:border-white/20 transition-all"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              Read All Posts
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   5. CONTACT / AVAILABILITY CTA
   ================================================================ */
export function ContactCTA() {
  return (
    <section className="px-6 lg:px-24 py-12 md:py-20 lg:py-24 relative overflow-hidden" aria-label="Contact and availability">
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-[100%] bg-blue-600/[0.08] blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-[100%] bg-violet-600/[0.05] blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center"
        >
          {/* Availability badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20">
              <span className="pulse-dot" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Available for Opportunities</span>
            </div>
          </motion.div>

          <motion.h2 variants={fadeUp} transition={{ duration: 0.5 }} className="t-h2 text-white mb-6">
            Let&apos;s Build Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400">Together</span>
          </motion.h2>

          <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="t-lead text-zinc-400 max-w-2xl mx-auto mb-8">
            Open to senior engineering and QA leadership roles. Interested in firmware validation, test architecture, and AI-augmented quality systems.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 md:mb-10 lg:mb-12">
            <Link
              href="/contact"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-zinc-900 font-bold hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
            >
              Get in Touch
              <Terminal className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
