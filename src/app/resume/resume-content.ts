/**
 * Resume-only prose that has no home in portfolio.ts.
 *
 * portfolio.ts stays the single source of truth for career FACTS (roles, dates,
 * bullets, projects, certifications). This file holds the framing a resume needs
 * and a portfolio page does not: the positioning summary, the grouped skill
 * matrix, and the contact line. Keeping it separate means the resume never
 * duplicates a fact — it only reformats one.
 */

export const RESUME_HEADLINE = "Lead Embedded Firmware & Systems QA Engineer";

export const RESUME_LOCATION = "San Francisco Bay Area, CA";

export const RESUME_SUMMARY =
  "Quality engineering leader with 18+ years validating firmware and embedded systems for Amazon (Alexa devices), Google (VR), Rivian, Cruise, and Samsara. Builds the test architectures behind safety-critical and AI/ML-driven products — hardware-in-the-loop rigs, CI/CD device labs, and automation frameworks that have delivered $3M+ in cost savings and $2.1M in new revenue. Currently architecting 0-to-1 validation for a sensor-integration IDE and AI-augmented test pipelines.";

export const RESUME_CONTACT: ReadonlyArray<{ label: string; href: string }> = [
  { label: "bilalahamad.com", href: "https://bilalahamad.com" },
  { label: "linkedin.com/in/bilalahamad", href: "https://linkedin.com/in/bilalahamad" },
  { label: "github.com/bilalahamad0", href: "https://github.com/bilalahamad0" },
  { label: "bilalahamad.com/contact", href: "https://bilalahamad.com/contact" },
];

export const RESUME_SKILL_GROUPS: ReadonlyArray<{ label: string; items: string }> = [
  {
    label: "Test & Automation",
    items:
      "Python, test framework architecture, hardware-in-the-loop (HIL), CI/CD (Jenkins), Docker/QEMU, Appium, Selenium, ADB & Android, QNX/C++",
  },
  {
    label: "Domains",
    items:
      "Firmware & IoT validation, automotive infotainment & V2X, AI/ML system testing, video quality, Bluetooth/Wi-Fi (WFA) certification, OTA updates",
  },
  {
    label: "AI-Augmented Engineering",
    items:
      "Claude Code, Cursor, Gemini — AI pair-programmed test frameworks, agentic automation pipelines",
  },
  {
    label: "Software & Data",
    items:
      "TypeScript, Node.js, React/Next.js, Pandas, Plotly & Splunk dashboards, AWS, GitHub Actions",
  },
];

export const RESUME_EDUCATION = {
  degree: "B.Tech, Electronics & Telecommunications Engineering",
  school: "Biju Patnaik University of Technology",
  years: "2004 – 2008",
};

/** Certifications worth the page space on a 2-page resume, newest/most senior first. */
export const RESUME_CERT_TITLES: ReadonlyArray<string> = [
  "Google AI Professional (2026)",
  "Google Project Management Professional (2026)",
  "ISTQB Certified Tester Foundation Level (CTFL)",
  "Software Testing Foundations: Integrating AI into Quality Process (2026)",
  "AI Coding Agents with GitHub Copilot and Cursor (2025)",
];

/** Projects that earn a line on the resume, in the order they appear. */
export const RESUME_PROJECT_IDS: ReadonlyArray<string> = ["warn", "adhan-ce", "adhan"];
