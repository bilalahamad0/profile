"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ExternalLink, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LearningPathData, SpecializationData } from "@/app/certifications/data";
import { panelBadgeVariants, reducedBadgeVariants } from "./CollapsePanel";
import { openBadgeUrl, openVerifyUrl, trackCourseBadge } from "./verify";
import { gridPositions } from "./gridPositions";

/**
 * 2-3-2 staggered ("circular") grid of badge tiles for the Pro Cert.
 *
 * Layout (7 items, every breakpoint):
 *
 *     [B1]  [B2]
 *   [B3] [B4] [B5]
 *     [B6]  [B7]
 *
 * Implementation notes:
 * - We render a single `<ol>` (one `<li>` per course) so screen readers and
 *   tests that count children-as-list-items both keep working.
 * - Visual 2-3-2 placement uses a 6-col CSS grid with explicit
 *   `col-start` / `col-end` classes per item index, applied at all sizes so
 *   the staggered rhythm holds on mobile too.
 */

/** The Professional Certificate's 6-col pyramid track. Frozen art: the grid it
 *  produces is asserted by tests/e2e/certifications.spec.ts. The coursework
 *  gallery below has its own track (COURSE_GRID_OL) because it fills a
 *  full-width panel rather than half of a two-column one, and its unit turns
 *  sideways on a phone. `TILE_PILL` stays shared, so the two grids' pills
 *  cannot drift. */
const GRID_OL = "m-0 grid list-none grid-cols-6 gap-x-0 gap-y-4 p-0 md:gap-y-5";
const TILE_ITEM = "flex flex-col items-center gap-2";
const TILE_PILL =
  "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 t-label font-bold uppercase tracking-wider text-emerald-700 transition-colors dark:text-emerald-300";

export const ChildBadgesGrid = ({ spec }: { spec: SpecializationData }) => {
  // reducedBadgeVariants, never `undefined` — see the comment on that const.
  const badgeVariants = useReducedMotion() ? reducedBadgeVariants : panelBadgeVariants;
  const positions = gridPositions(spec.children.length);
  return (
    <ol
      data-testid={spec.testId}
      className={cn(GRID_OL, "w-full max-w-[460px] place-items-center")}
    >
      {spec.children.map((child, index) => {
        const { badge } = child;
        if (!badge) return null;
        return (
          <motion.li
            key={child.step}
            variants={badgeVariants}
            className={cn(TILE_ITEM, positions[index])}
          >
            <button
              type="button"
              onClick={() =>
                openBadgeUrl(badge.credlyUrl, {
                  title: child.title,
                  specialization: spec.titleLines[0],
                  step: child.step,
                })
              }
              aria-label={`View ${child.title} verified badge on Credly`}
              className="group/badge relative h-[76px] w-[76px] shrink-0 rounded-full transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 md:h-[112px] md:w-[112px]"
            >
              <Image
                src={badge.image}
                alt={`${child.title} verified badge`}
                fill
                sizes="(max-width: 768px) 76px, 112px"
                className="object-contain drop-shadow-[0_4px_16px_rgba(16,185,129,0.25)]"
              />
            </button>
            <button
              type="button"
              onClick={() =>
                openVerifyUrl(child.url, {
                  title: child.title,
                  issuer: spec.issuer,
                  step: child.step,
                  specialization: spec.titleLines[0],
                })
              }
              aria-label={`Verify ${child.title} certificate on Coursera`}
              className={cn(
                TILE_PILL,
                "group/verify hover:border-emerald-300/60 hover:bg-emerald-500/20 hover:text-emerald-800 dark:hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70",
              )}
            >
              Verify
              <ExternalLink className="h-3 w-3 transition-transform group-hover/verify:translate-x-0.5" />
            </button>
          </motion.li>
        );
      })}
    </ol>
  );
};

