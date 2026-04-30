"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Download, ArrowUpRight, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/experience", label: "Experience" },
  { href: "/certifications", label: "Certifications" },
  { href: "/projects", label: "Projects" },
  { href: "/ai", label: "AI Lab" },
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
      className="mt-auto border-t border-white/5 bg-[#09090b]"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-24 py-16">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand column */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex flex-col group"
              aria-label="Bilal Ahamad — home"
            >
              <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Bilal Ahamad
              </span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 mt-0.5">
                Technical QA Lead
              </span>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              18+ years engineering quality at Amazon, Google, Rivian, Cruise, and Samsara.
            </p>

            {!isHome && (
              <>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-700" />
                  Sunnyvale, CA · Open to Remote & Bay Area
                </p>
                <a
                  href="/Bilal_Ahamad_Resume.pdf"
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-all mt-2"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              </>
            )}
          </div>

          {/* Navigation column */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-5">
              Navigation
            </p>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group"
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
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-5">
              Connect
            </p>
            <ul className="space-y-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel={href.startsWith("mailto") ? undefined : "noreferrer noopener"}
                    className="flex items-center gap-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            {!isHome && (
              <div className="mt-8 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Available
                  </span>
                </div>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  Open to senior engineering & QA leadership roles.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/5 mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>
            &copy; {year} Bilal Ahamad · All rights reserved
          </p>
          <p className="flex items-center gap-1.5">
            Built using AI
          </p>
        </div>
      </div>
    </footer>
  );
}
