import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge guard for the two state-changing endpoints. It does NOT touch any HTML
 * route — pages render fully for crawlers and the entry splash is a client-only
 * overlay — so there is zero SEO/ATS impact. The heavy lifting against scraping
 * platforms is Vercel's edge Bot Filter (enabled in the dashboard); this just
 * rejects obvious cross-origin POSTs before they reach the handler.
 */
export const config = {
  matcher: ["/api/contact", "/api/session"],
};

export function middleware(req: NextRequest) {
  if (req.method !== "POST") return NextResponse.next();

  // Browsers send Sec-Fetch-Site. If it's explicitly cross-site/cross-origin,
  // it's not our form posting — reject. Non-browser clients omit it (null) and
  // fall through to the route's signed-token check.
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") {
    return NextResponse.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
  }

  return NextResponse.next();
}
