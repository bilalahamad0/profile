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
 * metadata, the JSON-LD Person schema, the OG card and llms.txt. It matches the
 * owner's own resume. Edit it here and every surface follows; the embedded and
 * firmware keywords the title used to carry now live in the page descriptions
 * and RESUME_SUMMARY, so search and share previews still state the domain.
 */
export const RESUME_HEADLINE = "Systems Validation Architect";

export const RESUME_LOCATION = "Sunnyvale, CA";

export const RESUME_SUMMARY =
  "Systems validation architect with 18+ years building embedded validation ecosystems for safety-critical systems — firmware, IoT, wearables, AI video, and autonomous driving. Takes products from NPI bring-up to enterprise release through test automation, SIL environments, and test strategy.";

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
    items: "Python, Shell, C/C++, JavaScript · Pytest, Selenium, Appium",
  },
  {
    label: "Embedded, OS & Protocols",
    items:
      "Embedded Linux, RTOS, QNX, Android/AAOS, ARM, ESP32, Raspberry Pi · BLE, LTE/Wi-Fi, WFA certification, RTSP/RTP, TLS, UART/SPI/I2C, CAN FD, Automotive Ethernet, V2X, Wireshark/PCAP",
  },
  {
    label: "Infrastructure & Observability",
    items:
      "CI/CD (GitLab, GitHub Actions, Buildkite, Jenkins) · SIL (Docker/QEMU), HIL benches · Splunk, Grafana, Datadog",
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
];

/**
 * Projects that earn a line on the resume, in the order they appear. The
 * master resume names only the Smart-Home IoT caster (`adhan`); the other two
 * are shipped, public work that the sheet still has room for.
 */
export const RESUME_PROJECT_IDS: ReadonlyArray<string> = ["warn", "adhan-ce", "adhan"];
