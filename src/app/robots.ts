import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/structured-data";

// Crawlers that are protected internals for every bot.
const DISALLOW = ["/api/", "/_next/"];

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
