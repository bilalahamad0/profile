import type { LucideIcon } from "lucide-react";
import { Award, BookOpen, GitBranch, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

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

/** A course's public, login-free badge page plus its local art. Mirrors
 *  CredlyBadgeRef but names its platform: these badges live on TWO platforms
 *  and CredlyBadgeRef hardcodes one. */
export type CourseBadge = {
  /** Public badge page. HTTP 200 logged-out, no login wall — verified by curl
   *  2026-09-10/11 for every Google Skills page and both Credly pages. */
  url: string;
  /** What the ARTWORK itself says it is, read off the badge image — never
   *  inferred from where the badge is hosted.
   *
   *  "completion" = an on-demand course's completion badge; the art prints
   *  "COMPLETION BADGE" on Google's 1000x908 portrait template.
   *  "skill"      = a lab-based Google Cloud skill badge; the art prints
   *  "SKILL BADGE · <level>" over the four-colour bar on Google's 1000x666
   *  landscape template.
   *
   *  INDEPENDENT OF `provider`. Three of the four skill badges here are ALSO
   *  issued on Credly and link there; the fourth (27886491, "Use Agent Skills
   *  with Multi-Agent Systems") has no Credly twin and links Google Skills, so
   *  "skill" must never be read as "hosted on Credly" — that conflation is what
   *  made this badge ship announced as a completion badge over skill-badge art.
   *  Google's own Credentials page files both kinds under "Completions". The
   *  kind changes ONLY the sr-only spoken suffix. */
  kind: "completion" | "skill";
  /** WHICH platform's copy `url` points at. Deliberately INDEPENDENT of `kind`:
   *  a skill badge exists on both platforms and this records which copy is
   *  linked. Read twice by CourseBadgesGrid: it picks the pill's label ("Verify
   *  in Credly" on Credly, a bare "Verify" everywhere else) and it is spoken in
   *  the sr-only suffix, which names the platform either way.
   *
   *  NOTHING on the tile prints the DESTINATION page's own title. A `linkTitle`
   *  field once did, on the one badge Credly names differently from the course
   *  ("Prompt Design in Vertex AI Skill Badge"); the owner removed the
   *  parenthetical on 2026-09-11, and the field with it, so the tile shows the
   *  issuer's course name alone. The naming difference is recorded in a comment
   *  at that course instead — see the Prompt Design entry in path 118. */
  provider: "Google Skills" | "Credly";
  /** Local WebP under /public. Google Skills art in /badges/google-skills/,
   *  Credly art flat in /badges/ beside the ledger's other Credly art.
   *  The art is an OPAQUE white rectangular card (lossy VP8, no alpha, ~600px
   *  wide) that prints its own course title and the words "COMPLETION BADGE" /
   *  "SKILL BADGE". That is why the tile frame is `rounded-xl` on an explicit
   *  `bg-white` — a round clip would cut the card's corners — and why no
   *  sentence anywhere on this page has to state what kind of badge it is. */
  image: string;
};

/** One unit inside a path.
 *
 *  STANDING RULE (owner, 2026-09-11): a "Welcome:" or "Wrap Up:" module is
 *  NEVER a course. Google's path pages list them as activities, but they are
 *  bookends, not coursework, so they are filtered out of this file, out of
 *  `totalCourses`, out of the row chip and out of the badge grid — now and for
 *  any path added later. data.test.ts enforces it.
 *
 *  EVERY LISTED COURSE ON A `coursesLayout: "badges"` PATH CARRIES A BADGE, and
 *  data.test.ts asserts it: a badge-less course would render an empty tile, so
 *  it must fail loudly rather than paint. `badge` stays OPTIONAL only because
 *  the same type describes Stanford's five `coursesLayout: "list"` modules,
 *  which are unbadged by nature and never enter the badge grid. */
export type PathCourse = {
  /** 1-based position in the issuer's own order. */
  step: number;
  title: string;
  badge?: CourseBadge;
};

/** A typeset issuer mark. Never a downloaded logo and never a reconstructed
 *  lockup: `wordmark` and `code` stay indexable text, and `tile` is an OPAQUE
 *  fixed hex, so every ratio is identical in both themes. */
export type IssuerTile = {
  /** e.g. "bg-[#8C1515]". White and white/80 sit on it; both clear 4.5:1. */
  tile: string;
  wordmark: string;
  /** Font FAMILY only — never a weight, size, tracking or leading class. The
   *  wordmark renders on `t-h2` in the hero, and t-h2 bakes its own weight and
   *  tracking (globals.css), so a `font-<weight>` here would violate the one
   *  `t-*`-per-element rule. Only Stanford sets it. */
  wordmarkFamily?: "font-serif";
  /** Second line, rendered uppercase: "Skills" / "XEE100". */
  code: string;
};

/** Completed coursework the issuer records at the COURSE level only.
 *
 *  Structurally a peer of SpecializationData so CredentialRow renders it with
 *  the same geometry — and structurally excluded from every aggregation
 *  (see the COURSEWORK contract comment below). Note what this type CANNOT
 *  express: no `image` (there is no such artifact) and no `parentBadge` /
 *  `badgeHalo` / `badgeShadow` (the path earned no path-level badge). That
 *  inability is the honesty mechanism; it is not carried by any sentence on
 *  the page. */
export type LearningPathData = {
  id: string;
  headingId: string;
  testId: string;
  /** [name, unit-count line] — the same shape and slot as a specialization's
   *  ["Google AI Professional", "7-Course Journey"]. */
  titleLines: [string, string];
  issuer: string;
  /** Short form used in the link accessible names. */
  issuerShort: string;
  date: string;
  /** A FOURTH meta segment, appended after titleLines[1]. Set on exactly one
   *  card (data.test.ts): Google Cloud's own “Train for the exam” framing for
   *  path 1951, so the exam-prep fact is present in the COLLAPSED row and not
   *  only inside the panel. Not a disclaimer — Google's own words, positive. */
  metaSuffix?: string;
  /** The issuer's public path / syllabus page. NOT a verification URL, and
   *  never routed through openVerifyUrl()/openBadgeUrl(). */
  url: string;
  /** Visible label of that control: "Path page" | "Course page". */
  urlLabel: "Path page" | "Course page";
  /** Lowercase noun for the hero pill and the issuer-row link. */
  urlNoun: "path" | "course";
  /** Existing /public asset for the panel's issuer row, or absent (→ a neutral
   *  BookOpen glyph). No logo file is ever downloaded to fill it. */
  logo?: string;
  tile: IssuerTile;
  /** The issuer's own words. Exactly three arms are permitted, and the comment
   *  at each use site says which one it is and what was dropped:
   *
   *  1. VERBATIM, or a contiguous trim of the issuer's description — paths 118,
   *     3546 and 4020. The only edit allowed is straight → typographic quotes
   *     (" → “ ”, ' → ’), matching the rest of the site's copy; no word,
   *     punctuation mark or order ever changes.
   *  2. A SELECTION of the issuer's own sentences, each one verbatim and
   *     unedited but not adjacent in the source — path 1951 only. Whenever this
   *     arm is used, the use-site comment must name the dropped sentences and
   *     why, because the joined text is a sequence the issuer never wrote.
   *  3. An ATTRIBUTED SUMMARY, where the issuer publishes no quotable single
   *     paragraph — `ce-stanford-xee100` only. Stanford's course page is a
   *     spec sheet (title, faculty list, a bulleted module list), so this arm
   *     writes the connective prose HERE and quotes Stanford inline for the one
   *     claim that is theirs. Every fact in it must be checkable on the linked
   *     page; nothing may be asserted that the issuer does not state.
   *
   *  What is never allowed under any arm: a claim the issuer does not make, a
   *  paraphrase presented as a quotation, or marketing copy written here. */
  description: string;
  /** Optional attributed citation of the issuer's own title for this path when
   *  it differs from the heading. Keeps the official string ATS-searchable as a
   *  CITATION rather than as a claim. */
  officialTitleNote?: string;
  totalCourses: number;
  /** The issuer's noun for a unit — drives the row chip and the counter. */
  unitNoun: "Courses" | "Modules";
  gradient: string;
  coursesLayout: "list" | "badges";
  courses: readonly PathCourse[];
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
];

// --- LEDGER GROUPS ---

/** The two kinds the credential LEDGER may contain. */
export type LedgerCredential =
  | ({ kind: "specialization" } & SpecializationData)
  | ({ kind: "single" } & GalleryCertificate);

/** A completed learning path or short course. Its `kind` has no arm in
 *  LedgerCredential, which is why putting one into CREDENTIAL_GROUPS below is a
 *  COMPILE ERROR rather than something a reviewer has to catch. */
export type PathCredential = { kind: "path" } & LearningPathData;

/** Any row CredentialRow can render. */
export type Credential = LedgerCredential | PathCredential;

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
  /** Overrides the derived "{n} credentials · all verified" line. REQUIRED for
   *  any group whose rows are not credentials — the derived line would be a
   *  false claim. See COURSEWORK_GROUPS. */
  countLabel?: string;
  credentials: Credential[];
};

