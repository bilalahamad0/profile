import {
  Terminal, ShieldCheck, Box, Activity, Cpu, Cloud, Settings, Layers,
  Code2, Database, Wrench, Smartphone, Server, Layout
} from "lucide-react";

export const experienceData = [
  {
    role: "System Architect &\nTechnical QA Lead",
    company: "Stealth Mode",
    location: "Remote / Sunnyvale, CA",
    duration: "Sep 2025 - Aug 2026",
    desc: "Led architecture and validation for a sensor-integration developer IDE, from a LiDAR/Radar bring-up platform through to a Unified Sensor Test Platform.",
    highlights: [
      "Built a LiDAR/Radar bring-up platform in Python with Docker/QEMU SIL (virtual-ECU) environments and a pre-validated ARM/ESP32 compatibility layer, cutting bring-up cycles by 70%.",
      "Defined technical strategy for the Unified Sensor Test Platform, carrying it from framework concept to production-ready release gates with containerized A/B testing and benchmarking.",
      "Ran cost-benefit and compute-capacity analysis for large sensor deployments, holding the design to Industry 4.0 safety and reliability standards.",
    ],
    file: "/logos/stealth.png",
    faang: false,
    invertLogo: false,
    isStealth: true,
  },
  {
    role: "Senior Firmware Quality Lead",
    company: "Samsara Inc",
    location: "Remote / San Francisco, CA",
    duration: "Dec 2023 - Jul 2025",
    desc: "Owned firmware quality for commercial-fleet IoT Dash Cams in an AI/ML video safety ecosystem, leading 4 engineers across direct and matrixed teams.",
    highlights: [
      "Cut the regression cycle from two weeks to five days and post-launch firmware escapes by 30% across the Dash Cam product line.",
      "Wrote Pytest automation across the Edge-to-Cloud capture-encode-upload pipeline on Embedded Linux, covering on-device AI precision, security, and network robustness (RTSP/RTP, TLS, LTE/Wi-Fi).",
      "Ran Image Quality validation for dash cam camera modules on an optical bench (exposure, low-light, distortion), tying IQ results to on-device AI algorithm precision.",
    ],
    file: "/logos/samsara.png",
    faang: false,
    invertLogo: true,
  },
  {
    role: "Senior Automation Architect",
    company: "Cruise LLC",
    location: "San Francisco, CA",
    duration: "Oct 2022 - Jun 2023",
    desc: "Charted the test-delivery roadmap for safety-critical vehicle computational systems, defining ASIL-D validation protocols with systems architects for compute-platform releases.",
    highlights: [
      "Engineered a Python framework stress-testing autonomous driving compute workloads across CPU/GPU integration, AI/ML performance, V2X and PCAP replay, reaching 75% automation coverage.",
      "Qualified CPU/GPU compute platforms and firmware releases on HIL benches against performance, reliability, safety, fault-tolerance, and redundancy benchmarks.",
    ],
    file: "/logos/cruise.png",
    faang: false,
    invertLogo: false,
  },
  {
    role: "Test Lead &\nSenior System Test Engineer",
    company: "Rivian Automotive LLC",
    location: "Palo Alto, CA",
    duration: "Jun 2021 - Sep 2022",
    desc: "Directed test strategy and system test quality ownership across R1T, R1S, and Commercial Fleet (EDV): multi-ECU handshaking, bootloader validation, and low-power/12V body control.",
    highlights: [
      "Reduced production-blocking navigation and connectivity issues by 40% before first customer ship, coordinating 3+ squads on a bi-weekly release train.",
      "Architected the Python automation framework for QNX and Android covering OTA updates, navigation, infotainment and UI/UX, running 24/7 on SIL/HIL benches through Buildkite CI.",
      "Validated OTA flows end-to-end across the production fleet: build-artifact verification, staged rollout, A/B partition rollback, secure flashing, and Out-of-Box Experience regression.",
    ],
    file: "/logos/rivian.png",
    faang: false,
    invertLogo: false,
  },
  {
    role: "Senior Product Quality Lead &\nQAE II",
    company: "Amazon Lab126",
    location: "Sunnyvale, CA",
    duration: "Jun 2018 - Jun 2021",
    desc: "Led the quality roadmap for Alexa Voice Service products (Echo Buds, Echo Auto, Dash Button) across 50+ localized SKUs, synchronizing DSP, Acoustic and Firmware teams.",
    highlights: [
      "Engineered a reusable automation library of AVS test primitives, reducing manual testing cost by $3.0M.",
      "Ran 24/7 CI/CD pipelines with firmware quality gates and live Splunk dashboards across the device test labs, cutting post-launch field issues by 30%.",
      "Extended coverage to wake-word accuracy, multi-turn dialogue, and user-perceived latency across far-field audio paths, plus ANC/Passthrough, battery lifecycle and MTBF.",
    ],
    file: "/logos/amazon.png",
    faang: true,
    invertLogo: false,
  },
  {
    role: "Senior Test Engineer",
    company: "Tech Mahindra / Google Inc",
    location: "Mountain View, CA",
    duration: "Jan 2016 - Jun 2018",
    desc: "Steered system-level validation and firmware release sign-off across Pixel 2, Pixel 3 and the Google Daydream VR ecosystem, coordinating readiness with 10+ stakeholders.",
    highlights: [
      "Designed and built a 3DOF robotic motion-stimulus fixture (Arduino, servo motors) automating motion-fidelity, IMU sensor-fusion and spatial-tracking validation, cutting manual execution hours by 80%.",
      "Developed Python suites for UART bus analysis and real-time battery profiling across charge/discharge cycling, Depth of Discharge (DoD), and hibernation states.",
      "Built VR test coverage and evaluated motion precision across multi-generation releases, closing product-readiness gaps ahead of firmware sign-off.",
    ],
    file: "/logos/google.png",
    faang: true,
    invertLogo: false,
  },
  {
    role: "Product Validation Engineer",
    company: "Cognizant Technology / Cisco",
    location: "Boston, MA",
    duration: "Sep 2015 - Jan 2016",
    desc: "Built a modular Python automation framework for high-volume Set-top-Box (STB) regression, simulating handheld remote key events against video streaming applications.",
    highlights: [
      "Cut execution cycles by 50% while increasing repeatability, expanding test scope by 40% through modular architecture and programmable actions.",
    ],
    file: "/logos/cisco.png",
    faang: false,
    invertLogo: false,
  },
  {
    role: "Radio Validation Engineer",
    company: "Wistron Mobile Solutions Corp",
    location: "Rolling Meadows, IL",
    duration: "Dec 2014 - Sep 2015",
    desc: "Led validation for Wi-Fi Alliance (WFA) compliance on BlackBerry and Android handsets, executing pre-certification and interoperability (IOT) testing.",
    highlights: [
      "Automated the WLAN and interoperability (IOT) test harnesses to standardize handset certification validation, delivering $1.3M in operational savings.",
      "Designed internal dashboards to monitor automation test activity and alert engineers to high-priority issues.",
    ],
    file: "/logos/wistron.svg",
    faang: false,
    invertLogo: true,
  },
  {
    role: "Senior Software Engineer &\nTest Automation Lead",
    company: "L&T Infotech / Motorola Mobility",
    location: "Chicago, IL",
    duration: "Oct 2009 - Dec 2014",
    desc: "Headed NPI and system validation for Moto X, Moto G and the Moto 360 smartwatch, architecting a 3-tier Bluetooth qualification framework.",
    highlights: [
      "Architected a 3-tier Bluetooth qualification framework standardizing qualification across the handset portfolio.",
      "Resolved high-priority customer defects including Bluetooth call-audio glitches and car-kit media sync failures using automation.",
      "Re-designed the System Test automation framework to scale across an expanding Android smartphone portfolio.",
    ],
    file: "/logos/motorola.png",
    faang: false,
    invertLogo: true,
  },
  {
    role: "Software Developer",
    company: "Luminous Infoways",
    location: "Bhubaneswar, India",
    duration: "Oct 2008 - Sep 2009",
    desc: "Ran functional and integration testing, defect triage, and release stabilization for government portal production deployments.",
    highlights: [
      "Delivered web application deployment modules and feature integration, and served as the client liaison on portal releases.",
    ],
    file: "/logos/luminous.png",
    faang: false,
    invertLogo: false,
  },
];

