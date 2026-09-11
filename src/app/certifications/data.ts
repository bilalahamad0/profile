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
    id: "g-7",
    title: "Test Automation Foundations",
    issuer: "LinkedIn Learning",
    date: "2023",
    image: "/certificates/test_automation_foundations_thumb.jpg",
    url: "https://www.linkedin.com/learning/certificates/0a7921f60d0738aa78ec4312dda4bac360ef241f6d0209a0fce2e15ccda3d968",
    logo: "/logos/linkedin.png",
    description: "Automation strategy end to end — choosing test types and tooling, then sustaining suites across continuous integration and delivery.",
    gradient: "from-cyan-600/10 to-sky-600/10"
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
    id: "g-10",
    title: "Nano Tips to Stop Overthinking with Shadé Zahrai",
    issuer: "LinkedIn Learning",
    date: "2022",
    image: "/certificates/nano_tips_overthinking_thumb.jpg",
    url: "https://www.linkedin.com/learning/certificates/0041c10c2859e50332c144c268dcb9bf0a239d8df5f28a73e331fe514a72ef8d",
    logo: "/logos/linkedin.png",
    description: "Interrupting rumination and keeping judgement clear under pressure — applied positive psychology for high-stakes decisions.",
    gradient: "from-rose-600/10 to-pink-600/10"
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
    id: "g-9",
    title: "Scrum: The Basics",
    issuer: "LinkedIn Learning",
    date: "2021",
    image: "/certificates/scrum_basics_thumb.jpg",
    url: "https://www.linkedin.com/learning/certificates/b27c9412dbd221e0bfa9a8d5fa7769c6dbc0c5c3c3bb4aa31a67529481d2f0e2",
    logo: "/logos/linkedin.png",
    description: "The Scrum framework end to end — roles, artifacts, and ceremonies, and how a delivery team organizes its work around them.",
    gradient: "from-amber-600/10 to-orange-600/10"
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
    id: "g-8",
    title: "Node.js Essential Training",
    issuer: "LinkedIn Learning",
    date: "2024",
    image: "/certificates/node_js_essential_thumb.jpg",
    url: "https://www.linkedin.com/learning/certificates/e9b657ca75db5096262df4ca149e666a0717e7082af3d490ff6e7fd6b5a762df",
    logo: "/logos/linkedin.png",
    description: "Server-side JavaScript fundamentals — the Node core, module system, file I/O, and event-driven execution outside the browser.",
    gradient: "from-green-600/10 to-lime-600/10"
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
  {
    id: "g-11",
    title: "Learning Python Generators",
    issuer: "LinkedIn Learning",
    date: "2018",
    image: "/certificates/python_generators_thumb.jpg",
    url: "https://www.linkedin.com/learning/certificates/efbb25ce7ad8a03cb580b721b3a8504f1f3b0c72fb74bb4f886d703c163a69ad",
    logo: "/logos/linkedin.png",
    description: "Lazy iteration over large data sets — generator functions and expressions, and how they power context managers and coroutines.",
    gradient: "from-blue-700/10 to-amber-600/10"
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
// (ai / testing / leadership) plus a page-local engineering bucket for the dev
// certs that never belonged in a skills summary.
//
// This ledger is the COMPLETE record; `certifications` in portfolio.ts is a
// curated SUBSET of it, feeding the Experience summary card and the JSON-LD
// Person schema. A row here with no portfolio.ts twin is deliberate curation,
// not drift — currently g-4 / g-8 / g-3 / g-11 (engineering foundations) and
// g-9 / g-10 (short leadership coursework whose stronger sibling is already
// listed). Verify against portfolio.ts before "fixing" an apparent gap.
//
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
    // ISTQB leads on prominence, not recency: it is the only formally
    // accredited, proctored certification on the page, so it stays above the
    // newer coursework in its own group.
    credentials: [byCertId("g-1"), byCertId("g-7")],
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
      byCertId("g-10"),
      // Advanced above Basics: same completion year, and the pair reads as the
      // progression it was.
      byCertId("g-2"),
      byCertId("g-9"),
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
    credentials: [byCertId("g-4"), byCertId("g-8"), byCertId("g-3"), byCertId("g-11")],
  },
];

