import { describe, it, expect, vi } from "vitest";
import {
  GCP_PROJECT_ID,
  TOKEN_URL,
  DISCOVERY_URL,
  OPENID_CONFIG_URL,
  resolveCadence,
  parseEnvFile,
  buildOAuthTokenParams,
  buildRunReportPayload,
  pingGoogleOAuth,
  pingGoogleAnalyticsData,
  pingFallbackDiscovery,
  pingFallbackOpenId,
  executeHeartbeat,
  formatHeartbeatSummary,
} from "./gcp-heartbeat-core.mjs";

describe("gcp-heartbeat-core", () => {
  describe("resolveCadence", () => {
    it("returns explicit input when provided", () => {
      expect(resolveCadence("primary")).toBe("primary");
      expect(resolveCadence("fallback")).toBe("fallback");
    });

    it("resolves primary for Mon, Tue, Wed", () => {
      const mon = new Date("2026-11-02T12:00:00Z"); // Monday (day 1)
      const tue = new Date("2026-11-03T12:00:00Z"); // Tuesday (day 2)
      const wed = new Date("2026-11-04T12:00:00Z"); // Wednesday (day 3)
      expect(resolveCadence("auto", mon)).toBe("primary");
      expect(resolveCadence("auto", tue)).toBe("primary");
      expect(resolveCadence("auto", wed)).toBe("primary");
    });

    it("resolves fallback for Thu, Fri, Sat, Sun", () => {
      const thu = new Date("2026-11-05T12:00:00Z"); // Thursday (day 4)
      const sun = new Date("2026-11-08T12:00:00Z"); // Sunday (day 0)
      expect(resolveCadence("auto", thu)).toBe("fallback");
      expect(resolveCadence("auto", sun)).toBe("fallback");
    });
  });

  describe("parseEnvFile", () => {
    it("parses key=value lines correctly", () => {
      const input = `
# Comment
KEY1=val1
KEY2="quoted value"
KEY3='single quoted'

KEY_EMPTY=
`;
      const parsed = parseEnvFile(input);
      expect(parsed).toEqual({
        KEY1: "val1",
        KEY2: "quoted value",
        KEY3: "single quoted",
        KEY_EMPTY: "",
      });
    });

    it("handles empty or malformed strings gracefully", () => {
      expect(parseEnvFile("")).toEqual({});
      expect(parseEnvFile("INVALID_NO_EQUALS\n# just a comment")).toEqual({});
    });
  });

  describe("buildOAuthTokenParams", () => {
    it("throws if required params are missing", () => {
      expect(() => buildOAuthTokenParams({})).toThrow(/Missing required OAuth parameters/);
      expect(() => buildOAuthTokenParams({ clientId: "id", clientSecret: "sec" })).toThrow(/Missing required OAuth parameters/);
    });

    it("builds valid URLSearchParams", () => {
      const params = buildOAuthTokenParams({
        clientId: "my-id",
        clientSecret: "my-secret",
        refreshToken: "my-token",
      });
      expect(params.get("client_id")).toBe("my-id");
      expect(params.get("client_secret")).toBe("my-secret");
      expect(params.get("refresh_token")).toBe("my-token");
      expect(params.get("grant_type")).toBe("refresh_token");
    });
  });

  describe("buildRunReportPayload", () => {
    it("creates standard activeUsers report payload", () => {
      const payload = buildRunReportPayload();
      expect(payload).toEqual({
        dateRanges: [{ startDate: "yesterday", endDate: "today" }],
        metrics: [{ name: "activeUsers" }],
      });
    });
  });

  describe("pingGoogleOAuth", () => {
    it("successfully exchanges token and returns accessToken", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "mock-access-token", expires_in: 3600 }),
      });

      const res = await pingGoogleOAuth({
        clientId: "id",
        clientSecret: "secret",
        refreshToken: "token",
        fetchFn: mockFetch,
      });

      expect(mockFetch).toHaveBeenCalledWith(TOKEN_URL, expect.objectContaining({ method: "POST" }));
      expect(res.accessToken).toBe("mock-access-token");
      expect(res.expiresIn).toBe(3600);
    });

    it("throws if response is not ok", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => "invalid_grant",
      });

      await expect(
        pingGoogleOAuth({
          clientId: "id",
          clientSecret: "secret",
          refreshToken: "token",
          fetchFn: mockFetch,
        })
      ).rejects.toThrow(/HTTP 400/);
    });

    it("throws if access_token is missing from JSON response", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await expect(
        pingGoogleOAuth({
          clientId: "id",
          clientSecret: "secret",
          refreshToken: "token",
          fetchFn: mockFetch,
        })
      ).rejects.toThrow(/missing access_token/);
    });
  });

  describe("pingGoogleAnalyticsData", () => {
    it("throws if propertyId is missing", async () => {
      await expect(pingGoogleAnalyticsData({ accessToken: "token" })).rejects.toThrow(/Missing GA propertyId/);
    });

    it("successfully calls runReport endpoint", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
      });

      const res = await pingGoogleAnalyticsData({
        accessToken: "mock-token",
        propertyId: "123456",
        fetchFn: mockFetch,
      });

      expect(res.ok).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://analyticsdata.googleapis.com/v1beta/properties/123456:runReport",
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: "Bearer mock-token" }),
        })
      );
    });

    it("throws on non-ok API response", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        text: async () => "Forbidden",
      });

      await expect(
        pingGoogleAnalyticsData({
          accessToken: "mock-token",
          propertyId: "123456",
          fetchFn: mockFetch,
        })
      ).rejects.toThrow(/HTTP 403/);
    });
  });

  describe("pingFallbackDiscovery & pingFallbackOpenId", () => {
    it("successfully pings discovery endpoint", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
      const res = await pingFallbackDiscovery({ fetchFn: mockFetch });
      expect(res.ok).toBe(true);
      expect(res.endpoint).toBe(DISCOVERY_URL);
    });

    it("throws if discovery returns non-ok", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
      await expect(pingFallbackDiscovery({ fetchFn: mockFetch })).rejects.toThrow(/HTTP 500/);
    });

    it("successfully pings OpenID config endpoint", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
      const res = await pingFallbackOpenId({ fetchFn: mockFetch });
      expect(res.ok).toBe(true);
      expect(res.endpoint).toBe(OPENID_CONFIG_URL);
    });

    it("throws if OpenID config returns non-ok", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 502 });
      await expect(pingFallbackOpenId({ fetchFn: mockFetch })).rejects.toThrow(/HTTP 502/);
    });
  });

  describe("executeHeartbeat", () => {
    it("runs full primary flow when credentials and propertyId exist", async () => {
      const mockFetch = vi.fn().mockImplementation((url) => {
        if (url === TOKEN_URL) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ access_token: "test-token" }),
          });
        }
        return Promise.resolve({ ok: true, status: 200 });
      });

      const res = await executeHeartbeat({
        config: {
          clientId: "client-id",
          clientSecret: "client-secret",
          refreshToken: "refresh-token",
          propertyId: "532067997",
        },
        cadenceInput: "primary",
        fetchFn: mockFetch,
      });

      expect(res.success).toBe(true);
      expect(res.pingType).toBe("primary");
      expect(res.refreshedToken).toBe(true);
      expect(res.queriedApi).toBe(true);
      expect(res.projectId).toBe(GCP_PROJECT_ID);
    });

    it("falls back to discovery when primary OAuth ping fails", async () => {
      const mockFetch = vi.fn().mockImplementation((url) => {
        if (url === TOKEN_URL) {
          return Promise.resolve({
            ok: false,
            status: 400,
            text: async () => "invalid_grant",
          });
        }
        return Promise.resolve({ ok: true, status: 200 });
      });

      const res = await executeHeartbeat({
        config: {
          clientId: "bad-id",
          clientSecret: "bad-sec",
          refreshToken: "bad-token",
        },
        cadenceInput: "fallback",
        fetchFn: mockFetch,
      });

      expect(res.success).toBe(true);
      expect(res.pingType).toBe("fallback");
      expect(res.fallbackSuccess).toBe(true);
      expect(res.primaryError).toContain("HTTP 400");
    });

    it("runs unauthenticated fallback when credentials are not configured", async () => {
      const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
      const res = await executeHeartbeat({
        config: {},
        cadenceInput: "auto",
        fetchFn: mockFetch,
      });

      expect(res.success).toBe(true);
      expect(res.unauthenticated).toBe(true);
      expect(res.pingType).toBe("fallback");
      expect(res.message).toContain("Google Auth and API endpoints reachable");
    });

    it("handles unauthenticated fallback when network fails", async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error("Network down"));
      const res = await executeHeartbeat({
        config: {},
        cadenceInput: "auto",
        fetchFn: mockFetch,
      });

      expect(res.success).toBe(false);
      expect(res.unauthenticated).toBe(true);
      expect(res.message).toContain("Could not reach Google endpoints (Network down)");
    });
  });

  describe("formatHeartbeatSummary", () => {
    it("formats successful summary cleanly", () => {
      const summary = formatHeartbeatSummary({
        projectId: GCP_PROJECT_ID,
        cadence: "primary",
        pingType: "primary",
        timestamp: "2026-11-03T10:00:00Z",
        success: true,
        refreshedToken: true,
        queriedApi: true,
      });

      expect(summary).toContain("portfolio-analytics-497506");
      expect(summary).toContain("PRIMARY");
      expect(summary).toContain("ACTIVE / HEALTHY");
      expect(summary).toContain("Refreshed access token successfully");
      expect(summary).toContain("Google Analytics Data API runReport successful");
    });

    it("formats fallback failure cleanly", () => {
      const summary = formatHeartbeatSummary({
        projectId: GCP_PROJECT_ID,
        cadence: "fallback",
        pingType: "fallback",
        timestamp: "2026-11-03T10:00:00Z",
        success: true,
        primaryError: "Network timeout",
        fallbackSuccess: true,
      });

      expect(summary).toContain("FALLBACK");
      expect(summary).toContain("Failed with error: Network timeout");
      expect(summary).toContain("Pinged Google API discovery & Auth endpoints (OK)");
    });
  });
});
