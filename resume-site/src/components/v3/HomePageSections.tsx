"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Briefcase, Sparkles, BookOpen, Terminal,
  Download, MapPin, Linkedin, Github, Mail,
  Cpu, Building2, Award, Rocket, Clock, TrendingUp,
  FileText,
} from "lucide-react";
import { experienceData, projectsData, linkedInPosts } from "@/data/portfolio";

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
   1. EXPERIENCE TIMELINE PREVIEW
   ================================================================ */
const featuredRoles = experienceData.slice(0, 4);

export function ExperiencePreview() {
  return (
    <section className="px-6 lg:px-24 py-24 relative overflow-hidden" aria-labelledby="exp-preview-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <SectionLabel color="blue">Career Journey</SectionLabel>
            <h2 id="exp-preview-heading" className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
              Where I&apos;ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Built &amp; Led</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mb-14 leading-relaxed">
              From firmware labs to autonomous vehicle systems — a track record of engineering quality at scale across the industry&apos;s most demanding environments.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-violet-500/30 to-transparent" aria-hidden="true" />

            <div className="space-y-8">
              {featuredRoles.map((role, idx) => (
                <motion.div
                  key={role.company}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative pl-14 md:pl-16 group"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 md:left-3 top-2 w-[18px] h-[18px] md:w-[22px] md:h-[22px] rounded-full border-2 border-blue-500/50 bg-[#09090b] flex items-center justify-center group-hover:border-blue-400 transition-colors">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-500/70 group-hover:bg-blue-400 transition-colors" />
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 md:p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 group">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Company logo */}
                      <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center overflow-hidden">
                        <Image
                          src={role.file}
                          alt={role.company}
                          width={32}
                          height={32}
                          className={`w-7 h-7 object-contain ${role.invertLogo ? "invert brightness-[1.8]" : ""} opacity-60 group-hover:opacity-100 transition-opacity`}
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 mb-1.5">
                          <h3 className="text-base font-bold text-white truncate">{role.role.replace(/\n/g, " ")}</h3>
                          <span className="text-xs font-mono text-zinc-500 shrink-0">{role.duration}</span>
                        </div>
                        <p className="text-sm text-blue-400/80 font-medium mb-2">{role.company}</p>
                        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{role.desc}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-12 flex justify-center">
            <Link
              href="/experience"
              className="group flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/[0.05] border border-white/10 text-white font-bold hover:bg-white/[0.1] hover:border-white/20 transition-all"
            >
              <Briefcase className="w-4 h-4 text-blue-400" />
              View Full Roadmap
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   2. IMPACT STATS (animated counters)
   ================================================================ */
function AnimatedCounter({ target, suffix = "", prefix = "", decimals = 0 }: { target: number; suffix?: string; prefix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const frames = 60;
    const increment = target / frames;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / frames);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.round(count)}{suffix}
    </span>
  );
}

const impactStats = [
  { icon: Clock, label: "Years Experience", value: 18, suffix: "+", prefix: "", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { icon: Building2, label: "Companies", value: 10, suffix: "", prefix: "", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { icon: Award, label: "Certifications", value: 9, suffix: "", prefix: "", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { icon: TrendingUp, label: "Cost Savings", value: 6.4, suffix: "M+", prefix: "$", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { icon: Rocket, label: "AI-Built Systems", value: 4, suffix: "", prefix: "", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { icon: Cpu, label: "FAANG / Unicorn", value: 6, suffix: "", prefix: "", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
];

export function ImpactStats() {
  return (
    <section className="px-6 lg:px-24 py-24 relative" aria-labelledby="impact-heading">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-[100%] bg-blue-600/[0.06] blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
              <div className="h-px w-6 bg-emerald-500/50" />
              Track Record
              <div className="h-px w-6 bg-emerald-500/50" />
            </div>
            <h2 id="impact-heading" className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
              By The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Numbers</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
              Quantifiable impact across 18+ years of engineering quality at scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {impactStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`group relative flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-500 overflow-hidden`}
                >
                  <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${stat.bg} pointer-events-none`} />
                  <div className={`relative z-10 p-2.5 rounded-xl ${stat.bg} border ${stat.border} mb-4`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className={`relative z-10 text-3xl md:text-4xl font-black ${stat.color} mb-1`}>
                    <AnimatedCounter target={typeof stat.value === "number" ? stat.value : 0} suffix={stat.suffix} prefix={stat.prefix} decimals={stat.value % 1 !== 0 ? 1 : 0} />
                  </p>
                  <p className="relative z-10 text-xs text-zinc-500 font-semibold uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   3. AI LAB PREVIEW
   ================================================================ */
const aiProjects = projectsData.filter((p) => p.isAI);
const totalTokens = "405k+";
const avgContribution = Math.round(aiProjects.reduce((s, p) => s + p.aiContribution, 0) / aiProjects.length);

const aiStats = [
  { label: "Avg AI Contribution", value: `${avgContribution}%`, icon: TrendingUp },
  { label: "Total Tokens", value: totalTokens, icon: Cpu },
  { label: "AI-Built Systems", value: String(aiProjects.length), icon: Rocket },
];

export function AILabPreview() {
  return (
    <section className="px-6 lg:px-24 py-24 relative overflow-hidden" aria-labelledby="ai-preview-heading">
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
            <h2 id="ai-preview-heading" className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
              Where AI Meets{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">Engineering</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mb-12 leading-relaxed">
              Every project in the AI Lab was built from architecture to deployment using AI pair programming — compressing weeks of work into days.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {aiStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-violet-500/[0.04] border border-violet-500/[0.12] hover:border-violet-500/30 transition-all duration-500"
                >
                  <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Philosophy quote */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mb-12">
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

          {/* Featured AI project mini-cards */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {aiProjects.slice(0, 2).map((project) => (
              <div
                key={project.id}
                className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 pointer-events-none`} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-violet-300">
                      {project.aiContribution}% AI-Contributed
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        style={{ width: `${project.aiContribution}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-violet-300 shrink-0">{project.aiContribution}%</span>
                  </div>
                </div>
              </div>
            ))}
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
    <section className="px-6 lg:px-24 py-24 relative overflow-hidden" aria-labelledby="blog-preview-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <SectionLabel color="blue">Writing &amp; Insights</SectionLabel>
            <h2 id="blog-preview-heading" className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
              Lab{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Notes</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mb-14 leading-relaxed">
              Project deep-dives, whitepapers, and thought leadership on engineering quality and AI-native development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Featured post (larger) */}
            {featured && (
              <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="lg:col-span-3">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group relative block rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-950/30 to-indigo-950/20 p-8 hover:border-violet-500/30 transition-all duration-500 h-full overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/25 text-[10px] font-bold uppercase tracking-widest text-violet-300">
                        {featured.category}
                      </span>
                      <span className="text-xs text-zinc-500">{featured.readingTime} min read</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-violet-200 transition-colors leading-tight">
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
                  href={`/blog/${post.slug}`}
                  className="group flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-500"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">{post.category}</span>
                    <span className="text-[10px] text-zinc-600 ml-auto">{post.readingTime} min</span>
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
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">LinkedIn</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{post.excerpt}</p>
                </a>
              ))}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-10 flex justify-center">
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
    <section className="px-6 lg:px-24 py-24 relative overflow-hidden" aria-label="Contact and availability">
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

          <motion.h2 variants={fadeUp} transition={{ duration: 0.5 }} className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
            Let&apos;s Build Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400">Together</span>
          </motion.h2>

          <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="text-lg text-zinc-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            Open to senior engineering and QA leadership roles. Interested in firmware validation, test architecture, and AI-augmented quality systems.
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex items-center justify-center gap-2 text-sm text-zinc-500 mb-10">
            <MapPin className="w-4 h-4" />
            <span>Sunnyvale, CA · Open to Remote &amp; Bay Area</span>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/contact"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-zinc-900 font-bold hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
            >
              Get in Touch
              <Terminal className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="/Bilal_Ahamad_Resume.pdf"
              download
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.05] border border-white/10 text-white font-bold hover:bg-white/[0.1] hover:border-white/20 transition-all"
            >
              <Download className="w-4 h-4 text-blue-400" />
              Download Resume
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex items-center justify-center gap-4">
            {[
              { href: "https://www.linkedin.com/in/bilalahamad/", icon: Linkedin, label: "LinkedIn" },
              { href: "https://github.com/bilalahamad0", icon: Github, label: "GitHub" },
              { href: "mailto:bilal.ahamad@gmail.com", icon: Mail, label: "Email" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={label === "Email" ? undefined : "_blank"}
                rel={label === "Email" ? undefined : "noreferrer"}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all text-sm text-zinc-400 hover:text-white"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
