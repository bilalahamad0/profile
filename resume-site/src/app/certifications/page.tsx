"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Search,
  X,
  ChevronLeft,
  Award,
  Sparkles,
  ShieldCheck,
  Calendar,
  ArrowRight,
  CheckCircle2,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/components/analytics/google-analytics";

// --- TYPES ---

type GalleryCertificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  url: string | null;
  logo: string;
  description: string;
  gradient: string;
  isOfficial?: boolean;
  officialBadge?: string;
};

type CredlyBadgeRef = { image: string; credlyUrl: string };

type SpecializationChild = {
  step: number;
  title: string;
  url: string;
  badge: CredlyBadgeRef;
};

type SpecializationData = {
  id: string;
  headingId: string;
  testId: string;
  titleLines: [string, string]; // line 1 (name), line 2 (journey count)
  issuer: string;
  date: string;
  url: string;
  logo: string;
  description: string;
  totalCourses: number;
  image: string;
  gradient: string;
  childrenLayout: "list" | "badges";
  parentBadge: CredlyBadgeRef;
  children: SpecializationChild[];
};

function openVerifyUrl(
  url: string,
  meta: {
    title: string;
    issuer: string;
    step?: number;
    specialization?: string;
  }
) {
  trackEvent("verify_certificate", {
    title: meta.title,
    issuer: meta.issuer,
    ...(meta.specialization !== undefined && {
      specialization: meta.specialization,
    }),
    ...(meta.step !== undefined && { course_step: String(meta.step) }),
  });
  window.open(url, "_blank", "noopener,noreferrer");
}

function openBadgeUrl(
  url: string,
  meta: { title: string; specialization: string; step?: number }
) {
  trackEvent("verify_badge", {
    title: meta.title,
    provider: "Credly",
    specialization: meta.specialization,
    ...(meta.step !== undefined && { course_step: String(meta.step) }),
  });
  window.open(url, "_blank", "noopener,noreferrer");
}

// --- DATA ---

