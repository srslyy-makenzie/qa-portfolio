import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const CI = Boolean(process.env.CI)

// Every project runs against the real static build (out/), served the way the host serves it.
export default defineConfig({
  testDir: 'tests/e2e',
  // Its own folder: Playwright empties outputDir on start, and test-results/ also holds the
  // Vitest, link-check and static-gate JSON the Quality page is built from.
  outputDir: 'test-results/playwright-artifacts',
  fullyParallel: true,
  forbidOnly: CI,
  // One retry in CI; a retry-pass is reported as "flaky", never as "passed".
  retries: CI ? 1 : 0,
  workers: CI ? 2 : 2,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/playwright.json' }],
  ],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
  projects: [
    { name: 'chromium', testMatch: /.*\.e2e\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testMatch: /.*\.e2e\.ts/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testMatch: /.*\.e2e\.ts/, use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', testMatch: /.*\.e2e\.ts/, use: { ...devices['Pixel 7'] } },
    { name: 'a11y', testMatch: /a11y\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    { name: 'visual', testMatch: /visual\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `node scripts/serve.ts`,
    env: { PORT: String(PORT) },
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !CI,
  },
})
