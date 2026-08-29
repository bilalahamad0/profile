import { Bot, ChevronDown, Sparkles } from "lucide-react";
import type { AIMetrics } from "@/lib/ai-metrics";
import { formatTokens } from "@/lib/utils";

/**
 * The per-project half of the former /ai page, folded into its project card.
 *
 * It carries only what the surrounding project card does NOT already show —
 * the agents that built it, the before/after state change, and the measured
 * build figures. Name, tagline, description, tech tags, repo/architecture/blog
 * links all live one level up in the card, so repeating them here would just
 * make the page longer without adding a fact.
 *
 * Native <details> on purpose: the content is in the static HTML at build time
 * (crawlable / ATS-visible even while collapsed), it needs no client state, and
 * it keeps an already-tall card scannable.
 */

type AccentKey = "emerald" | "blue" | "pink" | "violet";

// The -700 light / -400 dark pairing is the site's accent contract: the 400s
// fail AA on the light ground, the 700s fail it on the dark one.
const ACCENTS: Record<AccentKey, { text: string; bg: string; border: string }> = {
  emerald: { text: "text-emerald-800 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  blue: { text: "text-blue-700 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  pink: { text: "text-pink-800 dark:text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  violet: { text: "text-violet-700 dark:text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
};

export function AIBuildBreakdown({
  metrics,
  accent,
  projectName,
}: {
  metrics: AIMetrics;
  accent: string;
  projectName: string;
}) {
  const colors = ACCENTS[accent as AccentKey] ?? ACCENTS.blue;

  const figures: Array<{ label: string; value: string }> = [
    { label: "Tokens", value: formatTokens(metrics.totalTokens) },
    { label: "Commits", value: String(metrics.totalCommits) },
    { label: "LOC", value: metrics.linesOfCode.toLocaleString() },
    { label: "Cycle", value: `${metrics.devCycleDays}d` },
    { label: "Days saved", value: `${metrics.manualEstimateDays - metrics.devCycleDays}d` },
  ];
  if (metrics.tests) {
    figures.push({
      label: "Tests",
      value: metrics.testSuites ? `${metrics.tests} · ${metrics.testSuites} suites` : String(metrics.tests),
    });
  }
  if (typeof metrics.microservices === "number") {
    figures.push({ label: "Microservices", value: String(metrics.microservices) });
  }

  return (
    <details className="group/ai mt-4 rounded-2xl border border-line/10 dark:border-line/5 bg-ink/[0.03] dark:bg-ink/[0.02] overflow-hidden">
      <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none select-none hover:bg-ink/[0.05] dark:hover:bg-ink/[0.03] transition-colors [&::-webkit-details-marker]:hidden">
        <Sparkles className={`w-3.5 h-3.5 shrink-0 ${colors.text}`} aria-hidden="true" />
        <span className="t-label font-black uppercase tracking-widest text-ink-muted">
          AI Build Breakdown
        </span>
        <ChevronDown
          className="w-4 h-4 ml-auto shrink-0 text-ink-muted transition-transform group-open/ai:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="px-4 pb-4 pt-1 space-y-4">
        {/* Measured build figures */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {figures.map(({ label, value }) => (
            <div key={label} className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border}`}>
              <dt className="t-label font-bold uppercase tracking-widest text-ink-muted">{label}</dt>
              <dd className="t-small font-semibold text-body mt-0.5 leading-tight">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Before / After */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* The 5% red wash all but vanishes on the light card, so the light
              base is 10%; dark keeps the original 5%. */}
          <div className="p-3 rounded-xl bg-red-500/10 dark:bg-red-500/5 border border-red-500/15">
            <span className="t-label font-black uppercase tracking-widest text-red-700 dark:text-red-400 block mb-1.5">
              Before AI
            </span>
            <p className="t-caption text-ink-muted leading-relaxed">{metrics.beforeAI}</p>
          </div>
          <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
            <span className={`t-label font-black uppercase tracking-widest ${colors.text} block mb-1.5`}>
              After AI
            </span>
            <p className="t-caption text-body leading-relaxed">{metrics.afterAI}</p>
          </div>
        </div>

        {/* Agents that built it */}
        {metrics.agents.length > 0 && (
          <div>
            <span className="block t-label font-black uppercase tracking-widest text-ink-muted mb-2">
              AI Agents
            </span>
            <ul role="list" className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {metrics.agents.map((agent) => (
                <li key={agent.name} className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Bot className={`w-3.5 h-3.5 shrink-0 ${colors.text}`} aria-hidden="true" />
                    <span className="t-small font-bold text-ink">{agent.name}</span>
                    <span className="t-label text-ink-muted ml-auto">{agent.period}</span>
                  </div>
                  <p className="t-label text-ink-muted mb-1.5">{agent.provider}</p>
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {agent.models.map((m) => (
                      <span key={m} className={`px-2 py-0.5 rounded-md t-label font-bold bg-ink/5 ${colors.text}`}>
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-baseline justify-between gap-3 t-label text-ink-muted">
                    <span className="shrink-0">{formatTokens(agent.tokens)} tokens</span>
                    <span className="text-right">{agent.role}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="pt-3 border-t border-line/10 dark:border-line/5 flex flex-wrap items-center justify-between gap-2 t-label text-ink-muted">
          <span>
            {projectName} metrics from <code className="text-ink-muted">ai-metrics.json</code>
          </span>
          <span>Updated {metrics.lastUpdated}</span>
        </p>
      </div>
    </details>
  );
}
