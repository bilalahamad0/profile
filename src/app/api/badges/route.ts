import { NextResponse } from 'next/server';

/**
 * Google Developer Profile badges count.
 *
 * Google's profile page renders via JS Web Components, so static HTML scraping
 * is unreliable. We maintain a manually-verified count and attempt a live check
 * as a best-effort enhancement. Update VERIFIED_BADGE_COUNT when new badges are earned.
 */
const VERIFIED_BADGE_COUNT = 12;

export async function GET() {
  try {
    const response = await fetch('https://developers.google.com/profile/u/bahamad', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const html = await response.text();
      const badgeMatches = html.match(/"badge"/gi);
      if (badgeMatches && badgeMatches.length > VERIFIED_BADGE_COUNT) {
        return NextResponse.json({ count: badgeMatches.length, source: 'live' });
      }
    }
  } catch (error) {
    console.error('Failed to fetch developer badges', error);
  }

  return NextResponse.json({ count: VERIFIED_BADGE_COUNT, source: 'verified' });
}