export const skills = [
  { name: "Python", icon: Code2, color: "text-blue-600 dark:text-blue-400" },
  { name: "TypeScript", icon: Code2, color: "text-blue-500" },
  { name: "React / Next.js", icon: Layout, color: "text-cyan-400" },
  { name: "Node.js", icon: Server, color: "text-green-500" },
  { name: "Tailwind CSS", icon: Layout, color: "text-sky-400" },
  { name: "Docker", icon: Box, color: "text-blue-600" },
  { name: "AWS", icon: Cloud, color: "text-orange-400" },
  { name: "Jenkins", icon: Wrench, color: "text-red-400" },
  { name: "CI / CD", icon: Activity, color: "text-emerald-500" },
  { name: "ADB & Android", icon: Smartphone, color: "text-green-400" },
  { name: "IoT/Firmware", icon: Cpu, color: "text-blue-700 dark:text-blue-300" },
  { name: "QNX / C++", icon: Settings, color: "text-zinc-700 dark:text-zinc-300" },
  { name: "Appium", icon: Smartphone, color: "text-purple-600 dark:text-purple-400" },
  { name: "Selenium", icon: Database, color: "text-emerald-600 dark:text-emerald-400" },
  { name: "Scrum", icon: Layers, color: "text-blue-500" },
  { name: "AI Copilot / Cursor", icon: ShieldCheck, color: "text-purple-400" }
];

