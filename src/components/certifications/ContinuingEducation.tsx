import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import { CONTINUING_EDUCATION } from "@/app/certifications/data";

/** Coursework that issued no certificate, presented as what it is: a completed
 *  Stanford School of Engineering course, at the same card size as a credential
 *  row. Server Component by design — nothing here expands, animates or tracks,
 *  so the issuer, the course code and all five topics are in the initial HTML
 *  with zero JavaScript.
 *
 *  On tone. An earlier pass stated the no-certificate fact four times — eyebrow,
 *  header, a red chip and a sentence — which read as an apology and buried the
 *  course. The fact is not hidden, but it is stated ONCE, in `formatNote`, in
 *  the fine-print slot beside the format where a reader looks for exactly that
 *  kind of detail. Accuracy needs one clear line; it does not need four. If you
 *  are tempted to add a second mention, edit `formatNote` instead.
 *
 *  What keeps this honest is structural, not typographic: CONTINUING_EDUCATION
 *  reaches no aggregation (see the contract in data.ts), the type cannot express
 *  a verification URL, and data.test.ts gates all three exclusions. So the copy
 *  is free to lead with the course.
 *
 *  Deliberately absent, every one of which the credential rows carry: the 01…12
 *  ledger numeral, the chevron disclosure, aria-expanded, the certificate
 *  thumbnail and its lightbox, and the Verify button. The single outbound
 *  control is a native <a> — never openVerifyUrl(), which would fire a
 *  `verify_certificate` event for a credential that does not exist. Emerald
 *  (reserved for verification, see data.ts) and the blue Verify pair
 *  (CredentialRow.tsx:216) appear nowhere: on this page those colours mean
 *  "you can verify this".
 *
 *  Colour, measured. Cardinal #8C1515 is the mirror image of the *-300 trap
 *  documented in CredentialGroup.tsx: as TEXT it is 9.0:1 on the light page
 *  ground but only 2.1:1 on #09090b. So it is used two ways and only two ways.
 *  (1) As a GROUND on the tile, where both layers are fixed hexes and every
 *  ratio is identical in light and dark — white 9.4:1, white/80 6.4:1.
 *  (2) As FOREGROUND on the page ground, always paired `text-[#8C1515]
 *  dark:text-red-300` (9.0:1 light / 10.5:1 dark), exactly the shape of the
 *  LIGHT_EYEBROW map. Do NOT "fix" the dark theme by lightening the fill:
 *  #A31F1F still measures only 2.63:1 against #09090b. */
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
            the section reads better without it. The eyebrow now names the
            institution, which is the strongest true thing here. */}
        <div className="mb-5 flex min-w-0 items-center gap-3 md:mb-6 md:gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#8C1515]/25 bg-[#8C1515]/10 text-[#8C1515] dark:border-red-300/25 dark:bg-red-400/10 dark:text-red-300">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="t-label font-bold uppercase tracking-widest text-[#8C1515] dark:text-red-300">
              Stanford School of Engineering
            </p>
            <h2 id="continuing-education-heading" className="t-h2 text-ink">
              Continuing Education
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          {CONTINUING_EDUCATION.map((entry) => (
            <div
              key={entry.id}
              className="glass-card relative overflow-hidden rounded-2xl border border-line/10"
            >
              {/* Same row metrics as CredentialRow's header, minus the numeral,
                  the chevron and the Verify control. */}
              <div className="flex min-h-[72px] flex-col gap-3 px-4 py-3 md:min-h-[96px] md:flex-row md:items-center md:gap-4 md:px-6 md:py-4">
                {/* The designed tile, at the exact size of a certificate
                    thumbnail (h-11 w-16 / md:h-14 md:w-[76px]) — but it leads
                    with an institution and a course code where a certificate
                    thumbnail shows a document, and it is not clickable. No
                    raster asset, so "Stanford" and "XEE100" stay indexable
                    text rather than pixels. */}
                <span className="relative flex h-11 w-16 shrink-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg bg-[#8C1515] ring-1 ring-inset ring-white/25 md:h-14 md:w-[76px]">
                  {/* The site's only serif, and the only font-family class in
                      this file. It sits on t-label — a size-only token, the
                      same slot every font-mono in this repo uses. */}
                  <span className="t-label font-serif text-white">
                    {entry.wordmark}
                  </span>
                  <span className="t-label font-bold uppercase tracking-wider text-white/80">
                    {entry.courseCode}
                  </span>
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="t-h3 text-ink/90 line-clamp-2 md:line-clamp-1">
                    {entry.title}
                  </h3>
                  <p className="mt-0.5 t-caption text-ink-muted dark:text-ink/55">
                    {entry.meta}
                  </p>
                </div>

                {/* Sits where a credential row prints its chips, and carries the
                    achievement rather than the absence of a certificate. A
                    module count would only repeat the five chips directly
                    below it. Cardinal, not violet or emerald: violet is the
                    specializations' "N Courses" chip and emerald is reserved
                    page-wide for verification, so either would borrow a
                    credential signal. Beside the Stanford tile, cardinal reads
                    as the institution rather than as a warning. */}
                <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-[#8C1515]/30 bg-[#8C1515]/[0.06] px-3 py-1 t-label font-bold uppercase tracking-wider text-[#8C1515] dark:border-red-300/25 dark:bg-red-400/[0.08] dark:text-red-300 md:self-auto">
                  {entry.status}
                </span>
              </div>

              {/* The substance: what the course actually covered. */}
              <div className="flex flex-col gap-3 border-t border-line/10 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-6 md:px-6">
                <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                  {entry.topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-md border border-line/10 bg-ink/[0.04] px-2.5 py-1 t-label font-semibold text-ink/70 dark:text-ink/60"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>

                <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1">
                  {/* The one and only statement of the record status, in the
                      fine-print slot next to the format. See the tone note at
                      the top of this file before adding a second one. */}
                  <span className="t-caption text-ink-subtle dark:text-ink/50">
                    {entry.formatNote}
                  </span>
                  <a
                    href={entry.courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 t-label font-semibold uppercase tracking-wider text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink dark:text-ink/60"
                  >
                    Course page
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