/** Column count for the full-width course gallery. The panel is ONE column
 *  now (see PathBody), so this grid no longer shares ChildBadgesGrid's frozen
 *  6-col `gridPositions()` pyramid: a pyramid sized for 7 Credly medallions in
 *  a half-width column left 4 or 5 course tiles stranded in a centred strip
 *  with dead space either side, which is the exact weakness that change
 *  removed. A plain gallery track spans the panel instead, and the column count
 *  is chosen per unit count so the rows come out full: 3 → one row of three,
 *  4 → one row of four, 5 → one row of five. Literal class strings, because
 *  Tailwind only ships the classes it can see in the source. `gridPositions()`
 *  itself is untouched and still drives the Professional Certificate grid above.
 *
 *  Below `sm` every count collapses to ONE column, because the tile turns
 *  sideways there (see COURSE_TILE_ITEM). */
const COURSE_GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-6",
  7: "grid-cols-1 sm:grid-cols-4 lg:grid-cols-7",
};
const COURSE_GRID_COLS_DEFAULT = "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

/** Counts whose DESKTOP shape cannot be written as "n equal columns".
 *
 *  The SMB path is the only one: 13 tiles in a 5-column track come out 5·5·3,
 *  and the short last row hangs on the left edge with two tiles' worth of hole
 *  beside it. The owner asked for 4·5·4 with every row centred (desktop only).
 *
 *  Rows of 4 and rows of 5 cannot both be full rows of the same track, so the
 *  centring is done on a 20-COLUMN track with every tile spanning 4:
 *
 *      cols  1   3         11        19
 *      row 1     [ 4 tiles, cols 3→19 ]      ← 2 columns of margin each side
 *      row 2 [ 5 tiles, cols 1→21 ]          ← full bleed
 *      row 3     [ 4 tiles, cols 3→19 ]      ← 2 columns of margin each side
 *
 *  Only the first tile of each row needs an explicit `col-start`; the rest
 *  auto-flow after it, and a start that no longer fits the current row pushes
 *  its tile to the next one. The arithmetic is exact, not approximate: with
 *  track width W and gap g, a 20-col column is w = (W − 19g)/20, so a span-4
 *  tile measures 4w + 3g = W/5 − 0.8g — the SAME width a 5-column track gives
 *  (W − 4g)/5. The tiles therefore do not change size, and the two margins are
 *  2w + 2g each, equal by construction.
 *
 *  DESKTOP ONLY (`lg`, 1024px+). Below `sm` the unit turns sideways in one
 *  column; `sm` and `md` keep the track they already had. */
const COURSE_GRID_ROW_PLANS: Record<
  number,
  { track: string; span: string; starts: readonly string[] }
> = {
  13: {
    track: "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-20",
    span: "lg:col-span-4",
    starts: [
      "lg:col-start-3", "", "", "",
      "lg:col-start-1", "", "", "", "",
      "lg:col-start-3", "", "", "",
    ],
  },
};

/** The unit itself: a ROW below `sm`, and the same centred stack TILE_ITEM
 *  gives a credential tile — art over caption over pill — from `sm` up.
 *
 *  A phone has one column of ~295px. Stacked, each unit costs the tile (76px)
 *  PLUS its wrapped course title PLUS a pill that wraps to three lines in a
 *  139px half-column — 13 of those ran 400px taller than the two-column pyramid
 *  this panel replaced. Turned sideways the title and pill sit BESIDE the art in
 *  the 205px left over, each on one or two lines, and the unit costs exactly the
 *  height of its own tile. Same tile, same caption, same pill, same order — the
 *  reading direction is what changes, and it matches the module rows Stanford's
 *  card already renders at that width. */
const COURSE_TILE_ITEM = "flex min-w-0 items-center gap-3 text-left sm:flex-col sm:gap-2 sm:text-center";
/** The caption + pill stack, which only exists as a box below `sm`: at `sm` and
 *  up `contents` dissolves it so both land back in the tile's own column flow,
 *  where `mt-auto` can align the pills of a row to one baseline. */
const COURSE_TILE_TEXT = "flex min-w-0 flex-1 flex-col items-start gap-1.5 sm:contents";

/** The gallery track. `items-stretch` is load-bearing: it makes every tile in a
 *  row as tall as the tallest one, which is the only thing that lets the
 *  `mt-auto` on the pill below push each pill to a shared baseline. With items
 *  sized to their own content, `mt-auto` is inert and the pills sit one caption
 *  line apart wherever a 2-line and a 3-line course title share a row.
 *
 *  Justification is left at `stretch`, NOT centred: a centred item is sized to
 *  its own content, which squeezed the caption and the (longer, provider-aware)
 *  pill into a narrower box than the column it sits in and cost a wrapped line
 *  per tile at 375px. Stretched items take the whole column; the tile, caption
 *  and pill stay centred inside them via COURSE_TILE_ITEM's `items-center`. */
