import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
