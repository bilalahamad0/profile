// Centralized JSON-LD structured-data builders.
//
// These are pure functions returning plain objects so they can be unit-tested
// and embedded via the <JsonLd> component. Keeping every schema.org entity
// (Person, WebSite, Blog, credentials, projects) in one place keeps the site's
// machine-readable identity consistent across routes — which is what both
// search engines and AI agents (LLMs) rely on to summarize the site accurately.

import type { Certification } from "@/data/portfolio";

export const SITE_URL = "https://bilalahamad.com";
export const PERSON_NAME = "Bilal Ahamad";
/** Stable @id for the Person entity declared on the homepage. */
export const PERSON_ID = `${SITE_URL}/#person`;
/** Stable @id for the WebSite entity. */
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** A lightweight reference to the site's canonical Person entity. */
const personRef = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON_NAME,
  url: SITE_URL,
} as const;

/** Resolve an on-site path to an absolute URL. `""` → the site root (no trailing slash). */
export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export type Crumb = { name: string; path: string };

/** schema.org BreadcrumbList for a route's ancestry (Home → … → current page). */
export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** schema.org WebSite — establishes the site entity and its author/publisher. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: `${PERSON_NAME} — Portfolio`,
    description:
      "Portfolio of Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer with 18+ years across Amazon, Google, Rivian, Cruise, and Samsara. Firmware validation, test automation architecture, IoT, functional safety, and AI-native development.",
    inLanguage: "en-US",
    author: personRef,
    publisher: personRef,
    copyrightHolder: personRef,
  };
}

/**
 * One career role, as `experienceData` records it. Only the three fields the
 * schema needs are required, so the real records — which also carry logos,
 * highlights and layout flags — satisfy this structurally.
 */
export type ExperienceLike = {
  role: string;
  company: string;
  duration: string;
};

/** ISO `yyyy-MM` bounds of a role. `endDate` is absent for a current role. */
export type RoleDates = { startDate: string; endDate?: string };

const MONTH_NUMBER: Readonly<Record<string, string>> = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

/** `"Sep 2025"` → `"2025-09"`. Null for anything that is not a month + year. */
function isoMonth(token: string): string | null {
  const match = /^([A-Za-z]{3,9})\.?\s+(\d{4})$/.exec(token.trim());
  if (!match) return null;
  const month = MONTH_NUMBER[match[1].slice(0, 3).toLowerCase()];
  return month ? `${match[2]}-${month}` : null;
}

/**
 * Parse a portfolio `duration` string — `"Dec 2014 - Sep 2015"`,
 * `"Jun 2021 - Present"` — into ISO dates.
 *
 * Returns null when either end is unreadable: the caller then drops the entry
 * rather than publishing a guessed date. A wrong tenure in machine-readable
 * markup is worse than a missing one, because search engines and AI assistants
 * repeat it as fact.
 */
export function parseRoleDates(duration: string): RoleDates | null {
  const parts = duration.split(/\s*[-–—]\s*/);
  if (parts.length !== 2) return null;
  const startDate = isoMonth(parts[0]);
  if (!startDate) return null;
  if (/^present$/i.test(parts[1].trim())) return { startDate };
  const endDate = isoMonth(parts[1]);
  return endDate ? { startDate, endDate } : null;
}

/** Job titles are stored with hard line breaks for the timeline's layout. */
function flattenTitle(role: string): string {
  return role.replace(/\s+/g, " ").trim();
}

/**
 * schema.org `hasOccupation` — one Role per career entry, generated from the
 * very records the visible timeline renders.
 *
 * This used to be a hand-maintained array and had drifted from the timeline by
 * up to 22 months on a single role. Deriving it makes that class of bug
 * structurally impossible: the markup Google and LinkedIn read cannot disagree
 * with the page a human reads, because both are the same data.
 */
