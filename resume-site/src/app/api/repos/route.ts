import { NextResponse } from "next/server";

const REPOS = ["warn", "adhan-api", "profile", "tmo"];

/**
 * Cached proxy for GitHub repo metadata.
 * Revalidates every hour — eliminates direct GitHub API calls from the browser
 * and prevents hitting the 60 req/hr unauthenticated rate limit.
 */
export async function GET() {
  try {
    const results = await Promise.all(
      REPOS.map((repo) =>
        fetch(`https://api.github.com/repos/bilalahamad0/${repo}`, {
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "bilal-portfolio/1.0",
          },
          next: { revalidate: 3600 }, // Cache for 1 hour
        })
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null)
      )
    );

    const repos = results
      .filter((r) => r && r.id)
      .map((r) => ({
        name: r.name as string,
        description: r.description as string,
        html_url: r.html_url as string,
        stargazers_count: r.stargazers_count as number,
        forks_count: r.forks_count as number,
        language: r.language as string | null,
      }));

    return NextResponse.json(repos, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
