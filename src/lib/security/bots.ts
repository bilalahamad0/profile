/**
 * Verified "good bot" allowlist — search engines, social link-preview fetchers,
 * and AI search crawlers that MUST keep reading the site so SEO/ATS/sharing all
 * keep working. These are recognised by user-agent here as a belt-and-suspenders
 * layer; Vercel's edge Bot Filter maintains its own verified-bot directory that
 * already lets these through.
 *
 * The entry splash is skipped for these agents so they index the static HTML
 * directly — they never see the overlay and there is zero crawl regression.
 */

const VERIFIED_BOTS: RegExp[] = [
  /googlebot/i,
  /google-inspectiontool/i,
  /storebot-google/i,
  /bingbot/i,
  /bingpreview/i,
  /msnbot/i,
  /slurp/i, // Yahoo
  /duckduckbot/i,
  /baiduspider/i,
  /yandex(bot|images)?/i,
  /sogou/i,
  /applebot/i,
  /linkedinbot/i,
  /facebookexternalhit/i,
  /facebot/i,
  /twitterbot/i,
  /slackbot/i,
  /slack-imgproxy/i,
  /discordbot/i,
  /telegrambot/i,
  /whatsapp/i,
  /redditbot/i,
  /pinterest(bot)?/i,
  /embedly/i,
  /skypeuripreview/i,
  /gptbot/i,
  /oai-searchbot/i,
  /chatgpt-user/i,
  /perplexitybot/i,
  /claudebot/i,
  /anthropic-ai/i,
];

/** Generic automation markers — used only to decide the splash is pointless to show. */
const KNOWN_CRAWLERS: RegExp[] = [/bot\b/i, /crawler/i, /spider/i, /\bcurl\//i, /python-requests/i, /headless/i];

/** True for a recognised legitimate crawler/preview agent that must keep crawling. */
export function isVerifiedBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return VERIFIED_BOTS.some((re) => re.test(userAgent));
}

/** True for anything that looks automated — verified or not. */
export function isLikelyBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return true; // no UA at all → treat as automation
  return isVerifiedBot(userAgent) || KNOWN_CRAWLERS.some((re) => re.test(userAgent));
}
