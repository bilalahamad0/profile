import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      // Next.js provides `server-only` at build time; stub it for unit tests.
      'server-only': fileURLToPath(
        new URL('./vitest.server-only-stub.ts', import.meta.url)
      ),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    css: false,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85
      }
    },
    server: {
      deps: {
        inline: true
      }
    }
  },
});