const COURSE_GRID_OL =
  "m-0 grid w-full list-none items-stretch gap-x-4 gap-y-5 p-0 md:gap-y-6";

/** One tile footprint at every count and every width. The old two-step (88px
 *  once past 7 units) existed because 13 tiles had to fit a half-width column;
 *  a full-width track holds 112px tiles at every breakpoint, so the atom is now
 *  the same size on all six cards and identical to ChildBadgesGrid's. */
const COURSE_TILE_BOX = "relative h-[76px] w-[76px] shrink-0 md:h-[112px] md:w-[112px]";

/** The badge-less tile's marker, in the slot where a badged tile shows Verify
 *  (owner's call, 2026-09-11). Same box geometry as `TILE_PILL` — rounded-full,
 *  `px-2.5 py-0.5`, `t-label font-bold uppercase` — and the same `mt-auto`, so
 *  the marker lands on the row's shared pill baseline instead of leaving the one
 *  unit in an `items-stretch` row with nothing bottom-aligned.
 *
 *  NEUTRAL ON PURPOSE, and the hue was picked by elimination: emerald is this
 *  page's verification colour, blue is the Verify control and CHIP_OFFICIAL,
 *  violet is the Courses chip, amber is the skills chips and the Credly glow.
 *  None may be spent on a tile with nothing to verify. `border-line/15` on
 *  `bg-ink/[0.06]` with `text-ink/70` / `dark:text-ink/60` type is the page's
 *  existing neutral-chip treatment, and the type measures (painted pixels, 1440,
 *  card open) rgb(83,87,90) on the chip's own ground rgb(222,233,237) = 5.90:1
 *  light, and rgb(165,169,171) on rgb(30,40,45) = 6.35:1 dark — past the 4.5:1
 *  text bar in both themes. The hairline border is pure decoration: it is not
 *  the only thing delimiting anything, so 1.4.11 does not apply to it.
 *
 *  It carries no link, no href, no tabindex and no ExternalLink chevron, so it
 *  is not a control and not a tab stop, and it is `aria-hidden` for the same
 *  reason the art is: the caption's `sr-only` "— hands-on lab" suffix already
 *  speaks this fact, and voicing the chip too would announce it twice.
 *  Deliberately NO `tracking-wider` beside `t-label` (CLAUDE.md: exactly one
 *  `t-*` class, no raw tracking/leading/size/weight next to it) — TILE_PILL
 *  carries one only because it is frozen art. */
const COURSE_TILE_MARKER =
  "mt-auto inline-flex max-w-full items-center rounded-full border border-line/15 bg-ink/[0.06] px-2.5 py-0.5 t-label font-bold uppercase text-ink/70 dark:text-ink/60";

