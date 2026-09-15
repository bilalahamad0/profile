"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  credentialSlug,
  type Credential,
  type GalleryCertificate,
  type GroupAccent,
} from "@/app/certifications/data";
import { CollapsePanel } from "./CollapsePanel";
import { SpecializationBody } from "./SpecializationBody";
import { SingleCertBody } from "./SingleCertBody";
import { PathBody } from "./PathBody";
import { IssuerTileMark } from "./IssuerTileMark";
import { openVerifyUrl, trackCourseworkPage } from "./verify";

const DISCLOSURE_SPRING = { type: "spring", stiffness: 380, damping: 28 } as const;

/** Chevron disclosure indicator — points down (expand) when collapsed and
 *  rotates to point up (collapse) when open. Decorative: the h3 toggle
 *  button is the accessible control. */
const Disclosure = ({ open, accent }: { open: boolean; accent: GroupAccent }) => {
  const reduceMotion = useReducedMotion();
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line/10 bg-ink/5 transition-colors",
        open && accent.disclosureOpen
      )}
    >
      <motion.span
        className="grid place-items-center"
        animate={{ rotate: open ? 180 : 0 }}
        transition={reduceMotion ? { duration: 0 } : DISCLOSURE_SPRING}
      >
        <ChevronDown className="h-4 w-4 text-ink/70" />
      </motion.span>
    </span>
  );
};

const Chip = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 t-label font-bold uppercase tracking-wider",
      className
    )}
  >
    {children}
  </span>
);

/** Chip tints are keyed to the chip's MEANING, not to the group accent — a
 *  "7 Courses" chip reads violet in every group so the same fact never wears
 *  two colours down the ledger. Emerald stays reserved for verification
 *  affordances (the course VERIFY pills in the expanded body). */
const CHIP_COURSES = "border-violet-400/25 bg-violet-400/10 text-violet-700 dark:text-violet-300";
/** One amber for every skills chip — AI Skills and PM Skills are the same
 *  category, so they share a tint and are told apart by their emoji/icon. */
const CHIP_SKILLS = "border-amber-400/30 bg-amber-400/10 text-amber-800 dark:text-amber-300";
const CHIP_OFFICIAL = "border-blue-400/25 bg-blue-400/10 text-blue-700 dark:text-blue-300";
const CHIP_PRODUCT = "border-line/15 bg-ink/[0.06] text-ink/70 dark:text-ink/60";

/** Level chips: progressive difficulty tiers.
 *  - Beginner: Emerald / Green (welcoming foundation)
 *  - Intermediate: Sky / Blue (applied competency)
 *  - Advanced: Purple / Violet (mastery tier) */
const LEVEL_CHIP_MAP: Record<string, string> = {
  Beginner: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Intermediate: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Advanced: "border-purple-500/25 bg-purple-500/10 text-purple-700 dark:text-purple-300",
};

/** Product chips: brand-aligned product hues.
 *  - Claude.ai: Anthropic terracotta / orange
 *  - Claude Code: CLI terminal cyan
 *  - Claude Cowork: Collaborative agent teal
 *  - Claude Teams: Organization indigo */
const PRODUCT_CHIP_MAP: Record<string, string> = {
  "Claude.ai": "border-orange-500/25 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  "Claude Code": "border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  "Claude Cowork": "border-teal-500/25 bg-teal-500/10 text-teal-700 dark:text-teal-300",
  "Claude Teams": "border-indigo-500/25 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
};

