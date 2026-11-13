import { expect, ROUTES, test } from './fixtures'

test('every route has a unique title, description, canonical and social cards', async ({ page }) => {
  const titles = new Set<string>()
  const descriptions = new Set<string>()
  for (const r of ROUTES) {
    await page.goto(r.path)
    const title = await page.title()
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(title, r.path).toBeTruthy()
    expect(description, r.path).toBeTruthy()
    titles.add(title)
    descriptions.add(description!)
    await expect(page.locator('link[rel="canonical"]'), r.path).toHaveAttribute('href', new RegExp(`${r.path}$`))
    for (const p of ['og:title', 'og:description', 'og:url', 'og:type']) {
      await expect(page.locator(`meta[property="${p}"]`), `${r.path} ${p}`).toHaveCount(1)
    }
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary')
  }
  expect(titles.size).toBe(ROUTES.length)
  expect(descriptions.size).toBe(ROUTES.length)
})

test('sitemap lists every route and robots points to it', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const r of ROUTES) expect(sitemap).toContain(`${r.path}</loc>`)
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Sitemap:')
  expect(robots).toContain('Allow: /')
})
