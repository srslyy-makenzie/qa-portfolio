import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/unit/setup.ts'],
    reporters: ['default', ['json', { outputFile: 'test-results/vitest.json' }]],
    coverage: {
      provider: 'v8',
      include: ['lib/**', 'components/**'],
      // Vendored design-system components are tested in mak UI itself.
      exclude: ['components/ui/**', 'lib/mdx.tsx', 'lib/content.ts'],
      reporter: ['text-summary', 'json-summary', 'html'],
    },
  },
})
