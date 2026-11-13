import AxeBuilder from '@axe-core/playwright'
import { expect, ROUTES, test, THEMES, useTheme } from './fixtures'

/** Waits for enter transitions: axe measures a fading-in popup at partial opacity otherwise. */
async function settle(page: import('@playwright/test').Page) {
  await page.evaluate(() => Promise.allSettled(document.getAnimations().map((a) => a.finished)))
}

// WCAG 2.2 AA, every route, every theme mode: contrast bugs hide in the theme nobody checked.
for (const theme of THEMES) {
  test.describe(`theme: ${theme.name}`, () => {
    for (const route of ROUTES) {
      test(`${route.name} has no axe violations`, async ({ page }) => {
        await useTheme(page, theme)
        await page.goto(route.path)
        await expect(page.locator('html')).toHaveClass(new RegExp(theme.scheme))
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze()
        const summary = results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
        }))
        expect(summary).toEqual([])
      })
    }
  })
}

test('open overlays are accessible: theme menu and mobile nav', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('theme-trigger').click()
  await expect(page.getByTestId('theme-menu')).toBeVisible()
  await settle(page)
  const menu = await new AxeBuilder({ page }).include('[data-testid="theme-menu"]').analyze()
  expect(menu.violations).toEqual([])
  await page.keyboard.press('Escape')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByTestId('mobile-nav')).toBeVisible()
  await settle(page)
  const sheet = await new AxeBuilder({ page }).include('[data-testid="mobile-nav"]').analyze()
  expect(sheet.violations).toEqual([])
})
