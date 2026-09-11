import React from "react";
import Image from "next/image";
import { BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTINUING_EDUCATION } from "@/app/certifications/data";

/** Coursework that issued no certificate, presented as what it is: completed
 *  courses and learning paths from more than one issuer, at the same card
 *  size as a credential row. Server Component by design — nothing here
 *  expands, animates or tracks, so every issuer, code, title and course name
 *  is in the initial HTML with zero JavaScript.
 *
 *  On tone. An earlier pass stated the no-certificate fact four times —
 *  eyebrow, header, a red chip and a sentence — which read as an apology and
 *  buried the course. The fact is not hidden, but it is stated ONCE per card,
 *  in `formatNote`, in the fine-print slot beside the format where a reader
 *  looks for exactly that kind of detail. Accuracy needs one clear line; it
 *  does not need four. If you are tempted to add a second mention, edit
 *  `formatNote` instead.
 *
 *  What keeps this honest is structural, not typographic: CONTINUING_EDUCATION
 *  reaches no aggregation (see the contract in data.ts), the ENTRY type cannot
 *  express a verification URL, and data.test.ts gates all three exclusions.
 *  So the copy is free to lead with the course.
 *
 *  Two kinds of chip, one map. A course with a `badge` renders as a plain
 *  <a target="_blank"> to its PUBLIC, login-free badge page (HTTP 200
 *  logged-out; the page says "Bilal Ahamad has earned this award!") with
 *  the local thumbnail inline and an ink ExternalLink glyph so a link chip is
 *  distinguishable from a plain chip without hover; a course without one
 *  renders as the same chip as a <span>. That link IS a verification
 *  affordance, so it borrows exactly the ledger's verification vocabulary for
 *  that one purpose and nothing more: emerald on HOVER and FOCUS only — the
 *  ring ChildBadgesGrid puts on its Credly badges, PAIRED for the light theme
 *  rather than copied (`ring-emerald-400/70` is dark-tuned: 1.60:1 on the
 *  light card; `ring-emerald-700` measures 5.44:1 light, `emerald-400/70`
 *  5.31:1 dark — both clear WCAG 2.4.11's 3:1). Rest state stays the neutral
 *  chip so thirteen of them do not become thirteen green pills under a ledger
 *  that says "all verified" four times. No emerald text, no "Verify" word, no
 *  CheckCircle2, and never openVerifyUrl()/openBadgeUrl() — they fire GA
 *  "verify_*" events with provider "Credly". Nothing at ENTRY level links
 *  anywhere except the issuer's plain page, exactly as before.
 *
 *  Deliberately absent, every one of which the credential rows carry: the
 *  01…12 ledger numeral, the chevron disclosure, aria-expanded, the
 *  certificate thumbnail and its lightbox, and the Verify button.
 *
 *  Colour, measured (alpha-composited; light card ≈ #fefefe over #fafafa,
 *  dark card ≈ #0f0f11 over #09090b). Issuer hue lives on the TILE GROUND and
 *  nowhere else — `accent.tile` is a fixed hex with white type, so its ratios
 *  are identical in both themes: cardinal #8C1515 white 9.4:1 / white/80
 *  6.4:1; Google Blue #174EA6 white 7.85:1 / white/80 5.67:1. Neither hex is
 *  ever FOREGROUND on the page ground (cardinal 2.1:1 and #174EA6 2.5:1 on
 *  #09090b), and no `dark:text-blue-*` partner is possible without becoming
 *  the Verify / CHIP_OFFICIAL vocabulary. So everything on the page ground is
 *  ink: eyebrow and jump pill `text-ink/70 dark:text-ink/60` (6.39:1 light /
 *  7.34:1 dark on the page), the same pair on the `bg-ink/[0.05]` icon tile
 *  and status chip (6.08–6.24 / 6.91–7.06) and on the `bg-ink/[0.04]` course
 *  chips (6.31 / 6.97); meta `text-ink-muted dark:text-ink/55` (7.66 / 6.24)
 *  and fine print `text-ink-subtle dark:text-ink/50` (4.79 / 5.34) are the
 *  existing pairs. The chip is ink on every card — including Stanford's,
 *  which used to be cardinal — because the ledger's rule (CredentialRow.tsx)
 *  is that a chip is tinted by its MEANING, and "Completed" must not wear two
 *  colours down one section. Badge-chip hover fill `bg-emerald-500/[0.08]`
 *  keeps `text-ink` at 16.3:1 / 17.3:1. The path-page link's focus ring is
 *  `ring-ink/70 dark:ring-ink/60` (6.51 / 7.24 on the card) — it mirrors the
 *  link's own text pair rather than the neutral `ring-line/40`, which measures
 *  only 2.53:1 on the light card, under WCAG 1.4.11's 3:1 for a focus
 *  indicator (3.81 dark). Not emerald: this link is the issuer's syllabus
 *  page, not a verification affordance. */

