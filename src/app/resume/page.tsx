import type { Metadata } from "next";
import { Download } from "lucide-react";
import { experienceData, projectsData } from "@/data/portfolio";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList, resumeSchema } from "@/lib/structured-data";
import {
  RESUME_CERT_TITLES,
  RESUME_CONTACT,
  RESUME_EDUCATION,
  RESUME_HEADLINE,
  RESUME_LOCATION,
  RESUME_PROJECT_IDS,
  RESUME_SKILL_GROUPS,
  RESUME_SUMMARY,
} from "./resume-content";

export const metadata: Metadata = {
  // The root layout's title template appends " | Bilal Ahamad" — so the tab
  // title must NOT carry the suffix itself. openGraph.title below is not run
  // through the template, so that one keeps the full string.
  title: "Resume",
  description:
    "Resume of Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer with 18+ years across Amazon Lab126, Google, Rivian, Cruise, and Samsara. Download as PDF.",
  alternates: { canonical: "https://bilalahamad.com/resume" },
  openGraph: {
    title: "Resume | Bilal Ahamad",
    description:
      "18+ years of firmware QA and test automation — Amazon, Google, Rivian, Cruise, Samsara. Read online or download the PDF.",
    url: "https://bilalahamad.com/resume",
    type: "profile",
    // Next merges page metadata over the root's shallowly, so declaring
    // `openGraph` here replaces the root block wholesale — without this the
    // most-shared URL on the site previewed as a bare text link.
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer",
      },
    ],
  },
};

const breadcrumb = breadcrumbList([
  { name: "Home", path: "" },
  { name: "Resume", path: "/resume" },
]);

/**
 * A one-page first-look resume: the six most recent roles each keep their
 * single strongest (metric-led) bullet, and everything before 2016 collapses
 * into one "Earlier" line. The full record lives on /experience — this sheet
 * exists to survive a 30-second scan, not to be complete.
 */
const DETAILED_ROLES = 6;

/**
 * The resume document — one page, two representations.
 *
 * On screen it is a paper sheet on the site's ground — the sheet itself stays
 * white with dark ink in both themes, only the surrounding chrome flips. In
 * print (and in
 * `scripts/generate-resume-pdf.mjs`, which renders this very route through
 * Chromium) the chrome drops away and the sheet becomes the PDF. Because every
 * fact is read from portfolio.ts at build time, the PDF cannot drift from the
 * site the way a hand-maintained binary would.
 */
export default function ResumePage() {
  const projects = RESUME_PROJECT_IDS.map((id) =>
    projectsData.find((p) => p.id === id)
  ).filter((p): p is (typeof projectsData)[number] => Boolean(p));

  // Everything before the detailed roles, folded into a single line so the
  // sheet stays one page without dropping the employers entirely.
  const earlier = experienceData.slice(DETAILED_ROLES);
  const earlierLine = earlier.map((r) => r.company).join(" · ");
  const earlierRange = earlier.length
    ? `${earlier[earlier.length - 1].duration.split(" - ")[0].split(" ").pop()}–${earlier[0].duration.split(" - ")[1].split(" ").pop()}`
    : "";

  return (
    <>
      {/* Outside `.resume-sheet` on purpose — the PDF generator snapshots that
          element's text, and structured data is for crawlers, not the page. */}
      <JsonLd data={[breadcrumb, resumeSchema()]} />
      <div className="min-h-screen bg-surface px-4 py-24 md:py-28 print:bg-white print:p-0">
      {/* Screen-only actions — hidden in print and in the generated PDF */}
      <div className="mx-auto mb-6 flex max-w-[8.5in] flex-wrap items-center justify-between gap-4 print:hidden">
        <p className="t-small text-ink-muted">
          Printable resume — the same content as{" "}
          <a
            href="/experience"
            className="text-blue-700 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            the full career timeline
          </a>
          .
        </p>
        <a
          href="/Bilal_Ahamad_Resume.pdf"
          download
          className="flex items-center gap-2 rounded-xl border border-line/10 bg-ink/5 px-6 py-3 text-ink transition-all hover:bg-ink/10"
        >
          <Download className="h-5 w-5" aria-hidden="true" /> Download PDF
        </a>
      </div>

      {/* Phone screens get a comfortable padding; the Letter-page inches take
          over from `sm` up, which is where the sheet has the width to spend
          them. Print is unaffected either way — globals.css zeroes
          `.resume-sheet` padding with `!important` and lets @page own the
          margins, and the PDF renders at desktop width regardless. */}
      <article className="resume-sheet mx-auto max-w-[8.5in] bg-white px-6 py-8 sm:px-[0.75in] sm:py-[0.7in] text-[#1a1a1a] shadow-2xl print:max-w-none print:shadow-none">
        <header className="mb-2 border-b-2 border-[#1a1a1a] pb-1.5">
          <h1 className="text-3xl font-bold tracking-wide">BILAL AHAMAD</h1>
          <p className="mt-0.5 text-base font-semibold text-[#1a56a0]">{RESUME_HEADLINE}</p>
          <p className="mt-1 text-xs text-[#333]">
            {RESUME_LOCATION}
            {RESUME_CONTACT.map((c) => (
              <span key={c.label}>
                {"  ·  "}
                {c.href ? (
                  <a href={c.href} className="text-[#1a56a0] underline">
                    {c.label}
                  </a>
                ) : (
                  c.label
                )}
              </span>
            ))}
          </p>
        </header>

        <ResumeSection title="Summary">
          <p className="text-sm leading-snug">{RESUME_SUMMARY}</p>
        </ResumeSection>

        <ResumeSection title="Core Skills">
          {RESUME_SKILL_GROUPS.map((g) => (
            <p key={g.label} className="mb-1 text-sm leading-snug">
              <span className="font-bold">{g.label}:</span> {g.items}
            </p>
          ))}
        </ResumeSection>

        <ResumeSection title="Experience">
          {experienceData.slice(0, DETAILED_ROLES).map((role) => (
            <div key={`${role.company}-${role.duration}`} className="mb-1">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-sm font-bold">
                  {role.role.replace(/\n/g, " ")}{" "}
                  <span className="font-normal text-[#1a56a0]">— {role.company}</span>
                </h3>
                <span className="whitespace-nowrap text-xs text-[#444]">
                  {role.duration} · {role.location}
                </span>
              </div>
              <ul className="mt-0.5 ml-4 list-disc">
                {role.highlights.slice(0, 1).map((h) => (
                  <li key={h} className="text-xs leading-snug">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="mt-1 text-xs leading-snug">
            <span className="font-bold">Earlier ({earlierRange}):</span> {earlierLine}
          </p>
        </ResumeSection>

        <ResumeSection title="Selected Projects">
          <p className="text-xs leading-snug">
            {projects.map((p) => p.name).join(" · ")} — shipped, open-source; details at
            bilalahamad.com/projects
          </p>
        </ResumeSection>

        <ResumeSection title="Certifications & Education">
          <p className="mb-0.5 text-xs leading-snug">
            <span className="font-bold">Certifications:</span>{" "}
            {RESUME_CERT_TITLES.join(" · ")}
          </p>
          <p className="text-xs leading-snug">
            <span className="font-bold">{RESUME_EDUCATION.degree}</span> —{" "}
            {RESUME_EDUCATION.school}, {RESUME_EDUCATION.years}
          </p>
        </ResumeSection>
      </article>
      </div>
    </>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-1.5">
      <h2 className="mb-1 border-b border-[#b9b9b9] pb-0.5 text-sm font-bold uppercase tracking-[0.12em]">
        {title}
      </h2>
      {children}
    </section>
  );
}
