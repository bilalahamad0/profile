"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, Mail, User, Award } from "lucide-react";

const navLinks = [
  {
    href: "/experience",
    label: "Experience",
    icon: <Briefcase className="w-4 h-4 shrink-0" />,
  },
  {
    href: "/certifications",
    label: "Certifications",
    icon: <Award className="w-4 h-4 shrink-0" />,
  },
  {
    href: "https://github.com/bilalahamad0",
    label: "Projects",
    external: true,
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    href: "#contact",
    label: "Contact",
    icon: <Mail className="w-4 h-4 shrink-0" />,
  },
];

export function NavbarV2() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-3 sm:pt-4 pb-2 flex justify-center pointer-events-none"
    >
      <nav className="glass border border-white/10 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-5 pointer-events-auto min-w-0 max-w-[calc(100vw-1.5rem)]">

        {/* Wordmark — full on sm+, condensed on xs */}
        <Link
          href="/"
          aria-label="Bilal Ahamad — home"
          className="shrink-0 text-white font-bold leading-none flex flex-col items-start pr-3 sm:pr-4 border-r border-white/10 hover:text-emerald-400 transition-colors"
        >
          <span className="text-[11px] sm:text-sm font-extrabold tracking-widest uppercase">BILAL</span>
          <span className="text-[8px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400">AHAMAD</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 sm:gap-4 text-sm font-medium text-zinc-300 min-w-0">
          {navLinks.map(({ href, label, icon, external }) => {
            const shared =
              "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-0 py-1 rounded-lg hover:text-white transition-colors group whitespace-nowrap";

            const iconEl = (
              <span className="text-zinc-400 group-hover:text-current transition-colors">
                {icon}
              </span>
            );

            if (external) {
              return (
                <a key={label} href={href} target="_blank" rel="noreferrer" className={shared}>
                  {iconEl}
                  <span className="hidden sm:inline">{label}</span>
                </a>
              );
            }
            return (
              <Link key={label} href={href} className={shared}>
                {iconEl}
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </motion.header>
  );
}
