import Image from "next/image";
import { Briefcase, Check, MapPin } from "lucide-react";
import { experienceData } from "@/data/portfolio";
import { AnimatedSection } from "@/components/experience/AnimatedSection";

export function ExperienceTimeline() {
  return (
    <AnimatedSection delay={0}>
    <section
      aria-label="Professional Career Timeline"
      className="glass-card rounded-3xl p-8 relative flex flex-col"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none" aria-hidden="true">
        <Briefcase className="w-32 h-32" />
      </div>

      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        Professional Career Timeline
      </h2>

      <ol className="space-y-6 relative z-10">
        {experienceData.map((exp, idx) => (
          <li key={exp.company + idx} className="flex gap-4 group border border-transparent rounded-xl hover:border-white/20 hover:bg-white/[0.02] transition-all duration-300 pr-2">
            {/* Logo + timeline connector */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-xl flex shrink-0 items-center justify-center border overflow-hidden p-2.5
                  ${exp.faang
                    ? "bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                    : (exp as { isStealth?: boolean }).isStealth
                      ? "bg-violet-500/10 border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
                  }`}
              >
                <Image
                  src={exp.file}
                  alt={exp.company}
                  width={40}
                  height={40}
                  className={`w-full h-full object-contain ${exp.invertLogo ? "filter invert brightness-200" : ""}`}
                  unoptimized
                />
              </div>
              {idx !== experienceData.length - 1 && (
                <div className="w-px flex-1 bg-gradient-to-b from-zinc-300 dark:from-zinc-600 to-transparent mt-2 pointer-events-none" aria-hidden="true" />
              )}
            </div>

            {/* Job details */}
            <div className="pb-4 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-tight whitespace-pre-line">
                  {exp.role}
                </h3>
                <span className="font-medium tracking-tight text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity duration-200">
                  {exp.company}
                </span>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-2 mt-1 flex items-center gap-2">
                <time>{exp.duration}</time>
                <span className="opacity-30" aria-hidden="true">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                  {exp.location}
                </span>
              </p>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md mb-3">
                {exp.desc}
              </p>

              {Array.isArray((exp as { highlights?: string[] }).highlights) &&
                (exp as { highlights?: string[] }).highlights!.length > 0 && (
                  <ul className="space-y-1.5 max-w-md">
                    {(exp as { highlights: string[] }).highlights.map((h, hi) => (
                      <li key={hi} className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed hover:text-white/90 transition-colors duration-200">
                        <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </li>
        ))}
      </ol>
    </section>
    </AnimatedSection>
  );
}