/** The art slot of a course the issuer publishes no badge for.
 *
 *  It occupies a NORMAL tile slot — same `COURSE_TILE_BOX`, same caption, same
 *  column — so the row stays full and centred and the path's contents stay
 *  complete and ATS-visible. What it does not carry is anything that would
 *  imply an award: no badge art, no link, no Verify pill. There is nothing to
 *  verify, so there is no affordance offering to.
 *
 *  WHAT IT SHOWS: a `FlaskConical` glyph — the conventional "hands-on lab" mark
 *  and the issuer's own activity type, since Google files this unit under
 *  `/focuses/<id>`, its lab route. So the slot depicts what the unit IS rather
 *  than what it lacks, which is why no disclaimer vocabulary is needed anywhere
 *  on this page. It replaced the bare word "LAB" typeset in this slot (owner's
 *  call, 2026-09-11: text alone read as a placeholder); the word survives as the
 *  tile's marker in the PILL slot, where badged tiles show Verify.
 *
 *  WHY A LUCIDE ICON AND NOT AN ASSET. `lucide-react` is already this page's
 *  icon vocabulary (CredentialRow, CredentialGroup, PathBody, and the
 *  ExternalLink in the pill above), so the mark themes with `currentColor`,
 *  stays crisp at both tile sizes, costs no request and adds nothing to the
 *  image budget — and nothing here has to be hand-rolled as an SVG path.
 *  Sized at 36px (76px tile) / 56px (112px tile), i.e. half the box, which is
 *  the optical weight of the badge artwork it stands in for once that art's own
 *  white margin is discounted, with generous padding left inside the frame.
 *  `strokeWidth` 1.5 matches the page's other lucide marks at display sizes.
 *
 *  It is driven by `isLab` on the COURSE, never by `!badge`: "no badge was
 *  issued" and "this is a lab" are different facts, and only the second one
 *  licenses the mark. A badge-less course with no `isLab` falls back to its step
 *  numeral rather than asserting something unrecorded.
 *
 *  CONTRAST (painted pixels, 1440, card OPEN — the only state this tile has, and
 *  the one where the card's gradient wash is applied). The stroke keeps the same
 *  `text-ink/70` / `dark:text-ink/60` ink the numeral fallback uses. Measured by
 *  reading the modal pixel of the tile ground and letting the browser composite
 *  the token over it: light, ink/70 → rgb(86,89,90) on ground rgb(230,240,239) =
 *  6.08:1; dark, ink/60 → rgb(163,167,167) on ground rgb(25,36,36) = 6.55:1.
 *  Those are the single-stroke figures; where the flask's outline crosses itself
 *  the painted pixel reads 12.18:1 light / 11.57:1 dark, so 6.08 is the floor.
 *  The glyph is a meaningful non-text graphic (≥ 3:1 under WCAG 1.4.11) and
 *  clears the 4.5:1 text bar as well, so the same token is safe for the "Lab"
 *  marker's type. Do not lighten it.
 *
 *  WHY IT IS NOT MISTAKEN FOR A BROKEN IMAGE. The badged branch puts its art on
 *  an explicit `bg-white` sticker with a hairline ring and a drop shadow, so a
 *  failed <Image> there is an empty WHITE box. This tile is the opposite frame —
 *  a tinted `bg-ink/[0.04]` ground, no white, no shadow — carrying a vector
 *  mark, which no load failure produces.
 *
 *  WHY NOT A NUMERAL HERE. PathBody's counter slot, a few hundred pixels up the
 *  SAME card, is already a large `t-h2 tabular-nums` figure on a `border-line/10
 *  bg-ink/[0.04]` ground, meaning "3 course badges". A second grey numeral box
 *  in the grid meaning "step 2" read as the same kind of object. A lab glyph
 *  carries no such collision. Both the icon and the fallback numeral are
 *  `aria-hidden` — they are art. What a screen reader announces is the caption
 *  beside them, which names the course and, on a lab, carries an `sr-only`
 *  "— hands-on lab" suffix so the spoken tile says what the painted one does
 *  (see the badge-less arm below). A badge-less course with no `isLab` adds
 *  nothing, because nothing about it has been recorded. */
const CourseUnitTile = ({ step, isLab }: { step: number; isLab?: true }) => (
  <span
    className={cn(
      COURSE_TILE_BOX,
      "grid place-items-center rounded-xl border border-line/10 bg-ink/[0.04]",
    )}
  >
    {isLab ? (
      <FlaskConical
        aria-hidden
        strokeWidth={1.5}
        className="h-9 w-9 text-ink/70 md:h-14 md:w-14 dark:text-ink/60"
      />
    ) : (
      <span aria-hidden className="t-h2 tabular-nums text-ink/70 dark:text-ink/60">
        {step}
      </span>
    )}
  </span>
);

