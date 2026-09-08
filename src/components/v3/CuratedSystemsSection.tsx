import Link from "next/link";
import { ArrowRight, ExternalLink, Activity, Radio, Cpu } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

interface SystemPreview {
  id: string;
  name: string;
  tagline: string;
  challenge: string;
  icon: React.ElementType;
  tech: string[];
  spotlight: string;
  accent: string;
  href: string;
}

const CURATED_SYSTEMS: SystemPreview[] = [
  {
    id: "warn",
    name: "National Layoff Intelligence Engine",
    tagline: "Automated distributed pipeline across 46 state labor portals",
    challenge: "Engineered an autonomous data ingestion architecture that scrapes, normalizes, and validates state WARN filings twice daily with zero human intervention using ETag caching and MD5 integrity verification.",
    icon: Activity,
    tech: ["Python", "ETag Cache", "GitHub Actions", "JSON API"],
    spotlight: "rgba(59, 130, 246, 0.15)",
    accent: "text-blue-700 dark:text-blue-400",
    href: "/projects#warn",
  },
  {
    id: "adhan",
    name: "Embedded IoT Media Orchestrator",
    tagline: "Raspberry Pi & Android TV ADB hardware integration",
    challenge: "Built an embedded daemon on Raspberry Pi that controls Sony Android TV media state over ADB for zero-touch audio broadcasting, handling device sleep, HDMI state arbitration, and NTP clock adjustments.",
    icon: Cpu,
    tech: ["Raspberry Pi", "ADB", "Embedded Linux", "Node.js"],
    spotlight: "rgba(16, 185, 129, 0.15)",
    accent: "text-emerald-700 dark:text-emerald-400",
    href: "/projects#adhan",
  },
  {
    id: "adhan-ce",
    name: "Cross-Browser Tab Synchronization Engine",
    tagline: "Manifest V3 cross-tab media orchestration",
    challenge: "Engineered an event-driven WebExtension that monitors active media across all browser tabs, automatically pausing audio and video at prayer times with instant state recovery across Chrome, Firefox, and Edge.",
    icon: Radio,
    tech: ["Manifest V3", "WebExtensions", "Service Workers", "Cross-Browser"],
    spotlight: "rgba(139, 92, 246, 0.15)",
    accent: "text-violet-700 dark:text-violet-400",
    href: "/projects#adhan-ce",
  },
];

export function CuratedSystemsSection() {
  return (
    <section
      className="px-6 lg:px-24 py-12 md:py-20 lg:py-24 relative overflow-hidden"
      id="curated-systems"
      aria-labelledby="curated-systems-heading"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-mono t-label uppercase tracking-widest">
              <div className="h-px w-6 bg-blue-500/50" />
              Applied Engineering
            </div>
            <h2 id="curated-systems-heading" className="t-h2 text-ink">
              Selected Systems &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                Frontiers
              </span>
            </h2>
            <p className="t-lead text-ink-muted font-light">
              A high-level view of production systems engineered outside the enterprise—combining
              physical computing, automated ingestion, and browser runtime architectures.
            </p>
          </div>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink/5 border border-line/10 t-small font-semibold text-ink hover:bg-ink/10 transition-all shrink-0 self-start md:self-auto"
          >
            <span>Explore All Projects &amp; Live Demos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CURATED_SYSTEMS.map((system) => {
            const Icon = system.icon;
            return (
              <SpotlightCard
                key={system.id}
                spotlightColor={system.spotlight}
                className="p-8 rounded-3xl border border-line/10 dark:border-line/[0.08] bg-surface-card/90 dark:bg-black/40 flex flex-col justify-between space-y-6 hover:border-line/20 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-ink/[0.04] dark:bg-ink/[0.03] border border-line/10 w-fit">
                      <Icon className={`w-5 h-5 ${system.accent}`} aria-hidden="true" />
                    </div>
                    <Link
                      href={system.href}
                      className="inline-flex items-center gap-1 t-label font-mono text-ink-muted hover:text-ink transition-colors"
                    >
                      <span>Deep Dive</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>

                  <div>
                    <h3 className="t-h3 text-ink">{system.name}</h3>
                    <p className={`t-caption font-mono ${system.accent} mt-1`}>
                      {system.tagline}
                    </p>
                  </div>

                  <p className="t-body text-ink-muted font-light leading-relaxed">
                    {system.challenge}
                  </p>
                </div>

                <div className="pt-4 border-t border-line/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {system.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="t-label font-mono px-2.5 py-0.5 rounded-md bg-ink/[0.04] border border-line/10 text-ink-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={system.href}
                    className={`t-caption font-semibold ${system.accent} hover:underline inline-flex items-center gap-1`}
                  >
                    <span>View Architecture</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