const SPECIALIZATIONS: SpecializationData[] = [
  // Reverse chronology — newer / more advanced first.
  {
    id: "spec-google-ai-professional",
    headingId: "specialization-path-heading-professional",
    testId: "specialization-courses-list-professional",
    titleLines: ["Google AI Professional Certificate", "7-Course Journey"],
    issuer: "Google · Coursera",
    date: "2026",
    url: "https://www.coursera.org/account/accomplishments/specialization/1B8PEYYE6E6R",
    logo: "/logos/google.png",
    description:
      "Google's applied 7-course professional certificate built around real workplace use cases — a full progression from AI fundamentals through brainstorming, research, communication, content creation, data analysis, and app building, with each course backed by its own verified credential.",
    totalCourses: 7,
    image: "/certificates/google_ai_professional_certificate_thumb.jpg",
    gradient: "from-emerald-600/25 via-teal-500/15 to-cyan-600/25",
    childrenLayout: "badges",
    parentBadge: {
      image: "/badges/google-ai-professional-certificate.png",
      credlyUrl:
        "https://www.credly.com/badges/e8f05e71-435e-4a62-85fd-4df4f7c3d3fa/public_url",
    },
    children: [
      {
        step: 1,
        title: "AI Fundamentals",
        url: "https://www.coursera.org/account/accomplishments/verify/M0X9KDJN1WFF",
        badge: {
          image: "/badges/google-ai-fundamentals.png",
          credlyUrl:
            "https://www.credly.com/badges/619780f5-f2e2-4940-b763-7a7cdd030b08/public_url",
        },
      },
      {
        step: 2,
        title: "AI for Brainstorming and Planning",
        url: "https://www.coursera.org/account/accomplishments/verify/Q4I2O6VG28G6",
        badge: {
          image: "/badges/google-ai-for-brainstorming-and-planning.png",
          credlyUrl:
            "https://www.credly.com/badges/da284132-9239-4a87-98fe-01084e9520ff/public_url",
        },
      },
      {
        step: 3,
        title: "AI for Research and Insights",
        url: "https://www.coursera.org/account/accomplishments/verify/H0XC4TW5TNG1",
        badge: {
          image: "/badges/google-ai-for-research-and-insights.png",
          credlyUrl:
            "https://www.credly.com/badges/2ff83a72-160e-4618-a78d-a685ee66b0d1/public_url",
        },
      },
      {
        step: 4,
        title: "AI for Writing and Communicating",
        url: "https://www.coursera.org/account/accomplishments/verify/8P1LT7PMQAWN",
        badge: {
          image: "/badges/google-ai-for-writing-and-communicating.png",
          credlyUrl:
            "https://www.credly.com/badges/45c84b15-6840-4f01-a414-8fcbc95680e1/public_url",
        },
      },
      {
        step: 5,
        title: "AI for Content Creation",
        url: "https://www.coursera.org/account/accomplishments/verify/CU6YQEIJKD8W",
        badge: {
          image: "/badges/google-ai-for-content-creation.png",
          credlyUrl:
            "https://www.credly.com/badges/18e200f5-80d3-45da-aaf1-b496f905786a/public_url",
        },
      },
      {
        step: 6,
        title: "AI for Data Analysis",
        url: "https://www.coursera.org/account/accomplishments/verify/GI0PVSF6FD8M",
        badge: {
          image: "/badges/google-ai-for-data-analysis.png",
          credlyUrl:
            "https://www.credly.com/badges/8ec33633-5436-4ca6-8ce2-dbe95277dc4d/public_url",
        },
      },
      {
        step: 7,
        title: "AI for App Building",
        url: "https://www.coursera.org/account/accomplishments/verify/86O6XPQIM9WM",
        badge: {
          image: "/badges/google-ai-for-app-building.png",
          credlyUrl:
            "https://www.credly.com/badges/01690309-193b-4055-8106-ecf82d5691fd/public_url",
        },
      },
    ],
  },
  {
    id: "spec-google-ai-essentials",
    headingId: "specialization-path-heading",
    testId: "specialization-courses-list",
    titleLines: ["Google AI Essentials", "5-Course Journey"],
    issuer: "Google · Coursera",
    date: "2026",
    url: "https://www.coursera.org/account/accomplishments/specialization/0YNZJF3R5PJA",
    logo: "/logos/google.png",
    description:
      "Google's flagship 5-course specialization on practical AI literacy — a linear progression from AI fundamentals through productivity, prompting, responsible use, and staying current, each course backed by its own verified credential.",
    totalCourses: 5,
    image: "/certificates/google_ai_essentials_thumb.jpg",
    gradient: "from-blue-600/25 via-indigo-500/15 to-purple-600/25",
    childrenLayout: "list",
    parentBadge: {
      image: "/badges/google-ai-essentials.png",
      credlyUrl:
        "https://www.credly.com/badges/850423f1-fac1-4fe7-9c31-6c7c3185b177/public_url",
    },
    children: [
      {
        step: 1,
        title: "Introduction to AI",
        url: "https://www.coursera.org/account/accomplishments/verify/IP7EYX7EZ8UK",
        badge: {
          image: "/badges/google-ai-fundamentals.png",
          credlyUrl:
            "https://www.credly.com/badges/619780f5-f2e2-4940-b763-7a7cdd030b08/public_url",
        },
      },
      {
        step: 2,
        title: "Maximize Productivity With AI Tools",
        url: "https://www.coursera.org/account/accomplishments/verify/FE9LE6HDIIZ7",
        badge: {
          image: "/badges/google-ai-essentials.png",
          credlyUrl:
            "https://www.credly.com/badges/850423f1-fac1-4fe7-9c31-6c7c3185b177/public_url",
        },
      },
      {
        step: 3,
        title: "Discover the Art of Prompting",
        url: "https://www.coursera.org/account/accomplishments/verify/EUDWX89YQYY0",
        badge: {
          image: "/badges/google-ai-essentials.png",
          credlyUrl:
            "https://www.credly.com/badges/850423f1-fac1-4fe7-9c31-6c7c3185b177/public_url",
        },
      },
      {
        step: 4,
        title: "Use AI Responsibly",
        url: "https://www.coursera.org/account/accomplishments/verify/MOALJCD0LU7S",
        badge: {
          image: "/badges/google-ai-essentials.png",
          credlyUrl:
            "https://www.credly.com/badges/850423f1-fac1-4fe7-9c31-6c7c3185b177/public_url",
        },
      },
      {
        step: 5,
        title: "Stay Ahead of the AI Curve",
        url: "https://www.coursera.org/account/accomplishments/verify/5QBPQ9VYATIG",
        badge: {
          image: "/badges/google-ai-essentials.png",
          credlyUrl:
            "https://www.credly.com/badges/850423f1-fac1-4fe7-9c31-6c7c3185b177/public_url",
        },
      },
    ],
  },
];

