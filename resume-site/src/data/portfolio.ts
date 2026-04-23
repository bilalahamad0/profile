import {
  Terminal, ShieldCheck, Box, Activity, Cpu, Cloud, Settings, Layers,
  Code2, Database, Wrench, Smartphone, Server, Layout
} from "lucide-react";

export const experienceData = [
  {
    role: "Founding System Architect &\nTechnical QA Lead",
    company: "Stealth Mode",
    location: "Remote / Stealth",
    duration: "Sep 2025 - Present",
    desc: "Concept to MVP: Spearheading the '0-to-1' architecture and validation of a Unified Sensor Integration IDE, automating the integration of OEM dependencies and standardizing sensor-level code extensions.",
    highlights: [
      "Architectural Innovation: Engineered a pre-validated compatibility layer for industry-standard chips (ARM, ESP32) and sensors (LiDAR/Radar), reducing manual bring-up cycles by an estimated 70%.",
      "Advanced Simulation: Built a containerized (Docker/QEMU) testing ecosystem enabling high-fidelity A/B validation and system-level performance engineering before physical hardware deployment.",
      "Technical Leadership: Conducted comprehensive cost-benefit and computing ability analysis for massive-scale sensor deployments, ensuring alignment with Industry 4.0 safety and reliability standards.",
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
    desc: "Spearheading E2E system test strategies for IoT Dash Cam product series within an AI/ML video-based safety ecosystem.",
    highlights: [
      "Developed automated testing pipelines focusing on video quality, AI/ML algorithm accuracy, and workload performance.",
      "Reduced regression cycles by 50% and significantly improved release cadence through network reliability and connectivity automation.",
      "Collaborated with cross-functional teams to address validation gaps and influence project scope and resource allocation.",
    ],
    file: "/logos/samsara.png",
    faang: false,
    invertLogo: true,
  },
  {
    role: "Senior Automation Engineer II",
    company: "Cruise LLC",
    location: "San Francisco, CA",
    duration: "Oct 2022 - Jun 2023",
    desc: "Owned test delivery for vehicle computational systems, overseeing successful releases of safety-critical firmware versions.",
    highlights: [
      "Developed an automation test framework for Sanity, Integration, and Stress testing, achieving 75% test coverage.",
      "Led design for fault tolerance, redundancy, and network reliability testing (V2X and PCAP replay).",
      "Aligned test strategies with business requirements through cross-functional coordination and stakeholder management.",
    ],
    file: "/logos/cruise.png",
    faang: false,
    invertLogo: false,
  },
  {
    role: "Infotainment & V2X Firmware Test Lead",
    company: "Rivian Automotive LLC",
    location: "Palo Alto, CA",
    duration: "Jun 2021 - Sep 2022",
    desc: "Directed technical testing strategy and E2E test delivery for in-car Infotainment Systems in R1T, R1S, and Fleet models.",
    highlights: [
      "Designed an automation test framework for QNX and Android platforms covering OTA updates, UI/UX, and navigation.",
      "Ensured comprehensive coverage for integration testing with vehicle systems, performance, and stability during continuous releases.",
      "Achieved critical KPI goals from Out-of-Box Experience to full user flow life cycle.",
    ],
    file: "/logos/rivian.png",
    faang: false,
    invertLogo: false,
  },
  {
    role: "Senior QA Engineer II &\nTest Lead",
    company: "Amazon Lab126",
    location: "Sunnyvale, CA",
    duration: "Jun 2018 - Jun 2021",
    desc: "Managed the QA process for Alexa Voice Service (AVS)-enabled products including Echo Buds (1st & 2nd Gen), Echo Auto, and Dash Button.",
    highlights: [
      "Automated Snippet API library, reducing manual testing costs by $3M.",
      "Setup test labs and CI/CD pipelines for continuous execution using 50+ devices, achieving 30% fewer post-launch issues.",
      "Created live dashboards using Splunk to highlight trends and metrics, improving test efficiency to 80%.",
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
    desc: "Led system testing for Google's VR Controller, successfully releasing 1st & 2nd Gen controllers and the Daydream View headset.",
    highlights: [
      "Engineered a 3DOF robotic arm using Arduino and servo motors for automated motion tracking testing, reducing execution hours by 80%.",
      "Key contributor in identifying VR test features and creating comprehensive test coverage, mitigating gaps in product readiness.",
      "Developed Python scripts to measure controller battery through UART and evaluate 2DOF motion tracking.",
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
    desc: "Developed a Python-based test automation framework for Set-top-Box (STB) video streaming applications by simulating handheld remote key events.",
    highlights: [
      "Enhanced test scope by 40% and reduced execution time by half through modular architecture and programmable actions.",
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
    desc: "Led validation for Wi-Fi Alliance (WFA) compliance on Android and BlackBerry handsets, executing pre-certification and interoperability testing.",
    highlights: [
      "Re-architected WLAN IOT test automation framework to integrate Android OS support, creating savings of $1.3M.",
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
    desc: "Pioneered a test automation framework for Bluetooth qualification testing on Motorola handsets, generating $2.1M in revenue.",
    highlights: [
      "Devised a 3-tier infrastructure enhancing code reusability (3x) and reducing test preparation LOE by 70%.",
      "Resolved high-priority customer issues including Bluetooth call audio glitches and car kit media sync issues using automation.",
      "Re-designed existing System Test automation framework to scale with growing numbers of Android smartphones.",
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
    desc: "Led functional and integration testing for web portal applications, ensuring robust performance and seamless user experience.",
    highlights: [
      "Worked in web application deployment module, feature integration, and client liaison.",
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

export const certs = [
  "Software Testing Foundations: Integrating AI into Quality Process (2026)",
  "AI Coding Agents with GitHub Copilot and Cursor (2025)",
  "AI for App building (2026)",
  "ISTQB Certified Tester Foundation Level (CTFL)",
  "How to Master Your Executive Presence (2023)",
  "Project Management Foundations (2023)",
  "Scrum: Advanced (2021)",
];

export const recommendations = [
  { name: "Sai Abhishek / MBA", title: "Project Manager | PMP | Scrum Master", review: "Bilal is an extremely hardworking and dedicated worker, he gives him 100% to all that he does. It was wonderful working with him in a brief stint way back in 2012, however, he has always kept in touch and has ensured that relations built stay forever. I wish him luck in all his future endeavours." },
  { name: "Nimish Choudhary", title: "Senior Manager | Lead Digital Engineer", review: "I have worked with Bilal in Lnt where we both were in mysore office for some time. Bilal is a very in-tellectual person. He is born with gift of adapting to new technology quickly, his hunger to learn new things and implementing them, has let too many new ways in which a technology can be utilized. Apart from being a technically strong he is a good person to work with. His discussion points are strong and the way he presents them is even better." },
];

export type ProjectCategory = "All" | "IoT & Automation" | "Data & Analytics" | "AI-Powered" | "Web & DevOps";

export const projectsData = [
  {
    id: "warn",
    name: "California Live Layoff Monitoring Dashboard",
    tagline: "Live layoff intelligence from raw government filings",
    description: "A fully automated data pipeline for the California WARN Act. Engineered for surgical precision, it transforms raw government filings into live actionable intelligence using ETag caching, MD5 verification, and GitHub Actions CI/CD — running twice daily with zero human intervention.",
    category: "Data & Analytics" as ProjectCategory,
    tech: ["Python", "GitHub Actions", "Plotly", "ETag Cache", "Pandas"],
    repo: "https://github.com/bilalahamad0/warn",
    demo: "https://bilalahamad0.github.io/warn/",
    isAI: true,
    aiTools: ["Antigravity", "Gemini 2.5 Flash/Pro", "Cursor", "Claude Sonnet 4"],
    aiContribution: 88,
    impact: "Automated 100% of data ingestion and alerting",
    gradient: "from-blue-600/20 via-blue-500/10 to-transparent",
    accent: "blue",
    blogSlug: "california-warn-story",
    // iframe embed of live dashboard
    previewType: "iframe" as const,
    previewSrc: "https://bilalahamad0.github.io/warn/",
    thumbnail: "https://opengraph.githubassets.com/1/bilalahamad0/warn",
    thumbnailAlt: "California Live Layoff Monitoring Dashboard — interactive charts",
    thumbnailType: "screenshot" as const,
  },
  {
    id: "adhan",
    name: "Smart-Home IoT Audio Caster",
    tagline: "AI-orchestrated IoT prayer time automation",
    description: "An advanced IoT orchestration layer for automated prayer-time notifications. Integrates Raspberry Pi with Sony Android TV via ADB, managing media states and low-level system commands. Built from scratch using AI pair programming—compressing a 3-week engineering cycle into 4 days.",
    category: "IoT & Automation" as ProjectCategory,
    tech: ["Node.js", "ADB", "Raspberry Pi", "Shell", "Android TV"],
    repo: "https://github.com/bilalahamad0/adhan-api",
    demo: null,
    isAI: true,
    aiTools: ["Antigravity", "Gemini 2.5 Flash/Pro", "Cursor", "Claude Sonnet 4 / Opus 4"],
    aiContribution: 92,
    impact: "Compressed 3-week build to 4 days · 405k tokens · 8 microservices",
    gradient: "from-emerald-600/20 via-emerald-500/10 to-transparent",
    accent: "emerald",
    blogSlug: "adhan-caster-story",
    // animated system flow from GitHub README
    previewType: "gif" as const,
    previewSrc: "https://raw.githubusercontent.com/bilalahamad0/adhan-api/main/images/system_flow/flow_animation.webp",
    thumbnail: "https://raw.githubusercontent.com/bilalahamad0/adhan-api/main/images/system_flow/flow_animation.webp",
    thumbnailAlt: "Smart-Home IoT Audio Caster system flow animation",
    thumbnailType: "animation" as const,
  },
  {
    id: "tmo",
    name: "Monthly Phone Bill Split & Autopay E2E Automation",
    tagline: "From manual PDF parsing to fully automated billing pipeline",
    description: "Originally a manual Python script to parse T-Mobile family plan PDFs and split costs, it was transformed into a fully automated, event-driven E2E system. The Mac Folder Action watches ~/Downloads and instantly processes new bills, calculates splits, and sends Zelle-ready summaries via email.",
    category: "AI-Powered" as ProjectCategory,
    tech: ["Python", "Shell", "macOS Automation", "Zelle", "SMTP"],
    repo: "https://github.com/bilalahamad0/tmo",
    demo: null,
    isAI: true,
    aiTools: ["Antigravity", "Gemini 2.5 Flash"],
    aiContribution: 75,
    impact: "Zero-touch monthly billing cycle",
    gradient: "from-pink-600/20 via-rose-500/10 to-transparent",
    accent: "pink",
    blogSlug: null,
    previewType: "image" as const,
    previewSrc: "https://opengraph.githubassets.com/1/bilalahamad0/tmo",
    thumbnail: "https://opengraph.githubassets.com/1/bilalahamad0/tmo",
    thumbnailAlt: "Monthly Phone Bill Split & Autopay E2E Automation repository",
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
    aiTools: ["Antigravity", "Gemini 2.5 Flash/Pro", "Cursor", "Claude Opus 4.6"],
    aiContribution: 85,
    impact: "Full-stack portfolio deployed to production · 500k tokens",
    gradient: "from-violet-600/20 via-purple-500/10 to-transparent",
    accent: "violet",
    blogSlug: null,
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
];
