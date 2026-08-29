import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/structured-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  // Freshness signal for the index pages that surface the latest writing.
  // Content-driven (newest post date) rather than a hardcoded build date so it
  // only changes when the content actually does.
  const newestPost = posts
    .map((p) => new Date(p.date))
    .filter((d) => !Number.isNaN(d.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                      priority: 1.0, changeFrequency: "weekly",  lastModified: newestPost },
    { url: `${SITE_URL}/experience`,      priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/resume`,          priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/projects`,        priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/certifications`,  priority: 0.8, changeFrequency: "monthly" },
    // No /ai entry: the AI Lab is now the #ai-lab section of /projects, and /ai
    // 301s there (next.config.ts). Listing a redirecting URL would be a soft error.
    { url: `${SITE_URL}/blog`,            priority: 0.8, changeFrequency: "weekly",  lastModified: newestPost },
    { url: `${SITE_URL}/contact`,         priority: 0.7, changeFrequency: "yearly"  },
    { url: `${SITE_URL}/privacy`,         priority: 0.3, changeFrequency: "yearly"  },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...blogRoutes];
}