const AI_CERTIFICATES: GalleryCertificate[] = [
  {
    id: "ai-2",
    title: "Software Testing Foundations: Integrating AI into the Quality Process",
    issuer: "LinkedIn Learning",
    date: "2026",
    image: "/certificates/software_testing_ai_thumb.jpg",
    url: "https://www.linkedin.com/learning/certificates/2a2a9abe336c54ff022075ad5887ac814192edc56dca798f9a7a5374be40a447",
    logo: "/logos/linkedin.png",
    description: "Modernizing QA workflows by integrating Generative AI into test planning, execution, and reporting.",
    gradient: "from-emerald-600/20 to-teal-600/20"
  },
  {
    id: "ai-1",
    title: "AI Coding Agents with GitHub Copilot and Cursor",
    issuer: "LinkedIn Learning",
    date: "2025",
    image: "/certificates/ai_coding_agents_thumb.jpg",
    url: "https://www.linkedin.com/learning/certificates/fa26c3fb8c3d86ba367271e666d1f5e54e0752eb73aff59ffb4e22a1c6b4d879",
    logo: "/logos/linkedin.png",
    description: "Deep dive into leveraging AI agents, GitHub Copilot, and Cursor for accelerated software development.",
    gradient: "from-blue-600/20 to-purple-600/20"
  },
  // ai-3 (AI for App Building) intentionally removed — it's now child #7 of the
  // Google AI Professional Certificate specialization above.
];

