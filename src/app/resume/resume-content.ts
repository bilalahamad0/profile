/**
 * Resume-only prose that has no home in portfolio.ts.
 *
 * portfolio.ts stays the single source of truth for career FACTS (roles, dates,
 * bullets, projects, certifications). This file holds the framing a resume needs
 * and a portfolio page does not: the positioning summary, the grouped skill
 * matrix, and the contact line. Keeping it separate means the resume never
 * duplicates a fact — it only reformats one.
 */

/**
 * The site's one brand string for the role — it also fills the nav, the page
 * metadata, the JSON-LD Person schema and llms.txt. The owner's own resume
 * self-describes as "Systems Validation Architect"; changing that here alone
 * would put the header of the PDF at odds with every other surface, so the
 * switch is a deliberate site-wide rename, not a resume-only edit.
 */
export const RESUME_HEADLINE = "Lead Embedded Firmware & Systems QA Engineer";

export const RESUME_LOCATION = "Sunnyvale, CA";

export const RESUME_SUMMARY =
  "Systems validation architect with 18+ years building embedded software validation ecosystems for safety-critical systems — firmware, IoT and wearables, mobile handsets, AI video pipelines, and autonomous driving. Takes products from NPI bring-up to enterprise-scale release: test automation, Software-in-the-Loop environments, test strategy, and lab infrastructure that cuts risk and accelerates feedback.";

/**
 * The real number is deliberately absent: this sheet is downloadable from a
 * public URL, which is precisely where a phone number gets scraped. "Phone on
 * request" reads as a choice rather than an omission — a masked "+1 XXX XXX
 * XXXX" reads like a redaction bug and tells a reader nothing they can act on.
 * Entries without an `href` render as plain text.
 */
export const RESUME_CONTACT: ReadonlyArray<{ label: string; href?: string }> = [
  { label: "bilal.ahamad@gmail.com", href: "mailto:bilal.ahamad@gmail.com" },
  { label: "bilalahamad.com", href: "https://bilalahamad.com" },
  { label: "linkedin.com/in/bilalahamad", href: "https://linkedin.com/in/bilalahamad" },
  { label: "github.com/bilalahamad0", href: "https://github.com/bilalahamad0" },
  { label: "Phone on request" },
];

/**
 * The resume's technical proficiencies, folded from seven source categories
 * into the four the sheet has room for. Length is a layout constraint, not a
 * style one: every group is kept short enough to wrap to two printed lines at
 * the 7in Letter column, which is what holds the PDF to two pages.
 */
export const RESUME_SKILL_GROUPS: ReadonlyArray<{ label: string; items: string }> = [
  {
    label: "Languages & Automation",
    items: "Python, Shell, C/C++, JavaScript, Pytest, Selenium, Appium",
  },
  {
    label: "OS & Embedded Hardware",
    items:
      "Embedded Linux, RTOS, QNX, Android/AAOS, iOS, ADB, ARM, ESP32, Raspberry Pi, Arduino",
  },
  {
    label: "Wireless, Protocols & Diagnostics",
    items:
      "BLE, LTE/Wi-Fi, Wi-Fi Alliance (WFA) certification, QXDM, RTSP/RTP, TLS, UART/SPI/I2C, CAN/CAN FD, Automotive Ethernet, V2X, Wireshark/PCAP replay",
  },
  {
    label: "Infrastructure & Observability",
    items:
      "CI/CD (GitLab CI, GitHub Actions, Buildkite, Jenkins), SIL (Docker/QEMU), HIL benches, Bazel, Git, JIRA, Splunk, Grafana, Datadog, Databricks",
  },
];

export const RESUME_EDUCATION = {
  degree: "B.Tech, Electronics & Telecommunications Engineering",
  school: "Biju Patnaik University of Technology",
  years: "2004 – 2008",
};

/**
 * Certifications worth the page space on a 2-page resume, newest/most senior
 * first — deliberately fuller than the two the owner's master resume prints
 * (ISTQB CTFL and Google Project Management). Every title here is a real
 * credential from /certifications, and this sheet has room the master does not.
 */
export const RESUME_CERT_TITLES: ReadonlyArray<string> = [
  "Google AI Professional (2026)",
  "Google Project Management Professional (2026)",
  "ISTQB Certified Tester Foundation Level (CTFL)",
  "AI Coding Agents with GitHub Copilot and Cursor (2025)",
];

/**
 * Projects that earn a line on the resume, in the order they appear. The
 * master resume names only the Smart-Home IoT caster (`adhan`); the other two
 * are shipped, public work that the sheet still has room for.
 */
export const RESUME_PROJECT_IDS: ReadonlyArray<string> = ["warn", "adhan-ce", "adhan"];
