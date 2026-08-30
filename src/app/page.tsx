// Server Component — no "use client" needed.
// Interactive children carry their own "use client" boundary.

import type { Metadata } from "next";
import { HeroPortfolio } from "@/components/v3/HeroPortfolio";
import { ResumeReelClient } from "@/components/v3/ResumeReelClient";
import {
  AILabPreview,
  BlogPreview,
  ContactCTA,
} from "@/components/v3/HomePageSections";
import { FeaturedProjectsSection } from "@/components/v3/FeaturedProjects";
import { getAllPosts } from "@/lib/blog";
import { getAIMetricsMap } from "@/lib/ai-metrics";
import { STATIC_FALLBACK } from "@/lib/ai-metrics-fallback";
import { experienceData } from "@/data/portfolio";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  PERSON_ID,
  jobTitleList,
  occupationList,
  websiteSchema,
} from "@/lib/structured-data";
import { RESUME_HEADLINE } from "./resume/resume-content";

export const metadata: Metadata = {
  title: "Home | Bilal Ahamad",
  description:
    "Bilal Ahamad — Systems Validation Architect. 18+ years at Amazon, Google, Rivian, Cruise & Samsara validating embedded firmware, IoT and AI systems.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Home | Bilal Ahamad",
    description:
      "Bilal Ahamad — Systems Validation Architect. 18+ years at Amazon, Google, Rivian, Cruise & Samsara validating embedded firmware, IoT and AI systems.",
    url: "https://bilalahamad.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Bilal Ahamad — Systems Validation Architect" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | Bilal Ahamad",
    description:
      "Bilal Ahamad — Systems Validation Architect. Embedded firmware and safety-critical validation across Amazon, Google, Rivian, Cruise, Samsara.",
    images: ["/og-image.png"],
  },
};

// Titles and tenures are DERIVED from `experienceData` — the same records the
// visible timeline, /resume and llms.txt render. They were hand-maintained here
// until a role's dates drifted 22 months from the timeline; nothing about this
// block should go back to being typed by hand.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Bilal Ahamad",
  jobTitle: jobTitleList(RESUME_HEADLINE, experienceData),
  alternateName: ["Bilal Ahmad", "B. Ahamad", "bilalahamad0"],
  description:
    "Senior/Staff Firmware and Systems Quality Leader with 18+ years on high-stakes launch programs at Amazon, Google, Rivian, Cruise, and Samsara. Specializing in firmware validation, test automation architecture, HIL/SIL, functional safety, AI/ML product quality, and NPI bringup.",
  email: "bilal.ahamad@gmail.com",
  url: "https://bilalahamad.com",
  image: "https://bilalahamad.com/og-image.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sunnyvale",
    addressRegion: "CA",
    addressCountry: { "@type": "Country", name: "US" },
  },
  sameAs: [
    "https://linkedin.com/in/bilalahamad",
    "https://github.com/bilalahamad0",
    "https://g.dev/bahamad",
  ],
  hasOccupation: occupationList(experienceData),
  alumniOf: [
    { "@type": "Organization", name: "Samsara Inc" },
    { "@type": "Organization", name: "Cruise LLC" },
    { "@type": "Organization", name: "Rivian Automotive LLC" },
    { "@type": "Organization", name: "Amazon Lab126" },
    { "@type": "Organization", name: "Amazon" },
    { "@type": "Organization", name: "Google" },
    { "@type": "Organization", name: "Tech Mahindra" },
    { "@type": "Organization", name: "Motorola Mobility" },
    { "@type": "Organization", name: "L&T Infotech" },
    { "@type": "Organization", name: "Wistron Mobile Solutions" },
    { "@type": "Organization", name: "Cognizant Technology" },
    { "@type": "Organization", name: "Cisco" },
    { "@type": "Organization", name: "Luminous Infoways" },
    { "@type": "Organization", name: "Biju Patnaik University of Technology" },
  ],
  // Roughly twenty terms he is genuinely known for, each traceable to a role in
  // `experienceData` or a credential on /certifications. This was 105 entries,
  // which reads as keyword stuffing to search engines and to the AI assistants
  // that increasingly summarize a candidate; a short, defensible list is worth
  // more than a long one nobody believes.
  knowsAbout: [
    "firmware validation",
    "embedded systems testing",
    "test automation architecture",
    "hardware-in-the-loop (HIL) testing",
    "software-in-the-loop (SIL) simulation",
    "Python test automation with Pytest",
    "CI/CD quality gates",
    "functional safety (ISO 26262 / ASIL-D)",
    "safety-critical systems validation",
    "NPI bring-up validation",
    "IoT and fleet telematics device quality",
    "Embedded Linux and RTOS validation",
    "QNX and Android Automotive (AAOS) validation",
    "OTA update validation",
    "V2X and CAN bus testing",
    "Wi-Fi, BLE and LTE connectivity testing",
    "Bluetooth qualification",
    "LiDAR and radar sensor validation",
    "autonomous vehicle compute validation",
    "AI/ML product quality",
    "AI-native software development",
  ],
};

export default async function HomePage() {
  // Live per-repo sidecars, with the build-time mirror standing in for any that
  // fail to fetch — the same contract /projects uses, so the two pages cannot
  // report different totals.
  const dynamic = await getAIMetricsMap();
  const metrics = { ...STATIC_FALLBACK } as typeof STATIC_FALLBACK;
  for (const id of Object.keys(metrics) as Array<keyof typeof STATIC_FALLBACK>) {
    const live = dynamic[id];
    if (live) metrics[id] = live;
  }
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    description: p.description,
    category: p.category,
    readingTime: p.readingTime,
    featured: p.featured,
  }));

  return (
    <>
      <JsonLd data={[personSchema, websiteSchema()]} />
      <div className="flex flex-col overflow-x-hidden" id="top">
      {/* ── Hero ───────────────────────────────────────── */}
      <HeroPortfolio />

      {/* ── Mobile Career Reel — lazy, SSR disabled ──── */}
      <ResumeReelClient />

      {/* ── Featured Projects ──────────────────────── */}
      <div className="section-divider" />
      <FeaturedProjectsSection />

      {/* ── AI Lab Preview ──────────────────────────── */}
      <div className="section-divider" />
      <AILabPreview metrics={metrics} />

      {/* ── Blog / Lab Notes ─────────────────────────── */}
      <div className="section-divider" />
      <BlogPreview posts={posts} />

      {/* ── Contact / Availability CTA ───────────────── */}
      <div className="section-divider" />
      <ContactCTA />
    </div>
    </>
  );
}