const GENERAL_CERTIFICATES: GalleryCertificate[] = [
  {
    id: "g-1",
    title: "ISTQB Foundation Level",
    issuer: "ISTQB®",
    date: "2011",
    image: "/certificates/istqb.jpg",
    url: "https://www.istqb.in/foundation/certified-tester2/40317-bilal-ahamad",
    logo: "/logos/istqb.png",
    description: "The gold standard in software testing certifications, covering fundamental testing principles and strategies.",
    gradient: "from-blue-600/10 to-blue-800/10",
    isOfficial: true,
    officialBadge: "/badges/ISTQB-CTFL-badge.png"
  },
  {
    id: "g-5",
    title: "Project Management Foundations",
    issuer: "LinkedIn Learning",
    date: "2023",
    image: "/certificates/pm_foundations_thumb.jpg",
    url: "https://www.linkedin.com/learning/certificates/40f20e0a52eb64a04a875e3539cc0e0808b59c34059bc3738f87065ef29dc85c",
    logo: "/logos/linkedin.png",
    description: "Essential project management skills including planning, execution, and risk management.",
    gradient: "from-indigo-600/10 to-violet-600/10"
  },
  {
    id: "g-2",
    title: "Scrum: Advanced",
    issuer: "LinkedIn Learning",
    date: "2021",
    image: "/certificates/scrum_advanced_ratio_fit.jpg",
    url: "https://www.linkedin.com/learning/certificates/9c6281ac20a7adf9e92714bff845ad8c95f08c0adea75b5ffbc7cadeaab9a357",
    logo: "/logos/linkedin.png",
    description: "Advanced Agile methodologies and Scrum framework for high-performing development teams.",
    gradient: "from-orange-600/10 to-red-600/10"
  },
  {
    id: "g-6",
    title: "How to Master Your Executive Presence",
    issuer: "LinkedIn Learning",
    date: "2023",
    image: "/certificates/executive_presence_thumb.jpg",
    url: "https://www.linkedin.com/learning/certificates/5df27e588af83322ebbb6cd0394d68155e9ca37642fa24f523ec0f804079a1af",
    logo: "/logos/linkedin.png",
    description: "Developing leadership communication, confidence, and professional impact.",
    gradient: "from-slate-600/10 to-zinc-600/10"
  },
  {
    id: "g-4",
    title: "Javascript Essential Training",
    issuer: "LinkedIn Learning",
    date: "2024",
    image: "/certificates/javascript_essential_thumb.jpg",
    url: "https://www.linkedin.com/learning/certificates/e4aa03cd2c7d8ecd88c685ad02ae81ed93511e2eaf7a8713b9d71229443cdf87",
    logo: "/logos/linkedin.png",
    description: "Deep dive into core JavaScript concepts, DOM manipulation, and asynchronous programming.",
    gradient: "from-yellow-600/10 to-amber-600/10"
  },
  {
    id: "g-3",
    title: "iOS App Development: Essential Courses",
    issuer: "LinkedIn Learning",
    date: "2022",
    image: "/certificates/ios_app_dev_thumb.jpg",
    url: "https://www.linkedin.com/learning/certificates/48129ec1213ef12a50ad1ef36e933e1ff1d47102c6a02910cbbfbd2459ebe81b",
    logo: "/logos/linkedin.png",
    description: "Comprehensive training in Swift, Xcode, and iOS development principles.",
    gradient: "from-sky-600/10 to-blue-600/10"
  },
];

// --- COMPONENTS ---

/**
 * 2-3-2 staggered ("circular") grid of badge tiles for the Pro Cert.
 *
 * Layout (desktop, 7 items):
 *
 *     [B1]  [B2]
 *   [B3] [B4] [B5]
 *     [B6]  [B7]
 *
 * Implementation notes:
 * - We render a single `<ol>` (one `<li>` per course) so screen readers and
 *   tests that count children-as-list-items both keep working.
 * - Visual 2-3-2 placement is done via a 6-col CSS grid with explicit
 *   `col-start` / `col-end` classes per item index.
 * - On mobile we drop the explicit positioning and let items flow into a
 *   simple 3-up wrap, which never overflows the card.
 */
const PRO_CERT_GRID_POSITIONS = [
  // index → desktop column placement on a 6-col track
  "md:col-start-2 md:col-end-4", // 1 — row 1 left
  "md:col-start-4 md:col-end-6", // 2 — row 1 right
  "md:col-start-1 md:col-end-3", // 3 — row 2 left
  "md:col-start-3 md:col-end-5", // 4 — row 2 center
  "md:col-start-5 md:col-end-7", // 5 — row 2 right
  "md:col-start-2 md:col-end-4", // 6 — row 3 left
  "md:col-start-4 md:col-end-6", // 7 — row 3 right
] as const;

