import "server-only";

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
  "adhan-ce": "adhan-ce",
};

const REVALIDATE_SECONDS = 3600;

async function fetchMetrics(projectId: string): Promise<AIMetrics | null> {
  const repo = REPO_MAP[projectId];
  if (!repo) return null;

  const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo}/main/ai-metrics.json`;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { "User-Agent": "bilal-portfolio/1.0" },
    });
    if (!res.ok) return null;
    return (await res.json()) as AIMetrics;
  } catch {
    return null;
  }
}

export async function getAIMetricsMap(): Promise<Record<string, AIMetrics>> {
  const projectIds = Object.keys(REPO_MAP);

  const results = await Promise.all(
    projectIds.map(async (id) => {
      const metrics = await fetchMetrics(id);
      return metrics ? ([id, metrics] as const) : null;
    })
  );

  const map: Record<string, AIMetrics> = {};
  for (const r of results) {
    if (r) map[r[0]] = r[1];
  }
  return map;
}