/** Rows that start expanded on load — the flagship specialization of each
 *  track (AI & Prompt Engineering, Leadership & Project Management).
 *  SSR-deterministic so there is never a hydration mismatch. */
export const DEFAULT_OPEN_IDS = [
  "spec-google-ai-professional",
  "spec-google-project-management",
] as const;

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

// --- CONTINUING EDUCATION (NON-CREDENTIAL) ---
//
// Coursework that issues NO certificate, and therefore is NOT a credential.
// It lives in its own const, deliberately out of reach of every aggregation
// above:
//   • NOT in SPECIALIZATIONS / AI_CERTIFICATES / GENERAL_CERTIFICATES, so it
//     can never reach ALL_SINGLES, ALL_YEARS or CERT_STATS.credentials (17).
//   • NOT in CREDENTIAL_GROUPS, so it never renders under an "all verified"
//     header, never gets a ledger numeral, and never gets a Verify control.
//   • NOT in `certifications` in src/data/portfolio.ts, so certificationsSchema()
//     never emits it as an EducationalOccupationalCredential and the Experience
//     page's `certs` summary card never lists it.
// Anything that would count, verify, badge or schema-tag an ENTRY is a bug;
// src/app/certifications/data.test.ts asserts all three exclusions.
//
// Two levels, and the distinction is the whole design:
//   ENTRY  — the course or learning path. Completing it issued nothing, so the
//            entry type has no `url` / `image` / `logo` field and never will:
//            the shape's inability to express entry-level verification is the
//            point (data.test.ts asserts those keys are absent on every entry).
//   COURSE — one unit inside an entry. Some units DO issue a public badge on
//            a badging platform (Google Skills course badges are public,
//            login-free pages that return 200 logged-out — verified
//            2026-09-10/11; so are the two Credly badge pages — verified
//            logged-out 2026-09-11). That is real and verifiable, so it lives
//            on the COURSE as `badge` — never promoted to the entry, never
//            counted anywhere, and never routed through
//            openVerifyUrl()/openBadgeUrl().
//            Google issues two kinds (`badge.kind`): an on-demand course's
//            COMPLETION badge, and a lab-based SKILL badge that Google Cloud
//            also issues on Credly. Google's own Credentials page lists both
//            under "Completions", and this section treats them identically —
//            the kind only changes the link's spoken suffix. A course badge
//            says "this course was completed"; it does not say "this path
//            issued a certificate", and the card's one `formatNote` line says
//            which. Completing a PATH issues nothing — no certificate, no
//            badge (Google fact, 2026-09-10) — which is exactly why the badge
//            lives on the course and not on the entry.
//            `badge.provider` says WHICH platform's public page is linked, and
//            it is independent of `kind`: a skill badge exists on both
//            platforms and this site links whichever copy the owner chose. The
//            two skill badges link Credly (the richer, issuer-attested page);
//            everything else links Google Skills. Thumbnails therefore live in
//            two folders — /badges/google-skills/*.webp for the Google copies
//            and /badges/*.webp for the Credly ones, flat beside the ledger's
//            other Credly art. Linking a Credly page here still does NOT make
//            the badge a credential: it stays a course unit inside Continuing
//            Education, outside every aggregation above.
//            `badge.linkTitle` closes the one gap that leaves: when the
//            platform names the badge differently from the course, the chip
//            SHOWS both names (course title first, the platform's own title
//            after it, muted) so a reader sees, before clicking, that the
//            destination page is titled something else. Today that is exactly
//            one badge — Credly issues "Prompt Design in Vertex AI Skill
//            Badge" for the course Google lists inside path 118 as "Prompt
//            Design in Agent Platform". The mismatch used to be recorded here
//            only, in a comment; it is now on the page.
//
// If a future entry here ever DOES earn a real certificate, move it into
// GENERAL_CERTIFICATES. Never add a `url` / `image` / `logo` field to
// ContinuingEducationEntry — put verification on ContinuingEducationCourse.
// data.test.ts asserts: no entry-level url/image/logo keys, every badge url
// and image path matches its provider's pattern, every badge image exists on
// disk, exactly the two lab-based badges carry kind "skill", and exactly one
// badge carries a `linkTitle` — never one equal to its own course title.

