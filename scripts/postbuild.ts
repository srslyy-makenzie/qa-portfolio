// After `next build`: render the resume page to out/resume.pdf (one source for web and PDF) and
// copy the latest HTML test reports into out/reports/ so the Quality page can link to them.
import { cpSync, existsSync } from 'node:fs'
import { chromium } from '@playwright/test'
import { startServer } from './static-server.ts'

const { server, url } = await startServer('out')
const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  await page.emulateMedia({ media: 'print', colorScheme: 'light' })
  await page.goto(`${url}/resume/`, { waitUntil: 'networkidle' })
  await page.pdf({
    path: 'out/resume.pdf',
    format: 'Letter',
    margin: { top: '0.5in', bottom: '0.5in', left: '0.6in', right: '0.6in' },
    printBackground: false,
  })
  console.log('Wrote out/resume.pdf')
} finally {
  await browser.close()
  server.close()
}

for (const [from, to] of [
  ['playwright-report', 'out/reports/playwright'],
  ['coverage', 'out/reports/coverage'],
] as const) {
  if (existsSync(`${from}/index.html`)) {
    cpSync(from, to, { recursive: true })
    console.log(`Copied ${from}/ to ${to}/`)
  }
}
