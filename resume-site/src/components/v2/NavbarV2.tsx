"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, Mail, User, Award, FolderKanban, Sparkles, BookOpen } from "lucide-react";


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
    href: "/projects",
    label: "Projects",
    icon: <FolderKanban className="w-4 h-4 shrink-0" />,
  },
  {
    href: "/ai",
    label: "AI Lab",
    icon: <Sparkles className="w-4 h-4 shrink-0" />,
  },
  {
    href: "/blog",
    label: "Blog",
    icon: <BookOpen className="w-4 h-4 shrink-0" />,
  },
  {
    href: "/contact",
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
          {navLinks.map(({ href, label, icon }) => {
            const shared =
              "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-0 py-1 rounded-lg hover:text-white transition-colors group whitespace-nowrap";

            const iconEl = (
              <span className="text-zinc-400 group-hover:text-current transition-colors">
                {icon}
              </span>
            );

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
