"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpecializationData } from "@/app/certifications/data";
import { panelBadgeVariants } from "./CollapsePanel";
import { openBadgeUrl, openVerifyUrl } from "./verify";

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
const PRO_CERT_GRID_POSITIONS = [
  // index → column placement on a 6-col track (applies at all breakpoints)
  "col-start-2 col-end-4", // 1 — row 1 left
  "col-start-4 col-end-6", // 2 — row 1 right
  "col-start-1 col-end-3", // 3 — row 2 left
  "col-start-3 col-end-5", // 4 — row 2 center
  "col-start-5 col-end-7", // 5 — row 2 right
  "col-start-2 col-end-4", // 6 — row 3 left
  "col-start-4 col-end-6", // 7 — row 3 right
] as const;

export const ChildBadgesGrid = ({ spec }: { spec: SpecializationData }) => {
  const badgeVariants = useReducedMotion() ? undefined : panelBadgeVariants;
  return (
    <ol
      data-testid={spec.testId}
      className="m-0 grid w-full max-w-[460px] list-none grid-cols-6 place-items-center gap-x-0 gap-y-4 p-0 md:gap-y-5"
    >
      {spec.children.map((child, index) => {
        const { badge } = child;
        if (!badge) return null;
        return (
          <motion.li
            key={child.step}
            variants={badgeVariants}
            className={cn(
              "flex flex-col items-center gap-2",
              PRO_CERT_GRID_POSITIONS[index]
            )}
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
              className="group/verify inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 t-label font-bold uppercase tracking-wider text-emerald-300 transition-colors hover:border-emerald-300/60 hover:bg-emerald-500/20 hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
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
