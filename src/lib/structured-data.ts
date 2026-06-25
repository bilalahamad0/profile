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
      itemListElement: projects.map((project, i) => ({
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
        },
      })),
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
