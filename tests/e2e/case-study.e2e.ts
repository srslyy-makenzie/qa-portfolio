import { expect, test } from './fixtures'

const SLUG = 'extensible-playwright-framework'

test('work index links to each case study', async ({ page }) => {
  await page.goto('/work/')
  const cards = page.getByTestId('case-study-card')
  await expect(cards).toHaveCount(2)
  await cards.first().getByRole('link').click()
  await expect(page).toHaveURL(new RegExp(`/work/${SLUG}/$`))
})

test('case study follows the template, in order', async ({ page }) => {
  await page.goto(`/work/${SLUG}/`)
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Work' })).toBeVisible()
  await expect(page.getByTestId('claim')).not.toBeEmpty()
  await expect(page.getByTestId('context')).toContainText('My role')
  const headings = await page.getByTestId('case-study').getByRole('heading', { level: 2 }).allTextContents()
  expect(headings).toEqual(['Quality problem', 'Strategy', 'Implementation', 'Results', 'See it run', 'Reflection'])
  await expect(page.getByRole('contentinfo').or(page.locator('article footer'))).toContainText(['Credits'])
})

test('results table has before/after numbers with worded change', async ({ page }) => {
  await page.goto(`/work/${SLUG}/`)
  const table = page.getByTestId('metrics-table')
  await expect(table.getByRole('rowheader').first()).toBeVisible()
  await expect(table).toContainText(/Improved: (down|up)/)
})

test('see-it-run explains missing evidence links', async ({ page }) => {
  await page.goto(`/work/${SLUG}/`)
  const section = page.getByTestId('see-it-run')
  await expect(section).toContainText('Why some links are missing')
  await section.getByRole('link', { name: 'See this site’s live suite' }).click()
  await expect(page).toHaveURL(/\/quality\/$/)
})

test('draft case studies say so', async ({ page }) => {
  await page.goto(`/work/${SLUG}/`)
  await expect(page.getByTestId('draft-notice')).toContainText('Draft case study')
})

test('code tabs switch with the keyboard', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard interaction')
  await page.goto(`/work/${SLUG}/`)
  const tabs = page.getByRole('tablist', { name: 'Framework patterns' })
  await tabs.getByRole('tab', { name: 'Fixture' }).click()
  await page.keyboard.press('ArrowRight')
  const pageObject = tabs.getByRole('tab', { name: 'Page object' })
  await expect(pageObject).toBeFocused()
  await pageObject.press('Enter')
  await expect(pageObject).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toContainText('class Checkout')
})

test('code blocks are highlighted at build time and keyboard-scrollable', async ({ page }) => {
  await page.goto(`/work/${SLUG}/`)
  const block = page.getByTestId('code-block').first()
  await expect(block.locator('pre')).toHaveAttribute('tabindex', '0')
  // Shiki emits token spans styled with CSS variables, so no runtime highlighter is shipped.
  expect(await block.locator('pre span[style*="--shiki-token"]').count()).toBeGreaterThan(5)
})

test('copy button copies code and confirms', async ({ page, browserName, context }) => {
  test.skip(browserName !== 'chromium', 'Clipboard permissions are Chromium-only in Playwright')
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/work/flaky-suite-to-trusted-gate/')
  const block = page.getByTestId('code-block').first()
  await block.getByTestId('copy-code').click()
  await expect(page.getByText('Copied to clipboard')).toBeVisible()
  const text = await page.evaluate(() => navigator.clipboard.readText())
  expect(text).toContain("getByRole('status')")
  // Lines marked as removed in the diff are not copied.
  expect(text).not.toContain('waitForTimeout')
})
