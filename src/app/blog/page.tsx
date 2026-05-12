// Server Component for static sections; filter logic lifted to client child.
// Layout already provides NavbarV2 globally.

import type { Metadata } from "next";
import Link from "next/link";
import { Clock, FileText, ArrowRight, BookOpen } from "lucide-react";
import { linkedInPosts } from "@/data/portfolio";
import { BlogGridClient } from "@/components/blog/BlogGridClient";

export const metadata: Metadata = {
  title: "Blog",
  description: "Project stories, technical whitepapers, and thoughts on AI-native engineering by Bilal Ahamad — firmware quality lead and agentic developer.",
  openGraph: {
    type: "website",
    title: "Blog | Bilal Ahamad",
    description:
      "Project stories, technical whitepapers, and thoughts on AI-native engineering by Bilal Ahamad.",
    url: "https://bilalahamad.com/blog",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Bilal Ahamad — Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Bilal Ahamad",
    description:
      "Project stories, technical whitepapers, and thoughts on AI-native engineering by Bilal Ahamad.",
    images: ["/og-image.png"],
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://bilalahamad.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://bilalahamad.com/blog" },
  ],
};

// Static post metadata — defined at module level, not inside a client component
export const mdxPosts = [
  {
    slug: "resilient-iot-application",
    title: "Engineering a Resilient Smart Home IoT Application: Lessons in Latency, mDNS, and Self-Healing Systems",
    date: "April 30, 2026",
    description:
      "Building a highly reliable, zero-latency IoT system on a Raspberry Pi, tackling mDNS discovery, background compute windows, and self-healing multi-tier fallbacks.",
    tags: ["IoT", "Raspberry Pi", "Networking", "Node.js", "System Design"],
    category: "Whitepaper" as const,
    readingTime: 6,
    featured: false,
    thumbnail: "/blog-thumbs/resilient-iot.png",
  },
  {
    slug: "clock-jump-case-study",
    title: "Engineering a Resilient Smart Home IoT Application: Navigating System Clock Jumps and Network Outages",
    date: "May 12, 2026",
    description:
      "A deep dive into how an unexpected network outage and subsequent NTP clock jump caused chaos in a Node.js IoT scheduler, and how we engineered a resilient self-healing pipeline.",
    tags: ["IoT", "Node.js", "Raspberry Pi", "System Architecture", "Debugging"],
    category: "Whitepaper" as const,
    readingTime: 5,
    featured: false,
    thumbnail: "/blog-thumbs/iot_clock_jump_thumbnail.png",
  },
  {
    slug: "ai-driven-development",
    title: "AI-Driven Development: Compressing 3 Weeks into 4 Days",
    date: "August 26, 2025",
    description:
      "A technical whitepaper on AI-native software engineering: methodology, toolchain, metrics, and a framework for measuring engineering velocity gains.",
    tags: ["AI", "Software Engineering", "Productivity"],
    category: "Whitepaper" as const,
    readingTime: 8,
    featured: true,
    thumbnail: "/blog-thumbs/ai-native-dev.png",
  },
  {
    slug: "california-warn-story",
    title: "California Live Layoff Monitoring Dashboard: Live Layoff Intelligence from Scratch",
    date: "August 20, 2025",
    description:
      "How I built a fully automated data pipeline that transforms raw California WARN Act filings into live, actionable layoff intelligence — running twice daily with zero human intervention.",
    tags: ["Python", "GitHub Actions", "Data Engineering"],
    category: "Project Story" as const,
    readingTime: 6,
    featured: false,
    thumbnail: "/blog-thumbs/california-warn.png",
  },
  {
    slug: "media-caster-story",
    title: "Smart-Home IoT Media Caster: Engineering IoT Automation with AI",
    date: "August 12, 2025",
    description:
      "A deep dive into building a prayer-time IoT orchestration system with Raspberry Pi, ADB, and Sony Android TV — compressed from 3 weeks to 4 days using AI pair programming.",
    tags: ["IoT", "Raspberry Pi", "ADB", "Node.js"],
    category: "Project Story" as const,
    readingTime: 5,
    featured: false,
    thumbnail: "/blog-thumbs/media-caster.png?v=2",
  },
];

const featured = mdxPosts.find((p) => p.featured);

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    <main className="min-h-screen bg-[#09090b] text-white" id="top">

      {/* Header — static, server-rendered, paints instantly */}
      <section className="pt-24 pb-10 md:pt-28 md:pb-12 lg:pt-36 lg:pb-16 px-6 lg:px-24 border-b border-white/5 relative overflow-hidden" aria-labelledby="blog-heading">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <BookOpen className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Writing &amp; Insights</span>
          </div>
          <h1 id="blog-heading" className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-none">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Lab Notes
            </span>
          </h1>
          <p className="text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
            Project stories, technical whitepapers, and thoughts on AI-native engineering. Published posts from LinkedIn and
            original deep-dives.
          </p>
        </div>
      </section>

      {/* Featured Post Hero — static HTML, instant paint */}
      {featured && (
        <section className="px-6 lg:px-24 py-10 md:py-12 lg:py-16 border-b border-white/5" aria-label="Featured post">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Featured Post</p>
            <Link href={`/blog/${featured.slug}`}>
              <div className="group relative rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 via-white/[0.02] to-transparent overflow-hidden p-8 md:p-14 hover:border-violet-500/40 transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-violet-500/10 transition-all" />
                <div className="relative z-10 max-w-3xl">
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                      <FileText className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-violet-300">Whitepaper</span>
                    </div>
                    <span className="text-xs text-zinc-500">{featured.date}</span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {featured.readingTime} min read
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-4 group-hover:text-violet-200 transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-8">{featured.description}</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-violet-400 group-hover:gap-3 transition-all">
                    Read Whitepaper <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Top Mask Overlay — darkens content behind filter bar */}
      <div className="mask-top-dark" aria-hidden="true" />

      {/* Lazy-loaded interactive filter + grid — client component */}
      <BlogGridClient mdxPosts={mdxPosts} linkedInPosts={linkedInPosts} />

    </main>
    </>
  );
}
