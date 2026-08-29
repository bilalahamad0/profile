import type { Metadata } from "next";
import { Download } from "lucide-react";
import { experienceData, projectsData } from "@/data/portfolio";
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
  },
};

/** Roles that carry their full bullet set; older roles condense to one line. */
const FULL_DETAIL_ROLES = 6;

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

  return (
    <div className="min-h-screen bg-surface px-4 py-24 md:py-28 print:bg-white print:p-0">
      {/* Screen-only actions — hidden in print and in the generated PDF */}
      <div className="mx-auto mb-6 flex max-w-[8.5in] flex-wrap items-center justify-between gap-4 print:hidden">
        <p className="t-small text-ink-muted">
          Printable resume — the same content as{" "}
          <a
            href="/experience"
            className="text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
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
        <header className="mb-3 border-b-2 border-[#1a1a1a] pb-2">
          <h1 className="text-3xl font-bold tracking-wide">BILAL AHAMAD</h1>
          <p className="mt-0.5 text-base font-semibold text-[#1a56a0]">{RESUME_HEADLINE}</p>
          <p className="mt-1 text-xs text-[#333]">
            {RESUME_LOCATION}
            {RESUME_CONTACT.map((c) => (
              <span key={c.label}>
                {"  ·  "}
                {c.href ? (
                  <a href={c.href} className="text-[#1a56a0]">
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
          {experienceData.map((role, i) => {
            const condensed = i >= FULL_DETAIL_ROLES;
            return (
              <div key={`${role.company}-${role.duration}`} className="mb-1.5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-sm font-bold">
                    {role.role.replace(/\n/g, " ")}{" "}
                    <span className="font-normal text-[#1a56a0]">— {role.company}</span>
                  </h3>
                  <span className="whitespace-nowrap text-xs text-[#444]">
                    {role.duration} · {role.location}
                  </span>
                </div>
                {!condensed && (
                  <p className="mt-0.5 text-xs leading-snug text-[#333]">{role.desc}</p>
                )}
                <ul className="mt-0.5 ml-4 list-disc">
                  {(condensed ? role.highlights.slice(0, 1) : role.highlights.slice(0, 2)).map(
                    (h) => (
                      <li key={h} className="text-xs leading-snug">
                        {h}
                      </li>
                    )
                  )}
                </ul>
              </div>
            );
          })}
        </ResumeSection>

        <ResumeSection title="Selected Projects">
          {projects.map((p) => (
            <p key={p.id} className="mb-1 text-xs leading-snug">
              <span className="font-bold">{p.name}</span> — {p.description}
            </p>
          ))}
        </ResumeSection>

        <div className="flex gap-8">
          {/* Certifications take the wider column: their titles are long enough
              to wrap to a second line at 50/50, which spilled a page. */}
          <div className="flex-[1.6]">
            <ResumeSection title="Certifications">
              <ul className="ml-4 list-disc">
                {RESUME_CERT_TITLES.map((c) => (
                  <li key={c} className="text-xs leading-snug">
                    {c}
                  </li>
                ))}
              </ul>
            </ResumeSection>
          </div>
          <div className="flex-1">
            <ResumeSection title="Education">
              <p className="text-xs leading-snug">
                <span className="font-bold">{RESUME_EDUCATION.degree}</span>
                <br />
                {RESUME_EDUCATION.school} — {RESUME_EDUCATION.years}
              </p>
            </ResumeSection>
          </div>
        </div>
      </article>
    </div>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-2">
      <h2 className="mb-1 border-b border-[#b9b9b9] pb-0.5 text-sm font-bold uppercase tracking-[0.12em]">
        {title}
      </h2>
      {children}
    </section>
  );
}
