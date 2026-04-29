import { NextResponse } from "next/server";

export type AIAgent = {
  name: string;
  provider: string;
  period: string;
  models: string[];
  tokens: number;
  role: string;
};

export type AIMetrics = {
  projectId: string;
  lastUpdated: string;
  aiContribution: number;
  agents: AIAgent[];
  totalTokens: number;
  totalCommits: number;
  linesOfCode: number;
  devCycleDays: number;
  manualEstimateDays: number;
  impact: string;
  cycle: string;
  beforeAI: string;
  afterAI: string;
  microservices?: number;
  tests?: number;
  testSuites?: number;
};

const GITHUB_USER = "bilalahamad0";

const REPO_MAP: Record<string, string> = {
  warn: "warn",
  adhan: "adhan-api",
  profile: "profile",
  tmo: "tmo",
};

async function fetchMetrics(projectId: string): Promise<AIMetrics | null> {
  const repo = REPO_MAP[projectId];
  if (!repo) return null;

  const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo}/main/ai-metrics.json`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "bilal-portfolio/1.0" },
    });
    if (!res.ok) return null;
    return (await res.json()) as AIMetrics;
  } catch {
    return null;
  }
}

/**
 * GET /api/ai-metrics
 * Fetches ai-metrics.json sidecar files from each repo's GitHub raw URL.
 * Returns only successfully fetched metrics — the client merges with static fallback data.
 * Cached for 1 hour at the edge.
 */
export async function GET() {
  const projectIds = Object.keys(REPO_MAP);

  const results = await Promise.all(
    projectIds.map(async (id) => {
      const metrics = await fetchMetrics(id);
      return metrics ? { id, metrics } : null;
    })
  );

  const metricsMap: Record<string, AIMetrics> = {};
  for (const r of results) {
    if (r) metricsMap[r.id] = r.metrics;
  }

  return NextResponse.json(metricsMap, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