/** The four counted groups. Narrowed to LedgerCredential on purpose. */
export type LedgerGroupDef = Omit<CredentialGroupDef, "credentials"> & {
  credentials: LedgerCredential[];
};

/** A coursework group: paths only, and `countLabel` is mandatory. */
export type CourseworkGroupDef = Omit<CredentialGroupDef, "credentials" | "countLabel"> & {
  countLabel: string;
  credentials: PathCredential[];
};

function bySpecId(id: string): LedgerCredential {
  const s = SPECIALIZATIONS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown specialization id: ${id}`);
  return { kind: "specialization", ...s };
}

function byCertId(id: string): LedgerCredential {
  const c = [...AI_CERTIFICATES, ...GENERAL_CERTIFICATES].find((x) => x.id === id);
  if (!c) throw new Error(`Unknown certificate id: ${id}`);
  return { kind: "single", ...c };
}

/** Deep-link/anchor id for a row. Specializations and paths already carry
 *  globally-unique ids; only the gallery singles need the `cert-` namespace. */
export function credentialSlug(credential: Credential): string {
  return credential.kind === "single" ? `cert-${credential.id}` : credential.id;
}

// Skill-domain groups mirroring CertCategory in src/data/portfolio.ts
// (ai / testing / leadership) plus a page-local engineering bucket for the dev
// certs that never belonged in a skills summary.
//
// This ledger is the COMPLETE record; `certifications` in portfolio.ts is a
// curated SUBSET of it, feeding the Experience summary card and the JSON-LD
// Person schema. A row here with no portfolio.ts twin is deliberate curation,
// not drift — currently g-4 / g-8 / g-3 (engineering foundations) and g-9
// (short leadership coursework whose stronger sibling is already listed).
// Verify against portfolio.ts before "fixing" an apparent gap.
// (g-10 "Nano Tips to Stop Overthinking" and g-11 "Learning Python Generators"
// were retired at the owner's request on 2026-09-11 and are gone from the file,
// not merely unlisted here; neither ever had a portfolio.ts twin.)
//
// Specializations come before singles within a group; singles by date desc.
export const CREDENTIAL_GROUPS: LedgerGroupDef[] = [
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
    credentials: [byCertId("g-4"), byCertId("g-8"), byCertId("g-3")],
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
  // Every certificate that certifies ONE course. A specialization contributes
  // its per-course credentials (7 + 7 + 4 + 5 = 23); a standalone certificate
  // IS a single course certificate and contributes itself (11). Total 34.
  //
  // It counted only the specialization children until 2026-09-12, which made
  // the figure mean two different things at once: it took the trouble to look
  // inside the four multi-course programmes while ignoring eleven certificates
  // that are course certificates in their own right. A reader comparing it
  // against "15 Credentials" could not reconcile the two, because 23 was
  // neither a subset of the 15 nor a total of anything.
  courseCertificates:
    SPECIALIZATIONS.reduce((n, s) => n + s.children.length, 0) + ALL_SINGLES.length,
  specializations: SPECIALIZATIONS.length,
  yearsSpan: `${Math.min(...ALL_YEARS)} – ${Math.max(...ALL_YEARS)}`,
};


// --- COURSEWORK (COMPLETED LEARNING PATHS AND SHORT COURSES) -----------------
//
// These render through the SAME CredentialRow / CredentialGroup / CollapsePanel
// / ChildBadgesGrid template as the ledger above — same numeral, same card,
// same chips, same chevron, same disclosure panel — a single full-width column
// since the issuer slab was removed (see PathBody). They are NOT credentials,
// and the honesty is carried STRUCTURALLY, never by a sentence on the page:
//   • LearningPathData has no `image` and no `parentBadge`/`badgeHalo`/
//     `badgeShadow`. The type CANNOT express a path-level award, which is why
//     the header visual is a typeset issuer tile and the panel's counter slot
//     holds a number. Verification lives on a COURSE, never on a path.
//   • PathCredential's `kind` is "path", which LedgerCredential has no arm for,
//     so a path inside CREDENTIAL_GROUPS is a COMPILE ERROR.
//   • Never in SPECIALIZATIONS / AI_CERTIFICATES / GENERAL_CERTIFICATES, so it
//     cannot reach ALL_SINGLES, ALL_YEARS or CERT_STATS.credentials (15).
//   • Never in `certifications` in src/data/portfolio.ts, so
//     certificationsSchema() emits no EducationalOccupationalCredential and the
//     Experience page's `certs` card never lists these. No "@type":"Course".
//   • COURSEWORK_GROUPS ids deliberately do NOT start with "group-", and path
//     rows' headingIds deliberately do NOT start with
//     "specialization-path-heading". Those are the two structural selectors
//     tests/e2e/certifications.spec.ts counts at exactly 4 each. That file is
//     edited ONLY under an explicit instruction: on 2026-09-11 exactly one
//     CREDENTIAL_TITLES entry (g-10, "Nano Tips to Stop Overthinking with
//     Shadé Zahrai") was removed with the credential itself, and nothing else.
//   • Each coursework group prints its own computed `countLabel`. Nothing here
//     prints "credential", "all verified" or "certified".
// A course badge IS real and publicly verifiable (Google Skills and Credly badge
// pages return 200 logged-out — verified 2026-09-10/11), so verification
// vocabulary is legitimate for a BADGE and is used nowhere else. Badge links
// never route through openVerifyUrl()/openBadgeUrl(); see verify.ts.
// src/app/certifications/data.test.ts asserts every line of this.

/** The two coursework sections are deliberately UNCOLOURED. Violet / blue /
 *  amber / sky belong to the four counted groups, and every other hue on this
 *  page is already reserved by meaning (emerald = verification, blue-700/400 =
 *  Verify + Official Badge, violet = courses, amber = skills). "No category
 *  hue" is the structural signal that this is a different register, and it
 *  spends no words on a disclaimer. Every value carries its own dark: partner,
 *  so eyebrowTone() in CredentialGroup (which maps only the four 300-weight
 *  tokens) leaves this pair unchanged.
 *  Measured: eyebrow ink/70 6.41:1 light / ink/60 7.31:1 dark on the page
 *  ground; icon tile ink/70 on bg-ink/[0.05] 6.12:1 light / ink/60 7.09:1 dark. */
const COURSEWORK_ACCENT: GroupAccent = {
  eyebrow: "text-ink/70 dark:text-ink/60",
  iconTile: "border-line/15 bg-ink/[0.05] text-ink/70 dark:text-ink/60",
  hairline: "from-ink/25 via-ink/10",
  hoverBorder: "hover:border-line/25",
  openRing:
    "data-[open=true]:border-line/25 data-[open=true]:shadow-[0_0_30px_-12px_rgba(113,113,122,0.45)]",
  disclosureOpen: "border-line/25 bg-ink/[0.08]",
};

/** Google Blue 900 (#174EA6, Google's own Material palette) as a GROUND:
 *  white 7.85:1, white/80 5.65:1 — identical in both themes. NOT #4285F4 /
 *  #1A73E8 / #1967D2 (white measures 3.56 / 4.51 / 5.2:1 there and white/80
 *  fails AA). Never used as TEXT: 2.5:1 on #09090b. Do not "brighten" it. */
const GOOGLE_SKILLS_TILE: IssuerTile = {
  tile: "bg-[#174EA6]",
  wordmark: "Google",
  code: "Skills",
};

/** Cardinal #8C1515 as a GROUND: white 9.40:1, white/80 6.44:1, identical in
 *  both themes. As TEXT it would be 2.1:1 on #09090b — it is never text. The
 *  site's one serif wordmark; `font-serif` is a FAMILY, never a weight. */
const STANFORD_TILE: IssuerTile = {
  tile: "bg-[#8C1515]",
  wordmark: "Stanford",
  wordmarkFamily: "font-serif",
  code: "XEE100",
};

const GOOGLE_SKILLS_PROFILE =
  "https://www.skills.google/public_profiles/aece174b-451d-4d6f-928d-6def28946025";

function gsBadge(
  id: number,
  image: string,
  kind: CourseBadge["kind"] = "completion",
): CourseBadge {
  return {
    url: `${GOOGLE_SKILLS_PROFILE}/badges/${id}`,
    image: `/badges/google-skills/${image}.webp`,
    kind,
    provider: "Google Skills",
  };
}

/** The Credly copy of a lab-based skill badge. Its public_url page returns 200
 *  logged-out (verified 2026-09-11/12) and names both the issuer (Google Cloud)
 *  and the earner, which is why all three skill badges link here rather than at
 *  their Google Skills twins — the convention `skill_badge_rule` records in
 *  scratchpad/google-skills-paths.json.
 *
 *  PROVENANCE. These are the only badges whose `url` is the Credly copy rather
 *  than a Google Skills page. Nothing is invented: each UUID below appears
 *  verbatim in that same file, and each has a Google Skills twin recorded
 *  there — 27852046 for "Prompt Design in Agent Platform" (path 118), 27848848
 *  for "Create Your First Gemini Enterprise Application" (paths 3546 / 4020)
 *  and 27888420 for "Deploy Multi-Agent Architectures" (path 3802). The Credly
 *  copy is the one linked because its page names the issuer AND the earner, and
 *  because it is the art the owner asked to be displayed. data.test.ts pins all
 *  three Credly URLs exactly (CREDLY_BADGE_URLS); the twin ids are recorded
 *  here and at each call site. */
function credlyBadge(uuid: string, image: string): CourseBadge {
  return {
    url: `https://www.credly.com/badges/${uuid}/public_url`,
    image: `/badges/${image}.webp`,
    kind: "skill",
    provider: "Credly",
  };
}

