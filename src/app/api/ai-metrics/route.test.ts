import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { AIMetrics } from "./route";
import { GET } from "./route";

const fetchMock = vi.fn<typeof fetch>();
const originalFetch = globalThis.fetch;

function createMetrics(projectId: string): AIMetrics {
  return {
    projectId,
    lastUpdated: "2026-04-20",
    aiContribution: 72,
    agents: [
      {
        name: "Coverage Agent",
        provider: "Cursor",
        period: "daily",
        models: ["composer"],
        tokens: 42000,
        role: "regression prevention",
      },
    ],
    totalTokens: 42000,
    totalCommits: 10,
    linesOfCode: 1200,
    devCycleDays: 3,
    manualEstimateDays: 8,
    impact: "High confidence",
    cycle: "3 days",
    beforeAI: "8 days",
    afterAI: "3 days",
  };
}

describe("GET /api/ai-metrics", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns only successful project metrics and keeps cache headers", async () => {
    const warnMetrics = createMetrics("warn");
    const tmoMetrics = createMetrics("tmo");

    fetchMock.mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/warn/")) {
        return new Response(JSON.stringify(warnMetrics), { status: 200 });
      }

      if (url.includes("/adhan-api/")) {
        return new Response("not found", { status: 404 });
      }

      if (url.includes("/profile/")) {
        throw new Error("connection reset");
      }

      if (url.includes("/tmo/")) {
        return new Response(JSON.stringify(tmoMetrics), { status: 200 });
      }

      return new Response("unknown repo", { status: 500 });
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600, stale-while-revalidate=7200"
    );
    expect(fetchMock).toHaveBeenCalledTimes(5);

    const calledUrls = fetchMock.mock.calls.map(([input]) => String(input));
    expect(calledUrls).toEqual([
      "https://raw.githubusercontent.com/bilalahamad0/warn/main/ai-metrics.json",
      "https://raw.githubusercontent.com/bilalahamad0/adhan-api/main/ai-metrics.json",
      "https://raw.githubusercontent.com/bilalahamad0/profile/main/ai-metrics.json",
      "https://raw.githubusercontent.com/bilalahamad0/tmo/main/ai-metrics.json",
      "https://raw.githubusercontent.com/bilalahamad0/adhan-ce/main/ai-metrics.json",
    ]);

    for (const [, init] of fetchMock.mock.calls) {
      expect(init).toMatchObject({
        next: { revalidate: 3600 },
        headers: { "User-Agent": "bilal-portfolio/1.0" },
      });
    }

    expect(data).toEqual({
      warn: warnMetrics,
      tmo: tmoMetrics,
    });
  });

  it("returns an empty map when all upstream responses fail or are invalid", async () => {
    fetchMock.mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/warn/")) {
        return new Response("invalid-json", { status: 200 });
      }

      if (url.includes("/adhan-api/")) {
        return new Response("forbidden", { status: 403 });
      }

      if (url.includes("/profile/")) {
        throw new Error("timeout");
      }

      return new Response("service unavailable", { status: 503 });
    });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({});
    expect(fetchMock).toHaveBeenCalledTimes(5);
  });
});
