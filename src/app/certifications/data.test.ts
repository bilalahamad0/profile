import { describe, it, expect } from "vitest";
import {
  AI_CERTIFICATES,
  CERT_STATS,
  CONTINUING_EDUCATION,
  CREDENTIAL_GROUPS,
  GENERAL_CERTIFICATES,
  SPECIALIZATIONS,
  credentialSlug,
} from "./data";
import { certifications } from "@/data/portfolio";

describe("continuing education is never counted as a credential", () => {
  it("does not move the computed stats strip", () => {
    expect(CERT_STATS.credentials).toBe(12);
    expect(CERT_STATS.specializations).toBe(SPECIALIZATIONS.length);
    expect(CERT_STATS.credentials).toBe(
      SPECIALIZATIONS.length + AI_CERTIFICATES.length + GENERAL_CERTIFICATES.length,
    );
  });

  it("is absent from every array that feeds the ledger, the stats or the JSON-LD", () => {
    const ledgerSlugs = CREDENTIAL_GROUPS.flatMap((g) =>
      g.credentials.map(credentialSlug),
    );
    const singleIds = [...AI_CERTIFICATES, ...GENERAL_CERTIFICATES].map((c) => c.id);
    const specIds = SPECIALIZATIONS.map((s) => s.id);
    const schemaTitles = certifications.map((c) => c.title);

    expect(CONTINUING_EDUCATION.length).toBeGreaterThan(0);
    for (const entry of CONTINUING_EDUCATION) {
      expect(ledgerSlugs).not.toContain(entry.id);
      expect(ledgerSlugs).not.toContain(`cert-${entry.id}`);
      expect(singleIds).not.toContain(entry.id);
      expect(specIds).not.toContain(entry.id);
      // portfolio.ts `certifications` feeds BOTH certificationsSchema()
      // (EducationalOccupationalCredential) and the `certs` summary card.
      expect(schemaTitles).not.toContain(entry.title);
    }
  });

  it("never claims a credential in its own data", () => {
    for (const entry of CONTINUING_EDUCATION) {
      expect(entry.courseUrl).toMatch(/^https:\/\/online\.stanford\.edu\/courses\//);
      expect(entry.meta).not.toMatch(/certified/i);
      expect(entry.status).not.toMatch(/certified|verified/i);
      expect(entry.formatNote).toMatch(/no certificate/i);
    }
  });
});
