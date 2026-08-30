import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { experienceData } from "@/data/portfolio";
import { parseRoleDates } from "@/lib/structured-data";

/**
 * The homepage Experience section.
 *
 * Until now the career — the thing this portfolio ranks first — held 0px of the
 * 4,067px desktop homepage. It survived only as three fragments: an "18+ Years"
 * stat card, a logo row, and a button, all inside the hero. A visitor could
 * read the whole page without learning a single job title. This section is the
 * missing middle: what the roles actually were, in order, with the one outcome
 * each is remembered for.
 *
 * NO "use client". Every job title, company and date below is in the static
 * HTML, which is the ATS contract in CLAUDE.md — and it is why this section,
 * rather than <ResumeReelClient> (which is `ssr: false`), is what a crawler
 * reads. The two are breakpoint-exclusive: the reel is `md:hidden`, this is
 * `hidden md:block`, so neither viewport sees the career twice.
 *
 * The hero already owns the "18+ Years" stat and the company logo row, so
 * nothing here repeats them — this section adds only what was missing.
 */

/** Matches DETAILED_ROLES on /resume: the six roles that carry their own entry. */
const DETAILED_ROLES = 6;

/** First and last four-digit years in a "Mon YYYY - Mon YYYY" duration. */
const years = (duration: string): string[] => duration.match(/\d{4}/g) ?? [];
const startYear = (duration: string) => years(duration)[0] ?? "";
const endYear = (duration: string) => years(duration).at(-1) ?? "";

function RoleEntry({
  role,
  company,
  location,
  duration,
  impact,
  isCurrent,
}: {
  role: string;
  company: string;
  location: string;
  duration: string;
  impact: string;
  isCurrent: boolean;
}) {
  const dates = parseRoleDates(duration);

  return (
    <li className="relative pl-8 pb-10 last:pb-0">
      {/* Spine node. Ring-offset in the surface colour punches the dot out of
          the line rather than drawing over it. */}
      <span
        aria-hidden="true"
        className={
          isCurrent
            ? "absolute left-0 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"
            : "absolute left-0 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-500/70 ring-4 ring-surface"
        }
      />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <time
          dateTime={dates?.startDate}
          className="t-caption font-mono uppercase tracking-wider text-ink-muted"
        >
          {duration}
        </time>
        {isCurrent && (
          <span className="t-label font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
            Current
          </span>
        )}
      </div>

      <h3 className="t-h3 text-ink mt-1.5">{role.replace(/\n/g, " ")}</h3>

      <p className="t-small text-ink-muted mt-0.5">
        <span className="font-semibold text-ink">{company}</span>
        <span className="text-ink-muted"> · {location}</span>
      </p>

      <p className="t-body text-ink-muted mt-3 max-w-2xl leading-relaxed">{impact}</p>
    </li>
  );
}

export function ExperienceHighlight() {
  const detailed = experienceData.slice(0, DETAILED_ROLES);
  const earlier = experienceData.slice(DETAILED_ROLES);
  const earlierSpan = `${startYear(experienceData[experienceData.length - 1].duration)}–${endYear(earlier[0].duration)}`;

  return (
    <section
      className="hidden md:block px-6 lg:px-24 py-12 md:py-20 lg:py-24 relative overflow-hidden"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-10 lg:gap-20">
          {/* Rail — sticks while the timeline scrolls past it. */}
          <header className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-500 font-mono t-caption uppercase tracking-widest mb-3">
              <div className="h-px w-6 bg-blue-500/50" />
              Experience
            </div>

            <h2 id="experience-heading" className="t-h2 text-ink">
              Eighteen years of catching failures before customers do
            </h2>

            <p className="t-lead text-ink-muted mt-5 leading-relaxed">
              Consumer devices at Amazon Lab126, spatial tracking at Google,
              infotainment at Rivian, autonomous compute at Cruise, fleet IoT at
              Samsara. Different stacks, one discipline: build the bench, the
              automation and the release gate that catch a defect while it is
              still cheap.
            </p>

            <Link
              href="/experience"
              className="group inline-flex min-h-11 items-center gap-2 mt-7 rounded-xl border border-line/10 bg-ink/5 px-5 py-2.5 t-small font-semibold text-ink transition-colors hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400"
            >
              Full career history
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </header>

          {/* Timeline. An <ol> because the ordering is the meaning. */}
          <ol className="relative border-l border-line/10">
            {detailed.map((r, i) => (
              <RoleEntry
                key={`${r.company}-${r.duration}`}
                role={r.role}
                company={r.company}
                location={r.location}
                duration={r.duration}
                impact={r.highlights[0]}
                isCurrent={i === 0}
              />
            ))}

            {/* The four earliest roles as one line — they belong in the record,
                not in the homepage's foreground. */}
            <li className="relative pl-8 pt-2">
              <span
                aria-hidden="true"
                className="absolute left-0 top-4 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-line/40 ring-4 ring-surface"
              />
              <p className="t-small text-ink-muted leading-relaxed">
                <span className="font-semibold text-ink">
                  Earlier ({earlierSpan}):
                </span>{" "}
                {earlier.map((r) => r.company).join(" · ")}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