const ChildBadgesGrid = ({
  spec,
}: {
  spec: SpecializationData;
}) => {
  return (
    <ol
      data-testid={spec.testId}
      className="m-0 grid w-full max-w-[440px] list-none grid-cols-3 place-items-center gap-x-2 gap-y-4 p-0 md:max-w-[460px] md:grid-cols-6 md:gap-x-0 md:gap-y-5"
    >
      {spec.children.map((child, index) => (
        <motion.li
          key={child.step}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.04, duration: 0.3 }}
          className={cn(
            "flex flex-col items-center gap-2",
            PRO_CERT_GRID_POSITIONS[index]
          )}
        >
          <button
            type="button"
            onClick={() =>
              openBadgeUrl(child.badge.credlyUrl, {
                title: child.title,
                specialization: spec.titleLines[0],
                step: child.step,
              })
            }
            aria-label={`View ${child.title} verified badge on Credly`}
            className="group/badge relative h-24 w-24 shrink-0 rounded-full transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 md:h-[112px] md:w-[112px]"
          >
            <Image
              src={child.badge.image}
              alt={`${child.title} verified badge`}
              fill
              sizes="(max-width: 768px) 96px, 112px"
              className="object-contain drop-shadow-[0_4px_16px_rgba(16,185,129,0.25)]"
            />
          </button>
          <button
            type="button"
            onClick={() =>
              openVerifyUrl(child.url, {
                title: child.title,
                issuer: spec.issuer,
                step: child.step,
                specialization: spec.titleLines[0],
              })
            }
            aria-label={`Verify ${child.title} certificate on Coursera`}
            className="group/verify inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 transition-colors hover:border-emerald-300/60 hover:bg-emerald-500/20 hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
          >
            Verify
            <ExternalLink className="h-3 w-3 transition-transform group-hover/verify:translate-x-0.5" />
          </button>
        </motion.li>
      ))}
    </ol>
  );
};

