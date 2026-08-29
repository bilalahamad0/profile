import { CalendarClock, ExternalLink } from "lucide-react";
import { SCHEDULING_URL, SCHEDULING_EMBED_URL } from "@/lib/contact";

/**
 * Inline Google Appointment Scheduling booking page, embedded on /contact so
 * visitors pick a slot without leaving the site. Uses the direct-iframe embed
 * (the `?gv=true` booking view) — no third-party script, so the only CSP
 * concession is `frame-src https://calendar.google.com`. A same-origin fallback
 * link keeps booking reachable if the frame is blocked (ad-blocker, CSP, etc.).
 *
 * `id="book"` is the scroll target every "Book a Call" affordance points to.
 */
export function BookingEmbed() {
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
          <iframe
            src={SCHEDULING_EMBED_URL}
            title="Book a 1:1 call with Bilal Ahamad"
            loading="lazy"
            className="w-full h-[640px] sm:h-[700px] rounded-2xl border-0 bg-white"
          />
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
