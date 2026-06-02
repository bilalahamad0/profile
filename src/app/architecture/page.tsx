import Link from "next/link";
import { ArrowRight, FolderKanban, Github } from "lucide-react";
import { ArchitectureDiagramClient } from "@/components/architecture/ArchitectureDiagramClient";

const STATS: { value: string; label: string }[] = [
  { value: "8", label: "Routes" },
  { value: "5", label: "API endpoints" },
  { value: "7", label: "MDX blog posts" },
  { value: "9", label: "Type tokens" },
];

export default function ArchitecturePage() {
  return (
    <>
      {/* ── Hero (server-rendered, static HTML for crawlers) ── */}
      <section className="relative overflow-hidden">
        <div className="aurora-gradient absolute inset-0 -z-10" />
        <div className="bg-noise" />
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-28 sm:pt-32 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
            <span className="pulse-dot" aria-hidden />
            <span className="t-label font-semibold uppercase tracking-widest text-zinc-400">
              System Architecture
            </span>
          </div>

          <h1 className="t-h1 mt-5 max-w-3xl text-white">
            How this portfolio is{" "}
            <span className="text-gradient-brand">engineered</span>
          </h1>

          <p className="t-lead mt-5 max-w-2xl text-body">
            A live look at the architecture, system design and automated workflows
            behind bilalahamad.com — from the Vercel edge down to a single source of
            truth, the content pipelines, and the quality gates that ship every change.
          </p>

          <dl className="mt-9 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl glass-card px-4 py-4">
                <dd className="t-h2 text-white">{s.value}</dd>
                <dt className="t-label mt-1 font-semibold uppercase tracking-wider text-zinc-500">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Animated diagram (client islands) ── */}
      <ArchitectureDiagramClient />

      {/* ── CTA ── */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-8 lg:px-8">
        <div className="rounded-3xl glass-card p-8 text-center sm:p-10">
          <h2 className="t-h2 text-white">Want to see it in action?</h2>
          <p className="t-body mx-auto mt-3 max-w-xl text-secondary">
            The same engineering rigor goes into every project. Explore the work or
            read the source on GitHub.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 t-small font-semibold text-white transition-colors hover:bg-blue-400"
            >
              <FolderKanban className="h-4 w-4" aria-hidden />
              View projects
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="https://github.com/bilalahamad0/profile"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 t-small font-semibold text-white transition-colors hover:bg-white/[0.06]"
            >
              <Github className="h-4 w-4" aria-hidden />
              View source
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
