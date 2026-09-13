"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Calendar, ExternalLink, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryCertificate } from "@/app/certifications/data";
import { panelItemVariants, reducedItemVariants } from "./CollapsePanel";
import { openVerifyUrl, trackCourseworkPage } from "./verify";

/** Expanded body of a single-certificate row: inspectable thumbnail on the
 *  left, full description + issuer + CTAs on the right. A row carrying award
 *  art also shows it at 128px beside the description — ISTQB's accreditation
 *  seal with its blue bloom, or a Claude Academy course-completion decagon
 *  rendered flat. Those are separate branches on purpose (see CredentialRow). */
export const SingleCertBody = ({
  cert,
  onInspect,
}: {
  cert: GalleryCertificate;
  onInspect: (cert: GalleryCertificate) => void;
}) => {
  const itemVariants = useReducedMotion() ? reducedItemVariants : panelItemVariants;
  const hasAwardArt = Boolean(cert.officialBadge || cert.courseBadge);
  /** `image` is a scanned CERTIFICATE on every row except the Claude Academy
   *  ones, where it is the issuer's completion BADGE CARD. Naming it a
   *  certificate there would describe the wrong artifact to a screen reader,
   *  so the noun follows the artwork. */
  const artifactNoun = cert.courseBadge ? "completion badge card" : "certificate";
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(280px,340px)_1fr] md:gap-8">
      {/* Thumbnail — opens the lightbox for full-size inspection */}
      <motion.div variants={itemVariants}>
        <button
          type="button"
          onClick={() => onInspect(cert)}
          aria-label={`View ${cert.title} ${artifactNoun} full size`}
          className={cn(
            "group/thumb relative block aspect-[1.4/1] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line/10 bg-black/20 ring-1 ring-line/10 transition-transform duration-300 hover:scale-[1.01]",
            // The Claude Academy badge cards are 1440×982 (1.466:1), wider than
            // the 1.4:1 slot every scanned certificate fits, so object-cover
            // shaved ~6px off each edge and cut the last glyph of "ISSUED
            // MAY 11, 2026" at 375. Matching the slot to the source shows the
            // whole card with no letterboxing; every other row keeps 1.4:1.
            cert.courseBadge && "aspect-[1440/982]"
          )}
        >
          <Image
            src={cert.image}
            alt={`${cert.title} ${artifactNoun} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            className={cn(
              cert.id === "g-2" ? "bg-white object-contain" : "object-cover",
              "transition-transform duration-700 group-hover/thumb:scale-105"
            )}
          />
          {/* Same scrim maths as the specialization thumbnail: the label sits
              on a near-white certificate, so 40% black left it at ~2.5:1.
              65% gives 5.5:1 over a white certificate. */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/65 opacity-0 transition-opacity duration-300 group-hover/thumb:opacity-100">
            <div className="flex translate-y-4 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md transition-transform duration-300 group-hover/thumb:translate-y-0">
              <Search className="h-4 w-4 text-white" aria-hidden />
              <span className="t-label font-semibold uppercase tracking-wider text-white">
                View Full Size
              </span>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Details */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {/* Issuer mark. A wide wordmark cannot use the 24px square box: the
              Anthropic mark is 8.9:1, so contained in a square it composites to
              24×3px. It is sized by WIDTH in a tile that widens to suit, and
              inverted so the near-black mark survives the dark plate `bg-ink/5`
              becomes in dark mode. Square marks keep the original tile and box
              untouched. */}
          <div
            className={
              cert.logoWordmark
                ? "relative flex h-10 w-auto shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line/10 bg-ink/5 px-2.5 py-1.5"
                : "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line/10 bg-ink/5 p-1.5"
            }
          >
            {cert.logoWordmark ? (
              <Image
                src={cert.logo}
                alt={cert.issuer}
                width={64}
                height={8}
                className="h-auto w-16 object-contain dark:invert"
              />
            ) : (
              <Image
                src={cert.logo}
                alt={cert.issuer}
                width={24}
                height={24}
                className="object-contain"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate t-caption font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
              {cert.issuer}
            </p>
            {/* 30% white on the dark card is 2.6:1 — the date needs the 60%
                an earlier accessibility pass set (7.2:1). */}
            <p className="flex items-center gap-1.5 t-label uppercase tracking-tighter text-ink-subtle dark:text-ink/60">
              <Calendar className="h-3 w-3" aria-hidden />
              {cert.date}
            </p>
          </div>
        </div>

        <div className={cn("flex flex-col gap-5", hasAwardArt && "sm:flex-row sm:items-center sm:gap-8")}>
          <p className="t-body text-ink/88">
            {cert.description}
          </p>
          {cert.officialBadge && (
            <div className="relative h-32 w-32 shrink-0 self-center transition-all duration-500 hover:scale-[1.07]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full bg-blue-500/30 blur-2xl"
              />
              <Image
                src={cert.officialBadge}
                alt={`${cert.title} official badge`}
                fill
                sizes="128px"
                className="relative object-contain drop-shadow-[0_6px_22px_rgba(37,99,235,0.55)]"
              />
            </div>
          )}
          {/* Course-completion decagon — the same glow-free treatment as the
              row header, one size up. No bloom div, no drop-shadow.
              DECORATIVE: this is the second instance of the same artwork in the
              same row, and the header decagon (CredentialRow) already announces
              "<title> course completion badge". A screen reader hearing it
              twice learns nothing the second time, so this copy is `alt=""`.
              ISTQB's pair stays described-twice because its two instances are
              worded differently and its expanded seal is asserted by name in
              tests/e2e/certifications.spec.ts. */}
          {cert.courseBadge && (
            <div className="relative h-32 w-32 shrink-0 self-center transition-all duration-500 hover:scale-[1.07]">
              <Image
                src={cert.courseBadge}
                alt=""
                fill
                sizes="128px"
                className="rounded-[22%] object-contain"
              />
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          {cert.url && (
            <button
              type="button"
              onClick={() =>
                openVerifyUrl(cert.url as string, {
                  title: cert.title,
                  issuer: cert.issuer,
                })
              }
              aria-label={`Verify ${cert.title} certificate`}
              className="inline-flex items-center gap-2 rounded-2xl bg-ink px-6 py-3 font-bold text-surface transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Verify Certificate
              <ExternalLink className="h-4 w-4" aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={() => onInspect(cert)}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl border border-line/10 bg-ink/5 px-5 py-3 t-small font-semibold text-ink/70 transition-colors hover:bg-ink/10 hover:text-ink",
              cert.courseBadge && "md:hidden"
            )}
          >
            <Search className="h-4 w-4" aria-hidden />
            View full size
          </button>
          {/* The issuer's own course page, when it is a separate document from
              the certificate. A real outbound <a> — crawlable, middle-
              clickable, works with JS off — and deliberately NOT
              openVerifyUrl(): a syllabus page verifies nothing, so this fires
              `open_coursework_page`, never `verify_certificate`. */}
          {cert.courseUrl && (
            <a
              href={cert.courseUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-course-link
              onClick={() =>
                trackCourseworkPage({
                  id: cert.id,
                  issuer: cert.issuer,
                  title: cert.title,
                  urlLabel: "Course page",
                })
              }
              aria-label={`Open the ${cert.title} course page on ${cert.issuer} (opens in a new tab)`}
              className="inline-flex items-center gap-2 rounded-2xl border border-line/10 bg-ink/5 px-5 py-3 t-small font-semibold text-ink/70 transition-colors hover:bg-ink/10 hover:text-ink"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Course page
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
};
