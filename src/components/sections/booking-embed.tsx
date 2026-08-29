"use client";

import { useState } from "react";
import { CalendarClock, ExternalLink, Play } from "lucide-react";
import { SCHEDULING_URL, SCHEDULING_EMBED_URL } from "@/lib/contact";

/**
 * Inline Google Appointment Scheduling booking page, embedded on /contact so
 * visitors pick a slot without leaving the site. Uses the direct-iframe embed
 * (the `?gv=true` booking view) — no third-party script, so the only CSP
 * concession is `frame-src https://calendar.google.com`. A same-origin fallback
 * link keeps booking reachable if the frame is blocked (ad-blocker, CSP, etc.).
 *
 * The frame is mounted CLICK-TO-LOAD, mirroring DashboardFacade: Google's
 * booking view pulls ~1.4MB of its own JS/CSS/reCAPTCHA/Material-Icons the
 * moment it mounts (even with loading="lazy", because it sits inside the
 * viewport-adjacent flow), which made /contact the heaviest page on the site.
 * Until the visitor asks for it, we render a themed dark glass placeholder —
 * which also removes the big blank white rectangle the raw embed painted into
 * an otherwise dark page.
 *
 * `id="book"` is the scroll target every "Book a Call" affordance points to.
 */
export function BookingEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section
      id="book"
      aria-label="Book a call"
      className="scroll-mt-24 border-t border-white/5 px-6 py-12 md:py-16 lg:py-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
            <CalendarClock className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
            <span className="t-label font-bold uppercase tracking-[0.2em] text-blue-300">
              Live Availability
            </span>
          </div>
          <h2 className="t-h2 mb-3">Book a Call</h2>
          <p className="t-lead text-zinc-400 font-light max-w-xl mx-auto">
            Pick a 1:1 slot straight from my calendar — no back-and-forth. Or send a note above and I&apos;ll reply within 24–48 hours.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-2 sm:p-3">
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
              className="group/facade flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-900/90 via-zinc-900/70 to-zinc-800/60 px-6 py-16 sm:py-20 text-center transition-colors hover:from-zinc-900/80 hover:via-zinc-900/60 hover:to-zinc-800/50"
            >
              <CalendarClock className="w-8 h-8 text-blue-400" aria-hidden="true" />
              <span className="t-small font-bold text-white">Book a 1:1 call</span>
              <span className="t-caption text-zinc-400">
                Google Calendar scheduler — loads on demand to keep this page light
              </span>
              <span className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/80 backdrop-blur-md border border-white/20 t-small font-black uppercase tracking-widest text-white shadow-xl transition-all group-hover/facade:bg-blue-500 group-hover/facade:scale-105">
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                Load booking calendar
              </span>
            </button>
          )}
        </div>

        <p className="text-center t-caption text-zinc-400 mt-4">
          Scheduler not loading?{" "}
          <a
            href={SCHEDULING_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-zinc-400 underline underline-offset-2 hover:text-blue-400 transition-colors"
          >
            Open the booking page in a new tab
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </p>
      </div>
    </section>
  );
}
