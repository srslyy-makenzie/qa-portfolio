import { expect, ROUTES, test } from './fixtures'

test.describe('home', () => {
  test('leads with name, target title, positioning and CTAs', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('QA Automation Engineer')
    await expect(page.getByTestId('positioning')).toContainText('Playwright')
    await expect(page.getByTestId('hero').getByTestId('ci-status')).toBeVisible()
    for (const cta of ['View case studies', 'Resume', 'Contact']) {
      await expect(page.getByTestId('hero').getByRole('link', { name: cta })).toBeVisible()
    }
    await expect(page.getByTestId('hero').getByRole('link', { name: /GitHub/ })).toHaveAttribute('target', '_blank')
  })

  test('features case studies and the Quality page', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('case-study-card')).toHaveCount(2)
    await page.getByTestId('quality-card').getByRole('link').click()
    await expect(page).toHaveURL(/\/quality\/$/)
  })

  test('CI badge links to the Quality page', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('hero').getByTestId('ci-status').click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('How this site is tested')
  })
})

test('primary navigation reaches every page and marks the current one', async ({ page, nav, isMobile }) => {
  await page.goto('/')
  for (const label of ['Work', 'Quality', 'Projects', 'About', 'Resume', 'Contact']) {
    await nav(label)
    await expect(page).toHaveURL(new RegExp(`/${label.toLowerCase()}/$`))
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    if (!isMobile) {
      await expect(page.getByTestId('desktop-nav').getByRole('link', { name: label, exact: true })).toHaveAttribute('aria-current', 'page')
    }
  }
})

test('mobile menu is a focus-trapped dialog that closes on Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-only navigation')
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const sheet = page.getByRole('dialog', { name: 'Menu' })
  await expect(sheet).toBeVisible()
  await expect(sheet.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  await page.keyboard.press('Escape')
  await expect(sheet).toBeHidden()
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
})

test('skip link moves focus to the main content', async ({ page, browserName, isMobile }) => {
  test.skip(isMobile || browserName === 'webkit', 'Tab does not focus links by default in WebKit; no keyboard on mobile')
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await skip.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})

test('every route renders one h1 and no console errors', async ({ page }) => {
  const errors: string[] = []
  // WebKit logs prefetches that page.goto cancels as "access control" errors; they aren't failures.
  const cancelledPrefetch = /127\.0\.0\.1:\d+\/.* due to access control checks/
  page.on('console', (m) => m.type() === 'error' && !cancelledPrefetch.test(m.text()) && errors.push(m.text()))
  page.on('pageerror', (e) => !cancelledPrefetch.test(e.message) && errors.push(e.message))
  for (const r of ROUTES) {
    const res = await page.goto(r.path)
    expect(res?.status(), r.path).toBe(200)
    await expect(page.locator('h1'), r.path).toHaveCount(1)
  }
  expect(errors).toEqual([])
})

test('unknown routes show the 404 page', async ({ page }) => {
  const res = await page.goto('/does-not-exist/')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
  await page.getByRole('link', { name: 'Go home' }).click()
  await expect(page).toHaveURL(/\/$/)
})
