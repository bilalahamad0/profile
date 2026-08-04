"use client";

import React, { useCallback, useEffect, useState } from "react";
import { trackEvent } from "@/components/analytics/google-analytics";
import {
  CREDENTIAL_GROUPS,
  DEFAULT_OPEN_ID,
  credentialSlug,
  type CredentialGroupDef,
  type GalleryCertificate,
} from "@/app/certifications/data";
import { CredentialGroup } from "./CredentialGroup";
import { CertLightbox } from "./CertLightbox";

const ALL_SLUGS = new Set(
  CREDENTIAL_GROUPS.flatMap((g) => g.credentials.map(credentialSlug))
);

// 0-based ledger index of each group's first row (the 01…12 numerals).
const GROUP_START_INDEXES = CREDENTIAL_GROUPS.map((_, i) =>
  CREDENTIAL_GROUPS.slice(0, i).reduce((n, g) => n + g.credentials.length, 0)
);

export function CredentialLedger() {
  // Multi-open by design — expanding one credential never closes another.
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(
    () => new Set([DEFAULT_OPEN_ID])
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
      trackEvent("credential_expand", { id: slug, category, expanded });
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
      trackEvent("credential_expand_all", { category: group.id, expanded: expand });
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
      <CertLightbox cert={inspected} onClose={closeInspect} />
    </>
  );
}
