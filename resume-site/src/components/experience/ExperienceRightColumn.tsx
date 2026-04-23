import Image from "next/image";
import Link from "next/link";
import { GoogleDevCarousel } from "@/components/experience/GoogleDevCarousel";
import { AnimatedSection } from "@/components/experience/AnimatedSection";
import { AwardsGallery } from "@/components/experience/AwardsGallery";
import { BadgeCount } from "@/components/experience/BadgeCount";
import {
  Terminal, ShieldCheck, Box, Layers, Settings, GraduationCap, Sparkles, ExternalLink,
} from "lucide-react";
import { skills } from "@/data/portfolio";

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

const AI_CERTS = [
  "Software Testing Foundations: Integrating AI into Quality Process (2026)",
  "AI Coding Agents with GitHub Copilot and Cursor (2025)",
  "AI for App building (2026)",
];

const TESTING_CERTS = ["ISTQB Certified Tester Foundation Level (CTFL)"];

const LEADERSHIP_CERTS = [
  "How to Master Your Executive Presence (2023)",
  "Project Management Foundations (2023)",
  "Scrum: Advanced (2021)",
];

export function ExperienceRightColumn() {
  return (
    <div className="flex flex-col gap-6">
      {/* Core Focus */}
      <AnimatedSection delay={0}>
        <section
          aria-label="Core Focus Areas"
          className="glass-card rounded-3xl p-8 flex flex-col"
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
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
        </section>
      </AnimatedSection>

      {/* Technical Arsenal */}
      <AnimatedSection delay={0.05}>
        <section
          aria-label="Technical Arsenal"
          className="glass-card rounded-3xl p-8 flex flex-col"
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            Technical Arsenal
          </h2>
          <ul className="flex flex-wrap gap-2.5 list-none">
            {skills.map((skill) => (
              <li
                key={skill.name}
                className="group px-3.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:border-white/20 text-sm font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-2 cursor-default transition-all"
              >
                <skill.icon
                  className={`w-4 h-4 ${skill.color} group-hover:scale-110 transition-transform`}
                  aria-hidden="true"
                />
                {skill.name}
              </li>
            ))}
          </ul>
        </section>
      </AnimatedSection>

      {/* Education */}
      <AnimatedSection delay={0.1}>
        <section
          aria-label="Education"
          className="glass-card rounded-3xl p-8 flex flex-col"
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            Education
          </h2>
          <div className="space-y-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Bachelor of Technology
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Electronics and Telecommunications Engineering
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Biju Patnaik University of Technology
            </p>
            <p className="text-xs font-medium uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              2004 – 2008
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* Certifications */}
      <AnimatedSection delay={0.15}>
        <section
          aria-label="Certifications"
          className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col"
        >
          <Settings
            className="absolute -right-8 -bottom-8 w-48 h-48 text-zinc-500/5 pointer-events-none"
            aria-hidden="true"
          />
          <div className="flex items-center justify-between mb-5 relative z-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-zinc-600 dark:text-zinc-400" aria-hidden="true" />
              Certifications
            </h2>
            <Link
              href="/certifications"
              className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest"
            >
              View All <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>

          {/* AI & ML */}
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 dark:text-purple-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" aria-hidden="true" /> AI &amp; Machine Learning
            </p>
            <ul className="space-y-2 mt-2">
              {AI_CERTS.map((cert) => (
                <li key={cert} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Box className="w-3 h-3 text-purple-400" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testing & Standards */}
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 dark:text-amber-400 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" aria-hidden="true" /> Testing &amp; Standards
            </p>
            <ul className="space-y-2 mt-2">
              {TESTING_CERTS.map((cert) => (
                <li key={cert} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Box className="w-3 h-3 text-amber-400" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Leadership */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 dark:text-blue-400 mb-2 flex items-center gap-1.5">
              <Box className="w-3 h-3" aria-hidden="true" /> Leadership &amp; Management
            </p>
            <ul className="space-y-2 mt-2">
              {LEADERSHIP_CERTS.map((cert) => (
                <li key={cert} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Box className="w-3 h-3 text-blue-400" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </AnimatedSection>

      {/* Awards & Recognition */}
      <AnimatedSection delay={0.2}>
        <section
          aria-label="Awards and Recognition"
          className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col"
        >
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2 relative z-10">
            <span className="text-2xl" aria-hidden="true">🏆</span>
            Awards &amp; Recognition
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 relative z-10">
            L&amp;T Infotech (2010–2011)
          </p>
          <AwardsGallery />
        </section>
      </AnimatedSection>

      {/* Google Developer Profile */}
      <AnimatedSection delay={0.25}>
        <section
          aria-label="Google Developer Profile"
          className="glass-card rounded-3xl p-8 relative flex flex-col gap-8 overflow-hidden"
        >
          {/* Google logo watermark */}
          <div className="absolute -left-6 -bottom-6 pointer-events-none opacity-[0.03] z-0" aria-hidden="true">
            <Image src="/logos/google.png" alt="" width={256} height={256} className="grayscale" />
          </div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2" aria-hidden="true" />

          <div className="flex flex-col z-10 w-full relative">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <Image src="/logos/google.png" alt="Google" width={20} height={20} className="object-contain" />
              </div>
              Google Developer Profile
            </h2>
            <a
              href="https://developers.google.com/profile/u/bahamad"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium mb-6 font-mono text-sm underline underline-offset-4 decoration-zinc-700 inline-block w-fit transition-colors"
            >
              g.dev/bahamad
            </a>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8">
              Recognized participant in the Google Developer Ecosystem. Attended multiple flagship events in Mountain View, earning badges for technical integrations and Platform mastery.
            </p>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
              I/O Attendance &amp; Badges
            </h3>
            <div className="flex flex-wrap gap-2.5 mb-8">
              <span className="px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
                I/O 2022–25 Attendee
              </span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <BadgeCount /> Badges
              </span>
            </div>

            <GoogleDevCarousel />
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
