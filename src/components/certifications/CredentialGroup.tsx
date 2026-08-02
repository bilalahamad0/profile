"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  credentialSlug,
  type CredentialGroupDef,
  type GalleryCertificate,
} from "@/app/certifications/data";
import { CredentialRow } from "./CredentialRow";

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
                group.accent.eyebrow
              )}
            >
              {group.eyebrow}
            </p>
            <h2 id={`${group.id}-heading`} className="t-h2 text-white">
              {group.title}
            </h2>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <button
            type="button"
            data-testid={`expand-all-${group.id}`}
            onClick={() => onToggleAll(group, !allOpen)}
            className="rounded t-label font-semibold uppercase tracking-wider text-white/60 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
          <span className="hidden t-caption text-white/50 sm:block">
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