// Google issues one badge per COURSE, not per path, so a course that appears in
// two paths is ONE const referenced twice — same id, same art, same kind, same
// provider. `step` differs per path, so it is spread in at the use site.
const INTRO_GENERATIVE_AI = {
  title: "Introduction to Generative AI",
  badge: gsBadge(4643942, "intro-generative-ai"),
} as const;
const INTRO_LARGE_LANGUAGE_MODELS = {
  title: "Introduction to Large Language Models",
  badge: gsBadge(27848454, "intro-large-language-models"),
} as const;
const AGENT_FUNDAMENTALS = {
  title: "Agent Fundamentals",
  badge: gsBadge(27848674, "agent-fundamentals"),
} as const;
const ENTERPRISE_AGENTS = {
  title: "Enterprise Agents and Use Cases",
  badge: gsBadge(27848742, "enterprise-agents-and-use-cases"),
} as const;
/** Lab-based skill badge → exists on both platforms; the Credly copy is linked
 *  (Google Skills badge 27848848 is its twin). Both platforms name it the same
 *  way — verified against Credly's og:title — so nothing about the destination
 *  needs recording here. */
const FIRST_GEMINI_ENTERPRISE_APP = {
  title: "Create Your First Gemini Enterprise Application",
  badge: credlyBadge(
    "fc080ecb-a01b-4ca4-a99f-4f008a846da9",
    "create-your-first-gemini-enterprise-application",
  ),
} as const;

