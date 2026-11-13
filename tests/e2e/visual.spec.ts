import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test, useTheme } from './fixtures'

// Baselines are per OS. Until an OS has a committed set (pnpm test:visual:update:linux for CI),
// the tests report as skipped rather than inventing a baseline on the fly.
const hasBaselines = existsSync(join(import.meta.dirname, '__screenshots__', process.platform))
test.skip(!hasBaselines && !process.argv.includes('--update-snapshots'), `No ${process.platform} visual baselines committed yet`)

// Key routes × light and dark. The Quality page is left out: its height follows each run's data.
// Run-specific data (timestamps, counts, the CI badge) is masked so
// a new test or a fresh run doesn't count as a visual change.
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/work/extensible-playwright-framework/', name: 'case-study' },
]
const THEMES = [
  { name: 'light', scheme: 'light', contrast: false },
  { name: 'dark', scheme: 'dark', contrast: false },
] as const

for (const theme of THEMES) {
  for (const route of ROUTES) {
    test(`${route.name} · ${theme.name}`, async ({ page }) => {
      await useTheme(page, theme)
      await page.goto(route.path)
      await page.evaluate(() => document.fonts.ready)
      await expect(page).toHaveScreenshot(`${route.name}-${theme.name}.png`, {
        fullPage: true,
        mask: [
          page.getByTestId('ci-status'),
          page.getByTestId('run-meta'),
          page.getByTestId('results-table'),
          page.getByTestId('coverage'),
          page.getByTestId('lighthouse'),
          page.getByTestId('pyramid').getByText(/\d+ tests/),
          page.getByTestId('quality-card'),
          page.locator('[data-testid="status-badge"]'),
        ],
      })
    })
  }
}
