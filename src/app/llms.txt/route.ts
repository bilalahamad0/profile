// Route handler for `/llms.txt` — a machine-readable site map for AI agents
// (https://llmstxt.org). Generated at build time from the same portfolio + blog
// single-source-of-truth data so it always reflects the live content.

import { experienceData, projectsData, certs } from "@/data/portfolio";
import { getAllPosts } from "@/lib/blog";
import { buildLlmsTxt } from "@/lib/llms-txt";

export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsTxt({
    experience: experienceData,
    projects: projectsData,
    certifications: certs,
    posts: getAllPosts(),
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
