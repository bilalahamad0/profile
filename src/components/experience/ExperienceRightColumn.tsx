import Image from "next/image";
import Link from "next/link";
import { GoogleDevCarousel } from "@/components/experience/GoogleDevCarousel";
import { AnimatedSection } from "@/components/experience/AnimatedSection";
import { AwardsGallery } from "@/components/experience/AwardsGallery";
import { BadgeCount } from "@/components/experience/BadgeCount";
import {
  Terminal, ShieldCheck, Box, Layers, Settings, GraduationCap, Sparkles,
  ExternalLink, Target, Cpu, Trophy, BadgeCheck, MessageSquareQuote, User,
} from "lucide-react";
import { skills, recommendations, certifications } from "@/data/portfolio";
import {
  MOBILE_COLLAPSIBLE,
  MOBILE_COLLAPSIBLE_INNER,
  MobileCollapseToggle,
} from "@/components/experience/MobileCollapseToggle";

/** Anchor targets for the mobile jump index on /experience. Exported so
 *  `app/experience/page.tsx` and this column can never drift apart. */
export const EXPERIENCE_SECTIONS = [
  { id: "exp-core-focus", label: "Core Focus" },
  { id: "exp-skills", label: "Technical Arsenal" },
  { id: "exp-education", label: "Education" },
  { id: "exp-certifications", label: "Certifications" },
  { id: "exp-recommendations", label: "Recommendations" },
  { id: "exp-awards", label: "Awards" },
  { id: "exp-google", label: "Google Dev Profile" },
] as const;

/** One offset for every in-page anchor: clears the fixed navbar plus the
 *  sticky mobile jump rail, and just the navbar once the rail is gone at `lg`. */
const ANCHOR_OFFSET = "scroll-mt-40 lg:scroll-mt-28";

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

const AI_CERTS = certifications.filter((c) => c.category === "ai").map((c) => c.title);
const TESTING_CERTS = certifications.filter((c) => c.category === "testing").map((c) => c.title);
const LEADERSHIP_CERTS = certifications.filter((c) => c.category === "leadership").map((c) => c.title);

