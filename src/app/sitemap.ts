import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://bilalahamad.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                      priority: 1.0, changeFrequency: "weekly"  },
    { url: `${BASE}/experience`,      priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/projects`,        priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/certifications`,  priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/ai`,              priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/blog`,            priority: 0.8, changeFrequency: "weekly"  },
    { url: `${BASE}/contact`,         priority: 0.7, changeFrequency: "yearly"  },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...blogRoutes];
}