/** A course's public, login-free badge page plus its local thumbnail. */
export type ContinuingEducationBadge = {
  /** Public badge page on the badging platform (HTTP 200 logged-out). Opened
   *  via a plain <a target="_blank" rel="noopener noreferrer">, never
   *  openBadgeUrl() — even for the Credly ones: that helper fires a
   *  `verify_badge` GA event with provider "Credly", and that event belongs to
   *  the ledger's credential rows, not to a course chip. */
  url: string;
  /** "completion" = an on-demand course's completion badge (issued by Google
   *  Skills only). "skill" = a lab-based Google Cloud skill badge, issued on
   *  BOTH Google Skills and Credly. Google's Credentials page files both under
   *  "Completions" and the chip renders identically for both; the kind is read
   *  ONLY by the sr-only link suffix ("skill badge" / "completion badge") so
   *  the spoken name is accurate. Independent of `provider` by design — see
   *  below. */
  kind: "completion" | "skill";
  /** Which platform's public page `url` points at, and the word spoken in the
   *  sr-only suffix — and, where `linkTitle` is set, the platform name PRINTED
   *  before it on the chip ("(Credly: …)"), so on that chip this value is
   *  visible copy, not sr-only text. Deliberately NOT derived from `kind`,
   *  even though today
   *  the correlation is exact (both skill badges → Credly, all 18 completion
   *  badges → Google Skills): a skill badge exists on both platforms, and this
   *  field records which copy is linked, not what kind of badge it is. */
  provider: "Google Skills" | "Credly";
  /** The destination page's OWN title, set only when the platform names the
   *  badge differently from the course. Its presence means "these two names
   *  disagree" — never set it to a value equal to the course title
   *  (data.test.ts fails a redundant value). The chip renders it verbatim and
   *  in full after the course title, muted and prefixed by `provider` (the
   *  field, not a literal "Credly:"), so a reader sees the name the
   *  badge page will greet them with instead of finding a page that never
   *  contains the string they clicked. It ADDS a name; it never replaces the
   *  course title, which is what the issuer's path page lists. */
  linkTitle?: string;
  /** Local thumbnail under /public (240px WebP, opaque white ground),
   *  rendered with next/image — no remotePatterns change. Google Skills art
   *  sits in /badges/google-skills/, Credly art flat in /badges/ beside the
   *  ledger's other Credly badges. data.test.ts asserts the file exists on
   *  disk and that the path matches the provider's folder. */
  image: string;
};

export type ContinuingEducationCourse = {
  /** Course / module title, verbatim from the issuer's path or syllabus page. */
  title: string;
  /** Present only when the issuer publishes a badge for this course (a
   *  completion badge or a skill badge — see `ContinuingEducationBadge.kind`).
   *  Absent = a plain chip (every Stanford module; Google's Welcome and Wrap
   *  Up units). Path completion itself never issues one — see the contract
   *  comment above. */
  badge?: ContinuingEducationBadge;
};

/** Literal Tailwind class strings per ISSUER — Tailwind cannot interpolate,
 *  so every variant is spelled out (same rule as GroupAccent above).
 *  Deliberately tiny: the issuer's colour lives ONLY on the tile, a fixed-hex
 *  GROUND that measures the same in both themes. Nothing issuer-coloured ever
 *  becomes text on the page ground — every hue there is already reserved
 *  (blue-700/400 = Verify and CHIP_OFFICIAL, emerald = verification, violet =
 *  "N Courses", amber = skills), and the ledger's own chip rule (CredentialRow:
 *  chips are tinted by MEANING, not by group) means the "Completed" chip must
 *  wear the same neutral tint on every card. Chips are therefore NOT part of
 *  this accent, exactly as they are not part of GroupAccent. */
