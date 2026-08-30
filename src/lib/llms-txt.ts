// Builder for `/llms.txt` — the emerging convention (https://llmstxt.org) that
// gives AI agents (LLMs) a concise, curated, machine-readable map of the site.
// It is generated from the same single-source-of-truth data as the rendered
// pages so it can never drift from the real content.
//
// Kept as a pure function (data is injected, never read from disk here) so it
// is trivially unit-testable.

import { SITE_URL, PERSON_NAME, absoluteUrl } from "@/lib/structured-data";

export type LlmsExperience = {
  role: string;
  company: string;
  duration: string;
  desc: string;
};

export type LlmsProject = {
  name: string;
  tagline: string;
  repo: string;
  demo?: string | null;
  category: string;
  /** Browser-marketplace listings (extensions). `url` is null until published. */
  storeListings?: ReadonlyArray<{ store: string; url: string | null; status: string }>;
};

export type LlmsPost = {
  slug: string;
  title: string;
  description: string;
};

export type LlmsTxtInput = {
  experience: LlmsExperience[];
  projects: LlmsProject[];
  certifications: string[];
  posts: LlmsPost[];
};

/** Collapse internal whitespace/newlines so a value renders on a single markdown line. */
function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

const PAGES: ReadonlyArray<{ name: string; path: string; note: string }> = [
  { name: "Home", path: "", note: "Overview, featured projects, and highlights." },
  { name: "Experience", path: "/experience", note: "Full 18-year career timeline." },
  { name: "Resume", path: "/resume", note: "One-page resume; PDF at /Bilal_Ahamad_Resume.pdf." },
  {
    name: "Projects",
    path: "/projects",
    note: "Open-source automation, IoT, and AI tools, with per-system AI-native engineering metrics at /projects#ai-lab.",
  },
  { name: "Certifications", path: "/certifications", note: "Professional credentials." },
  { name: "Blog", path: "/blog", note: "Project stories and technical whitepapers." },
  { name: "Contact", path: "/contact", note: "Hiring and consulting enquiries." },
];

export function buildLlmsTxt(input: LlmsTxtInput): string {
  const lines: string[] = [];

  lines.push(`# ${PERSON_NAME} — Systems Validation Architect`);
  lines.push("");
  lines.push(
    `> Portfolio of ${PERSON_NAME}: 18+ years engineering firmware and systems quality at Amazon, Google, Rivian, Cruise, and Samsara — test automation architecture, IoT/embedded validation, functional safety, and AI-native development. This file gives AI agents a concise, machine-readable map of ${SITE_URL}.`
  );
  lines.push("");
  lines.push(`- Site: ${SITE_URL}`);
  lines.push("- Role: Systems Validation Architect");
  lines.push("- Location: Sunnyvale, CA, US");
  lines.push("- Contact: bilal.ahamad@gmail.com");

  lines.push("");
  lines.push("## Pages");
  for (const page of PAGES) {
    lines.push(`- [${page.name}](${absoluteUrl(page.path)}): ${page.note}`);
  }

  if (input.experience.length) {
    lines.push("");
    lines.push("## Experience");
    for (const role of input.experience) {
      lines.push(
        `- ${oneLine(role.role)} — ${oneLine(role.company)} (${oneLine(role.duration)}): ${oneLine(role.desc)}`
      );
    }
  }

  if (input.projects.length) {
    lines.push("");
    lines.push("## Projects");
    for (const project of input.projects) {
      const url = project.demo ?? project.repo;
      lines.push(`- [${oneLine(project.name)}](${url}) — ${oneLine(project.category)}: ${oneLine(project.tagline)}`);
      // Extensions ship to several marketplaces; one `url` can only name one.
      const stores = (project.storeListings ?? []).map((listing) =>
        listing.url
          ? `[${oneLine(listing.store)}](${listing.url})`
          : `${oneLine(listing.store)} (${oneLine(listing.status).replace(/-/g, " ")})`
      );
      if (stores.length) lines.push(`  - Available on: ${stores.join(" · ")}`);
    }
  }

  if (input.posts.length) {
    lines.push("");
    lines.push("## Writing");
    for (const post of input.posts) {
      lines.push(
        `- [${oneLine(post.title)}](${absoluteUrl(`/blog/${post.slug}`)}): ${oneLine(post.description)}`
      );
    }
  }

  if (input.certifications.length) {
    lines.push("");
    lines.push("## Certifications");
    for (const cert of input.certifications) {
      lines.push(`- ${oneLine(cert)}`);
    }
  }

  lines.push("");
  return lines.join("\n");
}