export type CertCategory = "ai" | "testing" | "leadership";

export type Certification = {
  title: string;
  category: CertCategory;
};

// Single source of truth for the Experience-page Certifications card.
// Order = display priority within each category (most prominent / newest first).
// Mirrors the priority on /certifications so the summary card stays in sync
// whenever a new credential is added to the gallery.
// Note: "AI for App Building" is intentionally absent — it's now course #7 of
// the Google AI Professional specialization.
export const certifications: Certification[] = [
  { title: "Google AI Professional (2026)", category: "ai" },
  { title: "Google AI Essentials (2026)", category: "ai" },
  { title: "Google Prompting Essentials (2026)", category: "ai" },
  { title: "Software Testing Foundations: Integrating AI into Quality Process (2026)", category: "ai" },
  { title: "AI Coding Agents with GitHub Copilot and Cursor (2025)", category: "ai" },
  { title: "ISTQB Certified Tester Foundation Level (CTFL)", category: "testing" },
  { title: "Google Project Management Professional (2026)", category: "leadership" },
  { title: "Project Management Foundations (2023)", category: "leadership" },
  { title: "Scrum: Advanced (2021)", category: "leadership" },
  { title: "How to Master Your Executive Presence (2023)", category: "leadership" },
];

export const certs = certifications.map((c) => c.title);

export const recommendations = [
  { name: "Sai Abhishek / MBA", title: "Project Manager | PMP | Scrum Master", review: "Bilal is an extremely hardworking and dedicated worker… It was wonderful working with him in a brief stint way back in 2012, however, he has always kept in touch and has ensured that relations built stay forever. I wish him luck in all his future endeavours." },
  { name: "Nimish Choudhary", title: "Senior Manager | Lead Digital Engineer", review: "Bilal is a very intellectual person. He is born with gift of adapting to new technology quickly… he is a good person to work with. His discussion points are strong and the way he presents them is even better." },
];

export type ProjectCategory = "All" | "IoT & Automation" | "Data & Analytics" | "AI-Powered" | "Web & DevOps";

/**
 * A regional deep-dive that lives *inside* a parent project — rendered as an
 * extended sub-group beneath the parent card rather than as its own project.
 * Today: California (`/warn/ca/`) nested under the national US WARN tracker.
 */
export type SubDashboard = {
  id: string;
  region: string;
  tagline: string;
  href: string;
  demoLabel: string;
};

/**
 * One browser-marketplace listing for a project that ships as an extension —
 * rendered as the "Available On" sub-group inside the parent card, the
 * multi-store sibling of `SubDashboard`.
 *
 * Discriminated on `status` on purpose: a "live" row is guaranteed a public URL
 * and a version, while an "in-review" row is structurally forbidden from
 * claiming either — there is no public listing to link to yet.
 *
 * `store` is the short marketplace label (the row's visible text), deliberately
 * not the extension's own display name: that differs per store, so the exact
 * per-store identity lives in `listingName` and is spent on the tooltip and the
 * accessible name rather than on pixels.
 */