export type ContinuingEducationAccent = {
  /** Opaque fixed-hex tile ground, e.g. "bg-[#8C1515]". White and white/80
   *  text sit on it — keep both ≥ 4.5:1. */
  tile: string;
  /** Font FAMILY / WEIGHT of the wordmark line only (the component adds
   *  `t-label text-white`). Stanford is the site's one serif; Google is the
   *  site sans, semibold. It sits on t-label, a size-only token, so weight is
   *  allowed beside it. */
  wordmark: string;
};

export type ContinuingEducationEntry = {
  id: string;
  title: string;
  /** Full issuer, printed by the component as "{issuer} · {meta}" — the slot
   *  where a credential row prints its issuer. */
  issuer: string;
  /** Short issuer for the derived section eyebrow ("Google Skills · Stanford"). */
  issuerShort: string;
  /** Institution name, typeset on the designed tile. Never an image asset:
   *  no logo file is downloaded and no lockup is reconstructed. */
  wordmark: string;
  /** Second tile line, rendered uppercase: Stanford's course code (XEE100);
   *  Google's platform label ("Skills"). All four Google tiles are identical
   *  by design — the tile is an issuer mark, the h3 carries the path. */
  tileCode: string;
  /** Row meta line AFTER the issuer. Leads with substance. "six Stanford
   *  faculty" is Stanford's OWN wording ("six Stanford faculty members will
   *  deliver an overview") — keep the attribution to them: their teaching team
   *  lists Beth Pruitt at UC Santa Barbara, so writing that claim from scratch
   *  would overstate it. */
  meta: string;
  /** The achievement, in the slot where a credential row prints its chips.
   *  Never "certified" / "verified". */
  status: string;
  /** Curriculum units in the issuer's order. Each renders as one chip; a unit
   *  with a `badge` renders as a link to its public badge page. Duplicates
   *  ACROSS entries are real (Google reuses courses between paths); titles
   *  are unique WITHIN an entry (they are React keys). */
  courses: readonly ContinuingEducationCourse[];
  /** Format + record status, stated once, in the fine-print slot where format
   *  details live. Must contain the phrase "no certificate" exactly once
   *  (data.test.ts). Factual, not apologetic: this section exists to present
   *  real coursework accurately, and one quiet line does that. Repeating it —
   *  an eyebrow, a chip, AND a sentence — turns an honest footnote into a
   *  disclaimer that drowns out the course itself. Keep it to this one field. */
  formatNote: string;
  /** The issuer's public syllabus / path page. NOT a verification URL — there
   *  is none at entry level — and it must never be routed through
   *  openVerifyUrl()/openBadgeUrl(): they fire a `verify_certificate` GA
   *  event for a credential that does not exist. */
  courseUrl: string;
  /** Visible label of that link: "Course page" / "Path page". */
  courseUrlLabel: string;
  accent: ContinuingEducationAccent;
};

/** Cardinal #8C1515 as a GROUND: white 9.40:1, white/80 6.43:1, identical in
 *  both themes. As TEXT it would be 2.1:1 on #09090b — it is never used as
 *  text anywhere in the section any more. */
const STANFORD_ACCENT: ContinuingEducationAccent = {
  tile: "bg-[#8C1515]",
  wordmark: "font-serif",
};

/** Google Blue 900 (#174EA6, Google's own Material palette — Blue 800 is
 *  #185ABC, 700 #1967D2, 600 #1A73E8) as a GROUND:
 *  white 7.85:1, white/80 5.67:1, identical in both themes, and the same tonal
 *  weight as the cardinal tile so the two read as peers. NOT #4285F4 / #1A73E8
 *  / #1967D2: white type measures 3.56 / 4.51 / 5.2:1 there and white/80 fails
 *  (2.6 / 3.45 / 4.04:1) — do not "brighten" the tile. An opaque blue slab is
 *  visually distinct from the translucent `text-blue-700 dark:text-blue-400`
 *  Verify / CHIP_OFFICIAL vocabulary; #174EA6 is never used as text (2.5:1 on
 *  #09090b). */
const GOOGLE_SKILLS_ACCENT: ContinuingEducationAccent = {
  tile: "bg-[#174EA6]",
  wordmark: "font-semibold",
};

