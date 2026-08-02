"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
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
import { openVerifyUrl } from "./verify";

const DISCLOSURE_SPRING = { type: "spring", stiffness: 380, damping: 28 } as const;

/** Morphing plus → × disclosure indicator. Decorative: the h3 toggle button
 *  is the accessible control. */
const Disclosure = ({ open, accent }: { open: boolean; accent: GroupAccent }) => {
  const reduceMotion = useReducedMotion();
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors",
        open && accent.disclosureOpen
      )}
    >
      <motion.span
        className="absolute h-[2px] w-4 rounded-full bg-white/70"
        animate={{ rotate: open ? 135 : 0 }}
        transition={reduceMotion ? { duration: 0 } : DISCLOSURE_SPRING}
      />
      <motion.span
        className="absolute h-[2px] w-4 rounded-full bg-white/70"
        animate={{ rotate: open ? 135 : 90 }}
        transition={reduceMotion ? { duration: 0 } : DISCLOSURE_SPRING}
      />
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

export function CredentialRow({
  credential,
  index,
  accent,
  open,
  onToggle,
  onInspect,
}: {
  credential: Credential;
  index: number; // 0-based position across the whole ledger
  accent: GroupAccent;
  open: boolean;
  onToggle: () => void;
  onInspect: (cert: GalleryCertificate) => void;
}) {
  const isSpec = credential.kind === "specialization";
  const slug = credentialSlug(credential);
  const headingId = isSpec ? credential.headingId : `cert-heading-${credential.id}`;
  const panelId = `${slug}-panel`;
  const title = isSpec ? credential.titleLines[0] : credential.title;
  const metaLine = isSpec
    ? `${credential.issuer} · ${credential.date} · ${credential.titleLines[1]}`
    : `${credential.issuer} · ${credential.date}`;
  const isOfficial = !isSpec && Boolean(credential.officialBadge);

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
      {/* Continuous ledger index 01…12 — decorative ordering cue */}
      <span
        aria-hidden
        className="hidden w-7 shrink-0 t-label tabular-nums text-white/25 transition-colors group-hover/row:text-white/[0.45] sm:block"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Visual — parent badge for specs, thumbnail for singles */}
      {isSpec ? (
        <span className="relative h-11 w-11 shrink-0 md:h-14 md:w-14">
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
            sizes="56px"
            className="relative object-contain"
          />
        </span>
      ) : isOfficial ? (
        <span className="relative h-12 w-12 shrink-0 md:h-16 md:w-16">
          <span
            aria-hidden
            className="absolute -inset-1 rounded-full bg-blue-500/30 opacity-70 blur-md"
          />
          <Image
            src={credential.officialBadge as string}
            alt=""
            fill
            sizes="64px"
            className="relative object-contain drop-shadow-[0_6px_22px_rgba(37,99,235,0.55)]"
          />
        </span>
      ) : (
        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-black/20 ring-1 ring-white/10 md:h-14 md:w-[76px]">
          <Image
            src={credential.image}
            alt=""
            fill
            sizes="76px"
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
          className="block w-full min-w-0 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <span className="t-h3 text-white/90 transition-colors line-clamp-2 md:line-clamp-1 group-hover/row:text-white">
            {title}
          </span>
          <span className="mt-0.5 block truncate t-caption text-white/55">
            {metaLine}
          </span>
        </button>
      </h3>

      {/* Chips (≥sm) */}
      <span className="hidden items-center gap-2 sm:flex">
        {isSpec && (
          <Chip className={accent.chip}>{credential.totalCourses} Courses</Chip>
        )}
        {isSpec && credential.ribbon && (
          <Chip className="hidden border-amber-400/30 bg-amber-400/10 text-amber-300 lg:inline-flex">
            <span aria-hidden>{credential.ribbon.emoji}</span>
            {credential.ribbon.label}
          </Chip>
        )}
        {!isSpec && credential.id.startsWith("ai-") && (
          <Chip className="hidden border-purple-500/25 bg-purple-500/10 text-purple-300 lg:inline-flex">
            <Sparkles className="h-3 w-3 fill-purple-400/20" aria-hidden />
            AI Skills
          </Chip>
        )}
        {isOfficial && (
          <Chip className="hidden border-blue-400/25 bg-blue-400/10 text-blue-300 lg:inline-flex">
            Official Badge
          </Chip>
        )}
      </span>

      {/* Verified — ≥sm only; on phones the Verify link already signals it
          and the title needs every pixel */}
      <span className="hidden shrink-0 items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 sm:inline-flex">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
        <span className="t-label font-bold uppercase tracking-wider text-emerald-300">
          Verified
        </span>
      </span>

      {/* Verify — always reachable without expanding */}
      {(isSpec || credential.url) && (
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
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1 rounded-full text-blue-400 transition-colors hover:bg-white/[0.04] hover:text-blue-300 md:w-auto md:px-3"
        >
          <span className="hidden t-label font-semibold uppercase tracking-wider md:inline">
            Verify
          </span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}

      <Disclosure open={open} accent={accent} />
    </div>
  );

  const body = (
    <CollapsePanel id={panelId} labelledBy={headingId} open={open}>
      <div className="border-t border-white/5 px-4 pb-5 pt-4 md:px-6 md:pb-7 md:pt-5">
        {isSpec ? (
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
        "group/row glass-card relative overflow-hidden rounded-2xl border border-white/10 transition-colors",
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
