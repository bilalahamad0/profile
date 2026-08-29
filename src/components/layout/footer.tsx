"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUpRight, MapPin, CalendarClock } from "lucide-react";
import { usePathname } from "next/navigation";
import { BOOKING_ANCHOR } from "@/lib/contact";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navLinks = [
  { href: "/experience", label: "Experience" },
  { href: "/resume", label: "Resume" },
  { href: "/certifications", label: "Certifications" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://www.linkedin.com/in/bilalahamad/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://github.com/bilalahamad0",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "mailto:bilal.ahamad@gmail.com",
    label: "Email",
    icon: Mail,
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer
      className="mt-auto border-t border-line/10 bg-surface"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-24 py-16">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 md:gap-12 mb-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link
              href="/"
              className="inline-flex flex-col group"
              aria-label="Bilal Ahamad — home"
            >
              <span className="text-xl font-black tracking-tight text-ink group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                Bilal Ahamad
              </span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-ink-muted mt-0.5">
                Technical QA Lead
              </span>
            </Link>

            <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
              18+ years engineering quality at Amazon, Google, Rivian, Cruise, and Samsara.
            </p>

            {!isHome && (
              <p className="text-xs text-ink-muted flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-ink-subtle dark:text-zinc-700" />
                Sunnyvale, CA · Open to Remote & Bay Area
              </p>
            )}
          </div>

          {/* Navigation column */}
          <div>
            <p className="t-label font-black uppercase tracking-[0.25em] text-ink-muted mb-5">
              Navigation
            </p>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm font-medium text-ink-muted hover:text-ink transition-colors flex items-center gap-1 group"
                    >
                      {label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Connect column */}
          <div>
            <p className="t-label font-black uppercase tracking-[0.25em] text-ink-muted mb-5">
              Connect
            </p>
            <ul className="space-y-3">
              {/* Inline scheduler on /contact. Full-page nav (not next/link) so
                  the browser reliably scrolls to #book on arrival. */}
              <li>
                <a
                  href={BOOKING_ANCHOR}
                  className="flex items-center gap-2.5 text-sm font-medium text-ink-muted hover:text-ink transition-colors group"
                >
                  <CalendarClock className="w-4 h-4 shrink-0 text-ink-muted group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors" />
                  Book a Call
                </a>
              </li>
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel={href.startsWith("mailto") ? undefined : "noreferrer noopener"}
                    className="flex items-center gap-2.5 text-sm font-medium text-ink-muted hover:text-ink transition-colors group"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-ink-muted group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            {!isHome && (
              <div className="mt-8 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Available
                  </span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-200/70 leading-relaxed">
                  Open to senior engineering & QA leadership roles.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-line/10 mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 sm:justify-start">
            <span>&copy; {year} Bilal Ahamad · All rights reserved</span>
            <span aria-hidden="true">·</span>
            <Link href="/privacy" className="hover:text-ink transition-colors">
              Privacy
            </Link>
          </p>
          <div className="flex items-center gap-4">
            {/* The navbar carries the theme control from md up, where the pill has
                room; below that it would force nav targets under 40px, so the
                footer carries it instead. Exactly one control at every width. */}
            <div className="md:hidden">
              <ThemeToggle />
            </div>
            <p className="flex items-center gap-1.5">Built using AI</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