const SpecializationSection = ({ spec }: { spec: SpecializationData }) => {
  const totalLabel = String(spec.totalCourses).padStart(2, "0");
  return (
    <section aria-labelledby={spec.headingId}>
      {/* Section header — title is split into two lines (name / N-Course Journey).
          Per the design brief, the descriptive paragraph lives ONLY inside the card,
          not in the header. */}
      <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
            <GitBranch className="h-4 w-4" aria-hidden />
            Specialization path
          </div>
          <h2
            id={spec.headingId}
            className="text-3xl font-bold tracking-tight text-white md:text-4xl"
          >
            <span className="block">{spec.titleLines[0]}</span>
            <span className="block text-2xl font-semibold text-white/70 md:text-3xl">
              {spec.titleLines[1]}
            </span>
          </h2>
        </div>
        <div className="hidden flex-col items-end md:flex">
          <span className="text-5xl font-black leading-none text-white/5">
            {totalLabel}
          </span>
          <span className="mr-1 text-[10px] font-bold uppercase tracking-tighter text-white/20">
            Courses · 1 Specialization
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "group relative overflow-hidden rounded-3xl border border-purple-500/20 p-6 shadow-[0_0_40px_-10px_rgba(168,85,247,0.25)] md:p-8",
          "glass-card"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50",
            spec.gradient
          )}
          aria-hidden
        />

        <div className="relative">
          <div className="grid items-stretch gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-10">
            {/* ─────────── LEFT COLUMN ───────────
               Stacked, fills the card height so there is no empty space:
                 1. Thumbnail (with AI Skills ribbon)
                 2. Issuer + date
                 3. Description text + parent badge (horizontal, side-by-side)
            */}
            <div className="flex flex-col gap-5">
              <button
                type="button"
                onClick={() =>
                  openVerifyUrl(spec.url, {
                    title: spec.titleLines[0],
                    issuer: spec.issuer,
                    specialization: spec.titleLines[0],
                  })
                }
                aria-label={`View ${spec.titleLines[0]} certificate on Coursera`}
                className="group/thumb relative block aspect-[1.4/1] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/20 ring-1 ring-white/5 transition-transform duration-300 hover:scale-[1.01]"
              >
                <Image
                  src={spec.image}
                  alt={`${spec.titleLines[0]} certificate preview`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/thumb:scale-105"
                  sizes="(max-width: 768px) 100vw, 32rem"
                />
                {/* AI Skills ribbon */}
                <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/95 via-yellow-400/95 to-amber-500/95 px-3 py-1 shadow-[0_4px_20px_-4px_rgba(251,191,36,0.6)] backdrop-blur-sm">
                  <span className="text-xs leading-none" aria-hidden>🌟</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-950">
                    AI Skills
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover/thumb:opacity-100">
                  <div className="flex translate-y-4 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md transition-transform duration-300 group-hover/thumb:translate-y-0">
                    <ExternalLink className="h-4 w-4 text-white" aria-hidden />
                    <span className="text-xs font-semibold uppercase tracking-wider text-white">
                      View Certificate
                    </span>
                  </div>
                </div>
              </button>

              {/* Logo + issuer + date */}
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1.5">
                  <Image
                    src={spec.logo}
                    alt="Google"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold uppercase tracking-widest text-blue-400">
                    {spec.issuer}
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-tighter text-white/30">
                    <Calendar className="h-3 w-3" aria-hidden />
                    {spec.date}
                  </p>
                </div>
              </div>

              {/* Description text + parent badge — horizontally aligned.
                  This row absorbs the empty space that used to sit under the
                  issuer/date block. The parent badge is a self-contained
                  hover-to-verify Credly link with no surrounding text. */}
              <div className="mt-1 flex flex-1 items-center gap-5 rounded-2xl border border-white/5 bg-white/[0.015] p-4 md:gap-6 md:p-5">
                <p className="min-w-0 flex-1 text-sm leading-relaxed text-zinc-300 md:text-[15px]">
                  {spec.description}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    openBadgeUrl(spec.parentBadge.credlyUrl, {
                      title: `${spec.titleLines[0]} (Parent)`,
                      specialization: spec.titleLines[0],
                    })
                  }
                  aria-label={`View ${spec.titleLines[0]} parent badge on Credly`}
                  data-testid={`${spec.testId}-parent-badge`}
                  className="group/parent relative h-32 w-32 shrink-0 rounded-full transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 md:h-40 md:w-40"
                >
                  <Image
                    src={spec.parentBadge.image}
                    alt={`${spec.titleLines[0]} verified parent badge`}
                    fill
                    sizes="(max-width: 768px) 128px, 160px"
                    className="object-contain drop-shadow-[0_6px_22px_rgba(251,191,36,0.45)]"
                  />
                </button>
              </div>
            </div>

            {/* ─────────── RIGHT COLUMN ───────────
               Children of the specialization. Pro Cert (`badges` layout) is a
               2-3-2 circular grid of clickable Credly badges with VERIFY
               ribbons. Essentials (`list` layout) keeps the existing 5-course
               numbered list because Coursera does not issue a unique badge
               for each Essentials course — they all share the parent artwork.
            */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 self-start rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                All {spec.totalCourses} course credentials
              </div>

              {spec.childrenLayout === "list" ? (
                <ol
                  data-testid={spec.testId}
                  className="m-0 flex flex-1 list-none flex-col justify-between space-y-2.5 p-0"
                >
                  {spec.children.map((child, index) => (
                    <motion.li
                      key={child.step}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group/sub flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 backdrop-blur-sm transition-colors hover:border-purple-500/30 hover:bg-white/[0.04] md:px-4 md:py-3"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-purple-500/40 bg-[#09090b] text-[11px] font-bold text-white shadow-[0_0_15px_-5px_rgba(168,85,247,0.35)] md:h-8 md:w-8 md:text-xs">
                        {child.step}
                      </div>

                      <h4 className="min-w-0 flex-1 truncate text-sm font-semibold leading-snug text-white">
                        {child.title}
                      </h4>

                      <button
                        type="button"
                        onClick={() =>
                          openVerifyUrl(child.url, {
                            title: child.title,
                            issuer: spec.issuer,
                            step: child.step,
                            specialization: spec.titleLines[0],
                          })
                        }
                        aria-label={`Verify certificate for ${child.title}`}
                        className="group/vc inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400 transition-colors hover:text-blue-300"
                      >
                        <span className="hidden sm:inline">Verify</span>
                        <ExternalLink className="h-3 w-3 transition-transform group-hover/vc:translate-x-0.5" />
                      </button>

                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-emerald-400"
                        aria-hidden
                      />
                    </motion.li>
                  ))}
                </ol>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <ChildBadgesGrid spec={spec} />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const CertificateCard = ({
  cert,
  isAI = false,
  onClick,
}: {
  cert: GalleryCertificate;
  isAI?: boolean;
  onClick: (cert: GalleryCertificate) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      onClick={() => onClick(cert)}
      className={cn(
        "group relative glass-card p-4 rounded-3xl cursor-pointer overflow-hidden flex flex-col h-full",
        isAI ? "border-purple-500/20 shadow-[0_0_20px_-5px_rgba(168,85,247,0.15)]" : "border-white/5"
      )}
    >
      {/* Background Gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", cert.gradient)} />

      {/* Badge for AI */}
      {isAI && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">AI Skills</span>
          </div>
        </div>
      )}

      {/* Image Thumbnail */}
      <div className="relative aspect-[1.4/1] w-full rounded-2xl overflow-hidden mb-5 bg-black/20 ring-1 ring-white/5">
        <Image
          src={cert.image}
          alt={cert.title}
          fill
          className={`${cert.id === 'g-2' ? 'object-contain bg-white' : 'object-cover'} group-hover:scale-105 transition-transform duration-700`}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className={cn("rounded-full bg-white/10 backdrop-blur-md border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center", cert.url ? "px-4 py-2.5 gap-2" : "p-3")}>
            {cert.url ? (
              <>
                <ExternalLink className="w-4 h-4 text-white" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white pr-1">View Certificate</span>
              </>
            ) : (
              <Search className="w-5 h-5 text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col relative z-0">
        {cert.officialBadge ? (
          <div className="flex gap-6 items-center">
            {/* Left: Text Elements */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white/5 flex items-center justify-center p-1 border border-white/10">
                  <Image src={cert.logo} alt={cert.issuer} width={24} height={24} className="object-contain" />
                </div>
                <p className="text-xs font-medium text-white/50 truncate max-w-[150px]">{cert.issuer}</p>
              </div>

              <h3 className="text-lg font-semibold text-white/90 leading-tight mb-3 group-hover:text-white transition-colors">
                {cert.title}
              </h3>

              <p className="text-sm text-zinc-400 leading-relaxed">
                {cert.description}
              </p>
            </div>

            {/* Right: Large Badge — matches the parent-badge glow used on the
                Google AI specialization cards (offset drop-shadow + halo). */}
            <div className="relative w-32 h-32 shrink-0 transition-all duration-500 hover:scale-[1.07]">
              {/* Soft radial halo behind the badge */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full bg-blue-500/30 blur-2xl"
              />
              <Image
                src={cert.officialBadge}
                alt="Official Badge"
                fill
                className="relative object-contain drop-shadow-[0_6px_22px_rgba(37,99,235,0.55)]"
                priority
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white/5 flex items-center justify-center p-1 border border-white/10">
                <Image src={cert.logo} alt={cert.issuer} width={24} height={24} className="object-contain" />
              </div>
              <p className="text-xs font-medium text-white/50 truncate max-w-[150px]">{cert.issuer}</p>
            </div>

            <h3 className="text-lg font-semibold text-white/90 leading-tight mb-2 group-hover:text-white transition-colors">
              {cert.title}
            </h3>

            <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-4">
              {cert.description}
            </p>
          </>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-white/30">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-widest">{cert.date}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-white/40 group-hover:text-blue-400 transition-colors">
            VIEW DETAILS
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- PAGE ---

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<GalleryCertificate | null>(
    null
  );
  const handleCertificateClick = (cert: GalleryCertificate) => {
    if (cert.url) {
      trackEvent("verify_certificate", {
        title: cert.title,
        issuer: cert.issuer,
      });
      window.open(cert.url, "_blank", "noopener,noreferrer");
      return;
    }

    setSelectedCert(cert);
  };

  return (
    <div className="min-h-screen bg-[#09090b] aurora-gradient relative overflow-x-hidden">
      <div className="bg-noise" aria-hidden="true" />

      {/* Scroll to Top helper for SmoothScroll compatibility */}
      <div id="top" />

      {/* Header Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 shadow-xl">
            <Award className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Professional Credentials</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-tight">
            Knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">Album.</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            A curated collection of my professional certifications, specialized training,
            and continuous education in QA, Development, and Artificial Intelligence.
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-40 space-y-32">
        {/* SPECIALIZATION PATHS — reverse chronology: Pro Certificate first, Essentials second */}
        {SPECIALIZATIONS.map((spec) => (
          <SpecializationSection key={spec.id} spec={spec} />
        ))}

        {/* AI SECTION - HIGHLIGHTED */}
        <section>
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                AI & NEXT-GEN TECH
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">AI Specialists</h2>
              <p className="text-white/40 max-w-md">Highlighting expertise in Generative AI, Prompt Engineering, and AI-Powered Testing.</p>
            </div>
            {/* Minimal counter */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-5xl font-black text-white/5 leading-none">
                {String(AI_CERTIFICATES.length).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-bold text-white/20 tracking-tighter uppercase mr-1">Certifications</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AI_CERTIFICATES.map((cert) => (
              <CertificateCard
                key={cert.id}
                cert={cert}
                isAI={true}
                onClick={handleCertificateClick}
              />
            ))}
          </div>
        </section>

        {/* GENERAL SECTION */}
        <section>
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                CORE FOUNDATIONS
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Technical & Leadership</h2>
              <p className="text-white/40 max-w-md">Fundamental testing standards, development principles, and project management.</p>
            </div>
            {/* Minimal counter */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-5xl font-black text-white/5 leading-none">
                {String(GENERAL_CERTIFICATES.length).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-bold text-white/20 tracking-tighter uppercase mr-1">Certifications</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GENERAL_CERTIFICATES.map((cert) => (
              <CertificateCard
                key={cert.id}
                cert={cert}
                onClick={handleCertificateClick}
              />
            ))}
          </div>
        </section>
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl bg-black/80"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Mobile */}
              <button
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 border border-white/10 text-white md:hidden"
                onClick={() => setSelectedCert(null)}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Image Area */}
              <div className="relative flex-[1.5] bg-black/40 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
                <div className="relative w-[90%] h-[85%]">
                  <Image
                    src={selectedCert.image}
                    alt={selectedCert.title}
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    priority
                  />
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-8 md:p-12 flex flex-col bg-white/[0.02]">
                {/* Back to album (desktop) */}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="hidden md:flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-10"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Album
                </button>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-center">
                      <Image src={selectedCert.logo} alt={selectedCert.issuer} width={30} height={30} className="object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">{selectedCert.issuer}</p>
                      <p className="text-[11px] text-white/30 uppercase tracking-tighter">{selectedCert.date}</p>
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    {selectedCert.title}
                  </h3>

                  <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

                  <p className="text-white/50 leading-relaxed">
                    {selectedCert.description}
                  </p>

                  <div className="pt-10 mt-auto">
                    {selectedCert.url ? (
                      <Link
                        href={selectedCert.url}
                        target="_blank"
                        onClick={() => trackEvent('verify_certificate', {
                          title: selectedCert.title,
                          issuer: selectedCert.issuer
                        })}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="relative z-10">Verify Certificate</span>
                        <ExternalLink className="w-4 h-4" />
                        <div className="absolute inset-x-0 bottom-0 h-full bg-blue-400 rotate-2 translate-y-2 opacity-0 group-hover:opacity-10 transition-all rounded-2xl" />
                      </Link>
                    ) : (
                      <div className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 inline-block">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Internal Verification Only</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