/** THIS ARRAY'S ORDER IS THE DISPLAY ORDER, and it is the OWNER'S CHOICE, dated
 *  2026-09-11: Generative AI Leader (1951) · SMB Learning Path (4020) · Build
 *  High-Performance Multi-Agent Systems (4459) · Deploy Production Ready Agents
 *  (3802) · Introduction to Agents (3546) · Beginner: Introduction to
 *  Generative AI (118). Stanford follows alone in CONTINUING_EDUCATION, so the
 *  coursework ledger numerals run 01–06 here and 07 there.
 *
 *  IT IS CURATED, NOT DERIVED. Every earlier revision of this file sorted these
 *  cards newest-first and said so; that rule is GONE, not merely overridden.
 *  Nothing sorts at runtime, no `date` field is read for ordering, and a newly
 *  completed path does NOT go first — where it lands is the owner's call. Path
 *  3802 is the proof: it was completed LAST of the six and sits FOURTH.
 *  `display_order_path_ids` / `display_order_rule` in
 *  scratchpad/google-skills-paths.json record the same order and the same rule;
 *  data.test.ts pins it as EXPECTED_ORDER. */
export const LEARNING_PATHS: readonly LearningPathData[] = [
  {
    // The heading is EXACTLY the role name — no suffix, no appended qualifier,
    // no chip. Google Cloud's certification page lists this path under Quick
    // links as "Train for the exam" (target cloudskillsboost.google/paths/1951
    // = skills.google/paths/1951); that phrase is the card's `metaSuffix`, so
    // the exam-prep framing is present in the COLLAPSED row. Google's official
    // path title survives verbatim, quoted and attributed, in
    // `officialTitleNote` — a citation, not a claim — which is what keeps it
    // ATS-searchable. The word "certified" appears nowhere, and nothing states
    // what Google does not issue.
    id: "ce-google-skills-gen-ai-leader-1951",
    headingId: "ce-google-skills-gen-ai-leader-1951-heading",
    testId: "coursework-courses-gen-ai-leader",
    titleLines: ["Generative AI Leader", "5-Course Path"],
    issuer: "Google Skills",
    issuerShort: "Google Skills",
    date: "Sep 2026",
    metaSuffix: "“Train for the exam”",
    url: "https://www.skills.google/paths/1951",
    urlLabel: "Path page",
    urlNoun: "path",
    logo: "/logos/google.png",
    tile: GOOGLE_SKILLS_TILE,
    // `description` arm 2 — a SELECTION of Google's own sentences, not a
    // contiguous trim. Google's description runs six sentences; this prints #1
    // and #4, each verbatim and unedited, and drops #2, #3, #5 and #6:
    //   #2 "This certification learning path provides the foundational
    //      knowledge, preparing you to successfully leverage generative AI for
    //      organizational transformation." — dropped because it calls the path
    //      a "certification learning path"; reprinting that on a résumé page
    //      is the exact overclaim this section exists to avoid.
    //   #3 "Through a curated collection of on-demand courses, you will gain
    //      practical experience with Google Cloud's generative AI tools." and
    //   #5 "Upon completion, you will be equipped with the skills to apply
    //      generative AI for business transformation and innovation." —
    //      second-person marketing copy about what a reader will get.
    //   #6 the "prepare for the … certification exam" CTA.
    // Nothing is reworded and no sentence is spliced; the join is #1 + #4.
    // Google's full description is in scratchpad/google-skills-paths.json.
    description:
      "A Generative AI Leader articulates the capabilities of generative AI and understands how it can benefit an organization. This path focuses on the essential skills for the Generative AI Leader role, from understanding the fundamentals of generative AI to applying it for business innovation using tools like Gemini Advanced, Gemini Notebook, and Google AI Studio.",
    officialTitleNote:
      "Listed by Google as “Generative AI Leader Certification”, the “Train for the exam” path for the Google Cloud Generative AI Leader certification.",
    totalCourses: 5,
    unitNoun: "Courses",
    gradient: "from-violet-600/20 via-indigo-500/12 to-blue-600/20",
    coursesLayout: "badges",
    courses: [
      { step: 1, title: "Gen AI: Beyond the Chatbot", badge: gsBadge(27812324, "gen-ai-beyond-the-chatbot") },
      { step: 2, title: "Gen AI: Unlock Foundational Concepts", badge: gsBadge(27814445, "gen-ai-unlock-foundational-concepts") },
      { step: 3, title: "Gen AI: Navigate the Landscape", badge: gsBadge(27825264, "gen-ai-navigate-the-landscape") },
      { step: 4, title: "Gen AI Apps: Transform Your Work", badge: gsBadge(27846258, "gen-ai-apps-transform-your-work") },
      { step: 5, title: "Gen AI Agents: Transform Your Organization", badge: gsBadge(27847477, "gen-ai-agents-transform-your-organization") },
    ],
  },
  {
    id: "ce-google-skills-smb-4020",
    headingId: "ce-google-skills-smb-4020-heading",
    testId: "coursework-courses-smb",
    titleLines: ["SMB Learning Path", "13-Course Path"],
    issuer: "Google Skills",
    issuerShort: "Google Skills",
    date: "Sep 2026",
    url: "https://www.skills.google/paths/4020",
    urlLabel: "Path page",
    urlNoun: "path",
    logo: "/logos/google.png",
    tile: GOOGLE_SKILLS_TILE,
    // `description` arm 1 — Google's own first sentence, verbatim; its
    // GEAR-registration CTA is dropped. Keep Google's capitalisation of
    // "Small/Medium-sized Businesses (SMBs)".
    description:
      "This path was curated for Small/Medium-sized Businesses (SMBs) and focuses on scaling business operations by combining introductory Generative AI technical foundations with Gemini-led automation and the GEAR framework for custom agent development.",
    totalCourses: 13,
    unitNoun: "Courses",
    gradient: "from-sky-600/20 via-blue-500/12 to-violet-600/20",
    coursesLayout: "badges",
    courses: [
      { step: 1, ...INTRO_GENERATIVE_AI },
      { step: 2, ...INTRO_LARGE_LANGUAGE_MODELS },
      { step: 3, title: "Introduction to AI Agents", badge: gsBadge(27848206, "intro-ai-agents") },
      { step: 4, ...AGENT_FUNDAMENTALS },
      { step: 5, ...ENTERPRISE_AGENTS },
      { step: 6, ...FIRST_GEMINI_ENTERPRISE_APP },
      { step: 7, title: "Google Workspace with Gemini: Foundations of Your AI Workflow", badge: gsBadge(27848970, "google-workspace-with-gemini-foundations") },
      { step: 8, title: "Gemini in Gmail", badge: gsBadge(27849041, "gemini-in-gmail") },
      { step: 9, title: "Gemini in Google Sheets", badge: gsBadge(27849084, "gemini-in-google-sheets") },
      { step: 10, title: "AI Boost Bites: TL;DR with Gemini in Docs & Drive", badge: gsBadge(27849118, "ai-boost-bites-tldr-gemini-docs-drive") },
      { step: 11, title: "AI Boost Bites: Gemini Gems – Your ultimate marketing sidekick", badge: gsBadge(27849147, "ai-boost-bites-gemini-gems") },
      { step: 12, title: "AI Boost Bites: Content Generation with Gemini Made Easy", badge: gsBadge(27849164, "ai-boost-bites-content-generation") },
      { step: 13, title: "Gemini in Google Vids", badge: gsBadge(27849255, "gemini-in-google-vids") },
    ],
  },
  {
    id: "ce-google-skills-multi-agent-4459",
    headingId: "ce-google-skills-multi-agent-4459-heading",
    testId: "coursework-courses-multi-agent",
    titleLines: ["Build High-Performance Multi-Agent Systems", "3-Course Path"],
    issuer: "Google Skills",
    issuerShort: "Google Skills",
    date: "Sep 2026",
    url: "https://www.skills.google/paths/4459",
    urlLabel: "Path page",
    urlNoun: "path",
    logo: "/logos/google.png",
    tile: GOOGLE_SKILLS_TILE,
    // `description` arm 1 — Google's own path description, verbatim and
    // complete. It contains no straight quote or apostrophe, so not even the
    // typographic edit applies here.
    description:
      "Go from single-prompt design to orchestrating end-to-end, multi-agent systems. Learn to coordinate agents in Agent Development Kit (ADK), connect to external tools with MCP, and automate workflows using the Agent-to-Agent (A2A) protocol. This path teaches you to design workflow-based routing and deploy your solutions via Agent Runtime.",
    // THREE courses, not the six activities Google's path page counts. Two are
    // the "Welcome:" / "Wrap Up:" bookends, which are never courses. The third
    // exclusion is "Build Multi-Agent Systems with ADK" (/focuses/125061), a
    // hands-on lab Google issues no badge for anywhere: DELIBERATELY not listed
    // (owner, 2026-09-12) — a badge-less lab shows nothing that was achieved,
    // and labs are embedded inside many of the courses on this page without
    // ever being surfaced, so listing one standalone lab was inconsistent. Same
    // reasoning as those embedded labs; not a scraping gap.
    // scratchpad/google-skills-paths.json records the same split
    // (`activities: 6`, `site_course_count: 3`, `lab_course_rule`).
    totalCourses: 3,
    unitNoun: "Courses",
    gradient: "from-cyan-600/20 via-teal-500/12 to-blue-600/20",
    coursesLayout: "badges",
    courses: [
      {
        step: 1,
        title: "Build Collaborative Multi-Agent Systems with ADK & MCP",
        badge: gsBadge(27855015, "build-collaborative-multi-agent-systems-adk-mcp"),
      },
      {
        step: 2,
        title: "Build Agent Skills with Google",
        badge: gsBadge(27885513, "build-agent-skills-with-google"),
      },
      {
        step: 3,
        title: "Use Agent Skills with Multi-Agent Systems",
        // "skill", not the gsBadge() default: the artwork reads "SKILL BADGE ·
        // INTERMEDIATE" over the four-colour bar, and Google's raw PNG is
        // 1000x666 — the landscape skill-badge template, the same one 27848848
        // (1000x667) and 27852046 (1000x666) use — where every completion badge
        // in this file is the 1000x908/909 portrait template. It has no Credly
        // twin, so it stays `provider: "Google Skills"`; `kind` and `provider`
        // are independent (see CourseBadge).
        badge: gsBadge(27886491, "use-agent-skills-with-multi-agent-systems", "skill"),
      },
    ],
  },
  {
    // FOURTH by the owner's choice, not by date: this path was completed LAST
    // of the six (2026-09-12) and sits here. It is the clearest case against
    // ever re-deriving the section's order from a completion date — see the
    // comment on LEARNING_PATHS.
    id: "ce-google-skills-deploy-agents-3802",
    headingId: "ce-google-skills-deploy-agents-3802-heading",
    testId: "coursework-courses-deploy-agents",
    titleLines: ["Deploy Production Ready Agents", "3-Course Path"],
    issuer: "Google Skills",
    issuerShort: "Google Skills",
    date: "Sep 2026",
    url: "https://www.skills.google/paths/3802",
    urlLabel: "Path page",
    urlNoun: "path",
    logo: "/logos/google.png",
    tile: GOOGLE_SKILLS_TILE,
    // `description` arm 1 — Google's own path description, verbatim and
    // complete. It contains no straight quote or apostrophe, so not even the
    // typographic edit applies here.
    description:
      "Connect and operationalize agents across enterprise ecosystems. Learn to manage the entire agent lifecycle, deploy ADK agents to scalable environments like Vertex AI Agent Engine and Cloud Run, and enable enterprise connectivity using the Model Context Protocol (MCP) and Agent2Agent (A2A) Protocol.",
    // THREE courses, not the five activities Google's path page counts: the
    // first and last are the "Welcome:" / "Wrap Up:" bookends, which are never
    // courses. scratchpad/google-skills-paths.json records the same split
    // (`activities: 5`, `site_course_count: 3`).
    totalCourses: 3,
    unitNoun: "Courses",
    // Same blue→cyan family as the other Google cards, so the open row's wash
    // stays inside the range PathBody's date line was measured against
    // (ink/70 ≥ 6.2:1 light, ink/60 ≥ 6.9:1 dark).
    gradient: "from-blue-700/20 via-cyan-500/12 to-teal-600/20",
    coursesLayout: "badges",
    courses: [
      {
        step: 1,
        title: "Build and Deploy Agents in Production",
        badge: gsBadge(27888328, "build-and-deploy-agents-in-production"),
      },
      {
        step: 2,
        title: "Deploy Your First Agent",
        badge: gsBadge(27888392, "deploy-your-first-agent"),
      },
      {
        // A challenge lab, so it earns a lab-based Credly SKILL badge from
        // Google Cloud (issued 2026-09-12; public page verified logged-out) and
        // the tile glows like the other two — the convention is `provider`,
        // never the course's name or its position. Google Skills also issued
        // completion badge 27888420 for the same course; the Credly copy is
        // linked because it names the issuer AND the earner.
        // Credly titles it exactly as Google names the course, so there is
        // nothing about the destination to note.
        step: 3,
        title: "Deploy Multi-Agent Architectures",
        badge: credlyBadge(
          "97b82f44-68ec-4c85-8847-4c488e076a9a",
          "deploy-multi-agent-architectures",
        ),
      },
    ],
  },
  {
    id: "ce-google-skills-agents-3546",
    headingId: "ce-google-skills-agents-3546-heading",
    testId: "coursework-courses-agents",
    titleLines: [
      "Introduction to Agents and Google’s Agent Ecosystem",
      "3-Course Path",
    ],
    issuer: "Google Skills",
    issuerShort: "Google Skills",
    date: "Sep 2026",
    url: "https://www.skills.google/paths/3546",
    urlLabel: "Path page",
    urlNoun: "path",
    logo: "/logos/google.png",
    tile: GOOGLE_SKILLS_TILE,
    // `description` arm 1 — Google's own sentences 1–2, a contiguous prefix.
    // The ONE edit is typographic: Google's source writes 'the essentials of
    // "what is an agent,"' with straight quotes (U+0022); the site renders the
    // same words with “ ” like every other quotation on it. No word or mark of
    // punctuation is otherwise changed. Its trailing call to action — "Explore other paths in the Gemini Enterprise
    // Agent Ready (GEAR) series" — is dropped rather than restated: a
    // declarative rewrite ("Part of the … series") would be prose AUTHORED here,
    // which this field forbids, and Google's literal CTA is not a claim about
    // this résumé. The series name Google records for the path lives in
    // scratchpad/google-skills-paths.json (`series`) and reaches the page only
    // where Google itself writes it into a description (path 4020, below).
    description:
      "Gain a foundational understanding of AI agents, from their core architecture to their real-world business impact. Cover the essentials of “what is an agent,” understand Google Cloud's unified stack for agent development, and gain practical experience by creating your first Gemini Enterprise application to earn a skill badge.",
    // THREE courses, not the five activities Google's path page counts. The
    // first and last of those five are the "Welcome:" and "Wrap Up:" bookends,
    // which are never courses (see PathCourse) — they taught nothing, earned no
    // badge, and counting them would inflate the chip, the meta line and the
    // panel's badge counter alike. scratchpad/google-skills-paths.json records
    // the same split: `activities: 5`, `site_course_count: 3`.
    totalCourses: 3,
    unitNoun: "Courses",
    gradient: "from-indigo-600/20 via-blue-500/12 to-cyan-600/20",
    coursesLayout: "badges",
    courses: [
      { step: 1, ...AGENT_FUNDAMENTALS },
      { step: 2, ...ENTERPRISE_AGENTS },
      { step: 3, ...FIRST_GEMINI_ENTERPRISE_APP },
    ],
  },
  {
    id: "ce-google-skills-beginner-gen-ai-118",
    headingId: "ce-google-skills-beginner-gen-ai-118-heading",
    testId: "coursework-courses-beginner-gen-ai",
    titleLines: ["Beginner: Introduction to Generative AI", "4-Course Path"],
    issuer: "Google Skills",
    issuerShort: "Google Skills",
    date: "Sep 2026",
    url: "https://www.skills.google/paths/118",
    urlLabel: "Path page",
    urlNoun: "path",
    logo: "/logos/google.png",
    tile: GOOGLE_SKILLS_TILE,
    // `description` arm 1 — Google's own path description, verbatim and
    // complete (it is a single sentence; nothing is trimmed).
    description:
      "This learning path provides an overview of generative AI concepts, from the fundamentals of large language models to responsible AI principles.",
    totalCourses: 4,
    unitNoun: "Courses",
    gradient: "from-blue-600/20 via-sky-500/12 to-indigo-600/20",
    coursesLayout: "badges",
    courses: [
      { step: 1, ...INTRO_GENERATIVE_AI },
      { step: 2, ...INTRO_LARGE_LANGUAGE_MODELS },
      {
        step: 3,
        // TWO PLATFORMS, TWO NAMES — and the tile deliberately shows GOOGLE'S.
        // Google lists this course inside path 118 as "Prompt Design in Agent
        // Platform"; Credly issues the same skill badge as "Prompt Design in
        // Vertex AI Skill Badge" (hence the image filename, and the wording
        // printed on the artwork itself). The tile used to append Credly's name
        // in brackets after the course title; the owner removed that
        // parenthetical on 2026-09-11, so only the title below renders.
        //
        // DO NOT "fix" the title to match Credly. Renaming it would make the
        // card disagree with the Google path page it sits inside, which is the
        // issuer of the course. The destination is still communicated three
        // ways without any extra words: the Credly artwork (which reads "Prompt
        // Design in Vertex AI"), the amber skill-badge glow, and the "Verify in
        // Credly" pill. Credly's exact og:title is recorded in
        // scratchpad/google-skills-paths.json; Google Skills badge 27852046 is
        // the twin of the Credly copy linked here.
        title: "Prompt Design in Agent Platform",
        badge: credlyBadge(
          "328f785b-dc1b-4f73-9ed2-d9a8eb7c8e71",
          "prompt-design-in-vertex-ai",
        ),
      },
      {
        step: 4,
        title: "Responsible AI: Applying AI Principles with Google Cloud",
        badge: gsBadge(27852150, "responsible-ai-applying-ai-principles"),
      },
    ],
  },
];

