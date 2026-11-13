import { expect, test } from './fixtures'

test('resume downloads as a PDF', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Downloads are not supported on emulated mobile')
  await page.goto('/resume/')
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('resume-download').click()])
  expect(download.suggestedFilename()).toBe('Donovan-Cadena-QA-Automation-Engineer.pdf')
  const res = await page.request.get('/resume.pdf')
  expect(res.headers()['content-type']).toBe('application/pdf')
  expect((await res.body()).subarray(0, 4).toString()).toBe('%PDF')
})

test('resume page has the web-native summary', async ({ page }) => {
  await page.goto('/resume/')
  for (const h of ['Experience', 'Skills', 'Education & certifications']) {
    await expect(page.getByRole('heading', { level: 2, name: h })).toBeVisible()
  }
})

test('contact links: email, LinkedIn and GitHub', async ({ page }) => {
  await page.goto('/contact/')
  await expect(page.getByTestId('contact-email')).toHaveAttribute('href', /^mailto:.+@.+/)
  await expect(page.getByTestId('contact-linkedin')).toHaveAttribute('href', /linkedin\.com\/in\//)
  const github = page.getByTestId('contact-github')
  await expect(github).toHaveAttribute('href', /github\.com\//)
  await expect(github).toHaveAttribute('rel', 'noopener noreferrer')
  await expect(github).toContainText('(opens in a new tab)')
})
