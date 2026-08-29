"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MonitorPlay } from "lucide-react";

interface DashboardFacadeProps {
  /** Project name — used for the accessible label and the placeholder headline. */
  title: string;
  /** Describes the embed for assistive tech, e.g. "Load live dashboard". */
  label: string;
  /** One-line hint under the headline. */
  note?: string;
  /**
   * The real third-party embed (iframe + overlays). Mounted as the card nears
   * the viewport, so the heavy scripts never load with the page.
   */
  children: ReactNode;
}

/**
 * Defers a third-party dashboard embed until the reader is about to see it.
 *
 * The github.io dashboards pull ~1.5MB of Plotly and Firebase the moment their
 * iframe mounts — even with loading="lazy", because Chromium's lazy threshold is
 * generous enough to fetch them on load. So the iframe is withheld until an
 * IntersectionObserver says the card is approaching, then mounted automatically:
 * the dashboard is simply *there* when scrolled to, with no button to press.
 *
 * The 300px root margin starts the load just before the card enters view. The
 * dashboards sit well below the fold, so nothing is fetched on first paint —
 * verify that with a cold-load network capture if this margin ever changes.
 *
 * The placeholder stays clickable as a fallback for browsers without
 * IntersectionObserver, and reads as a loading state rather than a call to
 * action, since in practice it is only on screen for a moment.
 */
export function DashboardFacade({ title, label, note, children }: DashboardFacadeProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (loaded) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setLoaded(true); // no observer support — show the dashboard rather than a dead button
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoaded(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loaded]);

  if (loaded) return <>{children}</>;

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setLoaded(true)}
      className="absolute inset-0 z-[5] flex w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink/[0.07] via-ink/[0.05] to-ink/[0.03] backdrop-blur-sm px-6 text-center dark:from-zinc-900/90 dark:via-zinc-900/70 dark:to-zinc-800/60"
      aria-label={`${label} — ${title}`}
    >
      <MonitorPlay className="w-8 h-8 text-blue-700 dark:text-blue-400" aria-hidden="true" />
      <span className="t-small font-bold text-ink">{title}</span>
      {note && <span className="t-caption text-ink-muted">{note}</span>}
      <span className="t-caption text-ink-subtle" role="status">
        Loading live dashboard…
      </span>
    </button>
  );
}
