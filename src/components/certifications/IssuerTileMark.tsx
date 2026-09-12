import React from "react";
import { cn } from "@/lib/utils";
import type { IssuerTile } from "@/app/certifications/data";

/** The typeset issuer mark, in the ledger's SINGLE-CERTIFICATE thumbnail box
 *  (h-11 w-16 / md:h-14 md:w-[76px]).
 *
 *  A path earned no path-level badge, so it does NOT take the circular,
 *  halo-lit badge slot: that shape is this page's grammar for "an award", and
 *  filling it with a platform mark — or with a cluster of the path's own course
 *  badges — would present something as awarded FOR THE PATH. The rectangular
 *  slot already means "an artifact, not an award" on every single-certificate
 *  row, and it carries no halo and no drop-shadow for the same reason.
 *
 *  ONE SIZE. There used to be a `size` prop with a second, much larger `hero`
 *  variant (aspect-[1.4/1], full width, wordmark on `t-h2`) for the expanded
 *  panel's certificate-thumbnail box. That slab was deleted when the panel
 *  collapsed to a single column, taking its only caller with it, so the branch
 *  is gone rather than left dead: the collapsed row header is the only place an
 *  issuer mark appears.
 *
 *  `tile.tile` is an OPAQUE fixed hex, so every ratio is identical in both
 *  themes: white on #174EA6 7.85:1 / on #8C1515 9.40:1; white/80 5.65:1 /
 *  6.44:1. Neither hex is ever a foreground colour anywhere on the page.
 *
 *  TYPOGRAPHY: exactly one `t-*` per text element, and no `font-<weight>` /
 *  `tracking-*` / `leading-*` beside a token that bakes one. Both lines sit on
 *  `t-label` — the one token globals.css documents as size-only ("keep the
 *  element's own weight / uppercase / tracking / colour") — which is what lets
 *  the `code` line carry its own wide tracking. `wordmarkFamily` is a FAMILY
 *  class only, never a weight. `font-semibold` would be legal on the wordmark
 *  beside `t-label`; it is still not used, so the mark stays one voice. */
export function IssuerTileMark({ tile }: { tile: IssuerTile }) {
  return (
    <span
      className={cn(
        "relative flex h-11 w-16 shrink-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg ring-1 ring-inset ring-white/25 md:h-14 md:w-[76px]",
        tile.tile,
      )}
    >
      {/* Sheen — keeps the slab from reading flat. Decorative only. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/25"
      />
      <span className={cn("relative t-label text-white", tile.wordmarkFamily)}>
        {tile.wordmark}
      </span>
      <span className="relative t-label font-bold uppercase tracking-wider text-white/80">
        {tile.code}
      </span>
    </span>
  );
}
