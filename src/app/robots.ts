import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/structured-data";

// Paths no crawler needs. /api/ serves JSON and form handlers, never indexable
// content.
//
// /_next/ must NOT be listed. Every page's CSS, JS chunks, fonts and next/image
// URLs live under /_next/static and /_next/image, and Google renders pages with
// them. Disallowing /_next/ (2026-06-12 to 2026-10) made Googlebot render every
// page unstyled and without JS ("15/16 page resources blocked by robots.txt"),
// and both affected blog posts landed in "Crawled - currently not indexed".
const DISALLOW = ["/api/"];

// Major AI/LLM crawlers we explicitly welcome so the site is discoverable and
// summarizable by AI agents (training, retrieval, and live-answer bots alike).
// Listing them by name makes the intent unambiguous and overrides any default
// "block AI bots" heuristics a directory generator might assume.
const AI_CRAWLERS = [
  "GPTBot",            // OpenAI — training
  "OAI-SearchBot",     // OpenAI — search
  "ChatGPT-User",      // OpenAI — live browsing on user request
  "ClaudeBot",         // Anthropic — training
  "Claude-Web",        // Anthropic — live browsing
  "anthropic-ai",      // Anthropic — legacy UA
  "PerplexityBot",     // Perplexity
  "Perplexity-User",   // Perplexity — live browsing
  "Google-Extended",   // Google Gemini / Vertex grounding
  "Applebot-Extended", // Apple Intelligence
  "CCBot",             // Common Crawl (feeds many LLMs)
  "cohere-ai",         // Cohere
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default policy for traditional search + everything else.
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      // Explicit, named allowance for AI agents.
      { userAgent: AI_CRAWLERS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
