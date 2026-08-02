import React from "react";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { CredentialLedger } from "@/components/certifications/CredentialLedger";
import { CERT_STATS, CREDENTIAL_GROUPS } from "./data";

// Server Component by design: the hero, stats, and jump pills are static
// SEO-critical HTML; all interactivity lives in <CredentialLedger />.
// Every credential and course title is server-rendered whether its row is
// expanded or not (ATS requirement).

const STATS = [
  { value: String(CERT_STATS.credentials), label: "Credentials" },
  { value: String(CERT_STATS.courseCertificates), label: "Course Certificates" },
  { value: String(CERT_STATS.specializations), label: "Google Specializations" },
  { value: CERT_STATS.yearsSpan, label: "Learning Span" },
] as const;

export default function CertificationsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] aurora-gradient relative overflow-x-hidden">
      <div className="bg-noise" aria-hidden="true" />

      {/* Scroll to Top helper for SmoothScroll compatibility */}
      <div id="top" />

      {/* Header Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-24 pb-8 md:pt-32 md:pb-10 lg:pt-40">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="glass inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 shadow-xl">
            <Award className="h-4 w-4 text-blue-400" />
            <span className="t-caption font-bold uppercase tracking-[0.2em] text-white/70">Professional Credentials</span>
          </div>

          <h1 className="t-h1 text-white">
            Knowledge <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Album.</span>
          </h1>

          <p className="t-lead max-w-2xl text-zinc-400">
            A curated collection of my professional certifications, specialized training,
            and continuous education in QA, Development, and Artificial Intelligence.
          </p>
        </div>

        {/* At-a-glance stats — computed from the data, never hardcoded.
            flex-col-reverse keeps conforming dt→dd source order while
            rendering the number above its label. */}
        <dl className="glass-card mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-y-4 rounded-2xl border border-white/10 px-2 py-4 md:mt-10 md:flex md:items-stretch md:justify-center md:divide-x md:divide-white/10">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse px-4 text-center md:px-8">
              <dt className="mt-1 t-label font-bold uppercase tracking-wider text-white/55">
                {stat.label}
              </dt>
              <dd className="t-h2 text-white">{stat.value}</dd>
            </div>
          ))}
        </dl>

        {/* Jump pills — one per category group */}
        <nav
          aria-label="Certification categories"
          className="-mx-6 mt-6 flex snap-x items-center gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0"
        >
          {CREDENTIAL_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="inline-flex shrink-0 snap-start items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 t-label font-bold uppercase tracking-wider text-white/60 transition-colors hover:border-white/25 hover:text-white"
              >
                <Icon className={cn("h-3.5 w-3.5", group.accent.eyebrow)} aria-hidden />
                {group.title}
                <span className="text-white/30">· {group.credentials.length}</span>
              </a>
            );
          })}
        </nav>
      </section>

      {/* The Credential Ledger — categorized, collapsible credential rows */}
      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-10 md:pb-32 md:pt-14 lg:pb-40">
        <CredentialLedger />
      </div>
    </div>
  );
}