export const CONTINUING_EDUCATION: readonly LearningPathData[] = [
  {
    id: "ce-stanford-xee100",
    headingId: "ce-stanford-xee100-heading",
    testId: "coursework-courses-stanford",
    titleLines: ["Introduction to Internet of Things", "5-Module Course"],
    issuer: "Stanford School of Engineering",
    issuerShort: "Stanford",
    date: "2026",
    url: "https://online.stanford.edu/courses/xee100-introduction-internet-things",
    urlLabel: "Course page",
    urlNoun: "course",
    // No `logo`: no Stanford asset exists in /public, none is downloaded and no
    // lockup is reconstructed. The panel's issuer row falls back to a neutral
    // BookOpen glyph; the cardinal XEE100 tile is the card's real mark.
    tile: STANFORD_TILE,
    // `description` arm 3 — an ATTRIBUTED SUMMARY, the only one on this page.
    // Stanford publishes no quotable paragraph for XEE100: the course page is a
    // spec sheet (title, school, faculty list, a bulleted "5 modules" list), so
    // arms 1 and 2 have nothing to trim. The connective prose is therefore
    // written here, and every fact in it is on that page — "Stanford School of
    // Engineering", the five module names (Cool Applications, Sensors, Embedded
    // Systems, Networking, Circuits) and the short-course framing.
    // "six Stanford faculty members will deliver an overview" is Stanford's OWN
    // wording, so it stays QUOTED AND ATTRIBUTED: their teaching team lists
    // Beth Pruitt at UC Santa Barbara, and writing the claim unattributed would
    // overstate it.
    description:
      "A Stanford School of Engineering short course. In Stanford's words, “six Stanford faculty members will deliver an overview” of the Internet of Things, across five modules spanning applications, sensors, embedded systems, networking and circuits.",
    totalCourses: 5,
    unitNoun: "Modules",
    gradient: "from-red-700/20 via-rose-600/12 to-amber-600/20",
    coursesLayout: "list",
    courses: [
      { step: 1, title: "Cool Applications" },
      { step: 2, title: "Sensors" },
      { step: 3, title: "Embedded Systems" },
      { step: 4, title: "Networking" },
      { step: 5, title: "Circuits" },
    ],
  },
];

