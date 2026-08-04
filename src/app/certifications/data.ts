import type { LucideIcon } from "lucide-react";
import { Award, GitBranch, ShieldCheck, Sparkles } from "lucide-react";

// --- TYPES ---

export type GalleryCertificate = {
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

export type CredlyBadgeRef = { image: string; credlyUrl: string };

export type SpecializationChild = {
  step: number;
  title: string;
  url: string;
  /** Per-course Credly badge — present on specs whose courses each earn one. */
  badge?: CredlyBadgeRef;
  /** Colored course icon shown in the list layout when there is no per-course badge. */
  icon?: string;
  /** Course earned beyond the core specialization path — rendered set apart with a Bonus tag. */
  bonus?: boolean;
};

export type SpecializationData = {
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
  /** Radial halo tint behind the parent badge — tuned to contrast its own card
   *  background so the badge always reads as a glowing shield, never flat. */
  badgeHalo: string;
  /** Drop-shadow glow on the parent badge image, matched to the halo tint. */
  badgeShadow: string;
  /** Thumbnail ribbon — defaults to the AI Skills ribbon when omitted. */
  ribbon?: { emoji: string; label: string };
  children: SpecializationChild[];
};

// --- DATA ---

export const SPECIALIZATIONS: SpecializationData[] = [
  // Reverse chronology — newer / more advanced first.
  {
    id: "spec-google-project-management",
    headingId: "specialization-path-heading-pm",
    testId: "specialization-courses-list-pm",
    titleLines: ["Google Project Management Professional", "7-Course Journey"],
    issuer: "Google · Coursera",
    date: "2026",
    url: "https://www.coursera.org/account/accomplishments/professional-cert/RFCXEHN5D07B",
    logo: "/logos/google.png",
    description:
      "Google's career certificate in project management — a hands-on progression through project foundations, initiation, planning, execution, and Agile delivery, capped by a real-world capstone and a bonus AI-powered job-search course, with each course backed by its own verified credential.",
    totalCourses: 7,
    image: "/certificates/google_project_management_certificate_thumb.jpg",
    gradient: "from-blue-600/25 via-sky-500/15 to-amber-500/25",
    badgeHalo: "bg-amber-300/35",
    badgeShadow: "drop-shadow-[0_8px_30px_rgba(245,158,11,0.55)]",
    ribbon: { emoji: "🎯", label: "PM Skills" },
    childrenLayout: "list",
    parentBadge: {
      image: "/badges/google-project-management-certificate.png",
      credlyUrl:
        "https://www.credly.com/badges/00d274f5-2041-409e-803c-963f299371ab/public_url",
    },
    children: [
      {
        step: 1,
        title: "Foundations of Project Management",
        url: "https://www.coursera.org/account/accomplishments/records/MX7DVBTMZZ82",
        icon: "/logos/gpm/gpm-course-1-foundations.png",
      },
      {
        step: 2,
        title: "Project Initiation: Starting a Successful Project",
        url: "https://www.coursera.org/account/accomplishments/records/EW5OQ1F4S4KO",
        icon: "/logos/gpm/gpm-course-2-initiation.png",
      },
      {
        step: 3,
        title: "Project Planning: Putting It All Together",
        url: "https://www.coursera.org/account/accomplishments/records/I8FI69UC4QQ5",
        icon: "/logos/gpm/gpm-course-3-planning.png",
      },
      {
        step: 4,
        title: "Project Execution: Running the Project",
        url: "https://www.coursera.org/account/accomplishments/records/80FDIULPFE44",
        icon: "/logos/gpm/gpm-course-4-execution.png",
      },
      {
        step: 5,
        title: "Agile Project Management",
        url: "https://www.coursera.org/account/accomplishments/records/MHYXX9OT22C7",
        icon: "/logos/gpm/gpm-course-5-agile.png",
      },
      {
        step: 6,
        title: "Capstone: Applying Project Management in the Real World",
        url: "https://www.coursera.org/account/accomplishments/records/N4W9DXG8Z2DE",
        icon: "/logos/gpm/gpm-course-6-capstone.png",
      },
      {
        step: 7,
        title: "Accelerate Your Job Search with AI",
        url: "https://www.coursera.org/account/accomplishments/records/YB5RHDDOM6IM",
        icon: "/logos/gpm/gpm-course-7-ai-job-search.png",
        bonus: true,
      },
    ],
  },
  {
    id: "spec-google-ai-professional",
    headingId: "specialization-path-heading-professional",
    testId: "specialization-courses-list-professional",
    titleLines: ["Google AI Professional", "7-Course Journey"],
    issuer: "Google · Coursera",
    date: "2026",
    url: "https://www.coursera.org/account/accomplishments/specialization/1B8PEYYE6E6R",
    logo: "/logos/google.png",
    description:
      "Google's applied 7-course professional certificate built around real workplace use cases — a full progression from AI fundamentals through brainstorming, research, communication, content creation, data analysis, and app building, with each course backed by its own verified credential.",
    totalCourses: 7,
    image: "/certificates/google_ai_professional_certificate_thumb.jpg",
    gradient: "from-emerald-600/25 via-teal-500/15 to-cyan-600/25",
    badgeHalo: "bg-sky-400/30",
    badgeShadow: "drop-shadow-[0_8px_30px_rgba(56,189,248,0.55)]",
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
    id: "spec-google-prompting-essentials",
    headingId: "specialization-path-heading-prompting",
    testId: "specialization-courses-list-prompting",
    titleLines: ["Google Prompting Essentials", "4-Course Journey"],
    issuer: "Google · Coursera",
    date: "2026",
    url: "https://www.coursera.org/account/accomplishments/specialization/4LTXZE4J1Z0Z",
    logo: "/logos/google.png",
    description:
      "Google's focused 4-course specialization on applied prompt engineering — a hands-on progression from writing strong prompts to designing them for everyday work tasks, speeding up data analysis and presentation building, and partnering with AI as a creative or expert collaborator, each course backed by its own verified credential.",
    totalCourses: 4,
    image: "/certificates/google_prompting_essentials_thumb.jpg",
    gradient: "from-amber-500/25 via-yellow-500/15 to-emerald-600/25",
    badgeHalo: "bg-emerald-400/35",
    badgeShadow: "drop-shadow-[0_8px_30px_rgba(16,185,129,0.6)]",
    childrenLayout: "list",
    parentBadge: {
      image: "/badges/google-prompting-essentials.png",
      credlyUrl:
        "https://www.credly.com/badges/1f5fe261-f90d-417b-b158-3f0199237e7b/public_url",
    },
    children: [
      {
        step: 1,
        title: "Start Writing Prompts like a Pro",
        url: "https://www.coursera.org/account/accomplishments/verify/LF3MBR0DKK99",
        badge: {
          image: "/badges/google-prompting-essentials.png",
          credlyUrl:
            "https://www.credly.com/badges/1f5fe261-f90d-417b-b158-3f0199237e7b/public_url",
        },
      },
      {
        step: 2,
        title: "Design Prompts for Everyday Work Tasks",
        url: "https://www.coursera.org/account/accomplishments/verify/ASIU4DXSZSRQ",
        badge: {
          image: "/badges/google-prompting-essentials.png",
          credlyUrl:
            "https://www.credly.com/badges/1f5fe261-f90d-417b-b158-3f0199237e7b/public_url",
        },
      },
      {
        step: 3,
        title: "Speed Up Data Analysis and Presentation Building",
        url: "https://www.coursera.org/account/accomplishments/verify/OR6AU79FC5WN",
        badge: {
          image: "/badges/google-prompting-essentials.png",
          credlyUrl:
            "https://www.credly.com/badges/1f5fe261-f90d-417b-b158-3f0199237e7b/public_url",
        },
      },
      {
        step: 4,
        title: "Use AI as a Creative or Expert Partner",
        url: "https://www.coursera.org/account/accomplishments/verify/FK1PQFV1EI3F",
        badge: {
          image: "/badges/google-prompting-essentials.png",
          credlyUrl:
            "https://www.credly.com/badges/1f5fe261-f90d-417b-b158-3f0199237e7b/public_url",
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
    badgeHalo: "bg-amber-400/30",
    badgeShadow: "drop-shadow-[0_8px_30px_rgba(251,191,36,0.55)]",
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

export const AI_CERTIFICATES: GalleryCertificate[] = [
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
  // Google AI Professional specialization above.
];

export const GENERAL_CERTIFICATES: GalleryCertificate[] = [
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

// --- LEDGER GROUPS ---

export type Credential =
  | ({ kind: "specialization" } & SpecializationData)
  | ({ kind: "single" } & GalleryCertificate);

/** Literal Tailwind class strings per group — Tailwind can't interpolate,
 *  so every accent variant is spelled out in full. Emerald is reserved
 *  exclusively for verification affordances across all groups. Row chips are
 *  deliberately NOT part of the accent: they are tinted by chip type in
 *  CredentialRow so "7 Courses" reads identically in every group. */
export type GroupAccent = {
  eyebrow: string;
  iconTile: string;
  hairline: string;
  hoverBorder: string;
  openRing: string;
  disclosureOpen: string;
};

export type CredentialGroupDef = {
  id: string;
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  accent: GroupAccent;
  credentials: Credential[];
};

function bySpecId(id: string): Credential {
  const s = SPECIALIZATIONS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown specialization id: ${id}`);
  return { kind: "specialization", ...s };
}

function byCertId(id: string): Credential {
  const c = [...AI_CERTIFICATES, ...GENERAL_CERTIFICATES].find((x) => x.id === id);
  if (!c) throw new Error(`Unknown certificate id: ${id}`);
  return { kind: "single", ...c };
}

/** Deep-link/anchor id for a credential row. */
export function credentialSlug(credential: Credential): string {
  return credential.kind === "specialization" ? credential.id : `cert-${credential.id}`;
}

// Skill-domain groups mirroring CertCategory in src/data/portfolio.ts
// (ai / testing / leadership) plus a page-local engineering bucket for the
// two dev certs portfolio.ts deliberately leaves out of the summary card.
// Specializations come before singles within a group; singles by date desc.
export const CREDENTIAL_GROUPS: CredentialGroupDef[] = [
  {
    id: "group-ai",
    eyebrow: "AI & Next-Gen Skills",
    title: "AI & Prompt Engineering",
    icon: Sparkles,
    accent: {
      eyebrow: "text-violet-300",
      iconTile: "border-violet-400/20 bg-violet-500/10 text-violet-300",
      hairline: "from-violet-400/40 via-violet-400/10",
      hoverBorder: "hover:border-violet-400/30",
      openRing:
        "data-[open=true]:border-violet-400/25 data-[open=true]:shadow-[0_0_30px_-12px_rgba(139,92,246,0.35)]",
      disclosureOpen: "border-violet-400/30 bg-violet-400/10",
    },
    credentials: [
      bySpecId("spec-google-ai-professional"),
      bySpecId("spec-google-ai-essentials"),
      bySpecId("spec-google-prompting-essentials"),
      byCertId("ai-2"),
      byCertId("ai-1"),
    ],
  },
  {
    id: "group-testing",
    eyebrow: "The Core Discipline",
    title: "Software Testing",
    icon: ShieldCheck,
    accent: {
      eyebrow: "text-blue-300",
      iconTile: "border-blue-400/20 bg-blue-500/10 text-blue-300",
      hairline: "from-blue-400/40 via-blue-400/10",
      hoverBorder: "hover:border-blue-400/30",
      openRing:
        "data-[open=true]:border-blue-400/25 data-[open=true]:shadow-[0_0_30px_-12px_rgba(59,130,246,0.35)]",
      disclosureOpen: "border-blue-400/30 bg-blue-400/10",
    },
    credentials: [byCertId("g-1")],
  },
  {
    id: "group-leadership",
    eyebrow: "Delivery & Leadership",
    title: "Leadership & Project Management",
    icon: GitBranch,
    accent: {
      eyebrow: "text-amber-300",
      iconTile: "border-amber-400/20 bg-amber-500/10 text-amber-300",
      hairline: "from-amber-400/40 via-amber-400/10",
      hoverBorder: "hover:border-amber-400/30",
      openRing:
        "data-[open=true]:border-amber-400/25 data-[open=true]:shadow-[0_0_30px_-12px_rgba(245,158,11,0.3)]",
      disclosureOpen: "border-amber-400/30 bg-amber-400/10",
    },
    credentials: [
      bySpecId("spec-google-project-management"),
      byCertId("g-5"),
      byCertId("g-6"),
      byCertId("g-2"),
    ],
  },
  {
    id: "group-engineering",
    eyebrow: "Builder Foundations",
    title: "Engineering Foundations",
    icon: Award,
    accent: {
      eyebrow: "text-sky-300",
      iconTile: "border-sky-400/20 bg-sky-500/10 text-sky-300",
      hairline: "from-sky-400/40 via-sky-400/10",
      hoverBorder: "hover:border-sky-400/30",
      openRing:
        "data-[open=true]:border-sky-400/25 data-[open=true]:shadow-[0_0_30px_-12px_rgba(56,189,248,0.3)]",
      disclosureOpen: "border-sky-400/30 bg-sky-400/10",
    },
    credentials: [byCertId("g-4"), byCertId("g-3")],
  },
];

/** Row that starts expanded on load — the newest flagship specialization.
 *  SSR-deterministic so there is never a hydration mismatch. */
export const DEFAULT_OPEN_ID = "spec-google-ai-professional";

// --- SUMMARY STATS (always computed, never hardcoded) ---

const ALL_SINGLES = [...AI_CERTIFICATES, ...GENERAL_CERTIFICATES];

const ALL_YEARS = [
  ...SPECIALIZATIONS.map((s) => parseInt(s.date, 10)),
  ...ALL_SINGLES.map((c) => parseInt(c.date, 10)),
].filter((y) => !Number.isNaN(y));

export const CERT_STATS = {
  credentials: SPECIALIZATIONS.length + ALL_SINGLES.length,
  courseCertificates: SPECIALIZATIONS.reduce((n, s) => n + s.children.length, 0),
  specializations: SPECIALIZATIONS.length,
  yearsSpan: `${Math.min(...ALL_YEARS)} – ${Math.max(...ALL_YEARS)}`,
};