/** Issuers in entry order, de-duplicated — the eyebrow is derived from data,
 *  so a new issuer never needs an edit here. Renders "Google Skills · Stanford". */
const EYEBROW = Array.from(
  new Set(CONTINUING_EDUCATION.map((entry) => entry.issuerShort)),
).join(" · ");

/** Shared geometry of both course-chip kinds. Sits on t-label (size-only), so
 *  the weight is allowed beside it. */
const COURSE_CHIP =
  "inline-flex max-w-full items-center rounded-md border t-label font-semibold";

export function ContinuingEducation() {
  return (
    // Separator plus roughly the ledger's own inter-group rhythm. A second
    // coloured hairline would just read as a fifth group. This wrapper also
    // keeps the <section> a grandchild of the page's max-w-7xl container, so
    // the `.max-w-7xl.mx-auto.px-6 > section` probe in mobile-spacing.spec.ts
    // stays unmatched exactly as it is today.
    <div className="mt-16 border-t border-line/10 pt-12 md:mt-24 md:pt-16">
      <section
        id="continuing-education"
        aria-labelledby="continuing-education-heading"
        className="scroll-mt-28"
      >
        {/* Group-header geometry, minus the "{n} credentials · all verified"
            counterpart — that slot was the loudest of the four disclaimers and
            the section reads better without it. The eyebrow names every issuer
            below, so the header belongs to none of them and wears no
            institution colour: "no colour" and "no count" are the two quiet
            signals that this is a different kind of section. */}
        <div className="mb-5 flex min-w-0 items-center gap-3 md:mb-6 md:gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line/15 bg-ink/[0.05] text-ink/70 dark:text-ink/60">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="t-label font-bold uppercase tracking-widest text-ink/70 dark:text-ink/60">
              {EYEBROW}
            </p>
            <h2 id="continuing-education-heading" className="t-h2 text-ink">
              Continuing Education
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          {CONTINUING_EDUCATION.map((entry) => (
            <article
              key={entry.id}
              id={entry.id}
              data-testid="continuing-education-entry"
              aria-labelledby={`${entry.id}-heading`}
              className="glass-card relative overflow-hidden rounded-2xl border border-line/10 scroll-mt-28"
            >
              {/* Same row metrics as CredentialRow's header, minus the numeral,
                  the chevron and the Verify control. */}
              <div className="flex min-h-[72px] flex-col gap-3 px-4 py-3 md:min-h-[96px] md:flex-row md:items-center md:gap-4 md:px-6 md:py-4">
                {/* The designed tile, at the exact size of a certificate
                    thumbnail (h-11 w-16 / md:h-14 md:w-[76px]) — but it leads
                    with an institution and a code where a certificate
                    thumbnail shows a document, and it is not clickable. No
                    raster asset, so the wordmark and code stay indexable text
                    rather than pixels. `accent.tile` is the only place an
                    issuer colour appears. */}
                <span
                  className={cn(
                    "relative flex h-11 w-16 shrink-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg ring-1 ring-inset ring-white/25 md:h-14 md:w-[76px]",
                    entry.accent.tile,
                  )}
                >
                  {/* accent.wordmark is family/weight only; it sits on t-label,
                      a size-only token, the same slot every font-mono in this
                      repo uses. */}
                  <span className={cn("t-label text-white", entry.accent.wordmark)}>
                    {entry.wordmark}
                  </span>
                  <span className="t-label font-bold uppercase tracking-wider text-white/80">
                    {entry.tileCode}
                  </span>
                </span>

                <div className="min-w-0 flex-1">
                  {/* line-clamp-2 at EVERY width, where the ledger uses
                      md:line-clamp-1. The longest of these titles is 51
                      characters, and at 768–1000px a one-line clamp would cut
                      it — and a title ending "…Certification" is precisely
                      the misread this section must never produce, so the Gen
                      AI heading also never contains that word at all.
                      continuing-education.spec.ts measures that neither long
                      heading is clamped at 375 / 768 / 900 / 1280. */}
                  <h3
                    id={`${entry.id}-heading`}
                    className="t-h3 text-ink/90 line-clamp-2"
                  >
                    {entry.title}
                  </h3>
                  <p className="mt-0.5 t-caption text-ink-muted dark:text-ink/55">
                    {entry.issuer} · {entry.meta}
                  </p>
                </div>

                {/* Sits where a credential row prints its chips, and carries the
                    achievement rather than the absence of a certificate. Tinted
                    by MEANING like the ledger's chips: "Completed" reserves no
                    colour, so it is ink on every card (see the colour note).
                    rounded-full + uppercase keeps it visually distinct from the
                    rounded-md course chips below. */}
                <span className="inline-flex shrink-0 items-center self-start rounded-full border border-line/20 bg-ink/[0.05] px-3 py-1 t-label font-bold uppercase tracking-wider text-ink/70 dark:border-line/25 dark:text-ink/60 md:self-auto">
                  {entry.status}
                </span>
              </div>

              {/* Lower band, STACKED (not md:flex-row as before): thirteen
                  chips plus a ~130-character formatNote cannot share one row
                  without the aside forcing wraps or overflow, so the courses
                  get the full card width and the fine print + link sit on a
                  footer line beneath. Costs the Stanford card one line. */}
              <div className="flex flex-col gap-3 border-t border-line/10 px-4 py-3 md:px-6">
                <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                  {entry.courses.map((course) => (
                    <li key={course.title} className="min-w-0 max-w-full">
                      {course.badge ? (
                        <a
                          href={course.badge.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            COURSE_CHIP,
                            "group/badge gap-2 border-line/10 bg-ink/[0.04] py-1 pl-1 pr-2.5 text-ink/70 transition-colors hover:border-emerald-700/50 hover:bg-emerald-500/[0.08] hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:text-ink/60 dark:hover:border-emerald-400/50 dark:focus-visible:ring-emerald-400/70",
                          )}
                        >
                          {/* 240px WebP on an opaque white ground → explicit
                              bg-white so it reads as the same white sticker in
                              dark (19:1 edge against the dark card — exactly how
                              the ledger shows certificate previews). No blend or
                              opacity tricks: multiply would blacken the art,
                              opacity would grey the white. alt="" because the
                              link text already names the course. */}
                          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-sm bg-white ring-1 ring-line/10 dark:ring-white/15">
                            <Image
                              src={course.badge.image}
                              alt=""
                              fill
                              sizes="28px"
                              className="object-contain"
                            />
                          </span>
                          <span className="min-w-0">{course.title}</span>
                          {/* No opacity modifier: at `opacity-60` this glyph
                              composited to ~42% ink over the chip = 2.63:1
                              light / 3.34:1 dark, under WCAG 1.4.11's 3:1 for
                              a non-text UI part — and this glyph is what makes
                              a link chip distinguishable from a plain one
                              without hover, so it has to clear that bar. At
                              the chip's own ink it measures 6.31:1 / 6.97:1. */}
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                          {/* `badge.kind` changes ONLY the spoken suffix: a
                              lab-based skill badge (also on Credly) and an
                              on-demand completion badge look identical on the
                              chip, exactly as Google's Credentials page files
                              both under "Completions". */}
                          <span className="sr-only">
                            {` — ${course.badge.kind} badge on Google Skills, opens in a new tab`}
                          </span>
                        </a>
                      ) : (
                        <span
                          className={cn(
                            COURSE_CHIP,
                            "border-line/10 bg-ink/[0.04] px-2.5 py-1 text-ink/70 dark:text-ink/60",
                          )}
                        >
                          {course.title}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  {/* The one and only statement of the record status, in the
                      fine-print slot next to the format. See the tone note at
                      the top of this file before adding a second one. */}
                  <span className="min-w-0 max-w-prose t-caption text-ink-subtle dark:text-ink/50">
                    {entry.formatNote}
                  </span>
                  <a
                    href={entry.courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 t-label font-semibold uppercase tracking-wider text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 dark:text-ink/60 dark:focus-visible:ring-ink/60"
                  >
                    {entry.courseUrlLabel}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    <span className="sr-only"> on {entry.issuerShort} (opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
