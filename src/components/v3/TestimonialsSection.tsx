"use client";

import React from "react";
import { MessageSquareQuote, CheckCircle, Linkedin, ExternalLink } from "lucide-react";
import { recommendations } from "@/data/portfolio";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function TestimonialsSection() {
  return (
    <section
      className="px-6 lg:px-24 py-16 md:py-24 relative overflow-hidden"
      id="testimonials"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest">
              <div className="h-px w-6 bg-emerald-500/50" />
              Social Proof &amp; Peer Endorsements
            </div>
            <h2 id="testimonials-heading" className="t-h2 text-ink">
              Leadership &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
                Peer Endorsements
              </span>
            </h2>
            <p className="t-lead text-ink-muted font-light max-w-2xl">
              Direct recommendations from engineering directors, project managers, and digital leaders
              who have worked alongside Bilal on high-stakes programs.
            </p>
          </div>

          <a
            href="https://linkedin.com/in/bilalahamad"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all shrink-0 self-start md:self-auto"
          >
            <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Verify on LinkedIn</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </a>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <SpotlightCard
              key={rec.name}
              spotlightColor="rgba(16, 185, 129, 0.12)"
              className="p-8 flex flex-col justify-between h-full border-line/10 bg-surface-card/90 dark:bg-black/60"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    <MessageSquareQuote className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/15">
                    <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    Verified Recommendation
                  </span>
                </div>

                <p className="t-body text-body italic leading-relaxed font-light">
                  &ldquo;{rec.review}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-line/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-black text-sm">
                  {rec.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-ink leading-tight">{rec.name}</h3>
                  <p className="t-caption text-ink-muted mt-0.5">{rec.title}</p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
