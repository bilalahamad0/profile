import { Fragment } from "react";
import Image from "next/image";
import { Briefcase, Check, MapPin } from "lucide-react";
import { experienceData } from "@/data/portfolio";
import { AnimatedSection } from "@/components/experience/AnimatedSection";
import {
  MOBILE_COLLAPSIBLE,
  MOBILE_COLLAPSIBLE_INNER,
  MobileCollapseToggle,
} from "@/components/experience/MobileCollapseToggle";
import { cn } from "@/lib/utils";

export const EXPERIENCE_TIMELINE_ID = "exp-timeline";

/** Roles whose START year is before this are the "earlier career" block that
 *  the mobile jump index collapses. Derived from the data, never hardcoded to
 *  an index, so it survives edits to `experienceData`. */
const EARLIER_ROLES_BEFORE = 2016;
/** Never collapse unless this many recent roles stay open above the toggle. */
const MIN_ROLES_KEPT_OPEN = 3;

/** Anchor target for a role, e.g. `role-samsara-inc-2`. Index keeps it unique
 *  even if two entries ever share a company name. */
export function roleAnchorId(company: string, index: number) {
  const slug = company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `role-${slug || "entry"}-${index + 1}`;
}

/** Every 4-digit year mentioned in a duration string, in order. */
function durationYears(duration: string): number[] {
  return (duration.match(/\b(?:19|20)\d{2}\b/g) ?? []).map(Number);
}

/** Compact range for the jump-index chips: "Dec 2023 - Jul 2025" → "23–25". */
export function roleShortRange(duration: string): string {
  const years = durationYears(duration);
  if (years.length === 0) return "";
  const first = String(years[0]).slice(2);
  const last = String(years[years.length - 1]).slice(2);
  return first === last ? first : `${first}–${last}`;
}

/** Index of the first "earlier career" role, or -1 when the split is not worth
 *  making (too few roles above it, or fewer than two roles below it). */
const firstEarlierIndex = (() => {
  const found = experienceData.findIndex((exp) => {
    const years = durationYears(exp.duration);
    return years.length > 0 && years[0] < EARLIER_ROLES_BEFORE;
  });
  if (found < MIN_ROLES_KEPT_OPEN) return -1;
  if (experienceData.length - found < 2) return -1;
  return found;
})();

const earlierRoles = firstEarlierIndex >= 0 ? experienceData.slice(firstEarlierIndex) : [];
const earlierYears = earlierRoles.flatMap((exp) => durationYears(exp.duration));
const earlierRange = earlierYears.length
  ? ` (${Math.min(...earlierYears)}–${Math.max(...earlierYears)})`
  : "";
const earlierPanelIds = earlierRoles
  .map((exp, i) => roleAnchorId(exp.company, firstEarlierIndex + i))
  .join(" ");

export function ExperienceTimeline() {
  return (
    <AnimatedSection delay={0} className="flex flex-col h-full">
    <section
      id={EXPERIENCE_TIMELINE_ID}
      aria-label="Professional Career Timeline"
      className="glass-card rounded-3xl p-8 lg:p-12 relative flex flex-col h-full scroll-mt-40 lg:scroll-mt-28"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none" aria-hidden="true">
        <Briefcase className="w-32 h-32" />
      </div>

      <h2 className="t-h3 text-ink mb-8 lg:mb-10 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-blue-700 dark:text-blue-400" aria-hidden="true" />
        Professional Career Timeline
      </h2>

      {/* One flat <ol> of 10 list items — the disclosure below is an extra
          `lg:hidden` item, so at `lg` the flex container still distributes its
          slack across exactly the same ten roles it always has. */}
      <ol className="flex flex-col justify-between flex-1 gap-6 lg:gap-12 relative z-10">
        {experienceData.map((exp, idx) => {
          const isEarlier = firstEarlierIndex >= 0 && idx >= firstEarlierIndex;
          const body = (
            <div className="flex gap-4 group border border-transparent rounded-xl hover:border-line/20 hover:bg-ink/[0.03] transition-all duration-300 pr-2">
              {/* Logo + timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-xl flex shrink-0 items-center justify-center border overflow-hidden p-2.5
                    ${exp.faang
                      ? "bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                      : (exp as { isStealth?: boolean }).isStealth
                        ? "bg-violet-500/10 border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                        : "bg-ink/5 border-line/10"
                    }`}
                >
                  <Image
                    src={exp.file}
                    alt={exp.company}
                    width={40}
                    height={40}
                    className={`w-full h-full object-contain ${exp.invertLogo ? "dark:invert dark:brightness-200" : ""}`}
                  />
                </div>
                {idx !== experienceData.length - 1 && (
                  <div className="w-px flex-1 bg-gradient-to-b from-zinc-300 dark:from-zinc-600 to-transparent mt-2 pointer-events-none" aria-hidden="true" />
                )}
              </div>

              {/* Job details */}
              <div className="pb-4 lg:pb-6 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <h3 className="text-lg font-semibold text-ink leading-tight whitespace-pre-line">
                    {exp.role}
                  </h3>
                  <span className="font-medium tracking-tight text-emerald-700 dark:text-emerald-400 hover:opacity-80 transition-opacity duration-200">
                    {exp.company}
                  </span>
                </div>

                <p className="text-xs text-ink-muted mb-2 mt-1 flex items-center gap-2">
                  <time>{exp.duration}</time>
                  <span className="opacity-30" aria-hidden="true">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                    {exp.location}
                  </span>
                </p>

                <p className="text-sm text-ink-muted leading-relaxed max-w-md mb-3">
                  {exp.desc}
                </p>

                {Array.isArray((exp as { highlights?: string[] }).highlights) &&
                  (exp as { highlights?: string[] }).highlights!.length > 0 && (
                    <ul className="space-y-1.5 max-w-md">
                      {(exp as { highlights: string[] }).highlights.map((h, hi) => (
                        <li key={hi} className="flex items-start gap-2 text-xs text-ink-muted leading-relaxed hover:text-ink/90 transition-colors duration-200">
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            </div>
          );

          return (
            <Fragment key={exp.company + idx}>
              {idx === firstEarlierIndex && (
                <MobileCollapseToggle
                  as="li"
                  controls={earlierPanelIds}
                  showLabel={`Show ${earlierRoles.length} earlier roles${earlierRange}`}
                  hideLabel={`Hide ${earlierRoles.length} earlier roles${earlierRange}`}
                />
              )}
              <li
                id={roleAnchorId(exp.company, idx)}
                className={cn("scroll-mt-40 lg:scroll-mt-28", isEarlier && MOBILE_COLLAPSIBLE)}
              >
                {isEarlier ? <div className={MOBILE_COLLAPSIBLE_INNER}>{body}</div> : body}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </section>
    </AnimatedSection>
  );
}
