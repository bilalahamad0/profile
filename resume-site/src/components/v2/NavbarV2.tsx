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
  { href: "/certificates",  label: "Certificates",   icon: Award        },
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
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-2 sm:px-6 pt-3 sm:pt-4 pointer-events-none"
      role="banner"
    >
      <nav
        aria-label="Main navigation"
        className={cn(
          "glass rounded-full px-1 sm:px-5 py-2.5 flex items-center justify-between sm:justify-start gap-0 sm:gap-1 pointer-events-auto",
          "w-full max-w-7xl sm:w-auto transition-all duration-300",
          scrolled
            ? "shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        )}
      >
        {/* Wordmark */}
        <Link
          href="/"
          aria-label="Bilal Ahamad — home"
          className="shrink-0 flex flex-col items-start pr-2 sm:pr-4 border-r border-white/10 hover:text-emerald-400 transition-colors"
        >
          <span className="text-[9.5px] sm:text-[13px] font-black tracking-widest uppercase text-white leading-none">
            BILAL
          </span>
          <span className="text-[6.5px] sm:text-[9px] font-semibold tracking-[0.2em] uppercase text-zinc-500 leading-none mt-0.5">
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
                "flex flex-col items-center justify-center gap-0.5",
                "px-0.5 sm:px-3 py-1.5 rounded-xl transition-all duration-200",
                "group whitespace-nowrap shrink-0 flex-1 sm:flex-none",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors",
                  isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"
                )}
                aria-hidden="true"
              />
              <span className="text-[8px] sm:text-[10px] font-semibold leading-none tracking-tighter sm:tracking-normal">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </motion.header>
  );
}
