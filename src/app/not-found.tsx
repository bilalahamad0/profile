import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Home, Briefcase, Code2, BookOpen, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for doesn't exist or has moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-6 py-24 sm:py-32">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <span>Error 404</span>
          <span className="text-line/40">•</span>
          <span>Not Found</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
            Page not found
          </h1>
          <p className="text-base sm:text-lg text-ink-muted max-w-lg mx-auto font-light">
            The page you are looking for doesn&apos;t exist, was moved, or has an outdated link.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left pt-2">
          <Link
            href="/"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-line/10 dark:border-line/5 bg-surface-muted/30 hover:bg-surface-muted/70 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-ink">Home</div>
              <div className="text-xs text-ink-muted">Return to overview</div>
            </div>
          </Link>

          <Link
            href="/experience"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-line/10 dark:border-line/5 bg-surface-muted/30 hover:bg-surface-muted/70 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-ink">Experience</div>
              <div className="text-xs text-ink-muted">18+ years career timeline</div>
            </div>
          </Link>

          <Link
            href="/projects"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-line/10 dark:border-line/5 bg-surface-muted/30 hover:bg-surface-muted/70 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-ink">Projects & AI Lab</div>
              <div className="text-xs text-ink-muted">Code and live systems</div>
            </div>
          </Link>

          <Link
            href="/blog"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-line/10 dark:border-line/5 bg-surface-muted/30 hover:bg-surface-muted/70 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-ink">Technical Blog</div>
              <div className="text-xs text-ink-muted">Articles and whitepapers</div>
            </div>
          </Link>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4 text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ink-muted hover:text-ink transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to homepage
          </Link>
          <span className="text-line/40">•</span>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            <Mail className="w-3.5 h-3.5" />
            Contact Bilal
          </Link>
        </div>
      </div>
    </main>
  );
}
