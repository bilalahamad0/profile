import { ArrowRight, Github } from "lucide-react";
import { projectsData } from "@/data/portfolio";
import { getAIMetricsMap, type AIMetrics } from "@/lib/ai-metrics";
import { STATIC_FALLBACK } from "@/lib/ai-metrics-fallback";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { AILabSection } from "@/components/projects/AILabSection";

/**
 * /projects — the projects grid plus the AI Lab, merged here in 2026-08 when
 * /ai was retired as a top-level destination (nav went 7 -> 6). `/ai` now 301s
 * to this page; see the redirect note in `next.config.ts`.
 *
 * A Server Component so the weekly-refreshed AI metrics are fetched at build /
 * revalidate time and land in the static HTML, exactly as they did on /ai.
 * The interactive grid lives in <ProjectsExplorer> behind its own "use client".
 */

export const revalidate = 3600;

export default async function ProjectsPage() {
  // Live per-project sidecars from each repo, with the build-time mirror standing
  // in for any that fail to fetch — same contract the AI Lab page had.
  const dynamicMetrics = await getAIMetricsMap();

  const metrics: Record<string, AIMetrics> = {};
  for (const project of projectsData) {
    const m = dynamicMetrics[project.id] ?? STATIC_FALLBACK[project.id];
    if (m) metrics[project.id] = m;
  }

  const aiProjects = projectsData
    .filter((p) => p.isAI)
    .map((p) => ({ id: p.id, name: p.name, aiContribution: p.aiContribution }));

  return (
    <div className="min-h-screen bg-surface text-ink">
      <ProjectsExplorer metrics={metrics} />

      {/* AI Lab — the site-wide AI engineering metrics, formerly /ai */}
      <AILabSection projects={aiProjects} metrics={metrics} />

      {/* GitHub CTA */}
      <section className="py-12 md:py-20 lg:py-24 px-6 text-center border-t border-line/10 dark:border-line/5 bg-ink/[0.01]">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="t-h2">See All Repositories</h2>
          <p className="text-ink-muted">
            Explore the complete collection of public work, contributions, and experiments.
          </p>
          <a
            href="https://github.com/bilalahamad0"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-ink text-surface font-bold hover:bg-ink/85 dark:hover:bg-zinc-200 transition-all hover:scale-105 shadow-2xl"
          >
            <Github className="w-5 h-5" aria-hidden="true" />
            View GitHub Profile
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