export function occupationList(experience: ExperienceLike[]) {
  return experience.flatMap((entry) => {
    const dates = parseRoleDates(entry.duration);
    if (!dates) return [];
    return [
      {
        "@type": "Role",
        roleName: flattenTitle(entry.role),
        ...dates,
        occupiedBy: { "@type": "Organization", name: entry.company },
      },
    ];
  });
}

/**
 * schema.org `jobTitle` — the current headline first, then every distinct title
 * held, newest to oldest, deduplicated.
 */
export function jobTitleList(headline: string, experience: ExperienceLike[]): string[] {
  return [...new Set([headline, ...experience.map((entry) => flattenTitle(entry.role))])];
}

/**
 * schema.org ProfilePage for the one-page resume — the URL a recruiter is most
 * likely to be sent, and the one that carried no structured data at all. It
 * points at the same Person `@id` the homepage declares, so a crawler resolves
 * the sheet to the site's single identity rather than a second, thinner one.
 */
export function resumeSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/resume`,
    url: `${SITE_URL}/resume`,
    name: `${PERSON_NAME} — Resume`,
    description:
      "One-page resume of Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer with 18+ years across Amazon Lab126, Google, Rivian, Cruise, and Samsara.",
    inLanguage: "en-US",
    mainEntity: personRef,
    about: personRef,
    // The PDF is Chromium's print of this same route — same facts, one file.
    relatedLink: absoluteUrl("/Bilal_Ahamad_Resume.pdf"),
  };
}

const CREDENTIAL_CATEGORY: Record<Certification["category"], string> = {
  ai: "AI & Machine Learning",
  testing: "Software Testing",
  leadership: "Leadership & Management",
};

/** schema.org ProfilePage with an ItemList of professional credentials. */
export function certificationsSchema(certs: Certification[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/certifications`,
    name: `${PERSON_NAME} — Certifications`,
    mainEntity: personRef,
    about: personRef,
    hasPart: {
      "@type": "ItemList",
      name: "Professional Certifications",
      numberOfItems: certs.length,
      itemListElement: certs.map((cert, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "EducationalOccupationalCredential",
          name: cert.title,
          credentialCategory: CREDENTIAL_CATEGORY[cert.category],
          about: CREDENTIAL_CATEGORY[cert.category],
        },
      })),
    },
  };
}

export type ProjectLike = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  tech: string[];
  repo: string;
  demo?: string | null;
  /** Browser-marketplace listings (extensions). Only published ones carry a URL. */
  storeListings?: ReadonlyArray<{ url: string | null }>;
};

/** schema.org CollectionPage with an ItemList of the portfolio's projects (SoftwareSourceCode). */
export function projectsSchema(projects: ProjectLike[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/projects`,
    name: `${PERSON_NAME} — Projects`,
    about: personRef,
    mainEntity: {
      "@type": "ItemList",
      name: "Open-source & production projects",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, i) => {
        // Published marketplace listings — the crawler-visible proof that an
        // extension ships to more than the one storefront `url` can name.
        const storeUrls = (project.storeListings ?? [])
          .map((listing) => listing.url)
          .filter((url): url is string => url !== null);

        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareSourceCode",
            name: project.name,
            abstract: project.tagline,
            description: project.description,
            codeRepository: project.repo,
            url: project.demo ?? project.repo,
            applicationCategory: project.category,
            programmingLanguage: project.tech,
            keywords: project.tech.join(", "),
            author: personRef,
            creator: personRef,
            ...(storeUrls.length > 0 ? { sameAs: storeUrls } : {}),
          },
        };
      }),
    },
  };
}

export type PostLike = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

/** schema.org Blog listing every published post as a BlogPosting reference. */
export function blogSchema(posts: PostLike[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog`,
    name: `${PERSON_NAME} — Lab Notes`,
    description:
      "Project stories, technical whitepapers, and thoughts on AI-native engineering by Bilal Ahamad.",
    inLanguage: "en-US",
    author: personRef,
    publisher: personRef,
    blogPost: posts.map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      return {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: personRef,
      };
    }),
  };
}
