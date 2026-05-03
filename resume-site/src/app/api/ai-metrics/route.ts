import { NextResponse } from "next/server";
import { getAIMetricsMap } from "@/lib/ai-metrics";

export type { AIAgent, AIMetrics } from "@/lib/ai-metrics";

export const revalidate = 3600;

export async function GET() {
  const metricsMap = await getAIMetricsMap();

  return NextResponse.json(metricsMap, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
