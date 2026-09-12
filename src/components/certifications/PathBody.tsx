"use client";

import React from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, CheckCircle2, ListChecks } from "lucide-react";
import type { LearningPathData } from "@/app/certifications/data";
import { panelItemVariants, reducedItemVariants } from "./CollapsePanel";
import { CourseBadgesGrid, CourseUnitsList } from "./ChildBadgesGrid";
import { trackCourseworkPage } from "./verify";

/** Expanded body of a coursework row.
 *
 *  ONE COLUMN, full width. The panel used to copy SpecializationBody's
 *  two-column grid, with a large issuer slab in the left column standing in for
 *  the certificate thumbnail. Both are gone: a path has no certificate, so the
 *  slab was a placeholder occupying half the panel, and the split column pinned
 *  the course grid into roughly half the available width — where 4 or 5 badges
 *  stranded in a narrow pyramid with dead space either side, and Stanford's five
 *  modules floated in a ~250px empty band sized by the column beside them.
 *
 *  Everything that carried meaning survives, in reading order: the issuer row
 *  (logo, issuer, date, path-details link), the summary panel (the issuer's own
 *  description plus the badge counter), then the badge count pill and the course
 *  units themselves — now spread across the panel's full width. The honest
 *  substitutions are unchanged: no certificate thumbnail, a neutral counter
 *  where a specialization shows its awarded parent badge, and a pill that counts
 *  badges rather than credentials. */
export const PathBody = ({ path }: { path: LearningPathData }) => {
  const reduceMotion = useReducedMotion();
  const itemVariants = reduceMotion ? reducedItemVariants : panelItemVariants;
  const badges = path.courses.filter((c) => c.badge).length;
  const track = () =>
    trackCourseworkPage({
      id: path.id,
      issuer: path.issuer,
      title: path.titleLines[0],
      urlLabel: path.urlLabel,
    });

  // The parent-badge slot holds a COUNTER, never a badge: no path-level badge
  // exists and composing one would be a lie. On a card with badges it counts
  // them; on Stanford's, which has none, it counts modules — so no card ever
  // prints a zero, and the slot is never empty.
  //
  // No "of N courses" sub-line: it existed to explain the one path whose badge
  // count fell short of its course count, and with that lab no longer listed
  // every badged card counts the same number twice. `badges` still reads the
  // data rather than `totalCourses`, so the figure stays the number of tiles
  // the grid below actually paints.
  const counter =
    badges > 0
      ? { value: String(badges), label: "Course Badges" }
      : { value: String(path.totalCourses), label: path.unitNoun };

  return (
    <div className="flex flex-col gap-5">
      {/* Issuer row — byte-for-byte the specialization's, with the logo slot
          falling back to a neutral glyph where no issuer asset exists. */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line/10 bg-ink/5 p-1.5">
          {path.logo ? (
            <Image src={path.logo} alt="" width={24} height={24} className="object-contain" />
          ) : (
            <BookOpen className="h-5 w-5 text-ink/70 dark:text-ink/60" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate t-caption font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {path.issuer}
          </p>
          {/* ink/70 in light, ink/60 in dark. The specialization's own date
              line is a flat ink/60; this line is only ever read while the row
              is OPEN, i.e. with the gradient wash painted at opacity-50 behind
              it, and pixel-measured there ink/60 lands at 4.52:1 on the blue
              path cards and 4.45:1 on Stanford's red wash — one side of AA and
              one side under it. ink/70 gives 6.21–6.35:1 across all six.
              Dark keeps ink/60 (6.97–7.09:1), which was never in question. */}
          <p className="flex items-center gap-1.5 t-label uppercase tracking-tighter text-ink/70 dark:text-ink/60">
            <Calendar className="h-3 w-3" aria-hidden />
            {path.date}
          </p>
        </div>
        <a
          href={path.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={track}
          aria-label={`${path.titleLines[0]} ${path.urlNoun} details on ${path.issuerShort} (opens in a new tab)`}
          className="group/details inline-flex shrink-0 items-center gap-1 t-label font-semibold uppercase tracking-wider text-ink/70 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 dark:text-ink/60 dark:hover:text-ink dark:focus-visible:ring-ink/60"
        >
          {path.urlNoun === "path" ? "Path details" : "Course details"}
          <ArrowRight className="h-3 w-3 transition-transform group-hover/details:translate-x-1" />
        </a>
      </div>

      {/* Description + counter — the specialization's summary panel exactly,
          now at full panel width, so the description sets in two or three lines
          instead of the six or seven a half-width column forced. */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line/10 bg-ink/[0.03] p-4 md:flex-row md:items-center md:gap-6 md:p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="t-small text-ink/88">{path.description}</p>
          {path.officialTitleNote ? (
            // A CITATION of the issuer's own title for this path, not a
            // caveat: it keeps that exact string ATS-searchable without the
            // page asserting it.
            <p className="t-caption text-ink/75 dark:text-ink/50">{path.officialTitleNote}</p>
          ) : null}
        </div>
        <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center gap-1 self-center rounded-2xl border border-line/10 bg-ink/[0.04] px-2 text-center md:h-32 md:w-32">
          <span className="t-h2 tabular-nums text-ink">{counter.value}</span>
          <span className="t-label font-bold uppercase tracking-wider text-ink/70 dark:text-ink/60">
            {counter.label}
          </span>
        </div>
      </div>

      {/* Course units — the full width of the panel, no column to share. */}
      <div className="flex flex-col gap-4">
        {badges > 0 ? (
          // emerald-800, not emerald-700. Pixel-measured on the open card, where
          // this pill's bg-emerald-500/10 over the opacity-50 wash resolves to
          // rgb(211,239,238): emerald-700 is 4.50–4.53:1, i.e. sitting on the AA
          // line and moving with whichever gradient is behind it; emerald-800 is
          // 6.25–6.29:1. Dark unchanged (emerald-300, 10.07:1). Matches the tile
          // pill in CourseBadgesGrid.
          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 t-label font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            {badges} public course badges
          </div>
        ) : (
          // Nothing to verify, so nothing emerald. Neutral ink, and it labels
          // the list for what it is rather than for what it is not.
          <div className="flex items-center gap-2 self-start rounded-full border border-line/20 bg-ink/[0.05] px-3 py-1.5 t-label font-bold uppercase tracking-wider text-ink/70 dark:border-line/25 dark:text-ink/60">
            <ListChecks className="h-3.5 w-3.5" aria-hidden />
            {path.totalCourses} course modules
          </div>
        )}

        {path.coursesLayout === "badges" ? (
          <CourseBadgesGrid path={path} />
        ) : (
          <CourseUnitsList path={path} itemVariants={itemVariants} />
        )}
      </div>
    </div>
  );
};
