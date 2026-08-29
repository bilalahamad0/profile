// Server Component for static sections; filter logic lifted to client child.
// Layout already provides NavbarV2 globally.

import type { Metadata } from "next";
import Link from "next/link";
import { Clock, FileText, ArrowRight, BookOpen } from "lucide-react";
import { linkedInPosts } from "@/data/portfolio";
import { getAllPosts } from "@/lib/blog";
import { BlogGridClient } from "@/components/blog/BlogGridClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogSchema, breadcrumbList } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Project stories, technical whitepapers, and thoughts on AI-native engineering by Bilal Ahamad — firmware quality lead and agentic developer.",
  alternates: { canonical: "/blog" },
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

const breadcrumb = breadcrumbList([
  { name: "Home", path: "" },
  { name: "Blog", path: "/blog" },
]);

// Thumbnails are presentation assets keyed by slug — not part of post content,
// so they live here rather than in MDX frontmatter.
const slugToThumb: Record<string, string> = {
  "adhan-caster-extension-story": "/images/adhan-ce-demo.mp4",
  "gemma-ollama-raspberry-pi-adhan": "/blog-thumbs/gemma-ollama-raspberry-pi-adhan.png",
  "resilient-iot-application": "/blog-thumbs/resilient-iot.png",
  "clock-jump-case-study": "/blog-thumbs/iot_clock_jump_thumbnail.png",
  "ai-driven-development": "/blog-thumbs/ai-native-dev.png",
  "california-warn-story": "/blog-thumbs/california-warn.png",
  "warn-tracker-goes-national": "/blog-thumbs/us-warn-national.png",
  "media-caster-story": "/blog-thumbs/media-caster.png",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// "2026-05-24" -> "May 24, 2026"; non-ISO input is returned unchanged.
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const mi = Number(m) - 1;
  if (!y || !d || mi < 0 || mi > 11) return iso;
  return `${MONTHS[mi]} ${Number(d)}, ${y}`;
}

// Single source of truth: post content comes from MDX frontmatter via getAllPosts().
// Only presentation (thumbnail, display date) is layered on here.
const allPosts = getAllPosts();

export const mdxPosts = allPosts.map((p) => ({
  slug: p.slug,
  title: p.title,
  date: formatDate(p.date),
  description: p.description,
  tags: p.tags,
  category: p.category,
  readingTime: p.readingTime,
  featured: p.featured,
  thumbnail: slugToThumb[p.slug],
}));

// schema.org Blog listing every post (raw ISO dates) for rich results + AI agents.
const blogLd = blogSchema(allPosts);

const featured = mdxPosts.find((p) => p.featured);

export default function BlogPage() {
  return (
    <>
      <JsonLd data={[breadcrumb, blogLd]} />
    <div className="min-h-screen bg-[#09090b] text-white" id="top">

      {/* Header — static, server-rendered, paints instantly */}
      <section className="pt-24 pb-10 md:pt-28 md:pb-12 lg:pt-36 lg:pb-16 px-6 lg:px-24 border-b border-white/5 relative overflow-hidden" aria-labelledby="blog-heading">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <BookOpen className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Writing &amp; Insights</span>
          </div>
          <h1 id="blog-heading" className="t-h1 mb-6">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Lab Notes
            </span>
          </h1>
          <p className="t-lead text-zinc-400 font-light max-w-2xl">
            Project stories, technical whitepapers, and thoughts on AI-native engineering. Published posts from LinkedIn and
            original deep-dives.
          </p>
        </div>
      </section>

      {/* Featured Post Hero — static HTML, instant paint */}
      {featured && (
        <section className="px-6 lg:px-24 py-10 md:py-12 lg:py-16 border-b border-white/5" aria-label="Featured post">
          <div className="max-w-7xl mx-auto">
            <p className="t-label font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">Featured Post</p>
            <Link href={`/blog/${featured.slug}`}>
              <div className="group relative rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 via-white/[0.02] to-transparent overflow-hidden p-8 md:p-14 hover:border-violet-500/40 transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-violet-500/10 transition-all" />
                <div className="relative z-10 max-w-3xl">
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                      {featured.category === "Whitepaper" ? (
                        <FileText className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
                      ) : (
                        <BookOpen className="w-3.5 h-3.5 text-violet-400" aria-hidden="true" />
                      )}
                      <span className="t-label font-black uppercase tracking-wider text-violet-300">{featured.category}</span>
                    </div>
                    <span className="text-xs text-zinc-400">{featured.date}</span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {featured.readingTime} min read
                    </span>
                  </div>
                  <h2 className="t-h2 text-white mb-4 group-hover:text-violet-200 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="t-lead text-zinc-400 mb-8">{featured.description}</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-violet-400 group-hover:gap-3 transition-all">
                    Read {featured.category} <ArrowRight className="w-4 h-4" />
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

    </div>
    </>
  );
}
