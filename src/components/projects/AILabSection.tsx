import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import type { AIMetrics } from "@/lib/ai-metrics";
import { formatTokens } from "@/lib/utils";

/**
 * The site-wide half of the former /ai page ("AI Lab"), now a section of
 * /projects. Server-rendered so every figure is in the static HTML at build
 * time, exactly as it was on /ai.
 *
 * The per-project detail (agents, before/after, build figures) is NOT here —
 * it sits inside each project's own card above as <AIBuildBreakdown>, which is
 * where a reader looking at a project expects to find it. What stays here is
 * the part that is genuinely cross-project: the aggregate headline stats and
 * the comparison table. Each table row is an anchor into its project card.
 */

export type AILabProject = {
  id: string;
  name: string;
  aiContribution: number;
};

export function AILabSection({
  projects,
  metrics,
}: {
  projects: AILabProject[];
  metrics: Record<string, AIMetrics>;
}) {
  const tracked = projects.map((p) => ({ project: p, dm: metrics[p.id] }));
  const known = tracked.map((t) => t.dm).filter((m): m is AIMetrics => Boolean(m));

  const totalTokens = known.reduce((sum, m) => sum + m.totalTokens, 0);
  const totalCommits = known.reduce((sum, m) => sum + m.totalCommits, 0);

  // Derived from the same per-project figures the table below renders, rather than asserted
  // as a fixed string — a hardcoded headline silently goes false the moment any project's
  // cycle is corrected. Weighted by days (Σ actual ÷ Σ baseline), not a mean of percentages,
  // so a one-day project can't swing the total.
  const totalDevDays = known.reduce((sum, m) => sum + m.devCycleDays, 0);
  const totalManualDays = known.reduce((sum, m) => sum + m.manualEstimateDays, 0);
  const cycleReduction =
    totalManualDays > 0 ? Math.round((1 - totalDevDays / totalManualDays) * 100) : 0;

  const heroStats = [
    { label: "Dev Cycle Reduction", value: cycleReduction > 0 ? `${cycleReduction}%` : "—" },
    { label: "Production Systems", value: String(projects.length) },
    { label: "AI Tokens Processed", value: totalTokens > 0 ? `${formatTokens(totalTokens)}+` : "500k+" },
    { label: "Total Commits", value: totalCommits > 0 ? String(totalCommits) : "400+" },
  ];

  // One column definition drives the desktop header, the desktop body and the
  // mobile stack, so the three can never drift out of step.
  const COLUMNS: Array<{ head: string; note: string; cell: (m: AIMetrics | undefined, p: AILabProject) => string }> = [
    { head: "AI %", note: "AI Contribution", cell: (m, p) => `${m?.aiContribution ?? p.aiContribution}%` },
    { head: "Tokens", note: "Total processed", cell: (m) => (m ? formatTokens(m.totalTokens) : "—") },
    { head: "Commits", note: "Total commits", cell: (m) => (m ? String(m.totalCommits) : "—") },
    { head: "LOC", note: "Lines of code", cell: (m) => (m ? m.linesOfCode.toLocaleString() : "—") },
    { head: "Cycle", note: "Dev cycle days", cell: (m) => (m ? `${m.devCycleDays}d` : "—") },
    { head: "Saved", note: "Estimated days saved", cell: (m) => (m ? `${m.manualEstimateDays - m.devCycleDays}d` : "—") },
    {
      head: "Tests",
      note: "Counts (+ suites)",
      cell: (m) => (m?.tests ? (m.testSuites ? `${m.tests} · ${m.testSuites} suites` : String(m.tests)) : "—"),
    },
  ];

  const rows = tracked.map(({ project, dm }) => ({
    id: project.id,
    name: project.name,
    aiPct: `${dm?.aiContribution ?? project.aiContribution}%`,
    cells: COLUMNS.map((c) => ({ head: c.head, value: c.cell(dm, project) })),
  }));

  return (
    <section
      id="ai-lab"
      className="py-12 md:py-16 lg:py-20 px-6 lg:px-24 border-t border-white/5 relative overflow-hidden scroll-mt-32"
      aria-labelledby="ai-lab-heading"
    >
      {/* Neural-style backdrop, carried over from the AI Lab page */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-600/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/[0.05] blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400/30" aria-hidden="true" />
          <span className="t-label font-black uppercase tracking-[0.2em] text-purple-300">AI Lab</span>
        </div>

        <h2 id="ai-lab-heading" className="t-h2 mb-6">
          Where{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
            AI Meets
          </span>{" "}
          Engineering
        </h2>

        <p className="t-lead text-zinc-400 font-light max-w-2xl mb-10">
          Every system above was built through AI pair programming — not AI-assisted, but{" "}
          <span className="text-white font-medium">AI-native from architecture to deployment</span>.
          These are the measured numbers behind them, refreshed weekly from each repository.
        </p>

        {/* Aggregate headline stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mb-12">
          {heroStats.map(({ label, value }) => (
            <div key={label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="block text-2xl md:text-3xl font-black text-white mb-1">{value}</span>
              <span className="block t-label font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>

        {/* Metrics at a Glance */}
        <div className="flex items-center gap-2 text-purple-400 font-bold t-caption uppercase tracking-widest mb-4">
          <TrendingUp className="w-4 h-4" aria-hidden="true" />
          Metrics at a Glance
        </div>
        <h3 id="glance-heading" className="sr-only">Metrics at a Glance</h3>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <table className="w-full text-left" aria-labelledby="glance-heading">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th scope="col" className="px-5 py-3">
                  <div className="t-label font-black uppercase tracking-widest text-zinc-400">Project</div>
                  <div className="t-label text-zinc-400 mt-0.5">Jumps to card</div>
                </th>
                {COLUMNS.map((c) => (
                  <th scope="col" key={c.head} className="px-4 py-3">
                    <div className="t-label font-black uppercase tracking-widest text-zinc-400">{c.head}</div>
                    <div className="t-label text-zinc-400 mt-0.5">{c.note}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.03] transition-colors">
                  <th scope="row" className="px-5 py-3 font-normal">
                    <a href={`#${r.id}`} className="t-small font-bold text-white hover:text-purple-300 transition-colors">
                      {r.name}
                    </a>
                  </th>
                  {r.cells.map((cell, i) => (
                    <td
                      key={cell.head}
                      className={`px-4 py-3 t-caption ${i === 0 ? "font-semibold text-zinc-300" : "text-zinc-400"}`}
                    >
                      {cell.value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden space-y-3">
          {rows.map((r) => (
            <a
              key={r.id}
              href={`#${r.id}`}
              className="block p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="t-small font-bold text-white">{r.name}</span>
                <span className="t-label font-bold text-purple-400">{r.aiPct} AI</span>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 t-label">
                {r.cells.slice(1).map((cell) => (
                  <div key={cell.head} className="contents">
                    <dt className="text-zinc-400">{cell.head}</dt>
                    <dd className="text-zinc-300 text-right">{cell.value}</dd>
                  </div>
                ))}
              </dl>
            </a>
          ))}
        </div>

        <p className="mt-4 t-label text-zinc-400">
          Open any project&rsquo;s <span className="text-zinc-300">AI Build Breakdown</span> above for the
          agents, models and before/after behind these numbers.
        </p>

        {/* Whitepaper / consulting — the two links the AI Lab page closed on */}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/blog/ai-driven-development"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold hover:opacity-90 transition-opacity shadow-2xl shadow-purple-600/20"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            Read the AI Whitepaper
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-bold hover:bg-white/10 transition-all"
          >
            Discuss AI Consulting
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