export type StoreListing =
  | {
      /** Browser the listing targets — accessible name + row key. */
      browser: string;
      /** Short marketplace label — the row's visible primary text. */
      store: string;
      status: "live";
      /** Canonical listing URL — where the store's own 301 resolves to. */
      url: string;
      /** Version currently published on that store. */
      version: string;
      /** Exact display name on that store (differs per store). */
      listingName: string;
    }
  | {
      browser: string;
      store: string;
      status: "in-review";
      url: null;
      version: null;
      listingName: null;
      /** Submission state — tooltip + screen-reader detail. */
      note: string;
    };

export const projectsData = [
  {
    id: "warn",
    name: "US Live Layoff Monitoring Dashboard",
    tagline: "National WARN layoff intelligence, unified from every state agency",
    description: "A national WARN layoff dataset unifying notices from 46 states and DC into one searchable feed with a free JSON API and per-state email alerts — refreshed twice daily by a GitHub Actions pipeline with ETag caching and MD5 verification, zero human intervention.",
    category: "Data & Analytics" as ProjectCategory,
    tech: ["Python", "GitHub Actions", "Plotly", "ETag Cache", "Pandas", "JSON API"],
    repo: "https://github.com/bilalahamad0/warn",
    architecture: "https://bilalahamad0.github.io/warn/architecture.html",
    demo: "https://bilalahamad0.github.io/warn/",
    demoLabel: "Live US Dashboard",
    // Extended sub-group: regional deep-dives nested under the national tracker.
    subDashboards: [
      {
        id: "warn-ca",
        region: "California",
        tagline: "EDD filings with county, industry & employer breakdowns",
        href: "https://bilalahamad0.github.io/warn/ca/",
        demoLabel: "Live CA Dashboard",
      },
    ] as SubDashboard[],
    isAI: true,
    aiTools: ["Antigravity", "Gemini 2.5 Flash/Pro", "Cursor", "Claude Sonnet 4"],
    aiContribution: 88,
    impact: "Automated 100% of data ingestion and alerting across 46 states + DC",
    gradient: "from-blue-600/20 via-blue-500/10 to-transparent",
    accent: "blue",
    relatedPosts: [
      { slug: "warn-tracker-goes-national", label: "Project Story: Going National" },
      { slug: "california-warn-story", label: "Project Story: California Build" },
    ],
    // YouTube demo + silent looping video thumbnail
    previewType: "youtube" as const,
    previewSrc: "https://www.youtube.com/embed/s5pSbdQyYM8",
    dashboardSrc: "https://bilalahamad0.github.io/warn/",
    thumbnail: "/videos/California_Live_Layoff_Monitoring_Dashboard.mp4",
    thumbnailPoster: "/videos/posters/California_Live_Layoff_Monitoring_Dashboard.jpg",
    thumbnailAlt: "US Live Layoff Monitoring Dashboard — interactive charts (California sub-dashboard shown)",
    thumbnailType: "video" as const,
  },
  {
    id: "adhan",
    name: "Smart-Home IoT Media Caster",
    tagline: "Embedded Raspberry Pi orchestration for hands-off prayer-time media",
    description: "An embedded IoT layer running on a Raspberry Pi that drives a Sony Android TV over ADB, managing media state and low-level device commands for hands-off prayer-time notifications. Built in 4 days instead of a 3-week cycle, and running at a 99% cast success rate.",
    category: "IoT & Automation" as ProjectCategory,
    tech: ["Node.js", "ADB", "Raspberry Pi", "Shell", "Android TV"],
    repo: "https://github.com/bilalahamad0/adhan-api",
    architecture: "https://bilalahamad0.github.io/adhan-api/architecture.html",
    demo: "https://bilalahamad0.github.io/adhan-api/dashboard.html",
    demoLabel: "Live Dashboard",
    isAI: true,
    aiTools: ["Antigravity", "Gemini 2.5 Flash/Pro", "Cursor", "Claude Sonnet 4 / Opus 4.6"],
    aiContribution: 92,
    impact: "Zero-touch prayer-time media notifications with automated media-state control (Raspberry Pi + Android TV via ADB) · 10 microservices",
    gradient: "from-emerald-600/20 via-emerald-500/10 to-transparent",
    accent: "emerald",
    relatedPosts: [
      { slug: "media-caster-story", label: "Project Story" },
      { slug: "resilient-iot-application", label: "Whitepaper: Core Practices" },
      { slug: "clock-jump-case-study", label: "Whitepaper: NTP Clock Sync" },
      { slug: "gemma-ollama-raspberry-pi-adhan", label: "Whitepaper: Local Edge AI" },
    ],
    // YouTube demo
    previewType: "youtube" as const,
    previewSrc: "https://www.youtube.com/embed/GETyDnvZWog",
    dashboardSrc: "https://bilalahamad0.github.io/adhan-api/dashboard.html",
    thumbnail: "/videos/The_Architecture_of_Automation.mp4",
    thumbnailPoster: "/videos/posters/The_Architecture_of_Automation.jpg",
    thumbnailAlt: "Smart-Home IoT Media Caster system flow animation",
    thumbnailType: "video" as const,
  },
  {
    id: "tmo",
    name: "Monthly Phone Bill Split & Autopay E2E Automation",
    tagline: "From manual PDF parsing to fully automated billing pipeline",
    description: "An event-driven billing pipeline that splits a T-Mobile family plan the moment the bill lands: a Mac Folder Action watches ~/Downloads, parses each new PDF, calculates every line's share, and emails Zelle-ready summaries. Once a manual script, now fully automated.",
    category: "AI-Powered" as ProjectCategory,
    tech: ["Python", "Shell", "macOS Automation", "Zelle", "SMTP"],
    repo: "https://github.com/bilalahamad0/tmo",
    architecture: "https://bilalahamad0.github.io/tmo/architecture.html",
    demo: null,
    demoLabel: null,
    isAI: true,
    aiTools: ["Antigravity", "Gemini 2.5 Flash"],
    aiContribution: 75,
    impact: "Zero-touch monthly billing cycle",
    gradient: "from-pink-600/20 via-rose-500/10 to-transparent",
    accent: "pink",
    relatedPosts: [],
    // YouTube demo + silent looping video thumbnail
    previewType: "youtube" as const,
    previewSrc: "https://www.youtube.com/embed/gS9uSDc-h48",
    thumbnail: "/videos/Monthly_Phone_Bill_Split_Autopay.mp4",
    thumbnailPoster: "/videos/posters/Monthly_Phone_Bill_Split_Autopay.jpg",
    thumbnailAlt: "Monthly Phone Bill Split & Autopay E2E Automation — pipeline demo",
    thumbnailType: "video" as const,
  },
  {
    id: "adhan-ce",
    name: "Adhan Caster — Cross-Browser Extension",
    tagline: "Auto-pauses media in every tab at Adhan time",
    description: "A Manifest V3 browser extension that auto-pauses every playing video and audio across all open tabs at Adhan time, with a live countdown to the next prayer. One codebase live on the Chrome Web Store, Firefox Add-ons and Edge Add-ons — built in one day with Claude Code.",
    category: "AI-Powered" as ProjectCategory,
    tech: ["JavaScript", "WebExtensions", "Manifest V3", "Service Worker", "Cross-Browser", "Jest"],
    repo: "https://github.com/bilalahamad0/adhan-ce",
    architecture: "https://bilalahamad0.github.io/adhan-ce/architecture.html",
    demo: "https://chromewebstore.google.com/detail/adhan-caster-muslim-praye/jfjknglldcdminelckmmfdbnlikiogia",
    demoLabel: "Install for Chrome",
    // Marketplace availability — one row per browser store (see StoreListing).
    // The rows are independent on purpose: stores approve at their own pace, so
    // each keeps the version actually published there rather than the repo's
    // latest tag. Firefox and Edge both moved to 2.0.4 on 2026-08-17; Chrome
    // stayed on 2.0.3 because that release changed nothing in its package, so
    // resubmitting would have shipped a byte-identical CRX through a review
    // cycle. Verify against the live listings before editing.
    storeListings: [
      {
        browser: "Chrome",
        store: "Chrome Web Store",
        status: "live",
        url: "https://chromewebstore.google.com/detail/adhan-caster-muslim-praye/jfjknglldcdminelckmmfdbnlikiogia",
        version: "2.0.3",
        listingName: "Adhan Caster: Muslim Prayer Times & Auto-Pause",
      },
      {
        browser: "Firefox",
        store: "Firefox Add-ons",
        status: "live",
        url: "https://addons.mozilla.org/en-US/firefox/addon/adhan-caster-prayer-times/",
        version: "2.0.4",
        listingName: "Adhan Caster: Prayer Times",
      },
      {
        browser: "Edge",
        store: "Edge Add-ons",
        status: "live",
        url: "https://microsoftedge.microsoft.com/addons/detail/adhan-caster-muslim-pray/kapmpaofgphfbkpkmhhiooafplhckblg",
        version: "2.0.4",
        listingName: "Adhan Caster: Muslim Prayer Times & Auto-Pause",
      },
    ] as StoreListing[],
    isAI: true,
    aiTools: ["Claude Code (Opus 4.7)"],
    aiContribution: 95,
    impact: "Live on the Chrome Web Store, Firefox Add-ons and Edge Add-ons · auto-pauses media across every open tab at Adhan time · cross-tab prayer-focus mode · 194 tests, 14 suites",
    gradient: "from-emerald-600/20 via-emerald-500/10 to-transparent",
    accent: "emerald",
    relatedPosts: [
      { slug: "adhan-caster-extension-story", label: "Project Story" },
    ],
    // Animated demo (MP4 re-encode of repo docs/demo.gif — ~40% of the GIF's bytes)
    previewType: "image" as const,
    previewSrc: "/images/adhan-ce-demo.mp4",
    thumbnail: "/images/adhan-ce-demo.mp4",
    thumbnailAlt: "Adhan Caster — in-page countdown, cross-tab media pause, and full-screen prayer-focus flow",
    thumbnailType: "screenshot" as const,
  },
  {
    id: "profile",
    name: "Portfolio: bilalahamad.com",
    tagline: "Premium AI-native portfolio, built with Next.js + Framer Motion",
    description: "A production Next.js portfolio built end-to-end with AI pair programming (Antigravity + Gemini), fully responsive and dark-mode. Features glassmorphism design, live GitHub data, Vercel Analytics, Google Analytics events, and an interactive Certifications gallery.",
    category: "Web & DevOps" as ProjectCategory,
    tech: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "Vercel"],
    repo: "https://github.com/bilalahamad0/profile",
    architecture: "https://htmlpreview.github.io/?https://github.com/bilalahamad0/profile/blob/main/docs/architecture.html",
    demo: "https://bilalahamad.com",
    demoLabel: "Live Website",
    isAI: true,
    aiTools: ["Antigravity", "Gemini 2.5 Flash/Pro", "Cursor", "Claude Code"],
    aiContribution: 85,
    impact: "Full-stack portfolio deployed to production · 358M+ tokens",
    gradient: "from-violet-600/20 via-purple-500/10 to-transparent",
    accent: "violet",
    relatedPosts: [],
    previewType: "iframe" as const,
    previewSrc: "https://bilalahamad.com",
    thumbnail: "https://opengraph.githubassets.com/1/bilalahamad0/profile",
    thumbnailAlt: "Portfolio: bilalahamad.com website",
    thumbnailType: "screenshot" as const,
  },
];