export function ExperienceRightColumn() {
  return (
    <div className="flex flex-col h-full">

      {/* Core Focus */}
      <AnimatedSection delay={0} className="flex-auto flex flex-col">
        <section
          id="exp-core-focus"
          aria-label="Core Focus Areas"
          className={`glass-card rounded-3xl p-8 flex flex-col justify-between h-full relative hover:border-line/20 hover:bg-ink/[0.03] transition-all duration-300 ${ANCHOR_OFFSET}`}
        >
          <Target className="absolute top-3 right-3 w-20 h-20 opacity-[0.04] text-ink-muted pointer-events-none z-0" aria-hidden="true" />
          <h2 className="t-h3 text-ink mb-5 flex items-center gap-2 relative z-10">
            <Layers className="w-6 h-6 text-blue-700 dark:text-blue-400" aria-hidden="true" />
            Core Focus
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative z-10">
            {CORE_FOCUS_TAGS.map((tag, idx) => {
              let tone = "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300";
              if (idx >= 3 && idx < 6) tone = "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300";
              if (idx >= 6) tone = "bg-violet-500/10 border-violet-500/20 text-violet-700 dark:text-violet-300";
              return (
                <span
                  key={tag}
                  className={`px-3 py-1.5 rounded-md t-label font-bold uppercase tracking-[0.08em] border hover:bg-ink/5 hover:border-line/20 transition-all duration-200 cursor-default ${tone}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </section>
      </AnimatedSection>

      {/* Technical Arsenal */}
      <AnimatedSection delay={0.05} className="flex-auto flex flex-col">
        <section
          id="exp-skills"
          aria-label="Technical Arsenal"
          className={`glass-card rounded-3xl p-8 flex flex-col justify-between h-full relative hover:border-line/20 hover:bg-ink/[0.03] transition-all duration-300 ${ANCHOR_OFFSET}`}
        >
          <Cpu className="absolute top-3 right-3 w-20 h-20 opacity-[0.04] text-ink-muted pointer-events-none z-0" aria-hidden="true" />
          <h2 className="t-h3 text-ink mb-5 flex items-center gap-2 relative z-10">
            <Terminal className="w-6 h-6 text-purple-700 dark:text-purple-400" aria-hidden="true" />
            Technical Arsenal
          </h2>
          <ul className="flex flex-wrap gap-2.5 list-none relative z-10">
            {skills.map((skill) => (
              <li
                key={skill.name}
                className="group px-3.5 py-1.5 rounded-lg bg-ink/5 border border-line/10 hover:bg-ink/10 hover:border-line/20 hover:scale-105 text-sm font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-2 cursor-default transition-all duration-200"
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
      <AnimatedSection delay={0.1} className="flex-auto flex flex-col">
        <section
          id="exp-education"
          aria-label="Education"
          className={`glass-card rounded-3xl p-8 flex flex-col h-full relative hover:border-line/20 hover:bg-ink/[0.03] transition-all duration-300 ${ANCHOR_OFFSET}`}
        >
          <GraduationCap className="absolute top-3 right-3 w-20 h-20 opacity-[0.04] text-ink-muted pointer-events-none z-0" aria-hidden="true" />
          <h2 className="t-h3 text-ink mb-5 flex items-center gap-2 relative z-10">
            <GraduationCap className="w-6 h-6 text-indigo-700 dark:text-indigo-400" aria-hidden="true" />
            Education
          </h2>
          <div className="space-y-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 relative z-10 hover:border-line/20 hover:bg-ink/[0.03] transition-all duration-300 cursor-default">
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Bachelor of Technology
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Electronics and Telecommunications Engineering
            </p>
            <p className="text-sm text-ink-muted">
              Biju Patnaik University of Technology
            </p>
            <p className="text-xs font-medium uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              2004 – 2008
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* Certifications */}
      <AnimatedSection delay={0.15} className="flex-auto flex flex-col">
        <section
          id="exp-certifications"
          aria-label="Certifications"
          className={`glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between h-full hover:border-line/20 hover:bg-ink/[0.03] transition-all duration-300 ${ANCHOR_OFFSET}`}
        >
          <BadgeCheck className="absolute bottom-4 right-4 w-20 h-20 opacity-[0.04] text-ink-muted pointer-events-none z-0" aria-hidden="true" />
          <div className="flex items-center justify-between mb-5 relative z-10">
            <h2 className="t-h3 text-ink flex items-center gap-2">
              <Settings className="w-6 h-6 text-ink-muted" aria-hidden="true" />
              Certifications
            </h2>
            <Link
              href="/certifications"
              className="flex items-center gap-1.5 t-label font-bold text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 transition-colors uppercase tracking-widest"
            >
              View All <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>

          {/* AI & ML */}
          <div className="mb-4 relative z-10">
            <p className="t-label font-black uppercase tracking-[0.2em] text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" aria-hidden="true" /> AI &amp; Machine Learning
            </p>
            <ul className="space-y-2 mt-2">
              {AI_CERTS.map((cert) => (
                <li key={cert} className="flex items-start gap-3 hover:text-ink/90 hover:translate-x-1 transition-all duration-200">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Box className="w-3 h-3 text-purple-700 dark:text-purple-400" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testing & Standards */}
          <div className="mb-4 relative z-10">
            <p className="t-label font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" aria-hidden="true" /> Testing &amp; Standards
            </p>
            <ul className="space-y-2 mt-2">
              {TESTING_CERTS.map((cert) => (
                <li key={cert} className="flex items-start gap-3 hover:text-ink/90 hover:translate-x-1 transition-all duration-200">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Box className="w-3 h-3 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Leadership */}
          <div className="relative z-10">
            <p className="t-label font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1.5">
              <Box className="w-3 h-3" aria-hidden="true" /> Leadership &amp; Management
            </p>
            <ul className="space-y-2 mt-2">
              {LEADERSHIP_CERTS.map((cert) => (
                <li key={cert} className="flex items-start gap-3 hover:text-ink/90 hover:translate-x-1 transition-all duration-200">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Box className="w-3 h-3 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </AnimatedSection>

      {/* LinkedIn Recommendations */}
      <AnimatedSection delay={0.2} className="flex-auto flex flex-col">
        <section
          id="exp-recommendations"
          aria-label="LinkedIn Recommendations"
          className={`glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col h-full hover:border-line/20 hover:bg-ink/[0.03] transition-all duration-300 ${ANCHOR_OFFSET}`}
        >
          <MessageSquareQuote className="absolute bottom-4 right-4 w-20 h-20 opacity-[0.04] text-ink-muted pointer-events-none z-0" aria-hidden="true" />
          <h2 className="t-h3 text-ink mb-5 flex items-center gap-2 relative z-10">
            <MessageSquareQuote className="w-6 h-6 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            Recommendations
          </h2>
          <div className="flex flex-col justify-between flex-1 gap-4 relative z-10">
            {recommendations.map((rec) => (
              <div
                key={rec.name}
                className="p-5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all duration-200 cursor-default"
              >
                <p className="text-sm text-body leading-relaxed italic mb-4 font-light">
                  &ldquo;{rec.review}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/30 to-blue-400/30 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <User className="w-4 h-4 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{rec.name}</span>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400/70">{rec.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Awards & Recognition */}
      <AnimatedSection delay={0.25} className="flex-auto flex flex-col">
        <section
          id="exp-awards"
          aria-label="Awards and Recognition"
          className={`glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between h-full hover:border-line/20 hover:bg-ink/[0.03] transition-all duration-300 ${ANCHOR_OFFSET}`}
        >
          <Trophy className="absolute top-3 right-3 w-20 h-20 opacity-[0.04] text-ink-muted pointer-events-none z-0" aria-hidden="true" />
          <h2 className="t-h3 text-ink mb-2 flex items-center gap-2 relative z-10">
            <span className="text-2xl" aria-hidden="true">🏆</span>
            Awards &amp; Recognition
          </h2>
          <p className="text-sm text-ink-muted mb-6 relative z-10">
            L&amp;T Infotech (2010–2011)
          </p>
          {/* The gallery is ~1,000px of certificate photography on a phone —
              the single densest scroll-per-fact block on the page. Below `lg`
              it collapses behind a disclosure; the award titles and citations
              stay in the DOM either way, and desktop is untouched. */}
          <div className="relative z-10">
            <MobileCollapseToggle
              controls="exp-awards-gallery"
              showLabel="Show award photos and citations"
              hideLabel="Hide award photos and citations"
              className="mb-2"
            />
            <div id="exp-awards-gallery" className={MOBILE_COLLAPSIBLE}>
              <div className={MOBILE_COLLAPSIBLE_INNER}>
                <AwardsGallery />
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Google Developer Profile */}
      <AnimatedSection delay={0.3} className="flex-auto flex flex-col">
        <section
          id="exp-google"
          aria-label="Google Developer Profile"
          className={`glass-card rounded-3xl p-8 relative flex flex-col gap-8 h-full overflow-hidden hover:border-line/20 hover:bg-ink/[0.03] transition-all duration-300 ${ANCHOR_OFFSET}`}
        >
          {/* Google logo watermark */}
          <div className="absolute top-4 right-4 pointer-events-none opacity-[0.035] z-0" aria-hidden="true">
            <Image src="/logos/google.png" alt="" width={96} height={96} className="grayscale" />
          </div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/10 opacity-40 dark:opacity-100 rounded-full blur-[80px] pointer-events-none -translate-y-1/2" aria-hidden="true" />

          <div className="flex flex-col justify-between flex-1 z-10 w-full relative">
            <h2 className="t-h3 text-ink mb-2 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <Image src="/logos/google.png" alt="Google" width={20} height={20} className="object-contain" />
              </div>
              Google Developer Profile
            </h2>
            <a
              href="https://developers.google.com/profile/u/bahamad"
              target="_blank"
              rel="noreferrer"
              className="text-ink-muted hover:text-blue-700 dark:hover:text-blue-400 font-medium mb-6 font-mono text-sm underline underline-offset-4 decoration-zinc-700 inline-block w-fit transition-colors"
            >
              g.dev/bahamad
            </a>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8">
              Recognized participant in the Google Developer Ecosystem. Attended multiple flagship events in Mountain View, earning badges for technical integrations and Platform mastery.
            </p>
            <h3 className="t-label font-bold text-ink-muted uppercase tracking-widest mb-4">
              I/O Attendance &amp; Badges
            </h3>
            <div className="flex flex-wrap gap-2.5 mb-8">
              <span className="px-3 py-1.5 rounded-full bg-ink/5 border border-line/10 t-label font-medium text-zinc-700 dark:text-zinc-300">
                I/O 2022–25 Attendee
              </span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 t-label font-semibold text-emerald-700 dark:text-emerald-400">
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
