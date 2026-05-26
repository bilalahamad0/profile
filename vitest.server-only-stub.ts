// Empty stand-in for Next.js's build-time `server-only` shim, which is not a
// resolvable package under Vitest. Aliased in vitest.config.ts so modules that
// `import "server-only"` (e.g. src/lib/ai-metrics.ts) can be unit-tested.
export {};