const GOOGLE_SKILLS_PROFILE =
  "https://www.skills.google/public_profiles/aece174b-451d-4d6f-928d-6def28946025";

function gsBadge(
  id: number,
  image: string,
  kind: ContinuingEducationBadge["kind"] = "completion",
): ContinuingEducationBadge {
  return {
    url: `${GOOGLE_SKILLS_PROFILE}/badges/${id}`,
    image: `/badges/google-skills/${image}.webp`,
    kind,
    provider: "Google Skills",
  };
}

/** The Credly copy of a lab-based skill badge. Its public_url page returns 200
 *  logged-out (verified 2026-09-11) and names the issuer (Google Cloud) and the
 *  earner, which is why the two skill badges link here rather than at their
 *  Google Skills twins. Every Credly badge referenced here happens to be a
 *  lab-based skill badge, so `kind` is fixed at "skill" — but that is a fact
 *  about today's two badges, not a rule: provider and kind stay independent
 *  fields (see the type), and a future Credly-linked completion badge would
 *  simply widen this helper.
 *  Pass `linkTitle` ONLY when Credly's own badge name differs from the course
 *  title — it is rendered on the chip, so a value equal to the course title
 *  would print the same words twice. */
function credlyBadge(
  uuid: string,
  image: string,
  linkTitle?: string,
): ContinuingEducationBadge {
  return {
    url: `https://www.credly.com/badges/${uuid}/public_url`,
    image: `/badges/${image}.webp`,
    kind: "skill",
    provider: "Credly",
    ...(linkTitle ? { linkTitle } : {}),
  };
}

// Google issues one badge per COURSE, not per path — a course that sits in
// two paths points at the same badge id and the same thumbnail, so each shared
// course is one const referenced from every path that contains it.
//
// In both the SMB path and the Introduction to Agents path:
const AGENT_FUNDAMENTALS: ContinuingEducationCourse = {
  title: "Agent Fundamentals",
  badge: gsBadge(27848674, "agent-fundamentals"),
};
const ENTERPRISE_AGENTS: ContinuingEducationCourse = {
  title: "Enterprise Agents and Use Cases",
  badge: gsBadge(27848742, "enterprise-agents-and-use-cases"),
};
// Lab-based skill badge, so it exists on both platforms; the Credly copy is the
// one linked (Google Skills badge 27848848 is its twin). Credly and Google use
// the SAME name for this one — verified against Credly's og:title — so it gets
// no `linkTitle`; that field exists only to surface a DISAGREEMENT. Shared by
// the SMB and Agents paths, so both cards pick the Credly link up from this
// single const.
const FIRST_GEMINI_ENTERPRISE_APP: ContinuingEducationCourse = {
  title: "Create Your First Gemini Enterprise Application",
  badge: credlyBadge(
    "fc080ecb-a01b-4ca4-a99f-4f008a846da9",
    "create-your-first-gemini-enterprise-application",
  ),
};
// In both the SMB path and the Beginner: Introduction to Generative AI path:
const INTRO_GENERATIVE_AI: ContinuingEducationCourse = {
  title: "Introduction to Generative AI",
  badge: gsBadge(4643942, "intro-generative-ai"),
};
const INTRO_LARGE_LANGUAGE_MODELS: ContinuingEducationCourse = {
  title: "Introduction to Large Language Models",
  badge: gsBadge(27848454, "intro-large-language-models"),
};