/** The path variant of the credential badge grid: same <ol>/<li> shape, same
 *  tile footprint, same emerald pill, same panelBadgeVariants stagger — laid
 *  out as a full-width gallery rather than the frozen pyramid. Differences from
 *  ChildBadgesGrid, every one of them forced by the data or the art:
 *
 *  • ONE destination per unit (the public badge page), so the whole tile is a
 *    single <a> rather than the Pro Cert's badge button + Verify pill, which
 *    point at two different places (Credly badge, Coursera certificate). Two
 *    controls here would be two links to the same URL.
 *  • The art is an OPAQUE white rectangular card (lossy VP8 → no alpha,
 *    ~600px wide) that prints its own course title and the words "COMPLETION
 *    BADGE" / "SKILL BADGE". A `rounded-full` frame would crop it, so the tile
 *    is `rounded-xl` on an explicit `bg-white` with a hairline ring — the same
 *    white-sticker treatment the ledger gives certificate previews (19.11:1
 *    edge on the dark card; on the light card the edge is 1.01:1, so the ring
 *    plus a soft shadow carries it and WCAG 1.4.11's 3:1 lands on the artwork,
 *    caption and pill, which are what identify the control).
 *  • A visible caption at `t-small`. The Pro Cert's Credly art carries its
 *    course name in legible type; at 112px the Google art does not. Course
 *    titles are primary content — `t-label` (11px, the documented floor) is for
 *    meta, and SpecializationBody's list uses `t-small` for these same strings.
 *
 *  NOT EVERY UNIT HAS A BADGE, and the grid has a second arm for the ones that
 *  do not (CourseUnitTile, below). That arm was briefly deleted on the reading
 *  that only the "Welcome:" / "Wrap Up:" bookends ever lacked a badge; path
 *  4459 disproved it — its step 2 is a hands-on lab that Google issues no badge
 *  for at all. Narrowing the grid to badged units would silently drop a course
 *  from a path whose chip counts it, so the grid maps `path.courses` whole and
 *  data.test.ts pins exactly which courses are badge-less instead of forbidding
 *  the case.
 *
 *  THE GLOW marks the Credly-hosted badges and is driven off
 *  `badge.provider`, never off `badge.kind` and never off a filename. Provider,
 *  not kind, is the honest trigger: one of the four skill badges (27886491) is
 *  hosted only on Google Skills, so keying the glow off `kind` would light a
 *  fifth tile and break "only the Credly badges glow". It reuses the ledger's
 *  own award vocabulary (`SpecializationData.badgeHalo`: a blurred tint behind
 *  the art, plus a matching coloured shadow on the tile), in AMBER, the hue this
 *  page already reserves for skills (`CHIP_SKILLS`) — emerald would collide with
 *  verification and blue with the Verify/Official controls. Because the art is
 *  an opaque white card, the halo has to sit OUTSIDE the tile's `overflow-hidden`
 *  frame or it would read as a smudge under a white sticker; hence the extra
 *  wrapper span, which also carries the hover scale so the glow scales with it.
 *
 *  Emerald is legitimate on the pill and nowhere else in these two sections: a
 *  course badge page IS public, login-free and verifiable, so the pill reads
 *  "Verify in Credly" on a Credly badge and a bare "Verify" on every other
 *  provider (the owner's wording, 2026-09-11). The word is never applied to a
 *  path, only to a badge. */
