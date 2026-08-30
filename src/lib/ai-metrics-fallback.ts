import type { AIMetrics } from "@/lib/ai-metrics";

/**
 * Build-time mirror of every project's `ai-metrics.json`.
 *
 * On the live site this is INVISIBLE: `getAIMetricsMap()` fetches each project's
 * sidecar from `raw.githubusercontent.com/bilalahamad0/<repo>/main/ai-metrics.json`
 * and those values win. The fallback only renders when a fetch fails (GitHub
 * unreachable, repo renamed, sidecar missing) so the AI metrics on /projects
 * never collapse to blanks.
 *
 * Source of truth per project is that repo's own `ai-metrics.json` — for
 * `profile`, this repo's `./ai-metrics.json`, refreshed weekly by
 * `.github/workflows/update-ai-metrics.yml`. Keep the DERIVED fields here in
 * step with `node scripts/sync-ai-metrics.mjs --report`; never invent the
 * CURATED ones. Full procedure: `.claude/skills/update-ai-page/SKILL.md`.
 *
 * Lives in `src/lib/` rather than beside a page so the page that renders these
 * metrics can move without the weekly refresh pipeline losing its target.
 */
export const STATIC_FALLBACK: Record<string, AIMetrics> = {
  warn: {
    projectId: "warn",
    lastUpdated: "2026-08-03",
    aiContribution: 88,
    agents: [
      {
        name: "Antigravity",
        provider: "Google DeepMind",
        period: "Apr 2026",
        models: ["Gemini 2.5 Flash", "Gemini 2.5 Pro"],
        tokens: 100000,
        role: "Foundation & pipeline architecture",
      },
      {
        name: "Cursor",
        provider: "Anthropic",
        period: "Apr 2026 – Present",
        models: ["Claude Sonnet 4"],
        tokens: 100000,
        role: "Dashboard revamp, charts & code review",
      },
      {
        name: "Claude Code",
        provider: "Anthropic",
        period: "Jul 2026",
        models: ["Claude Fable 5", "Claude Opus 4.8", "Claude Opus 5"],
        tokens: 278143352,
        role: "50-state expansion, national dataset & US dashboard",
      },
    ],
    totalTokens: 278343352,
    totalCommits: 344,
    linesOfCode: 40714,
    devCycleDays: 31,
    manualEstimateDays: 93,
    impact: "Automated 100% of data ingestion and alerting",
    cycle: "31 active days",
    beforeAI: "Manual Excel download, no monitoring",
    afterAI: "Fully automated pipeline, runs twice daily",
    tests: 968,
    testSuites: 57,
  },
  adhan: {
    projectId: "adhan",
    lastUpdated: "2026-08-03",
    aiContribution: 92,
    agents: [
      {
        name: "Antigravity",
        provider: "Google DeepMind",
        period: "Feb – Apr 2026",
        models: ["Gemini 2.5 Flash", "Gemini 2.5 Pro"],
        tokens: 255000,
        role: "v1–v2 architecture",
      },
      {
        name: "Cursor",
        provider: "Anthropic",
        period: "Apr 2026 – Present",
        models: ["Claude Sonnet 4", "Claude Opus 4.6"],
        tokens: 200000,
        role: "v3 pipeline, auto-updater & dashboard",
      },
      {
        name: "Claude Code",
        provider: "Anthropic",
        period: "May 2026 – Present",
        models: ["Claude Opus 4.8", "Claude Opus 4.7", "Claude Fable 5"],
        tokens: 438972981,
        role: "Edge-AI assistant tuning & Chrome extension build",
      },
    ],
    totalTokens: 439427981,
    totalCommits: 270,
    linesOfCode: 12776,
    devCycleDays: 56,
    manualEstimateDays: 168,
    impact: "Zero-touch prayer-time audio notifications with automated media-state control (Raspberry Pi + Android TV via ADB) · 10 microservices",
    cycle: "56 active days",
    beforeAI: "No automation, manual device control",
    afterAI: "Zero-touch IoT orchestration system",
    microservices: 10,
    tests: 165,
    testSuites: 13,
  },
  "adhan-ce": {
    projectId: "adhan-ce",
    lastUpdated: "2026-08-02",
    aiContribution: 95,
    agents: [
      {
        name: "Claude Code",
        provider: "Anthropic",
        period: "May – Jul 2026",
        models: ["Claude Opus 4.8", "Claude Opus 4.7", "Claude Fable 5"],
        tokens: 103522508,
        role: "End-to-end build — service worker, content scripts, geocoding, tests & store assets",
      },
    ],
    totalTokens: 103522508,
    totalCommits: 88,
    linesOfCode: 8216,
    devCycleDays: 1,
    manualEstimateDays: 14,
    impact: "Auto-pauses media across every open browser tab at Adhan time · cross-tab prayer-focus mode",
    cycle: "1 day",
    beforeAI: "Manual prayer tracking; media kept playing during Adhan",
    afterAI: "One-click extension pauses every tab at prayer time",
    tests: 189,
    testSuites: 14,
  },
  tmo: {
    projectId: "tmo",
    lastUpdated: "2026-08-03",
    aiContribution: 75,
    agents: [
      {
        name: "Antigravity",
        provider: "Google DeepMind",
        period: "Apr 2026",
        models: ["Gemini 2.5 Flash"],
        tokens: 90000,
        role: "Pipeline scaffolding & automation architecture",
      },
      {
        name: "Claude Code",
        provider: "Anthropic",
        period: "May 2026 – Present",
        models: ["Claude Opus 4.8", "Claude Opus 4.7"],
        tokens: 133215702,
        role: "Zelle hardening, login robustness & dashboards",
      },
    ],
    totalTokens: 133305702,
    totalCommits: 41,
    linesOfCode: 5485,
    devCycleDays: 9,
    manualEstimateDays: 36,
    impact: "Zero-touch monthly billing cycle",
    cycle: "9 active days",
    beforeAI: "Manual Python script, ran per request",
    afterAI: "Event-driven E2E billing automation",
    tests: 227,
    testSuites: 11,
  },
  profile: {
    projectId: "profile",
    lastUpdated: "2026-08-03",
    aiContribution: 85,
    agents: [
      {
        name: "Cursor",
        provider: "Google DeepMind",
        period: "Jul 2025",
        models: ["Gemini 2.5 Flash", "Gemini 2.5 Pro"],
        tokens: 300000,
        role: "Foundation & MVP architecture",
      },
      {
        name: "Cursor",
        provider: "Anthropic",
        period: "Apr 2026 – Present",
        models: ["Claude Opus 4.6", "Claude Sonnet 4"],
        tokens: 200000,
        role: "Modernization, hardening & code review",
      },
      {
        name: "Claude Code",
        provider: "Anthropic",
        period: "Apr 2026 – Present",
        models: ["Claude Opus 4.7", "Claude Opus 4.8", "Claude Opus 4.6", "Claude Opus 5", "Claude Fable 5"],
        tokens: 357726655,
        role: "SEO, metrics automation & CI hardening",
      },
    ],
    totalTokens: 358226655,
    totalCommits: 503,
    linesOfCode: 14988,
    devCycleDays: 58,
    manualEstimateDays: 76,
    impact: "Full-stack portfolio deployed to production",
    cycle: "58 active days",
    beforeAI: "Static HTML/CSS resume site",
    afterAI: "AI-native Next.js portfolio with analytics",
    tests: 242,
    testSuites: 19,
  },
};
