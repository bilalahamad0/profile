import Link from "next/link";
import { ArrowRight, ExternalLink, Activity, Radio, Cpu } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { LazyLoopVideo } from "@/components/media/LazyLoopVideo";
import { projectsData } from "@/data/portfolio";

const FEATURED_SYSTEM_IDS = ["warn", "adhan", "adhan-ce"] as const;

const SYSTEM_CONFIGS: Record<
  (typeof FEATURED_SYSTEM_IDS)[number],
  {
    icon: React.ElementType;
    spotlight: string;
    accentText: string;
    categoryBadge: string;
    challenge: string;
  }
> = {
  warn: {
    icon: Activity,
    spotlight: "rgba(59, 130, 246, 0.15)",
    accentText: "text-blue-700 dark:text-blue-400",
    categoryBadge: "Data & Analytics",
    challenge:
      "Autonomous data ingestion architecture that scrapes, normalizes, and validates state WARN filings across 46 states and DC twice daily with zero human intervention using ETag caching and MD5 verification.",
  },
  adhan: {
    icon: Cpu,
    spotlight: "rgba(16, 185, 129, 0.15)",
    accentText: "text-emerald-700 dark:text-emerald-400",
    categoryBadge: "IoT & Automation",
    challenge:
      "Embedded daemon running on a Raspberry Pi that orchestrates a Sony Android TV over ADB for zero-touch audio broadcasting, managing device power states, HDMI audio routing, and NTP clock drift.",
  },
  "adhan-ce": {
    icon: Radio,
    spotlight: "rgba(139, 92, 246, 0.15)",
    accentText: "text-violet-700 dark:text-violet-400",
    categoryBadge: "WebExtensions",
    challenge:
      "Cross-browser WebExtension that synchronizes media state across all open browser tabs, automatically pausing audio and video streams at prayer times with state recovery across Chromium, Gecko, and Edge engines.",
  },
};

export function CuratedSystemsSection() {
  const systems = FEATURED_SYSTEM_IDS.map((id) => {
    const project = projectsData.find((p) => p.id === id);
    const config = SYSTEM_CONFIGS[id];
    return {
      project: project!,
      config,
    };
  });

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
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-mono t-label uppercase">
              <div className="h-px w-6 bg-blue-500/50" />
              Applied Engineering
            </div>
            <h2 id="curated-systems-heading" className="t-h2 text-ink">
              Selected Systems &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                Frontiers
              </span>
            </h2>
            <p className="t-lead text-ink-muted">
              A high-level view of production systems engineered outside the enterprise—combining
              physical computing, automated ingestion, and browser runtime architectures.
            </p>
          </div>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink/5 border border-line/10 t-small text-ink hover:bg-ink/10 transition-all shrink-0 self-start md:self-auto"
          >
            <span>Explore All Projects &amp; Live Demos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        {/* 3 Columns Grid with Video Thumbnails */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {systems.map(({ project, config }) => {
            const Icon = config.icon;
            const hasVideoThumb = Boolean(project.thumbnail?.endsWith(".mp4"));
            const poster = (project as { thumbnailPoster?: string }).thumbnailPoster;

            return (
              <SpotlightCard
                key={project.id}
                spotlightColor={config.spotlight}
                className="group relative rounded-3xl border border-line/10 dark:border-line/[0.08] bg-surface-card/90 dark:bg-black/40 flex flex-col justify-between overflow-hidden hover:border-line/20 transition-all duration-300"
              >
                <div>
                  {/* Video Thumbnail Preview */}
                  {hasVideoThumb && project.thumbnail ? (
                    <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-ink/[0.04]">
                      <LazyLoopVideo
                        src={project.thumbnail}
                        poster={poster}
                        className="w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-card dark:from-[#121214] via-transparent to-transparent pointer-events-none" />

                      {/* Category Badge overlay */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/15 t-label font-mono uppercase text-white/90">
                          {config.categoryBadge}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  {/* Card Content */}
                  <div className="p-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-2xl bg-ink/[0.04] dark:bg-ink/[0.03] border border-line/10 w-fit">
                        <Icon className={`w-5 h-5 ${config.accentText}`} aria-hidden="true" />
                      </div>
                      <Link
                        href={`/projects#${project.id}`}
                        className="inline-flex items-center gap-1 t-label font-mono text-ink-muted hover:text-ink transition-colors"
                      >
                        <span>Deep Dive</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    </div>

                    <div>
                      {/* Exact matching project name from projects page */}
                      <h3 className="t-h3 text-ink">
                        {project.name}
                      </h3>
                      <p className={`t-caption font-mono ${config.accentText} mt-1.5`}>
                        {project.tagline}
                      </p>
                    </div>

                    <p className="t-body text-ink-muted">
                      {config.challenge}
                    </p>
                  </div>
                </div>

                {/* Footer with Tech Stack & Navigation */}
                <div className="p-7 pt-4 border-t border-line/10 flex items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="t-label font-mono px-2.5 py-0.5 rounded-md bg-ink/[0.04] border border-line/10 text-ink-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/projects#${project.id}`}
                    className={`t-caption ${config.accentText} hover:underline inline-flex items-center gap-1`}
                  >
                    <span>View System</span>
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
