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

export const metadata: Metadata = {
  title: "Home | Bilal Ahamad",
  description:
    "Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer. 18+ years at Amazon, Google, Rivian, Cruise, Samsara. Portfolio of production-grade automation, IoT, and AI systems.",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bilal Ahamad",
  jobTitle: "Lead Embedded Firmware & Systems QA Engineer",
  email: "bilal.ahamad@gmail.com",
  url: "https://bilalahamad.com",
  image: "https://bilalahamad.com/og-image.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sunnyvale",
    addressRegion: "CA",
    addressCountry: "US",
  },
  sameAs: [
    "https://linkedin.com/in/bilalahamad",
    "https://github.com/bilalahamad0",
  ],
  alumniOf: [
    { "@type": "Organization", name: "Samsara Inc" },
    { "@type": "Organization", name: "Cruise LLC" },
    { "@type": "Organization", name: "Rivian Automotive LLC" },
    { "@type": "Organization", name: "Amazon Lab126" },
    { "@type": "Organization", name: "Google" },
    { "@type": "Organization", name: "Motorola Mobility" },
  ],
  knowsAbout: [
    "firmware validation",
    "test automation",
    "hardware-in-the-loop testing",
    "software-in-the-loop testing",
    "functional safety",
    "ISO 26262",
    "AI/ML product quality",
    "V2X",
    "IoT",
    "NPI bringup",
    "ASIL-D",
    "cross-functional program leadership",
  ],
};

export default function HomePage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="flex flex-col overflow-x-hidden dark" id="top">
      {/* ── Hero ───────────────────────────────────────── */}
      <HeroPortfolio />

      {/* ── Mobile Career Reel — lazy, SSR disabled ──── */}
      <ResumeReelClient />

      {/* ── Featured Projects ──────────────────────── */}
      <div className="section-divider" />
      <FeaturedProjectsSection />

      {/* ── AI Lab Preview ──────────────────────────── */}
      <div className="section-divider" />
      <AILabPreview />

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