// Reverse chronology by completion. The four Google paths all finished on
// 2026-09-10 (PDT) — Beginner: Introduction to Generative AI ~22:00, Agents
// ~18:00, SMB ~17:55, Gen AI Leader ~14:35, from the owner's Google Skills
// activity log — and Stanford earlier in 2026.
// data.test.ts and continuing-education.spec.ts both assert this id order.
export const CONTINUING_EDUCATION: readonly ContinuingEducationEntry[] = [
  {
    id: "ce-google-skills-beginner-gen-ai-118",
    title: "Beginner: Introduction to Generative AI",
    issuer: "Google Skills",
    issuerShort: "Google Skills",
    wordmark: "Google",
    tileCode: "Skills",
    // Google's own description, verbatim after "This learning path provides
    // an": "overview of generative AI concepts, from the fundamentals of large
    // language models to responsible AI principles."
    meta: "Overview of generative AI concepts, from the fundamentals of large language models to responsible AI principles · 4 courses",
    status: "Completed Sep 2026",
    courses: [
      INTRO_GENERATIVE_AI,
      INTRO_LARGE_LANGUAGE_MODELS,
      {
        // The chip LEADS with Google's course title and SHOWS Credly's name
        // after it. The two platforms name this badge differently — Credly
        // issues it as "Prompt Design in Vertex AI Skill Badge" (hence the
        // image filename), Google lists the course inside path 118 as "Prompt
        // Design in Agent Platform". Renaming the chip to Credly's wording
        // would make this card disagree with the path page it links to, so the
        // course title stays; but leaving Credly's name off meant the linked
        // page never contained the string it was clicked from, and could not
        // corroborate the label. Hence `linkTitle`: both names, verbatim, in
        // one chip. The value below is Credly's exact og:title (no trailing
        // "was issued by…"), verified logged-out 2026-09-11. Google Skills
        // badge 27852046 is the twin of this Credly badge.
        title: "Prompt Design in Agent Platform",
        badge: credlyBadge(
          "328f785b-dc1b-4f73-9ed2-d9a8eb7c8e71",
          "prompt-design-in-vertex-ai",
          "Prompt Design in Vertex AI Skill Badge",
        ),
      },
      {
        title: "Responsible AI: Applying AI Principles with Google Cloud",
        badge: gsBadge(27852150, "responsible-ai-applying-ai-principles"),
      },
    ],
    formatNote:
      "On-demand online path · Google issues no certificate for completing this path — the badges are per course.",
    courseUrl: "https://www.skills.google/paths/118",
    courseUrlLabel: "Path page",
    accent: GOOGLE_SKILLS_ACCENT,
  },
  {
    id: "ce-google-skills-agents-3546",
    title: "Introduction to Agents and Google’s Agent Ecosystem",
    issuer: "Google Skills",
    issuerShort: "Google Skills",
    wordmark: "Google",
    tileCode: "Skills",
    meta: "Learning path in the Gemini Enterprise Agent Ready (GEAR) series · 5 courses",
    status: "Completed Sep 2026",
    courses: [
      { title: "Welcome: Introduction to Agents and Google’s Agent Ecosystem" },
      AGENT_FUNDAMENTALS,
      ENTERPRISE_AGENTS,
      FIRST_GEMINI_ENTERPRISE_APP,
      { title: "Wrap Up: Introduction to Agents and Google’s Agent Ecosystem" },
    ],
    formatNote:
      "On-demand online path · Google issues no certificate for completing this path — badges are per course, and the Welcome and Wrap Up modules issue none.",
    courseUrl: "https://www.skills.google/paths/3546",
    courseUrlLabel: "Path page",
    accent: GOOGLE_SKILLS_ACCENT,
  },
  {
    id: "ce-google-skills-smb-4020",
    title: "SMB Learning Path",
    issuer: "Google Skills",
    issuerShort: "Google Skills",
    wordmark: "Google",
    tileCode: "Skills",
    // Google's own phrase: "This path was curated for Small/Medium-sized
    // Businesses (SMBs)". Keep the capitalisation.
    meta: "Learning path curated for Small/Medium-sized Businesses (SMBs) · 13 courses",
    status: "Completed Sep 2026",
    courses: [
      INTRO_GENERATIVE_AI,
      INTRO_LARGE_LANGUAGE_MODELS,
      { title: "Introduction to AI Agents", badge: gsBadge(27848206, "intro-ai-agents") },
      AGENT_FUNDAMENTALS,
      ENTERPRISE_AGENTS,
      FIRST_GEMINI_ENTERPRISE_APP,
      { title: "Google Workspace with Gemini: Foundations of Your AI Workflow", badge: gsBadge(27848970, "google-workspace-with-gemini-foundations") },
      { title: "Gemini in Gmail", badge: gsBadge(27849041, "gemini-in-gmail") },
      { title: "Gemini in Google Sheets", badge: gsBadge(27849084, "gemini-in-google-sheets") },
      { title: "AI Boost Bites: TL;DR with Gemini in Docs & Drive", badge: gsBadge(27849118, "ai-boost-bites-tldr-gemini-docs-drive") },
      { title: "AI Boost Bites: Gemini Gems – Your ultimate marketing sidekick", badge: gsBadge(27849147, "ai-boost-bites-gemini-gems") },
      { title: "AI Boost Bites: Content Generation with Gemini Made Easy", badge: gsBadge(27849164, "ai-boost-bites-content-generation") },
      { title: "Gemini in Google Vids", badge: gsBadge(27849255, "gemini-in-google-vids") },
    ],
    formatNote:
      "On-demand online path · Google issues no certificate for completing this path — the badges are per course.",
    courseUrl: "https://www.skills.google/paths/4020",
    courseUrlLabel: "Path page",
    accent: GOOGLE_SKILLS_ACCENT,
  },
  {
    // Google's official path title is "Generative AI Leader Certification" —
    // it is the EXAM-PREP path for the Google Cloud certification of that
    // name: Google Cloud's own certification page
    // (https://cloud.google.com/learn/certification/generative-ai-leader)
    // lists this path under Quick links as "Train for the exam", and the owner
    // has not sat the exam (skills.google Credentials → Certifications (0)).
    // The heading therefore never contains the word "Certification" (and,
    // being clamped, can never truncate to it); the meta line leads with
    // Google's "Train for the exam" framing and keeps the official title
    // verbatim, quoted and attributed, so it stays searchable; the fine print
    // names the certification as a separate credential and says the exam was
    // not taken. data.test.ts guards all three, and "certified" appears
    // nowhere in this entry.
    id: "ce-google-skills-gen-ai-leader-1951",
    title: "Generative AI Leader — Exam-Prep Learning Path",
    issuer: "Google Skills",
    issuerShort: "Google Skills",
    wordmark: "Google",
    tileCode: "Skills",
    meta: "“Train for the exam” path for the Google Cloud Generative AI Leader certification · listed by Google as “Generative AI Leader Certification” · 5 courses",
    status: "Completed Sep 2026",
    courses: [
      { title: "Gen AI: Beyond the Chatbot", badge: gsBadge(27812324, "gen-ai-beyond-the-chatbot") },
      { title: "Gen AI: Unlock Foundational Concepts", badge: gsBadge(27814445, "gen-ai-unlock-foundational-concepts") },
      { title: "Gen AI: Navigate the Landscape", badge: gsBadge(27825264, "gen-ai-navigate-the-landscape") },
      { title: "Gen AI Apps: Transform Your Work", badge: gsBadge(27846258, "gen-ai-apps-transform-your-work") },
      { title: "Gen AI Agents: Transform Your Organization", badge: gsBadge(27847477, "gen-ai-agents-transform-your-organization") },
    ],
    formatNote:
      "On-demand exam-prep path · Google issues no certificate for completing this path — the Google Cloud Generative AI Leader certification is a separate credential (exam not taken).",
    courseUrl: "https://www.skills.google/paths/1951",
    courseUrlLabel: "Path page",
    accent: GOOGLE_SKILLS_ACCENT,
  },
  {
    id: "ce-stanford-xee100",
    title: "Introduction to Internet of Things",
    issuer: "Stanford School of Engineering",
    issuerShort: "Stanford",
    wordmark: "Stanford",
    tileCode: "XEE100",
    meta: "Taught by six Stanford faculty · 5 modules",
    status: "Completed 2026",
    courses: [
      { title: "Cool Applications" },
      { title: "Sensors" },
      { title: "Embedded Systems" },
      { title: "Networking" },
      { title: "Circuits" },
    ],
    formatNote:
      "Non-credit short course · Stanford issues no certificate for this course.",
    courseUrl:
      "https://online.stanford.edu/courses/xee100-introduction-internet-things",
    courseUrlLabel: "Course page",
    accent: STANFORD_ACCENT,
  },
];
