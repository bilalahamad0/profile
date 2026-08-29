import { ArrowLeft, ArrowUp, Download } from "lucide-react";
import Link from "next/link";
import { experienceData } from "@/data/portfolio";
import {
  EXPERIENCE_TIMELINE_ID,
  ExperienceTimeline,
  roleAnchorId,
  roleShortRange,
} from "@/components/experience/ExperienceTimeline";
import {
  EXPERIENCE_SECTIONS,
  ExperienceRightColumn,
} from "@/components/experience/ExperienceRightColumn";
import { ShareButton } from "@/components/experience/ShareButton";
import { cn } from "@/lib/utils";

const JUMP_CHIP =
  "flex min-h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line/10 bg-ink/5 px-3 t-label font-semibold text-ink-muted transition-colors hover:border-line/20 hover:bg-ink/10 hover:text-ink";

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Header */}
      <section
        id="experience-top"
        className="pt-24 pb-8 md:pt-28 md:pb-10 lg:pt-36 lg:pb-12 px-6 lg:px-24 border-b border-line/10 dark:border-line/5 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="t-h1">
              Technical <span className="text-blue-700 dark:text-blue-400">Roadmap</span>
            </h1>
            <p className="t-lead text-ink-muted font-light max-w-2xl">
              A comprehensive chronicle of 18+ years in engineering, test automation, and IoT
              orchestration across the global tech ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="/Bilal_Ahamad_Resume.pdf"
              download
              className="flex items-center gap-2 px-6 py-3 rounded-xl border bg-ink/5 border-line/10 text-ink hover:bg-ink/10 transition-all"
            >
              <Download className="w-5 h-5" aria-hidden="true" /> Download Resume
            </a>
            <ShareButton />
          </div>
        </div>
      </section>

      {/* Mobile jump index — the page stacks to a single ~9,000px column below
          `lg`, so without this every role is reached by scrolling past all the
          ones above it. Plain anchors: no JavaScript, no open/close state, and
          the leading "Top" chip doubles as the back-to-top affordance because
          the rail stays stuck under the navbar for the whole scroll. Hidden at
          `lg`, where the two-column bento is only ~5 screens. */}
      <nav
        aria-label="Jump to a role or section"
        className="lg:hidden sticky top-20 z-40 px-4 sm:px-6 py-2"
      >
        <ul className="glass flex items-center gap-2 overflow-x-auto overscroll-x-contain rounded-2xl px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <li className="shrink-0">
            <a
              href="#experience-top"
              className={cn(
                JUMP_CHIP,
                "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300"
              )}
            >
              <ArrowUp className="w-3 h-3 shrink-0" aria-hidden="true" />
              Top
            </a>
          </li>
          <li className="shrink-0">
            <a href={`#${EXPERIENCE_TIMELINE_ID}`} className={JUMP_CHIP}>
              Timeline
            </a>
          </li>
          {experienceData.map((exp, idx) => {
            const range = roleShortRange(exp.duration);
            return (
              <li key={exp.company + idx} className="shrink-0">
                <a href={`#${roleAnchorId(exp.company, idx)}`} className={JUMP_CHIP}>
                  {range ? `${exp.company} · ${range}` : exp.company}
                </a>
              </li>
            );
          })}
          <li aria-hidden="true" className="shrink-0 w-px h-5 bg-line/20" />
          {EXPERIENCE_SECTIONS.map((section) => (
            <li key={section.id} className="shrink-0">
              <a href={`#${section.id}`} className={JUMP_CHIP}>
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Career content — fully SSR'd */}
      <section className="relative py-8 md:py-10 lg:py-12 px-4 sm:px-6" aria-label="Professional dashboard">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-500/5 blur-[120px] rounded-full opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <ExperienceTimeline />
          <ExperienceRightColumn />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 lg:py-24 px-6 text-center border-t border-line/10 dark:border-line/5">
        <h2 className="t-h2 mb-8">Ready to build something together?</h2>
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-2xl shadow-blue-600/20"
        >
          Get in Touch
          <ArrowLeft className="w-5 h-5 rotate-180" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
