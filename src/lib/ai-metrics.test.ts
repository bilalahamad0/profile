import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { AIMetrics } from "./ai-metrics";

// ai-metrics.ts imports "server-only", which throws outside an RSC bundle.
vi.mock("server-only", () => ({}));

import { getAIMetricsMap } from "./ai-metrics";

const ALL_IDS = ["adhan", "adhan-ce", "profile", "tmo", "warn"];

function sampleMetrics(projectId: string): AIMetrics {
  return {
    projectId,
    lastUpdated: "2026-05-25",
    aiContribution: 80,
    agents: [],
    totalTokens: 1000,
    totalCommits: 10,
    linesOfCode: 100,
    devCycleDays: 1,
    manualEstimateDays: 2,
    impact: "x",
    cycle: "1d",
    beforeAI: "before",
    afterAI: "after",
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getAIMetricsMap()", () => {
  it("returns a map keyed by every known project id when all fetches succeed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => sampleMetrics("any") }))
    );

    const map = await getAIMetricsMap();

    expect(Object.keys(map).sort()).toEqual(ALL_IDS);
  });

  it("requests the raw GitHub ai-metrics.json for each repo (id→repo mapping)", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => sampleMetrics("any"),
    }));
    vi.stubGlobal("fetch", fetchMock);

    await getAIMetricsMap();

    const urls = fetchMock.mock.calls.map((c) => String(c[0]));
    // "adhan" maps to the adhan-api repo, not "adhan".
    expect(urls).toContain(
      "https://raw.githubusercontent.com/bilalahamad0/adhan-api/main/ai-metrics.json"
    );
    expect(urls).toContain(
      "https://raw.githubusercontent.com/bilalahamad0/profile/main/ai-metrics.json"
    );
  });

  it("omits a project when its response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        String(url).includes("/profile/")
          ? { ok: true, json: async () => sampleMetrics("profile") }
          : { ok: false, json: async () => ({}) }
      )
    );

    const map = await getAIMetricsMap();

    expect(Object.keys(map)).toEqual(["profile"]);
    expect(map.profile.projectId).toBe("profile");
  });

  it("returns an empty map when every fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      })
    );

    expect(await getAIMetricsMap()).toEqual({});
  });
});
