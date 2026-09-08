"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search, Download, Mail, CalendarClock, Briefcase, Award,
  FolderKanban, BookOpen, Moon, Sun, X,
  Check, Terminal, Cpu
} from "lucide-react";
import { BOOKING_ANCHOR } from "@/lib/contact";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  category: "Actions" | "Navigation" | "Experience" | "Projects" | "Theme";
  icon: React.ElementType;
  shortcut?: string;
  onSelect: () => void;
  keywords?: string[];
}

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Define commands
  const commands: CommandItem[] = [
    // Quick Actions
    {
      id: "resume",
      label: "Download Resume PDF",
      category: "Actions",
      icon: Download,
      shortcut: "PDF",
      keywords: ["cv", "resume", "download", "pdf"],
      onSelect: () => {
        window.open("/Bilal_Ahamad_Resume.pdf", "_blank");
        setIsOpen(false);
      },
    },
    {
      id: "copy-email",
      label: "Copy Email Address",
      category: "Actions",
      icon: copiedEmail ? Check : Mail,
      shortcut: "EMAIL",
      keywords: ["contact", "email", "bilal", "message"],
      onSelect: () => {
        navigator.clipboard.writeText("bilal.ahamad@gmail.com");
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      },
    },
    {
      id: "book-call",
      label: "Book a Discussion / Call",
      category: "Actions",
      icon: CalendarClock,
      keywords: ["calendar", "meeting", "call", "schedule"],
      onSelect: () => {
        window.location.assign(BOOKING_ANCHOR);
        setIsOpen(false);
      },
    },

    // Navigation
    {
      id: "nav-home",
      label: "Go to Home",
      category: "Navigation",
      icon: Terminal,
      onSelect: () => { router.push("/"); setIsOpen(false); },
    },
    {
      id: "nav-experience",
      label: "Go to Experience Roadmap",
      category: "Navigation",
      icon: Briefcase,
      keywords: ["career", "work", "history", "jobs"],
      onSelect: () => { router.push("/experience"); setIsOpen(false); },
    },
    {
      id: "nav-projects",
      label: "Go to Projects & AI Lab",
      category: "Navigation",
      icon: FolderKanban,
      keywords: ["work", "repos", "github", "apps"],
      onSelect: () => { router.push("/projects"); setIsOpen(false); },
    },
    {
      id: "nav-certs",
      label: "Go to Certifications Album",
      category: "Navigation",
      icon: Award,
      keywords: ["degrees", "credentials", "istqb", "google"],
      onSelect: () => { router.push("/certifications"); setIsOpen(false); },
    },
    {
      id: "nav-blog",
      label: "Go to Lab Notes & Blog",
      category: "Navigation",
      icon: BookOpen,
      keywords: ["articles", "writing", "whitepapers"],
      onSelect: () => { router.push("/blog"); setIsOpen(false); },
    },

    // Experience Jumps
    {
      id: "exp-stealth",
      label: "Stealth Mode (LiDAR/Radar Bring-Up IDE)",
      category: "Experience",
      icon: Cpu,
      keywords: ["sensor", "docker", "qemu", "sil"],
      onSelect: () => { router.push("/experience#exp-stealth-mode-0"); setIsOpen(false); },
    },
    {
      id: "exp-samsara",
      label: "Samsara (IoT Dash Cams & Edge AI)",
      category: "Experience",
      icon: Cpu,
      keywords: ["iot", "dashcam", "linux", "pytest"],
      onSelect: () => { router.push("/experience#exp-samsara-inc-1"); setIsOpen(false); },
    },
    {
      id: "exp-cruise",
      label: "Cruise LLC (ASIL-D Autonomous Vehicle Compute)",
      category: "Experience",
      icon: Cpu,
      keywords: ["av", "hil", "autonomous", "asil"],
      onSelect: () => { router.push("/experience#exp-cruise-llc-2"); setIsOpen(false); },
    },
    {
      id: "exp-rivian",
      label: "Rivian Automotive (R1T/R1S Infotainment & OTA)",
      category: "Experience",
      icon: Cpu,
      keywords: ["ev", "qnx", "android", "ota"],
      onSelect: () => { router.push("/experience#exp-rivian-automotive-llc-3"); setIsOpen(false); },
    },
    {
      id: "exp-amazon",
      label: "Amazon Lab126 (Alexa Voice Service Devices)",
      category: "Experience",
      icon: Cpu,
      keywords: ["alexa", "echo", "audio", "firmware"],
      onSelect: () => { router.push("/experience#exp-amazon-lab126-4"); setIsOpen(false); },
    },
    {
      id: "exp-google",
      label: "Google Inc (Pixel 2/3, VR & 3DOF Robotics)",
      category: "Experience",
      icon: Cpu,
      keywords: ["pixel", "robotics", "imu", "vr"],
      onSelect: () => { router.push("/experience#exp-tech-mahindra-google-inc-5"); setIsOpen(false); },
    },

    // Projects
    {
      id: "proj-warn",
      label: "US Live Layoff Monitoring Dashboard",
      category: "Projects",
      icon: FolderKanban,
      onSelect: () => { router.push("/projects#warn"); setIsOpen(false); },
    },
    {
      id: "proj-adhan",
      label: "Smart-Home IoT Media Caster (Raspberry Pi)",
      category: "Projects",
      icon: FolderKanban,
      onSelect: () => { router.push("/projects#adhan"); setIsOpen(false); },
    },
    {
      id: "proj-tmo",
      label: "Monthly Phone Bill Split Automation",
      category: "Projects",
      icon: FolderKanban,
      onSelect: () => { router.push("/projects#tmo"); setIsOpen(false); },
    },

    // Theme
    {
      id: "toggle-theme",
      label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      category: "Theme",
      icon: theme === "dark" ? Sun : Moon,
      onSelect: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        setIsOpen(false);
      },
    },
  ];

  // Filter commands by search query
  const filtered = commands.filter((cmd) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    if (cmd.label.toLowerCase().includes(q)) return true;
    if (cmd.category.toLowerCase().includes(q)) return true;
    if (cmd.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
    return false;
  });

  // Global keydown listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation within list
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].onSelect();
      }
    },
    [filtered, selectedIndex]
  );

  return (
    <>
      {/* ── Trigger Chip (Custom hook into navbar/page) ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/[0.04] hover:bg-ink/[0.08] border border-line/10 t-caption font-mono text-ink-muted hover:text-ink transition-all cursor-pointer"
        aria-label="Open Command Menu (Press ⌘K)"
        title="Press ⌘K to open command menu"
      >
        <Search className="w-3 h-3 text-ink-muted" aria-hidden="true" />
        <span className="text-[10px] tracking-tight">⌘K</span>
      </button>

      {/* ── Modal Backdrop & Dialog ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command Menu"
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-line/15 bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line/10 bg-ink/[0.02]">
              <Search className="w-4 h-4 text-ink-muted shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command, role, or project..."
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-ink/5"
                aria-label="Close command menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Command List */}
            <div className="overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-ink-muted">
                  No commands matching &ldquo;{search}&rdquo;
                </div>
              ) : (
                filtered.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.onSelect}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer",
                        isSelected
                          ? "bg-ink/10 text-ink"
                          : "text-ink-muted hover:text-ink hover:bg-ink/[0.04]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            isSelected ? "text-violet-600 dark:text-violet-400" : "text-ink-muted"
                          )}
                          aria-hidden="true"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-tight">{cmd.label}</span>
                          <span className="text-[10px] text-ink-muted uppercase tracking-wider mt-0.5">
                            {cmd.category}
                          </span>
                        </div>
                      </div>
                      {cmd.shortcut && (
                        <span className="t-label font-mono text-ink-muted bg-ink/5 px-2 py-0.5 rounded border border-line/10">
                          {cmd.shortcut}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer keyboard hints */}
            <div className="px-4 py-2.5 border-t border-line/10 bg-ink/[0.02] flex items-center justify-between t-label font-mono text-ink-muted">
              <span>↑↓ to navigate · Enter to select</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
