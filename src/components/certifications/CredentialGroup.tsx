"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  credentialSlug,
  type CredentialGroupDef,
  type GalleryCertificate,
} from "@/app/certifications/data";
import { CredentialRow } from "./CredentialRow";

/** The group accents in `data.ts` are tuned for the dark ground: on the light
 *  page their 300 weights collapse to 1.4–1.8:1 and fail WCAG AA. Each hue
 *  keeps its dark value and gains a light-safe partner here — violet-700
 *  6.8:1, blue-700 6.4:1, amber-800 6.8:1, sky-700 5.7:1 on rgb(250,250,250),
 *  with the 300 weight preserved behind `dark:` so the dark theme is
 *  untouched. Unknown tokens fall through unchanged. */
const LIGHT_EYEBROW: Record<string, string> = {
  "text-violet-300": "text-violet-700 dark:text-violet-300",
  "text-blue-300": "text-blue-700 dark:text-blue-300",
  "text-amber-300": "text-amber-800 dark:text-amber-300",
  "text-sky-300": "text-sky-700 dark:text-sky-300",
};

const eyebrowTone = (accentEyebrow: string) =>
  LIGHT_EYEBROW[accentEyebrow] ?? accentEyebrow;

export function CredentialGroup({
  group,
  startIndex,
  openIds,
  onToggle,
  onToggleAll,
  onInspect,
}: {
  group: CredentialGroupDef;
  startIndex: number; // 0-based ledger index of this group's first row
  openIds: ReadonlySet<string>;
  onToggle: (slug: string, category: string) => void;
  onToggleAll: (group: CredentialGroupDef, expand: boolean) => void;
  onInspect: (cert: GalleryCertificate) => void;
}) {
  const Icon = group.icon;
  const slugs = group.credentials.map(credentialSlug);
  const allOpen = slugs.every((s) => openIds.has(s));
  const count = group.credentials.length;

  return (
    <section id={group.id} aria-labelledby={`${group.id}-heading`} className="scroll-mt-28">
      {/* Group header */}
      <div className="mb-5 flex items-end justify-between gap-4 md:mb-6">
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <span
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-xl border",
              group.accent.iconTile
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p
              className={cn(
                "t-label font-bold uppercase tracking-widest",
                eyebrowTone(group.accent.eyebrow)
              )}
            >
              {group.eyebrow}
            </p>
            <h2 id={`${group.id}-heading`} className="t-h2 text-ink">
              {group.title}
            </h2>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <button
            type="button"
            data-testid={`expand-all-${group.id}`}
            onClick={() => onToggleAll(group, !allOpen)}
            className="rounded t-label font-semibold uppercase tracking-wider text-ink/60 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-line/40"
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
          <span className="hidden t-caption text-ink-subtle sm:block dark:text-ink/50">
            {count} {count === 1 ? "credential" : "credentials"} · all verified
          </span>
        </div>
      </div>

      {/* Hairline */}
      <div
        aria-hidden
        className={cn(
          "mb-5 h-px w-full bg-gradient-to-r to-transparent md:mb-6",
          group.accent.hairline
        )}
      />

      {/* Rows */}
      <div className="flex flex-col gap-3 md:gap-4">
        {group.credentials.map((credential, i) => {
          const slug = credentialSlug(credential);
          return (
            <CredentialRow
              key={slug}
              credential={credential}
              index={startIndex + i}
              accent={group.accent}
              open={openIds.has(slug)}
              onToggle={() => onToggle(slug, group.id)}
              onInspect={onInspect}
            />
          );
        })}
      </div>
    </section>
  );
}
