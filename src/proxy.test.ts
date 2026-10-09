// @vitest-environment node
// happy-dom's Request drops Sec-* headers (forbidden for browser scripts), which
// would hide the very header this guard reads.
import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy, config } from "./proxy";

const post = (siteHeader?: string) =>
  new NextRequest("https://bilalahamad.com/api/contact", {
    method: "POST",
    headers: siteHeader ? { "sec-fetch-site": siteHeader } : {},
  });

// NextResponse.next() marks a pass-through with this header.
const passedThrough = (res: Response) => res.headers.get("x-middleware-next") === "1";

describe("proxy (cross-origin guard)", () => {
  it("only runs on the two state-changing endpoints", () => {
    expect(config.matcher).toEqual(["/api/contact", "/api/session"]);
  });

  it.each(["cross-site", "same-site"])("rejects a POST with Sec-Fetch-Site: %s", async (site) => {
    const res = proxy(post(site));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Cross-origin requests are not allowed." });
  });

  it.each(["same-origin", "none"])("passes a POST with Sec-Fetch-Site: %s through", (site) => {
    expect(passedThrough(proxy(post(site)))).toBe(true);
  });

  it("passes a POST without Sec-Fetch-Site through to the route's token check", () => {
    expect(passedThrough(proxy(post()))).toBe(true);
  });

  it("never blocks non-POST requests", () => {
    const req = new NextRequest("https://bilalahamad.com/api/session", {
      method: "GET",
      headers: { "sec-fetch-site": "cross-site" },
    });
    expect(passedThrough(proxy(req))).toBe(true);
  });
});