export function CredentialRow({
  credential,
  accent,
  open,
  onToggle,
  onInspect,
}: {
  credential: Credential;
  accent: GroupAccent;
  open: boolean;
  onToggle: () => void;
  onInspect: (cert: GalleryCertificate) => void;
}) {
  const isSpec = credential.kind === "specialization";
  const isSingle = credential.kind === "single";
  const slug = credentialSlug(credential);
  const headingId = isSingle ? `cert-heading-${credential.id}` : credential.headingId;
  const panelId = `${slug}-panel`;
  const title = isSingle ? credential.title : credential.titleLines[0];
  const metaLine = isSingle
    ? `${credential.issuer} · ${credential.date}`
    : `${credential.issuer} · ${credential.date} · ${credential.titleLines[1]}${
        credential.kind === "path" && credential.metaSuffix ? ` · ${credential.metaSuffix}` : ""
      }`;
  // Two kinds of square award art take the header's badge slot, and they are
  // deliberately DIFFERENT code paths rather than one path with a tint knob:
  // `officialBadge` is an accreditation body's seal (ISTQB® only) and keeps its
  // blue halo + blue drop-shadow written out literally below, while
  // `courseBadge` is a course-completion decagon rendered flat — no halo
  // element, no drop-shadow, no bloom (owner decision, 2026-09-12). Neither can
  // pick up the other's treatment by omitting a field.
  const officialBadge = isSingle ? credential.officialBadge : undefined;
  const courseBadge = isSingle ? credential.courseBadge : undefined;
  /** The "Official Badge" claim — an accreditation BODY's own mark, which is
   *  what the blue chip and the blue collapsed border assert. Keyed to the data
   *  flag, no longer to `Boolean(officialBadge)`: a course-completion badge is
   *  genuine award art without being an accreditation seal, and the Claude
   *  Academy rows already carry the amber AI Skills chip. ISTQB® sets the flag,
   *  so its row is unchanged. */
  const isOfficial = isSingle && credential.isOfficial === true;
  /** Both of these are read straight off the DATA — never from an id prefix, a
   *  title match, or which section the row renders in. `aiSkills` used to be
   *  `isSingle && credential.id.startsWith("ai-")`, which made a deep-link
   *  anchor decide a visual claim and locked the chip out of the Google Skills
   *  paths; both now carry it because their data says so. Specializations state
   *  the same fact through `ribbon` and are untouched by either flag. */
  const aiSkills = !isSpec && credential.aiSkills === true;
  const product = isSingle ? credential.product : undefined;
  const level = isSingle ? credential.level : undefined;

  const handleRowClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // The heading button and Verify button handle their own clicks; every
    // other spot on the strip toggles, so the whole row feels clickable.
    if ((e.target as HTMLElement).closest("button, a")) return;
    onToggle();
  };

  const header = (
    <div
      onClick={handleRowClick}
      className="flex min-h-[72px] cursor-pointer items-center gap-3 px-4 py-3 md:min-h-[96px] md:gap-4 md:px-6 md:py-4"
    >
      {/* Visual — uniform 48×48 (mobile) / 64×64 (desktop) across all types:
          parent badge for specs, issuer tile for paths, award decagon/seal,
          or certificate thumbnail for singles. Standardized so all card titles
          align to the exact same horizontal starting placement. */}
      {credential.kind === "path" ? (
        <IssuerTileMark tile={credential.tile} />
      ) : isSpec ? (
        <span className="relative h-12 w-12 shrink-0 md:h-16 md:w-16">
          <span
            aria-hidden
            className={cn(
              "absolute -inset-1 rounded-full opacity-60 blur-md",
              credential.badgeHalo
            )}
          />
          <Image
            src={credential.parentBadge.image}
            alt=""
            fill
            sizes="64px"
            className="relative object-contain"
          />
        </span>
      ) : officialBadge ? (
        <span className="relative h-12 w-12 shrink-0 md:h-16 md:w-16">
          <span
            aria-hidden
            className="absolute -inset-1 rounded-full bg-blue-500/30 opacity-70 blur-md"
          />
          <Image
            src={officialBadge}
            alt={`${title} official issuer badge`}
            fill
            sizes="64px"
            className="relative object-contain drop-shadow-[0_6px_22px_rgba(37,99,235,0.55)]"
          />
        </span>
      ) : courseBadge ? (
        <span className="relative h-12 w-12 shrink-0 md:h-16 md:w-16">
          <Image
            src={courseBadge}
            alt={`${title} course completion badge`}
            fill
            sizes="64px"
            className="rounded-[22%] object-contain"
          />
        </span>
      ) : (
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/20 ring-1 ring-line/10 md:h-16 md:w-16">
          <Image
            src={credential.image}
            alt=""
            fill
            sizes="64px"
            className={credential.id === "g-2" ? "bg-white object-contain" : "object-cover"}
          />
        </span>
      )}

      {/* Title block — the accessible toggle */}
      <h3 className="min-w-0 flex-1">
        <button
          type="button"
          id={headingId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="block w-full min-w-0 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-line/40"
        >
          {/* NO clamp below `md` (owner, 2026-09-13: "dynamically inflate the
              headers to contain full subject title"). It was `line-clamp-2`,
              which at 375px cut "Building Effective Human Agent Teams (Beta)"
              down to "Building Effective…" — losing both the subject and the
              qualifier on a row whose whole job is to name a course. The title
              now wraps to as many lines as it needs and the header grows with
              it: `min-h-[72px]` is a floor, the flex row is `items-center`,
              and every sibling is `shrink-0`, so nothing can be pushed under
              the numeral, the chevron or the Verify control. `md:line-clamp-1`
              is unchanged, so desktop rows keep their exact height.
              `line-clamp-none` rather than simply dropping the class: it keeps
              the span a BLOCK box with the same line-box metrics the clamped
              `-webkit-box` had, so the rows that already fitted in two lines
              measure identically to before (94.08px at 375, verified) and only
              the rows that were actually being cut off grow. Letting the span
              fall back to `inline` shifted every row by ~1.3px for nothing. */}
          <span className="t-h3 text-ink/90 transition-colors line-clamp-none md:line-clamp-1 group-hover/row:text-ink">
            {title}
          </span>
          <span className="mt-0.5 block truncate t-caption text-ink-muted dark:text-ink/55">
            {metaLine}
          </span>
        </button>
      </h3>

      {/* Chips (≥sm) — fixed order across every group: qualifier chips first
          (product, then AI Skills / the specialization ribbon), then Courses,
          so Courses always sits directly left of Verify. The product chip
          heads the run because it names WHAT the course is about; AI Skills
          then qualifies it, and the count closes the row. */}
      <span data-chips className="hidden items-center gap-2 sm:flex">
        {isSpec && credential.ribbon && (
          <Chip className={cn("hidden lg:inline-flex", CHIP_SKILLS)}>
            <span aria-hidden>{credential.ribbon.emoji}</span>
            {credential.ribbon.label}
          </Chip>
        )}
        {level && (
          <Chip className={cn("hidden lg:inline-flex", LEVEL_CHIP_MAP[level] ?? CHIP_PRODUCT)}>
            {level}
          </Chip>
        )}
        {product && (
          <Chip className={cn("hidden lg:inline-flex normal-case", PRODUCT_CHIP_MAP[product] ?? CHIP_PRODUCT)}>
            {product}
          </Chip>
        )}
        {aiSkills && (
          <Chip className={cn("hidden lg:inline-flex", CHIP_SKILLS)}>
            <Sparkles className="h-3 w-3 fill-amber-400/20" aria-hidden />
            AI Skills
          </Chip>
        )}
        {isOfficial && (
          <Chip className={cn("hidden lg:inline-flex", CHIP_OFFICIAL)}>
            Official Badge
          </Chip>
        )}
        {isSpec && (
          <Chip className={CHIP_COURSES}>{credential.totalCourses} Courses</Chip>
        )}
        {credential.kind === "path" && (
          <Chip className={CHIP_COURSES}>
            {credential.totalCourses} {credential.unitNoun}
          </Chip>
        )}
      </span>

      {/* Verify — always reachable without expanding. There is deliberately no
          "Verified" state pill beside it: it rendered identically on every row,
          so it distinguished nothing while implying some rows might not be
          verified. The group header states "all verified" once, and this link
          is the stronger claim — it hands over the issuer URL as proof.
          Path rows take this slot with the issuer's own page: same box, same
          icon, same label position — but a real <a>, a neutral ink hue (blue is
          the Verify/Official vocabulary, emerald the verification one), and a
          word that claims nothing. GA gets `open_coursework_page`, never
          `verify_certificate`. handleRowClick already ignores clicks inside an
          anchor, so this cannot toggle the row. */}
      {credential.kind === "path" ? (
        <a
          href={credential.url}
          target="_blank"
          rel="noopener noreferrer"
          data-coursework-link
          onClick={() =>
            trackCourseworkPage({
              id: credential.id,
              issuer: credential.issuer,
              title,
              urlLabel: credential.urlLabel,
            })
          }
          aria-label={`${credential.urlLabel} for ${title} on ${credential.issuerShort} (opens in a new tab)`}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1 rounded-full text-ink/70 transition-colors hover:bg-ink/[0.04] hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 dark:text-ink/60 dark:hover:text-ink dark:focus-visible:ring-ink/60 md:w-auto md:px-3"
        >
          <span className="hidden t-label font-semibold uppercase tracking-wider md:inline">
            {credential.urlLabel}
          </span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      ) : isSpec || credential.url ? (
        <button
          type="button"
          data-verify
          onClick={() =>
            openVerifyUrl(isSpec ? credential.url : (credential.url as string), {
              title,
              issuer: credential.issuer,
              ...(isSpec && { specialization: title }),
            })
          }
          aria-label={`Verify ${title}`}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1 rounded-full text-blue-700 transition-colors hover:bg-ink/[0.04] hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 md:w-auto md:px-3"
        >
          <span className="hidden t-label font-semibold uppercase tracking-wider md:inline">
            Verify
          </span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </button>
      ) : null}

      <Disclosure open={open} accent={accent} />
    </div>
  );

  const body = (
    <CollapsePanel id={panelId} labelledBy={headingId} open={open}>
      <div className="border-t border-line/10 px-4 pb-5 pt-4 md:px-6 md:pb-7 md:pt-5">
        {credential.kind === "path" ? (
          <PathBody path={credential} />
        ) : isSpec ? (
          <SpecializationBody spec={credential} />
        ) : (
          <SingleCertBody cert={credential} onInspect={onInspect} />
        )}
      </div>
    </CollapsePanel>
  );

  const card = (
    <div
      data-open={open}
      className={cn(
        "group/row glass-card relative overflow-hidden rounded-2xl border border-line/10 transition-colors",
        accent.hoverBorder,
        accent.openRing,
        isOfficial && !open && "border-blue-400/20"
      )}
    >
      {/* Per-credential gradient wash — only visible while expanded */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
          credential.gradient,
          open && "opacity-50"
        )}
      />
      <div className="relative">
        {header}
        {body}
      </div>
    </div>
  );

  // Specialization rows keep their <section aria-labelledby> wrapper so the
  // page's long-standing structural selectors (and e2e tests) hold.
  return isSpec ? (
    <section id={slug} aria-labelledby={headingId} className="scroll-mt-28">
      {card}
    </section>
  ) : (
    <article id={slug} aria-labelledby={headingId} className="scroll-mt-28">
      {card}
    </article>
  );
}
