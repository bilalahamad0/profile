"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpecializationData } from "@/app/certifications/data";
import { haloBloomVariants, panelItemVariants } from "./CollapsePanel";
import { ChildBadgesGrid } from "./ChildBadgesGrid";
import { openBadgeUrl, openVerifyUrl } from "./verify";

/** Expanded body of a specialization row — the full detail canvas that used
 *  to be the standalone mega-card: thumbnail + ribbon, issuer row,
 *  description, glowing parent Credly badge, and the per-course credentials. */
export const SpecializationBody = ({ spec }: { spec: SpecializationData }) => {
  const ribbon = spec.ribbon ?? { emoji: "🌟", label: "AI Skills" };
  const reduceMotion = useReducedMotion();
  const itemVariants = reduceMotion ? undefined : panelItemVariants;

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-8">
      {/* ─────────── LEFT COLUMN — visual ─────────── */}
      <div className="flex flex-col gap-5">
        <button
          type="button"
          onClick={() =>
            openVerifyUrl(spec.url, {
              title: spec.titleLines[0],
              issuer: spec.issuer,
              specialization: spec.titleLines[0],
            })
          }
          aria-label={`View ${spec.titleLines[0]} certificate on Coursera`}
          className="group/thumb relative block aspect-[1.4/1] w-full cursor-pointer overflow-hidden rounded-2xl border border-line/10 bg-black/20 ring-1 ring-line/10 transition-transform duration-300 hover:scale-[1.01]"
        >
          <Image
            src={spec.image}
            alt={`${spec.titleLines[0]} certificate preview`}
            fill
            className="object-cover transition-transform duration-700 group-hover/thumb:scale-105"
            sizes="(max-width: 768px) 100vw, 32rem"
          />
          {/* Skills ribbon (AI Skills by default, per-spec override) */}
          <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/95 via-yellow-400/95 to-amber-500/95 px-3 py-1 shadow-[0_4px_20px_-4px_rgba(251,191,36,0.6)] backdrop-blur-sm">
            <span className="t-caption" aria-hidden>{ribbon.emoji}</span>
            <span className="t-label font-black uppercase tracking-wider text-amber-950">
              {ribbon.label}
            </span>
          </div>
          {/* Hover overlay — the scrim, not the theme, is the background for
              this label: certificates are near-white, so 40% black left the
              white text at ~2.5:1 on the real pixels. 65% holds it at 5.5:1
              over a white certificate and 7.0:1 on the composited ground. */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/65 opacity-0 transition-opacity duration-300 group-hover/thumb:opacity-100">
            <div className="flex translate-y-4 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md transition-transform duration-300 group-hover/thumb:translate-y-0">
              <ExternalLink className="h-4 w-4 text-white" aria-hidden />
              <span className="t-label font-semibold uppercase tracking-wider text-white">
                View Certificate
              </span>
            </div>
          </div>
        </button>

        {/* Logo + issuer + date + VIEW DETAILS (mobile-friendly CTA) */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line/10 bg-ink/5 p-1.5">
            <Image
              src={spec.logo}
              alt="Google"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate t-caption font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
              {spec.issuer}
            </p>
            <p className="flex items-center gap-1.5 t-label uppercase tracking-tighter text-ink/60">
              <Calendar className="h-3 w-3" aria-hidden />
              {spec.date}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              openVerifyUrl(spec.url, {
                title: spec.titleLines[0],
                issuer: spec.issuer,
                specialization: spec.titleLines[0],
              })
            }
            aria-label={`View ${spec.titleLines[0]} details on Coursera`}
            className="group/details inline-flex shrink-0 items-center gap-1 t-label font-semibold tracking-wider text-ink/60 transition-colors hover:text-blue-700 focus:outline-none focus-visible:text-blue-700 dark:hover:text-blue-400 dark:focus-visible:text-blue-400"
          >
            VIEW DETAILS
            <ArrowRight className="h-3 w-3 transition-transform group-hover/details:translate-x-1" />
          </button>
        </div>

        {/* Summary + parent badge — lives under the certificate so the left
            column carries the story and the right column stays pure courses */}
        <div className="flex flex-col gap-4 rounded-2xl border border-line/10 bg-ink/[0.03] p-4 lg:flex-row lg:items-center lg:gap-6 lg:p-5">
          <p className="min-w-0 flex-1 t-small text-ink/88">
            {spec.description}
          </p>
          <button
            type="button"
            onClick={() =>
              openBadgeUrl(spec.parentBadge.credlyUrl, {
                title: `${spec.titleLines[0]} (Parent)`,
                specialization: spec.titleLines[0],
              })
            }
            aria-label={`View ${spec.titleLines[0]} parent badge on Credly`}
            data-testid={`${spec.testId}-parent-badge`}
            className="group/parent relative h-28 w-28 shrink-0 self-center rounded-full transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 md:h-32 md:w-32 lg:h-32 lg:w-32"
          >
            <motion.span
              aria-hidden
              variants={reduceMotion ? undefined : haloBloomVariants}
              className={cn(
                "pointer-events-none absolute -inset-3 rounded-full blur-2xl",
                spec.badgeHalo
              )}
            />
            <Image
              src={spec.parentBadge.image}
              alt={`${spec.titleLines[0]} verified parent badge`}
              fill
              sizes="128px"
              className={cn("relative object-contain", spec.badgeShadow)}
            />
          </button>
        </div>
      </div>

      {/* ─────────── RIGHT COLUMN — course credentials only ─────────── */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 self-start rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 t-label font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          All {spec.totalCourses} course credentials
        </div>

        {spec.childrenLayout === "list" ? (
          <ol
            className="m-0 flex flex-1 list-none flex-col justify-center gap-3 p-0"
            data-testid={spec.testId}
          >
            {spec.children.map((child) => (
              <motion.li
                key={child.step}
                variants={itemVariants}
                className={cn(
                  "group/sub flex items-center gap-3 rounded-xl border border-line/10 bg-ink/[0.03] px-3 py-2.5 backdrop-blur-sm transition-colors hover:border-purple-500/30 hover:bg-ink/[0.06] md:px-4 md:py-3",
                  child.bonus &&
                    "relative mt-3 before:absolute before:-top-[7px] before:left-2 before:right-2 before:border-t before:border-line/10 before:content-['']"
                )}
              >
                {child.icon ? (
                  <div className="relative h-9 w-9 shrink-0 md:h-10 md:w-10">
                    <Image
                      src={child.icon}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-purple-500/40 bg-surface t-label font-bold text-ink shadow-[0_0_15px_-5px_rgba(168,85,247,0.35)] md:h-8 md:w-8">
                    {child.step}
                  </div>
                )}

                <h4 className="min-w-0 flex-1 truncate t-small font-semibold text-ink">
                  {child.title}
                </h4>

                {child.bonus && (
                  <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 t-label font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    Bonus
                  </span>
                )}

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
                  aria-label={`Verify certificate for ${child.title}`}
                  className="group/vc inline-flex shrink-0 items-center gap-1 t-label font-semibold uppercase tracking-wider text-blue-700 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span className="hidden sm:inline">Verify</span>
                  <ExternalLink className="h-3 w-3 transition-transform group-hover/vc:translate-x-0.5" />
                </button>

                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400"
                  aria-hidden
                />
              </motion.li>
            ))}
          </ol>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <ChildBadgesGrid spec={spec} />
          </div>
        )}
      </div>
    </div>
  );
};
