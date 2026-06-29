import { NextResponse } from "next/server";
import { getAIMetricsMap } from "@/lib/ai-metrics";
import { rateLimit, getClientIp } from "@/lib/security/ratelimit";

export type { AIAgent, AIMetrics } from "@/lib/ai-metrics";

export const revalidate = 3600;

export async function GET(req: Request) {
  const rl = await rateLimit(`read:ai-metrics:${getClientIp(req)}`, 60, 60);
  if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const metricsMap = await getAIMetricsMap();

  return NextResponse.json(metricsMap, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
