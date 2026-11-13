import { expect, test, useTheme } from './fixtures'

test('switches color scheme and high contrast, and remembers them', async ({ page }) => {
  await page.goto('/')
  const html = page.locator('html')
  await page.getByTestId('theme-trigger').click()
  await page.getByRole('menuitemradio', { name: 'Dark' }).click()
  await expect(html).toHaveClass(/\bdark\b/)

  // Radio and checkbox items keep the menu open, so both settings can be changed in one visit.
  await page.getByRole('menuitemcheckbox', { name: 'High contrast' }).click()
  await expect(html).toHaveAttribute('data-contrast', 'more')
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('theme-menu')).toBeHidden()
  await expect(page.getByTestId('theme-trigger')).toBeFocused()

  await page.reload()
  await expect(html).toHaveClass(/\bdark\b/)
  await expect(html).toHaveAttribute('data-contrast', 'more')
  await expect(page.getByTestId('theme-trigger')).toHaveAccessibleName('Theme: Dark, high contrast')
})

test('applies the saved theme before first paint (no flash)', async ({ page }) => {
  await useTheme(page, { name: 'dark', scheme: 'dark', contrast: false })
  // Block scripts other than the inline pre-paint one: the class must already be there.
  await page.route('**/_next/static/**/*.js', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/\bdark\b/)
})

test('System follows the OS preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  await page.emulateMedia({ colorScheme: 'light' })
  const bgLight = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  expect(bg).not.toBe(bgLight)
})