export const CourseBadgesGrid = ({ path }: { path: LearningPathData }) => {
  // reducedBadgeVariants, never `undefined` — see the comment on that const.
  const badgeVariants = useReducedMotion() ? reducedBadgeVariants : panelBadgeVariants;
  // EVERY unit, badged or not. The track is sized by the course count, so a
  // badge-less course takes a real slot and its row stays full — dropping it
  // would leave the grid disagreeing with the chip that counts it.
  const units = path.courses;
  const plan = COURSE_GRID_ROW_PLANS[units.length];
  const columns =
    plan?.track ?? COURSE_GRID_COLS[units.length] ?? COURSE_GRID_COLS_DEFAULT;

  return (
    <ol data-testid={path.testId} className={cn(COURSE_GRID_OL, columns)}>
      {units.map((course, index) => {
        // `const`, so the narrowing below survives into the click closure —
        // no `course.badge!` anywhere in this component.
        const { badge } = course;
        // A lab-based skill badge, hosted on Credly. Read from the DATA, so a
        // sixth path with a Credly badge lights up without touching this file.
        const glow = badge?.provider === "Credly";
        return (
          <motion.li
            key={course.step}
            variants={badgeVariants}
            className={cn(
              COURSE_TILE_ITEM,
              "h-full sm:px-1",
              plan && [plan.span, plan.starts[index]],
            )}
          >
            {badge ? (
              <a
                href={badge.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackCourseBadge({
                    title: course.title,
                    provider: badge.provider,
                    kind: badge.kind,
                    coursework: path.titleLines[0],
                  })
                }
                className={cn(
                  COURSE_TILE_ITEM,
                  // h-full/w-full so the link fills the stretched <li>; without a
                  // filled box there is no slack for `mt-auto` to distribute.
                  "group/badge h-full w-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400/70",
                )}
              >
                <span
                  className={cn(
                    COURSE_TILE_BOX,
                    "transition-transform duration-300 group-hover/badge:scale-110",
                  )}
                >
                  {glow ? (
                    // `inset-0`, NOT a negative inset: the glow is the blur
                    // bleeding past the box, so the element itself must stay
                    // inside the tile. A `-inset-2` halo painted the same glow
                    // but made the wrapper's scrollWidth 8px wider than its
                    // clientWidth, which is exactly the signal the e2e reads as
                    // "this tile clips its text". Layout-neutral decoration
                    // keeps that assertion strict.
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-xl bg-amber-400/70 blur-lg dark:bg-amber-300/60"
                    />
                  ) : null}
                  <span
                    className={cn(
                      "absolute inset-0 overflow-hidden rounded-xl bg-white ring-1 ring-line/15 dark:ring-white/15",
                      glow
                        ? "shadow-[0_4px_20px_rgba(245,158,11,0.65)] ring-amber-500/60 dark:ring-amber-300/60"
                        : "shadow-[0_2px_10px_rgba(0,0,0,0.10)]",
                    )}
                  >
                    {/* alt="" — the link's own text already names the course. */}
                    <Image
                      src={badge.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 76px, 112px"
                      className="object-contain p-1"
                    />
                  </span>
                </span>
                <span className={COURSE_TILE_TEXT}>
                  {/* The ISSUER'S course title, and nothing after it. A muted
                      "(Credly: …)" parenthetical used to follow on the one tile
                      whose destination page carries a different name; the owner
                      removed it on 2026-09-11. Where the two names differ, the
                      difference is recorded in a comment on that course in
                      data.ts, never on the page. */}
                  <span className="min-w-0 break-words t-small font-semibold text-ink/88">
                    {course.title}
                  </span>
                  <span
                    className={cn(
                      TILE_PILL,
                      // `max-w-full` + the default `whitespace-normal` let the
                      // longer Credly label WRAP inside the pill rather than
                      // overflow a narrow tile — the label is never truncated
                      // and never abbreviated. It sets on one line in the
                      // sideways unit at 375px and on two in a gallery column
                      // at 1440px; either way scrollWidth === clientWidth on every
                      // visible span, asserted in the e2e at both widths.
                      "mt-auto max-w-full text-center",
                      // emerald-800 replaces TILE_PILL's emerald-700 (twMerge keeps
                      // the later text-*). Measured by reading the painted pixel
                      // under the glyphs on the OPEN card — the only state this
                      // pill has, and the one where the gradient wash is applied at
                      // opacity-50: the pill's own bg-emerald-500/10 resolves to
                      // rgb(213,239,238) light, where emerald-700 is 4.55:1 —
                      // riding the AA line — and emerald-800 is 6.31:1. Dark is
                      // unchanged (emerald-300, 10.07:1). emerald-800 is already
                      // the hover colour, so resting and hover now agree. Scoped to
                      // this grid on purpose: the specialization Verify pill that
                      // shares TILE_PILL is frozen art (and measures 4.35:1 light
                      // on its own card — a pre-existing defect, not this branch's
                      // to fix).
                      "text-emerald-800 group-hover/badge:border-emerald-300/60 group-hover/badge:bg-emerald-500/20 group-hover/badge:text-emerald-800 dark:group-hover/badge:text-emerald-200",
                    )}
                  >
                    {/* "Verify in Credly" on a Credly badge; a bare "Verify"
                        on every other provider (today only Google Skills) —
                        the owner's wording, 2026-09-11. Driven off
                        `badge.provider`, never off a per-course list, so a
                        seventh path's badges label themselves.

                        WCAG 2.5.3 (Label in Name) holds either way: the
                        accessible name of this <a> is composed of the course
                        title, this pill's text and the sr-only suffix, so it
                        CONTAINS the visible string — "Verify" on a Google
                        Skills tile, "Verify in Credly" on a Credly one. The
                        sr-only suffix below still names the platform, which is
                        what a screen-reader user loses when the visible label
                        stops saying where the link goes. */}
                    {badge.provider === "Credly" ? "Verify in Credly" : "Verify"}
                    <ExternalLink
                      className="h-3 w-3 shrink-0 transition-transform group-hover/badge:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </span>
                {/* `kind` changes ONLY this spoken suffix — a lab-based skill
                    badge and an on-demand completion badge look identical on
                    the tile apart from the glow, exactly as Google's own
                    Credentials page files both under "Completions". `provider`
                    changes the suffix AND the pill's visible label above.
                    The two fields are independent: read both, derive neither. */}
                <span className="sr-only">
                  {` — ${badge.kind} badge on ${badge.provider}, opens in a new tab`}
                </span>
              </a>
            ) : (
              // No badge exists for this course, so no link and no VERIFY pill —
              // the marked tile, the same caption every other unit carries, and
              // (on a lab) a neutral "Lab" marker in the pill slot. `isLab` is
              // read from the COURSE and passed through untouched: the tile
              // never infers "lab" from the missing badge.
              // `h-full w-full` mirrors the anchor's box so a stretched <li> is
              // filled either way.
              <div className={cn(COURSE_TILE_ITEM, "h-full w-full")}>
                <CourseUnitTile step={course.step} isLab={course.isLab} />
                <span className={COURSE_TILE_TEXT}>
                  <span className="min-w-0 break-words t-small font-semibold text-ink/88">
                    {course.title}
                    {course.isLab ? (
                      // Both painted marks on this tile — the flask glyph and
                      // the "Lab" chip below — are aria-hidden (they are art,
                      // not content), so without this the ONE tile that differs
                      // from its neighbours would be the only one announcing
                      // nothing: every badged tile speaks a suffix naming what
                      // it is. Same fact the tile depicts — the issuer's own
                      // activity type, no disclaimer vocabulary and no claim of
                      // an award. Driven by `isLab`, never by `!badge`, exactly
                      // like the marks it voices.
                      <span className="sr-only">{" — hands-on lab"}</span>
                    ) : null}
                  </span>
                  {course.isLab ? (
                    <span aria-hidden className={COURSE_TILE_MARKER}>
                      Lab
                    </span>
                  ) : null}
                </span>
              </div>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
};

/** SpecializationBody's list branch, reused for a path with no badges.
 *  Removed: the Verify linker, the trailing CheckCircle2, and the Bonus tag —
 *  nothing here is verifiable, and CheckCircle2/Verify are credential
 *  vocabulary. Substituted: the purple hover and the purple-glowing step disc
 *  become neutral `line/25`, because purple is the AI group's accent and these
 *  sections wear no category hue. `truncate` is dropped from the h4 so a long
 *  module title wraps instead of being cut.
 *
 *  LAYOUT. A grid, not a stack, and no `flex-1 justify-center`: the column it
 *  used to centre itself inside is gone (PathBody is one column now), and that
 *  pair of classes is what stretched five short module rows to the height of
 *  the panel's other column and floated them in a ~250px empty band. The rows
 *  tile across the panel instead — one column on a phone, two from `sm`, three
 *  from `lg` — so a five-module course occupies two rows at desktop width. */
export const CourseUnitsList = ({
  path,
  itemVariants,
}: {
  path: LearningPathData;
  /** Always a real variant pair — the reduced-motion branch passes
   *  `reducedItemVariants`, never `undefined` (see CollapsePanel). */
  itemVariants: Variants;
}) => (
  <ol
    className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3"
    data-testid={path.testId}
  >
    {path.courses.map((course) => (
      <motion.li
        key={course.step}
        variants={itemVariants}
        className="group/sub flex items-center gap-3 rounded-xl border border-line/10 bg-ink/[0.03] px-3 py-2.5 backdrop-blur-sm transition-colors hover:border-line/25 hover:bg-ink/[0.06] md:px-4 md:py-3"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line/25 bg-surface t-label font-bold tabular-nums text-ink md:h-8 md:w-8">
          {course.step}
        </div>
        <h4 className="min-w-0 flex-1 t-small font-semibold text-ink">{course.title}</h4>
      </motion.li>
    ))}
  </ol>
);
