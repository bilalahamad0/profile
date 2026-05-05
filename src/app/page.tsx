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
  openGraph: {
    type: "website",
    title: "Home | Bilal Ahamad",
    description:
      "Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer. 18+ years at Amazon, Google, Rivian, Cruise, Samsara. Portfolio of production-grade automation, IoT, and AI systems.",
    url: "https://bilalahamad.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | Bilal Ahamad",
    description:
      "Bilal Ahamad — Lead Embedded Firmware & Systems QA Engineer. 18+ years at Amazon, Google, Rivian, Cruise, Samsara.",
    images: ["/og-image.png"],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bilal Ahamad",
  jobTitle: [
    "Lead Embedded Firmware & Systems QA Engineer",
    "Founding System Architect & Technical QA Lead",
    "Senior Firmware Quality Lead",
    "Senior Automation Architect",
    "Infotainment & V2X Firmware Test Lead",
    "Product Quality Lead & Senior QA Engineer II",
    "Senior Test Engineer",
    "Product Validation Engineer",
    "Radio Validation Engineer",
    "Test Automation Lead",
    "Software Developer",
  ],
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
  hasOccupation: [
    {
      "@type": "Role",
      roleName: "Founding System Architect & Technical QA Lead",
      startDate: "2025-09",
      occupiedBy: { "@type": "Organization", name: "Stealth Mode Startup" },
    },
    {
      "@type": "Role",
      roleName: "Senior Firmware Quality Lead",
      startDate: "2023-12",
      endDate: "2025-07",
      occupiedBy: { "@type": "Organization", name: "Samsara Inc" },
    },
    {
      "@type": "Role",
      roleName: "Senior Automation Architect",
      startDate: "2022-10",
      endDate: "2023-06",
      occupiedBy: { "@type": "Organization", name: "Cruise LLC" },
    },
    {
      "@type": "Role",
      roleName: "Infotainment & V2X Firmware Test Lead",
      startDate: "2021-06",
      endDate: "2022-09",
      occupiedBy: { "@type": "Organization", name: "Rivian Automotive LLC" },
    },
    {
      "@type": "Role",
      roleName: "Product Quality Lead & Senior QA Engineer II",
      startDate: "2018-06",
      endDate: "2021-06",
      occupiedBy: { "@type": "Organization", name: "Amazon Lab126" },
    },
    {
      "@type": "Role",
      roleName: "Senior Test Engineer",
      startDate: "2016-01",
      endDate: "2018-06",
      occupiedBy: { "@type": "Organization", name: "Google Inc / Tech Mahindra" },
    },
    {
      "@type": "Role",
      roleName: "Product Validation Engineer",
      startDate: "2015-09",
      endDate: "2016-01",
      occupiedBy: { "@type": "Organization", name: "Cognizant Technology / Cisco" },
    },
    {
      "@type": "Role",
      roleName: "Radio Validation Engineer",
      startDate: "2013-01",
      endDate: "2015-09",
      occupiedBy: { "@type": "Organization", name: "Wistron Mobile Solutions" },
    },
    {
      "@type": "Role",
      roleName: "Test Automation Lead",
      startDate: "2010-01",
      endDate: "2013-01",
      occupiedBy: { "@type": "Organization", name: "L&T Infotech / Motorola Mobility" },
    },
    {
      "@type": "Role",
      roleName: "Software Developer",
      startDate: "2008-01",
      endDate: "2010-01",
      occupiedBy: { "@type": "Organization", name: "Luminous Infoways" },
    },
  ],
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
  knowsAbout: [
    "firmware validation",
    "embedded systems testing",
    "test automation architecture",
    "systems integration testing",
    "hardware-in-the-loop testing",
    "HIL validation",
    "software-in-the-loop testing",
    "SIL validation",
    "CI/CD quality gates",
    "firmware quality governance",
    "release governance",
    "go/no-go decision authority",
    "release readiness",
    "quality KPI dashboards",
    "defect governance",
    "defect lifecycle management",
    "SDLC transformation",
    "NPI bringup validation",
    "V1 innovation",
    "EVT DVT PVT quality",
    "functional safety",
    "ISO 26262",
    "ASIL-D compliance",
    "safety-critical systems",
    "V2X firmware validation",
    "vehicle compute automation",
    "automotive firmware engineering",
    "infotainment firmware validation",
    "OTA validation",
    "QNX embedded systems",
    "Android automotive",
    "L2 autonomy validation",
    "PCAP replay testing",
    "CAN bus testing",
    "fault injection testing",
    "Wireshark diagnostics",
    "IoT firmware quality",
    "IoT systems validation",
    "Raspberry Pi automation",
    "ARM embedded validation",
    "ESP32 firmware testing",
    "RTOS embedded testing",
    "ADB Android automation",
    "BLE testing",
    "LTE Wi-Fi connectivity testing",
    "LiDAR sensor validation",
    "Radar sensor validation",
    "heterogeneous embedded stacks",
    "AI/ML product quality",
    "AI algorithm precision testing",
    "ML model validation",
    "AI-native engineering",
    "AI pair programming",
    "agentic development",
    "multi-agent workflows",
    "AI dashcam quality",
    "autonomous vehicle quality",
    "XR product validation",
    "VR controller testing",
    "3DOF robotic validation",
    "DSP acoustic testing",
    "Alexa Voice Service quality",
    "voice product quality",
    "Python test automation",
    "Pytest automation framework",
    "Appium mobile automation",
    "Selenium automation",
    "Shell scripting automation",
    "C++ embedded testing",
    "JavaScript automation",
    "Arduino automation",
    "Jenkins CI/CD",
    "Docker simulation",
    "QEMU simulation",
    "Bazel build system",
    "GitHub Actions",
    "Splunk observability",
    "Grafana dashboards",
    "Kibana analytics",
    "Datadog monitoring",
    "Databricks",
    "GraphQL testing",
    "cross-functional program leadership",
    "technical mentorship",
    "engineering team leadership",
    "stakeholder alignment",
    "executive risk framing",
    "cost of quality optimization",
    "operational savings",
    "regression cycle time reduction",
    "post-launch escape reduction",
    "beta coordination",
    "production sign-off",
    "ISTQB certified tester",
    "Bluetooth qualification",
    "WLAN IoT automation",
    "set-top box validation",
    "handset interoperability testing",
    "government portal quality",
    "Unified Sensor Integration IDE",
    "Docker QEMU simulation-backed validation",
    "A/B performance qualification",
    "Scrum Agile quality",
    "waterfall SDLC",
    "total cost of quality",
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
