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
  { role: "Radio Validation Engineer", company: "Wistron Mobile", location: "Chicago, IL", duration: "Dec 2014 - Sep 2015", desc: "Pre-certification and Interoperability testing on Android/BlackBerry handsets.", file: "/logos/wistron.png", faang: false, invertLogo: false },
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