export type LinkedInPost = {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  url: string;
  category: string;
  thumbnail?: string;
};

export const linkedInPosts: LinkedInPost[] = [
  {
    id: "li-1",
    title: "AI + Predictive Analytics: The Future of Quality Assurance",
    excerpt: "How predictive analytics powered by AI is reshaping QA from reactive bug-hunting to proactive defect prevention — a shift every engineering leader needs to understand.",
    tags: ["#ai", "#qualityassurance", "#predictiveanalytics"],
    date: "August 12, 2025",
    url: "https://www.linkedin.com/posts/bilalahamad_ai-qualityassurance-predictiveanalytics-activity-7360870999065546753-zmX-",
    category: "LinkedIn",
    thumbnail:
      "https://media.licdn.com/dms/image/v2/D5610AQEvP6gOVBgnLw/image-shrink_1280/B56ZicRKazHcAQ-/0/1754968404005?e=2147483647&v=beta&t=1oDtLO4S_y9pKz0rGSp2LyzvyZaOroAT0jqRxw9LYIE",
  },
  {
    id: "li-2",
    title: "AI Testing: Why Your QA Team Can't Afford to Ignore It",
    excerpt: "AI-native testing pipelines aren't just faster — they surface systemic defects that humans consistently miss. Here's how I'm integrating AI testing into every new project.",
    tags: ["#qualityassurance", "#ai", "#aitesting"],
    date: "August 13, 2025",
    url: "https://www.linkedin.com/posts/bilalahamad_qualityassurance-ai-aitesting-activity-7361425761225883648-16H9",
    category: "LinkedIn",
    thumbnail:
      "https://media.licdn.com/dms/image/v2/D5610AQGsP4KNBG6ZoA/image-shrink_1280/B56ZikJtUKHQAQ-/0/1755100669525?e=2147483647&v=beta&t=JAFkY7MnnMjd8nNu8g-hDeM9ONlwDRL0zqdLiEML-2E",
  },
  {
    id: "li-3",
    title: "Fact-Checking in the Age of AI: A QA Perspective",
    excerpt: "AI hallucinations aren't just a product problem — they're a quality problem. As QA engineers, we have a unique responsibility to build truth-verification into AI pipelines.",
    tags: ["#ai", "#qualityassurance", "#factchecking"],
    date: "August 20, 2025",
    url: "https://www.linkedin.com/posts/bilalahamad_ai-qualityassurance-factchecking-activity-7363724206255063048-4C7i",
    category: "LinkedIn",
    thumbnail:
      "https://media.licdn.com/dms/image/v2/D5610AQF73lpVq-UPxQ/image-shrink_1280/B56ZjE0IuUG0AM-/0/1755648661128?e=2147483647&v=beta&t=Ns3XxxLPk1KWGjsbcaamilvLRLu0-T27cyJO9IY223M",
  },
  {
    id: "li-4",
    title: "AI for Business: The Solopreneur's Secret Weapon",
    excerpt: "Why solopreneurs who master AI tooling will outcompete entire teams. A first-hand account of building production-grade systems alone, faster than ever before.",
    tags: ["#aiforbusiness", "#solopreneur", "#qualityassurance"],
    date: "August 23, 2025",
    url: "https://www.linkedin.com/posts/bilalahamad_aiforbusiness-solopreneur-qualityassurance-activity-7364945849866465280-2c8r",
    category: "LinkedIn",
    thumbnail:
      "https://media.licdn.com/dms/image/v2/D5610AQFiAFbkg47Ctg/image-shrink_1280/B56ZjWLN5pG0AM-/0/1755939924103?e=2147483647&v=beta&t=TblJlxiUA6uKsrCCaSsZp41bVyEIn620L60FPtgRxOo",
  },
  {
    id: "li-5",
    title: "Marketing Automation Meets QA: Closing the Loop on AI-Powered Growth",
    excerpt: "What happens when you apply QA rigor to AI marketing pipelines? You get measurable, auditable, and reproducible growth. Here's the framework I use.",
    tags: ["#marketingautomation", "#ai", "#qualityassurance"],
    date: "August 26, 2025",
    url: "https://www.linkedin.com/posts/bilalahamad_marketingautomation-ai-qualityassurance-activity-7366209393358471168-qUAE",
    category: "LinkedIn",
    thumbnail:
      "https://media.licdn.com/dms/image/v2/D5610AQG35d5IUimEIQ/image-shrink_1280/B56ZjoIZ2CHkAQ-/0/1756241176239?e=2147483647&v=beta&t=sx6wMLRe0F56ERjknl2-RZgQ9ZnMMNok883Y3_SnEkY",
  },
  {
    id: "li-6",
    title: "Flash Update: 2,300+ California Tech Roles Hit by July Layoffs",
    excerpt:
      "Straight from California WARN filings: Intuit, Meta, LinkedIn, Credit Karma, and NetApp are cutting 2,300+ tech roles this July. Sharing the data early so we can look out for one another.",
    tags: ["#technews", "#dataanalytics", "#bayareatech"],
    date: "May 27, 2026",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7465282589398999040/",
    category: "LinkedIn",
    thumbnail: "/blog-thumbs/warn-july-2026-layoffs.png",
  },
];
