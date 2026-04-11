import {
  Terminal, ShieldCheck, Box, Activity, Cpu, Cloud, Settings, Layers,
  Code2, Database, Wrench, Smartphone, Server, Layout
} from "lucide-react";

export const experienceData = [
  { role: "Test Lead / Senior Firmware QA", company: "Samsara", location: "San Francisco, CA", duration: "Dec 2023 - Present", desc: "E2E test strategies for Dash cam IoT products on video-based safety platforms.", file: "/logos/samsara.png", faang: false, invertLogo: true },
  { role: "Test Lead / Senior Test Automation Engineer", company: "Cruise", location: "San Francisco, CA", duration: "Oct 2022 - Jun 2023", desc: "CPU/GPU System Computing test delivery. Developed automation achieving 75% test coverage.", file: "/logos/cruise.png", faang: false, invertLogo: false },
  { role: "Infotainment Test Lead", company: "Rivian Automotive", location: "Palo Alto, CA", duration: "Jun 2021 - Sep 2022", desc: "Infotainment QA for R1T/R1S. Designed QNX/Android firmware automation pipelines.", file: "/logos/rivian.png", faang: false, invertLogo: false },
  { role: "Test Lead / Senior Quality Assurance II", company: "Amazon Lab126", location: "Sunnyvale, CA", duration: "Jun 2018 - Jun 2021", desc: "Alexa IoT testing (Dash, Echo Auto, Echo Buds). Automated VUI tests saving $3M.", file: "/logos/amazon.png", faang: true, invertLogo: false },
  { role: "Software Test Engineer", company: "Google (via Tech Mahindra)", location: "Mountain View, CA", duration: "Jan 2016 - Jun 2018", desc: "Standalone VR Controller systems testing. Built 3DOF robot arm for automated motion tracking.", file: "/logos/google.png", faang: true, invertLogo: false },
  { role: "Test Engineer", company: "Cisco (via Cognizant)", location: "Boston, MA", duration: "Sep 2015 - Jan 2016", desc: "Python-based framework for Set-top-Box Video Streaming automation.", file: "/logos/cisco.png", faang: false, invertLogo: false },
  { role: "Radio Validation Engineer", company: "Wistron Mobile", location: "Chicago, IL", duration: "Dec 2014 - Sep 2015", desc: "Pre-certification and Interoperability testing on Android/BlackBerry handsets.", file: "/logos/wistron.svg", faang: false, invertLogo: true },
  { role: "Senior Software Engineer in Test", company: "Motorola Mobility (via L&T Infotech)", location: "Sunnyvale, CA", duration: "Oct 2009 - Dec 2014", desc: "Bluetooth automation framework for mobile handsets showcasing $2.1M savings.", file: "/logos/motorola.png", faang: false, invertLogo: true },
  { role: "Test Engineer", company: "Luminous Infoways", location: "Bhubaneswar, India", duration: "Oct 2008 - Sep 2009", desc: "Web application deployment modules, feature integration.", file: "/logos/luminous.png", faang: false, invertLogo: false },
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

export const certs = [
  "Software Testing Foundations: Integrating AI into Quality Process (2026)",
  "AI Coding Agents with GitHub Copilot and Cursor (2025)",
  "How to Master Your Executive Presence (2023)",
  "Project Management Foundations (2023)",
  "Scrum: Advanced (2021)",
  "ISTQB Foundation Level"
];

export const recommendations = [
  { name: "Sai Abhishek / MBA", title: "Project Manager | PMP | Scrum Master", review: "Bilal is an extremely hardworking and dedicated worker, he gives him 100% to all that he does. It was wonderful working with him in a brief stint way back in 2012, however, he has always kept in touch and has ensured that relations built stay forever. I wish him luck in all his future endeavours." },
  { name: "Nimish Choudhary", title: "Senior Manager | Lead Digital Engineer", review: "I have worked with Bilal in Lnt where we both were in mysore office for some time. Bilal is a very in-tellectual person. He is born with gift of adapting to new technology quickly, his hunger to learn new things and implementing them, has let too many new ways in which a technology can be utilized. Apart from being a technically strong he is a good person to work with. His discussion points are strong and the way he presents them is even better." },
];

export type ProjectCategory = "All" | "IoT & Automation" | "Data & Analytics" | "AI-Powered" | "Web & DevOps";

export const projectsData = [
  {
    id: "warn",
    name: "California WARN Pipeline",
    tagline: "Live layoff intelligence from raw government filings",
    description: "A fully automated data pipeline for the California WARN Act. Engineered for surgical precision, it transforms raw government filings into live actionable intelligence using ETag caching, MD5 verification, and GitHub Actions CI/CD — running twice daily with zero human intervention.",
    category: "Data & Analytics" as ProjectCategory,
    tech: ["Python", "GitHub Actions", "Plotly", "ETag Cache", "Pandas"],
    repo: "https://github.com/bilalahamad0/warn",
    demo: "https://bilalahamad0.github.io/warn/",
    isAI: true,
    aiTools: ["Antigravity", "Gemini 3 Pro"],
    aiContribution: 88,
    impact: "Automated 100% of data ingestion and alerting",
    gradient: "from-blue-600/20 via-blue-500/10 to-transparent",
    accent: "blue",
    blogSlug: "california-warn-story",
    thumbnail: "https://bilalahamad0.github.io/warn/charts/top_companies.png",
    thumbnailAlt: "California WARN layoff dashboard — top companies by layoffs",
    thumbnailType: "screenshot" as const,
  },
  {
    id: "adhan",
    name: "Adhan Audio Caster",
    tagline: "AI-orchestrated IoT prayer time automation",
    description: "An advanced IoT orchestration layer for automated prayer-time notifications. Integrates Raspberry Pi with Sony Android TV via ADB, managing media states and low-level system commands. Built from scratch using AI pair programming—compressing a 3-week engineering cycle into 4 days.",
    category: "IoT & Automation" as ProjectCategory,
    tech: ["Node.js", "ADB", "Raspberry Pi", "Shell", "Android TV"],
    repo: "https://github.com/bilalahamad0/adhan-api",
    demo: null,
    isAI: true,
    aiTools: ["Antigravity", "Gemini 3 Flash/Pro"],
    aiContribution: 92,
    impact: "Compressed 3-week build to 4 days",
    gradient: "from-emerald-600/20 via-emerald-500/10 to-transparent",
    accent: "emerald",
    blogSlug: "adhan-caster-story",
    thumbnail: "https://raw.githubusercontent.com/bilalahamad0/adhan-api/main/images/system_flow/flow_animation.webp",
    thumbnailAlt: "Adhan Audio Caster system flow animation",
    thumbnailType: "animation" as const,
  },
  {
    id: "tmo",
    name: "T-Mobile Bill Automation",
    tagline: "From manual PDF parsing to fully automated billing pipeline",
    description: "Originally a manual Python script to parse T-Mobile family plan PDFs and split costs, it was transformed into a fully automated, event-driven E2E system. The Mac Folder Action watches ~/Downloads and instantly processes new bills, calculates splits, and sends Zelle-ready summaries via email.",
    category: "AI-Powered" as ProjectCategory,
    tech: ["Python", "Shell", "macOS Automation", "Zelle", "SMTP"],
    repo: "https://github.com/bilalahamad0/tmo",
    demo: null,
    isAI: true,
    aiTools: ["Antigravity", "Gemini"],
    aiContribution: 75,
    impact: "Zero-touch monthly billing cycle",
    gradient: "from-pink-600/20 via-rose-500/10 to-transparent",
    accent: "pink",
    blogSlug: null,
    thumbnail: "https://opengraph.githubassets.com/1/bilalahamad0/tmo",
    thumbnailAlt: "T-Mobile Bill Automation repository",
    thumbnailType: "screenshot" as const,
  },

  {
    id: "profile",
    name: "Portfolio: bilalahamad.com",
    tagline: "Premium AI-native portfolio, built with Next.js + Framer Motion",
    description: "A fully responsive, dark-mode portfolio website built end-to-end with AI pair programming (Antigravity + Gemini). Features glassmorphism design, live GitHub data, Vercel Analytics, Google Analytics with custom events, and an interactive Certifications gallery.",
    category: "Web & DevOps" as ProjectCategory,
    tech: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "Vercel"],
    repo: "https://github.com/bilalahamad0/profile",
    demo: "https://bilalahamad.com",
    isAI: true,
    aiTools: ["Antigravity", "Gemini 3 Flash/Pro"],
    aiContribution: 85,
    impact: "Full-stack portfolio deployed to production",
    gradient: "from-violet-600/20 via-purple-500/10 to-transparent",
    accent: "violet",
    blogSlug: null,
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
    thumbnail: "/blog-thumbs/adhan-iot.png",
  },

  {
    id: "li-2",
    title: "AI Testing: Why Your QA Team Can't Afford to Ignore It",

    excerpt: "AI-native testing pipelines aren't just faster — they surface systemic defects that humans consistently miss. Here's how I'm integrating AI testing into every new project.",
    tags: ["#qualityassurance", "#ai", "#aitesting"],
    date: "August 13, 2025",
    url: "https://www.linkedin.com/posts/bilalahamad_qualityassurance-ai-aitesting-activity-7361425761225883648-16H9",
    category: "LinkedIn",
    thumbnail: "/blog-thumbs/adhan-iot.png",
  },
  {
    id: "li-3",
    title: "Fact-Checking in the Age of AI: A QA Perspective",
    excerpt: "AI hallucinations aren't just a product problem — they're a quality problem. As QA engineers, we have a unique responsibility to build truth-verification into AI pipelines.",
    tags: ["#ai", "#qualityassurance", "#factchecking"],
    date: "August 20, 2025",
    url: "https://www.linkedin.com/posts/bilalahamad_ai-qualityassurance-factchecking-activity-7363724206255063048-4C7i",
    category: "LinkedIn",
    thumbnail: "/blog-thumbs/california-warn.png",
  },
  {
    id: "li-4",
    title: "AI for Business: The Solopreneur's Secret Weapon",
    excerpt: "Why solopreneurs who master AI tooling will outcompete entire teams. A first-hand account of building production-grade systems alone, faster than ever before.",
    tags: ["#aiforbusiness", "#solopreneur", "#qualityassurance"],
    date: "August 23, 2025",
    url: "https://www.linkedin.com/posts/bilalahamad_aiforbusiness-solopreneur-qualityassurance-activity-7364945849866465280-2c8r",
    category: "LinkedIn",
    thumbnail: "/blog-thumbs/ai-native-dev.png",
  },
  {
    id: "li-5",
    title: "Marketing Automation Meets QA: Closing the Loop on AI-Powered Growth",
    excerpt: "What happens when you apply QA rigor to AI marketing pipelines? You get measurable, auditable, and reproducible growth. Here's the framework I use.",
    tags: ["#marketingautomation", "#ai", "#qualityassurance"],
    date: "August 26, 2025",
    url: "https://www.linkedin.com/posts/bilalahamad_marketingautomation-ai-qualityassurance-activity-7366209393358471168-qUAE",
    category: "LinkedIn",
    thumbnail: "/blog-thumbs/ai-native-dev.png",
  },
];

