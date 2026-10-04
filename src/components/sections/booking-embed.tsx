"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarClock, ExternalLink, Play, Share2, Check } from "lucide-react";
import { SCHEDULING_URL, SCHEDULING_EMBED_URL, BOOKING_SHARE_URL } from "@/lib/contact";

/**
 * Inline Google Appointment Scheduling booking page, embedded on /contact so
 * visitors pick a slot without leaving the site. Uses the direct-iframe embed
 * (the `?gv=true` booking view) — no third-party script, so the only CSP
 * concession is `frame-src https://calendar.google.com`. A same-origin fallback
 * link keeps booking reachable if the frame is blocked (ad-blocker, CSP, etc.).
 *
 * For casual /contact visits, the frame is mounted CLICK-TO-LOAD, mirroring
 * DashboardFacade: Google's booking view pulls ~1.4MB of its own assets the
 * moment it mounts.
 *
 * However, when arriving via a shared booking link (/book, /schedule, /calendar,
 * or #book), the calendar AUTO-LOADS immediately so recipients don't face
 * unnecessary clicks.
 *
 * `id="book"` is the scroll target every "Book a Call" affordance points to.
 */
export function BookingEmbed() {
  const [loaded, setLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Auto-load if arriving with booking intent (/book redirect, ?book=true, or #book)
  useEffect(() => {
    const checkBookingIntent = () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const hasParam =
        params.has("book") || params.has("schedule") || params.has("calendar");
      const hasHash = window.location.hash === "#book";
      if (hasParam || hasHash) {
        setLoaded(true);
      }
    };

    checkBookingIntent();
    window.addEventListener("hashchange", checkBookingIntent);
    return () => window.removeEventListener("hashchange", checkBookingIntent);
  }, []);

  const handleShare = useCallback(async () => {
    const url =
      typeof window !== "undefined" && window.location.origin
        ? `${window.location.origin}/book`
        : BOOKING_SHARE_URL;

    const shareData = {
      title: "Book a 1:1 with Bilal Ahamad",
      text: "Schedule a 1:1 call with Bilal Ahamad directly via his website calendar.",
      url,
    };

    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share dismissed — fall back to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2200);
      } catch {
        // Clipboard write failed
      }
    }
  }, []);

  return (
    <section
      id="book"
      aria-label="Book a call"
      className="scroll-mt-24 border-t border-line/10 px-6 py-12 md:py-16 lg:py-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <CalendarClock className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" aria-hidden="true" />
              <span className="t-label font-bold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">
                Live Availability
              </span>
            </div>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share calendar booking link"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isCopied
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 shadow-sm"
                  : "bg-surface/80 border-line/15 text-ink-muted hover:text-ink hover:bg-ink/5 hover:border-line/30 dark:bg-zinc-900/60"
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>Copied /book link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span>Share Calendar</span>
                </>
              )}
            </button>
          </div>
          <h2 className="t-h2 mb-3">Book a Call</h2>
          <p className="t-lead text-ink-muted font-light max-w-xl mx-auto">
            Pick a 1:1 slot straight from my calendar — no back-and-forth. Or send a note above and I&apos;ll reply within 24–48 hours.
          </p>
        </div>

        <div className="rounded-3xl border border-line/10 bg-ink/5 backdrop-blur-sm p-2 sm:p-3">
          {loaded ? (
            <iframe
              src={SCHEDULING_EMBED_URL}
              title="Book a 1:1 call with Bilal Ahamad"
              loading="lazy"
              className="w-full h-[640px] sm:h-[700px] rounded-2xl border-0 bg-white"
            />
          ) : (
            <button
              type="button"
              onClick={() => setLoaded(true)}
              aria-label="Load booking calendar — book a 1:1 call with Bilal Ahamad"
              className="group/facade flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-line/10 bg-gradient-to-br from-ink/[0.07] via-ink/[0.05] to-ink/[0.03] px-6 py-16 sm:py-20 text-center transition-colors hover:from-ink/[0.10] hover:via-ink/[0.07] hover:to-ink/[0.05] dark:from-zinc-900/90 dark:via-zinc-900/70 dark:to-zinc-800/60 dark:hover:from-zinc-900/80 dark:hover:via-zinc-900/60 dark:hover:to-zinc-800/50"
            >
              <CalendarClock className="w-8 h-8 text-blue-700 dark:text-blue-400" aria-hidden="true" />
              <span className="t-small font-bold text-ink">Google Calendar scheduler</span>
              <span className="t-caption text-ink-muted">
                Loads on demand, so this page stays light
              </span>
              <span className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 backdrop-blur-md border border-white/20 t-small font-black uppercase tracking-widest text-white shadow-xl transition-all group-hover/facade:bg-blue-700 group-hover/facade:scale-105 dark:bg-blue-500/80 dark:group-hover/facade:bg-blue-500">
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                Load calendar
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center t-caption text-ink-muted mt-4">
          <span>
            Shareable link:{" "}
            <button
              type="button"
              onClick={handleShare}
              aria-label="Copy bilalahamad.com/book to clipboard"
              className="font-mono text-ink underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              bilalahamad.com/book
            </button>
          </span>
          <span className="hidden sm:inline opacity-30">•</span>
          <span>
            Scheduler not loading?{" "}
            <a
              href={SCHEDULING_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-ink-muted underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              Open in a new tab
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
