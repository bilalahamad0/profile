"use client";

import { useState, useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Everything below `lg` is treated as "mobile" for the /experience page —
 *  the two-column bento only exists at `lg` and above. */
const MOBILE_QUERY = "(max-width: 1023.98px)";

const neverChanges = () => () => {};
const subscribeToViewport = (onChange: () => void) => {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/** `false` on the server and through hydration, `true` once mounted — the
 *  server must never emit a disclosure button that JavaScript is not there to
 *  operate. */
const useIsHydrated = () =>
  useSyncExternalStore(
    neverChanges,
    () => true,
    () => false
  );

/** Server snapshot is `false` so the static HTML is always the expanded state. */
const useIsMobile = () =>
  useSyncExternalStore(
    subscribeToViewport,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  );

/**
 * Class bundle for a panel that this toggle collapses.
 *
 * The collapse is pure CSS, driven off the toggle's `data-mobile-collapsed`
 * attribute through a sibling selector, so the *open* state is the default the
 * server renders. That is the whole point: with JavaScript disabled (or before
 * hydration, or for a crawler that never runs the bundle) the attribute is
 * `false`, no rule matches, and every role is laid out at full height exactly
 * as it is today. Content is never conditionally rendered — same contract as
 * `CollapsePanel` on /certifications, and it keeps the career text in the
 * static HTML that ATS parsers read.
 *
 * `grid-template-rows: 1fr → 0fr` is what animates; `visibility` is in the
 * transition list so the panel stays painted while it closes but leaves the
 * tab order and the accessibility tree once it is shut (the CSS equivalent of
 * the `inert` attribute CollapsePanel uses).
 *
 * Every rule is scoped `max-lg:`, so the desktop bento grid is provably
 * untouched — no `!important`, no runtime state reaches it.
 *
 * Apply to the panel element; its single child must be `MOBILE_COLLAPSIBLE_INNER`.
 */
export const MOBILE_COLLAPSIBLE =
  "grid grid-rows-[1fr] transition-[grid-template-rows,visibility] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] " +
  "max-lg:[[data-mobile-collapsed=true]~&]:grid-rows-[0fr] " +
  "max-lg:[[data-mobile-collapsed=true]~&]:invisible";

/** Required wrapper inside a `MOBILE_COLLAPSIBLE` panel — the 0fr row can only
 *  squeeze a child that is allowed to shrink below its content height. */
export const MOBILE_COLLAPSIBLE_INNER = "min-h-0 overflow-hidden lg:overflow-visible";

/**
 * Progressive-enhancement disclosure button for the /experience page.
 *
 * Renders nothing on the server, so a JS-disabled visitor is never shown a
 * control that cannot work — they simply get the fully expanded page. After
 * hydration the button appears below `lg` and collapses the sibling panels
 * that carry `MOBILE_COLLAPSIBLE`.
 */
export function MobileCollapseToggle({
  as: Tag = "div",
  controls,
  showLabel,
  hideLabel,
  className,
}: {
  /** `li` when the toggle sits inside the timeline's ordered list. */
  as?: "div" | "li";
  /** Space-separated id list of the panels this button expands. */
  controls: string;
  showLabel: string;
  hideLabel: string;
  className?: string;
}) {
  const hydrated = useIsHydrated();
  const isMobile = useIsMobile();
  // Default follows the viewport; an explicit tap wins from then on.
  const [chosen, setChosen] = useState<boolean | null>(null);
  const collapsed = chosen ?? isMobile;

  return (
    <Tag
      data-mobile-collapsed={collapsed}
      className={cn("lg:hidden empty:hidden", className)}
    >
      {hydrated && (
        <button
          type="button"
          aria-expanded={!collapsed}
          aria-controls={controls}
          onClick={() => setChosen(!collapsed)}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-line/10 bg-ink/5 px-4 py-2.5 t-label font-bold uppercase tracking-[0.12em] text-ink-muted transition-colors hover:border-line/20 hover:bg-ink/10 hover:text-ink"
        >
          {collapsed ? showLabel : hideLabel}
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-300",
              !collapsed && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
      )}
    </Tag>
  );
}
