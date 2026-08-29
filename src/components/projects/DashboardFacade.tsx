"use client";

import { useState, type ReactNode } from "react";
import { MonitorPlay, Play } from "lucide-react";

interface DashboardFacadeProps {
  /** Project name — used for the accessible label and the placeholder headline. */
  title: string;
  /** Button text, e.g. "Load live dashboard". */
  label: string;
  /** One-line hint under the headline, e.g. "Live Plotly dashboard — loads on demand". */
  note?: string;
  /**
   * The real third-party embed (iframe + overlays). Not mounted until the
   * visitor clicks, so heavy scripts (Plotly, Firebase, full pages) never
   * load with the page.
   */
  children: ReactNode;
}

/**
 * Click-to-load facade for third-party iframe embeds. The github.io dashboards
 * pull in ~1.5MB of Plotly + Firebase the moment their iframe mounts — even
 * with loading="lazy" — so the iframe is swapped in only after an explicit
 * click on this themed glass placeholder.
 */
export function DashboardFacade({ title, label, note, children }: DashboardFacadeProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) return <>{children}</>;

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="group/facade absolute inset-0 z-[5] flex w-full cursor-pointer flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-900/90 via-zinc-900/70 to-zinc-800/60 backdrop-blur-sm px-6 text-center transition-colors hover:from-zinc-900/80 hover:via-zinc-900/60 hover:to-zinc-800/50"
      aria-label={`${label} — ${title}`}
    >
      <MonitorPlay className="w-8 h-8 text-blue-400" aria-hidden="true" />
      <span className="t-small font-bold text-white">{title}</span>
      {note && <span className="t-caption text-zinc-400">{note}</span>}
      <span className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/80 backdrop-blur-md border border-white/20 t-small font-black uppercase tracking-widest text-white shadow-xl transition-all group-hover/facade:bg-blue-500 group-hover/facade:scale-105">
        <Play className="w-4 h-4 fill-current" aria-hidden="true" />
        {label}
      </span>
    </button>
  );
}
