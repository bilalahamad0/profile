"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, MonitorOff, Moon, Sun } from "lucide-react";

/** Shared so the pre-hydration placeholder is exactly the size of the real control. */
const GROUP =
  "flex items-center gap-0.5 rounded-full border border-line/10 bg-ink/5 p-0.5";
const BUTTON =
  "flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 motion-reduce:transition-none";

/**
 * Two independent controls rather than one three-way choice:
 *
 *  1. Appearance — sun or moon, showing the theme currently in effect; clicking
 *     flips it and pins that choice.
 *  2. System — a monitor, slashed when the site is NOT following the OS.
 *     Clicking it hands control back to the OS, or takes it back by pinning
 *     whatever is on screen right now.
 *
 * Each icon shows the CURRENT state; the accessible name spells out both that
 * state and what activating will do, so the two never have to be inferred from
 * the glyph alone. While the OS is in charge the appearance icon is muted, to
 * signal it is a reflection rather than a choice.
 */
export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Before hydration the resolved theme is unknowable — render the same box so
  // the centred navbar pill cannot change width underneath the user.
  if (!mounted) {
    return (
      <div className={GROUP} aria-hidden="true">
        <span className={BUTTON} />
        <span className={BUTTON} />
      </div>
    );
  }

  const isSystem = theme === "system";
  const isDark = resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <div className={GROUP}>
      <button
        type="button"
        onClick={() => setTheme(next)}
        aria-label={`Theme: ${isDark ? "dark" : "light"}${isSystem ? ", following your system" : ""}. Switch to ${next}.`}
        title={`Switch to ${next} theme`}
        className={`${BUTTON} ${isSystem ? "text-ink-muted hover:text-ink hover:bg-ink/10" : "bg-ink text-surface"}`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Sun className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setTheme(isSystem ? (resolvedTheme ?? "dark") : "system")}
        aria-pressed={isSystem}
        aria-label="Follow system theme"
        title={isSystem ? "Following your system theme" : "Not following your system theme"}
        className={`${BUTTON} ${isSystem ? "bg-ink text-surface" : "text-ink-muted hover:text-ink hover:bg-ink/10"}`}
      >
        {isSystem ? (
          <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <MonitorOff className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
