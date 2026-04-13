"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Briefcase, Mail, Award, FolderKanban, Sparkles, BookOpen, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/",              label: "Home",           icon: Home         },
  { href: "/experience",    label: "Experience",     icon: Briefcase    },
  { href: "/certifications",label: "Certifications", icon: Award        },
  { href: "/projects",      label: "Projects",       icon: FolderKanban },
  { href: "/ai",            label: "AI Lab",         icon: Sparkles     },
  { href: "/blog",          label: "Blog",           icon: BookOpen     },
  { href: "/contact",       label: "Contact",        icon: Mail         },
];

export function NavbarV2() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none"
      role="banner"
    >
      {/*
       * Scrollable pill — on mobile the user can scroll horizontally
       * to reach all links. overflow-x-auto + snap-x for smooth scrolling.
       */}
      <nav
        aria-label="Main navigation"
        className={cn(
          "glass rounded-full px-3 sm:px-5 py-2.5 flex items-center gap-1 pointer-events-auto",
          "overflow-x-auto scroll-smooth snap-x snap-mandatory",
          "max-w-[calc(100vw-1.5rem)]",
          // Scrollbar hidden but scrollable on mobile
          "scrollbar-none [-webkit-overflow-scrolling:touch]",
          // Tighten shadow when not scrolled
          scrolled
            ? "shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        )}
      >
        {/* Wordmark */}
        <Link
          href="/"
          aria-label="Bilal Ahamad — home"
          className="shrink-0 flex flex-col items-start pr-3 sm:pr-4 border-r border-white/10 hover:text-emerald-400 transition-colors snap-start"
        >
          <span className="text-[11px] sm:text-[13px] font-black tracking-widest uppercase text-white leading-none">
            BILAL
          </span>
          <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.2em] uppercase text-zinc-500 leading-none mt-0.5">
            AHAMAD
          </span>
        </Link>

        {/* Nav links — icon + label on all sizes */}
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "snap-start flex flex-col items-center justify-center gap-0.5",
                "px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-200",
                "group whitespace-nowrap shrink-0",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"
                )}
                aria-hidden="true"
              />
              <span className="text-[9px] sm:text-[10px] font-semibold leading-none">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </motion.header>
  );
}
