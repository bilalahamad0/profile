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
  title: "Home",
  description:
    "Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer. 18+ years at Amazon, Google, Rivian, Cruise, Samsara. Portfolio of production-grade automation, IoT, and AI systems.",
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
  );
}
