import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("/llms.txt route", () => {
  it("serves a plain-text, UTF-8 document", () => {
    const res = GET();
    expect(res.headers.get("content-type")).toContain("text/plain");
    expect(res.headers.get("content-type")).toContain("utf-8");
  });

  it("renders the llms.txt document from live portfolio + blog data", async () => {
    const body = await GET().text();
    expect(body.startsWith("# Bilal Ahamad")).toBe(true);
    expect(body).toContain("## Pages");
    expect(body).toContain("## Projects");
    // A real, single-source-of-truth project repo should appear in the output.
    expect(body).toContain("https://github.com/bilalahamad0/");
    expect(body).toContain("https://bilalahamad.com/blog/");
  });
});
