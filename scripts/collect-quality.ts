// Collects the latest test results into content/quality/latest-run.json, which the Quality page
// renders at build time. Reads each reporter's own JSON output; missing inputs are recorded as
// "not run" rather than invented.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import {
  fromCoverage,
  fromLighthouse,
  fromPlaywright,
  fromVitest,
  qualityRunSchema,
  statusOf,
  type QualityRun,
  type Suite,
} from '../lib/quality.ts'

const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null)

const vitest = read('test-results/vitest.json')
const playwright = read('test-results/playwright.json')
const coverage = read('coverage/coverage-summary.json')
const lhci = read('.lighthouseci/manifest.json')
const links = read('test-results/links.json')
// Written by CI after lint and typecheck pass (their exit code is the result).
const staticGates = read('test-results/static.json') as { lint?: boolean; typecheck?: boolean } | null

const staticSuite: Suite = (() => {
  const ran = staticGates ? [staticGates.lint, staticGates.typecheck].filter((v) => v !== undefined) : []
  const counts = { passed: ran.filter(Boolean).length, failed: ran.filter((v) => v === false).length, flaky: 0, skipped: 0 }
  return { id: 'static', name: 'Lint + type check', layer: 'static', tool: 'ESLint, TypeScript', status: statusOf(counts), counts, durationMs: 0 }
})()

const unit: Suite = vitest
  ? fromVitest(vitest)
  : { id: 'unit', name: 'Unit & component', layer: 'unit', tool: 'Vitest + Testing Library', status: 'not-run', counts: { passed: 0, failed: 0, flaky: 0, skipped: 0 }, durationMs: 0 }

const env = process.env
const run: QualityRun = {
  generatedAt: new Date().toISOString(),
  commit: env.GITHUB_SHA ?? null,
  branch: env.GITHUB_REF_NAME ?? null,
  runUrl: env.GITHUB_RUN_ID ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}` : null,
  source: env.CI ? 'ci' : 'local',
  suites: [staticSuite, unit, ...(playwright ? fromPlaywright(playwright) : fromPlaywright({ suites: [] }))],
  coverage: coverage ? fromCoverage(coverage) : null,
  lighthouse: lhci ? fromLighthouse(lhci) : null,
  links: links ? { checked: links.checked, broken: links.broken } : null,
  reports: {
    playwright: existsSync('playwright-report/index.html') ? '/reports/playwright/' : null,
    coverage: existsSync('coverage/index.html') ? '/reports/coverage/' : null,
  },
}

mkdirSync('content/quality', { recursive: true })
writeFileSync('content/quality/latest-run.json', `${JSON.stringify(qualityRunSchema.parse(run), null, 2)}\n`)
console.log(
  'Wrote content/quality/latest-run.json:',
  run.suites.map((s) => `${s.id}=${s.status}`).join(' '),
)