const asPath = (p: LearningPathData): PathCredential => ({ kind: "path", ...p });

/** DISTINCT badge PAGES, not badge references. Across the six Google paths
 *  there are 31 references but only 26 distinct badges — Google reuses five
 *  courses between paths. Printing 31 would overstate the awards held, which is
 *  the exact class of overclaim this rebuild exists to prevent. The 31
 *  references are exactly the 31 course entries: every listed course carries a
 *  badge, so the chip's count and the reference count cannot disagree. Computed
 *  with a Set so it cannot drift; every number is asserted in data.test.ts. */
const distinctBadges = (paths: readonly LearningPathData[]) =>
  new Set(
    paths.flatMap((p) => p.courses.flatMap((c) => (c.badge ? [c.badge.url] : []))),
  ).size;
const totalUnits = (paths: readonly LearningPathData[]) =>
  paths.reduce((n, p) => n + p.totalCourses, 0);
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Rendered AFTER the ledger, by CredentialLedger. Deliberately NOT part of
 *  CREDENTIAL_GROUPS (which the type system now forbids), ids deliberately not
 *  "group-*", and `countLabel` never says "credential", "all verified" or
 *  "certified". */
export const COURSEWORK_GROUPS: CourseworkGroupDef[] = [
  {
    id: "google-skills",
    eyebrow: "Completed Learning Paths",
    title: "Google Skills",
    icon: GraduationCap,
    accent: COURSEWORK_ACCENT,
    countLabel: `${plural(LEARNING_PATHS.length, "learning path", "learning paths")} · ${plural(
      distinctBadges(LEARNING_PATHS),
      "course badge",
      "course badges",
    )}`,
    credentials: LEARNING_PATHS.map(asPath),
  },
  {
    id: "continuing-education",
    eyebrow: "Stanford School of Engineering",
    title: "Continuing Education",
    icon: BookOpen,
    accent: COURSEWORK_ACCENT,
    countLabel: `${plural(CONTINUING_EDUCATION.length, "short course", "short courses")} · ${plural(
      totalUnits(CONTINUING_EDUCATION),
      "module",
      "modules",
    )}`,
    credentials: CONTINUING_EDUCATION.map(asPath),
  },
];
