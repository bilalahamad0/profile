"use client";

import React, { useCallback, useEffect, useState } from "react";
import { trackEvent } from "@/components/analytics/google-analytics";
import {
  COURSEWORK_GROUPS,
  CREDENTIAL_GROUPS,
  DEFAULT_OPEN_IDS,
  credentialSlug,
  type CredentialGroupDef,
  type GalleryCertificate,
} from "@/app/certifications/data";
import { CredentialGroup } from "./CredentialGroup";
import { CertLightbox } from "./CertLightbox";

// Deep links must reach the coursework rows too.
const ALL_SLUGS = new Set(
  [...CREDENTIAL_GROUPS, ...COURSEWORK_GROUPS].flatMap((g) =>
    g.credentials.map(credentialSlug),
  )
);

const startIndexes = (groups: readonly { credentials: readonly unknown[] }[]) =>
  groups.map((_, i) => groups.slice(0, i).reduce((n, g) => n + g.credentials.length, 0));

// 0-based ledger index of each group's first row (the 01…17 numerals).
const GROUP_START_INDEXES = startIndexes(CREDENTIAL_GROUPS);
// The coursework sections are a SEPARATE ledger: their numerals restart at 01
// and then run continuously across the two sections (01–04 Google Skills, 05
// Continuing Education), exactly as the credential ledger runs 01–17 across its
// four group headers. Continuing to 18 would number these as items of the
// credential ledger — the one numeric claim on this page that would be false,
// and visibly at odds with the stats strip's "17 Credentials".
const COURSEWORK_START_INDEXES = startIndexes(COURSEWORK_GROUPS);

// Both ledgers share one open-state store and therefore one pair of GA events,
// whose names ("credential_expand") predate the coursework sections and cannot
// be renamed without splitting an existing funnel. So every expand carries an
// explicit `kind`, and no report has to infer from `category` that a row named
// by a credential event is not a credential. Badge and path links are separate
// events entirely (open_course_badge / open_coursework_page, see verify.ts).
const COURSEWORK_GROUP_IDS = new Set(COURSEWORK_GROUPS.map((g) => g.id));
const expandKind = (groupId: string) =>
  COURSEWORK_GROUP_IDS.has(groupId) ? "coursework" : "credential";

export function CredentialLedger() {
  // Multi-open by design — expanding one credential never closes another.
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(
    () => new Set(DEFAULT_OPEN_IDS)
  );
  const [inspected, setInspected] = useState<GalleryCertificate | null>(null);

  // Deep link: /certifications#<row-id> opens that row on load. The hash is
  // only knowable client-side, so this must run after hydration (the server
  // always renders the deterministic default-open state). Deferred a frame so
  // the state update isn't synchronous within the effect body.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !ALL_SLUGS.has(hash)) return;
    const raf = requestAnimationFrame(() => {
      setOpenIds((prev) => (prev.has(hash) ? prev : new Set([...prev, hash])));
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Side effects (analytics) stay OUT of the state updater — React is free to
  // re-run updaters, so they must be pure.
  //
  // Expanding deliberately does NOT rewrite the address bar. It used to
  // replaceState a `#<slug>`, which turned the canonical /certifications URL
  // into a deep link the moment anyone opened a row — so whatever was then
  // copied, bookmarked or offered by browser autocomplete carried the hash,
  // and loading it dropped the visitor ~1500px down the page. Expanding a row
  // is a view action, not a navigation. Inbound deep links still work (see the
  // effect above) and the group jump pills still produce shareable anchors.
  const handleToggle = useCallback(
    (slug: string, category: string) => {
      const expanded = !openIds.has(slug);
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (expanded) {
          next.add(slug);
        } else {
          next.delete(slug);
        }
        return next;
      });
      trackEvent("credential_expand", {
        id: slug,
        category,
        expanded,
        kind: expandKind(category),
      });
    },
    [openIds]
  );

  const closeInspect = useCallback(() => setInspected(null), []);

  const handleToggleAll = useCallback(
    (group: CredentialGroupDef, expand: boolean) => {
      const slugs = group.credentials.map(credentialSlug);
      setOpenIds((prev) => {
        const next = new Set(prev);
        slugs.forEach((s) => (expand ? next.add(s) : next.delete(s)));
        return next;
      });
      trackEvent("credential_expand_all", {
        category: group.id,
        expanded: expand,
        kind: expandKind(group.id),
      });
    },
    []
  );

  return (
    <>
      <div className="space-y-14 md:space-y-20">
        {CREDENTIAL_GROUPS.map((group, i) => (
          <CredentialGroup
            key={group.id}
            group={group}
            startIndex={GROUP_START_INDEXES[i]}
            openIds={openIds}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            onInspect={setInspected}
          />
        ))}
      </div>

      {/* Completed coursework, below the credential ledger and behind a rule.
          The ledger states its standard four times before a reader arrives
          here, so the boundary reads as a boundary rather than an apology.
          This wrapper is a <div> on purpose: it keeps every new <section> a
          GRANDCHILD of the page's .max-w-7xl.mx-auto.px-6 container, so the
          `> section` probe in mobile-spacing.spec.ts stays unmatched exactly as
          it is today. */}
      <div className="mt-16 space-y-14 border-t border-line/10 pt-12 md:mt-24 md:space-y-20 md:pt-16">
        {COURSEWORK_GROUPS.map((group, i) => (
          <CredentialGroup
            key={group.id}
            group={group}
            startIndex={COURSEWORK_START_INDEXES[i]}
            openIds={openIds}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            onInspect={setInspected}
          />
        ))}
      </div>

      <CertLightbox cert={inspected} onClose={closeInspect} />
    </>
  );
}
