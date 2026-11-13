// The Quality page's data: results of this site's own test suite, collected from the
// reporters' JSON output by scripts/collect-quality.ts. Pure functions only (no fs), so they
// are unit-tested and shared by the script and the page.
import { z } from 'zod'

export const STATUSES = ['passed', 'failed', 'flaky', 'skipped', 'not-run'] as const
export type Status = (typeof STATUSES)[number]

const counts = z.object({
  passed: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative(),
  flaky: z.number().int().nonnegative(),
  skipped: z.number().int().nonnegative(),
})
export type Counts = z.infer<typeof counts>

export const suiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  layer: z.enum(['static', 'unit', 'e2e', 'a11y', 'visual']),
  tool: z.string(),
  status: z.enum(STATUSES),
  counts,
  durationMs: z.number().nonnegative(),
})
export type Suite = z.infer<typeof suiteSchema>

export const qualityRunSchema = z.object({
  generatedAt: z.string(),
  commit: z.string().nullable(),
  branch: z.string().nullable(),
  runUrl: z.url().nullable(),
  source: z.enum(['ci', 'local']),
  suites: z.array(suiteSchema),
  coverage: z
    .object({
      lines: z.number(),
      statements: z.number(),
      functions: z.number(),
      branches: z.number(),
    })
    .nullable(),
  lighthouse: z
    .object({
      url: z.string(),
      performance: z.number(),
      accessibility: z.number(),
      bestPractices: z.number(),
      seo: z.number(),
    })
    .nullable(),
  links: z.object({ checked: z.number(), broken: z.number() }).nullable(),
  /** Hosted HTML reports, copied into the build at these paths when they exist. */
  reports: z.object({ playwright: z.string().nullable(), coverage: z.string().nullable() }),
})
export type QualityRun = z.infer<typeof qualityRunSchema>

export function emptyCounts(): Counts {
  return { passed: 0, failed: 0, flaky: 0, skipped: 0 }
}

export function addCounts(a: Counts, b: Counts): Counts {
  return {
    passed: a.passed + b.passed,
    failed: a.failed + b.failed,
    flaky: a.flaky + b.flaky,
    skipped: a.skipped + b.skipped,
  }
}

export function total(c: Counts) {
  return c.passed + c.failed + c.flaky + c.skipped
}

/** Worst status wins: failed > flaky > passed; a suite with nothing executed is "skipped". */
export function statusOf(c: Counts): Status {
  if (c.failed > 0) return 'failed'
  if (c.flaky > 0) return 'flaky'
  if (c.passed > 0) return 'passed'
  return c.skipped > 0 ? 'skipped' : 'not-run'
}

export function overallStatus(run: Pick<QualityRun, 'suites'>): Status {
  const ran = run.suites.filter((s) => s.status !== 'not-run')
  if (ran.length === 0) return 'not-run'
  return statusOf(ran.reduce((acc, s) => addCounts(acc, s.counts), emptyCounts()))
}

// ---- Vitest (--reporter=json) --------------------------------------------------------------

type VitestJson = {
  numPassedTests: number
  numFailedTests: number
  numPendingTests: number
  numTodoTests?: number
  startTime: number
  testResults: { startTime?: number; endTime?: number }[]
}

export function fromVitest(json: VitestJson): Suite {
  const c: Counts = {
    passed: json.numPassedTests,
    failed: json.numFailedTests,
    flaky: 0,
    skipped: json.numPendingTests + (json.numTodoTests ?? 0),
  }
  const end = Math.max(json.startTime, ...json.testResults.map((r) => r.endTime ?? 0))
  return {
    id: 'unit',
    name: 'Unit & component',
    layer: 'unit',
    tool: 'Vitest + Testing Library',
    status: statusOf(c),
    counts: c,
    durationMs: Math.max(0, end - json.startTime),
  }
}

// ---- Playwright (json reporter) ------------------------------------------------------------

type PwTest = {
  projectName: string
  status: 'expected' | 'unexpected' | 'flaky' | 'skipped'
  results: { duration: number }[]
}
type PwSuite = { specs?: { tests: PwTest[] }[]; suites?: PwSuite[] }
type PwJson = { suites: PwSuite[] }

const PROJECTS: Record<string, Pick<Suite, 'name' | 'layer' | 'tool'>> = {
  chromium: { name: 'E2E · Chromium', layer: 'e2e', tool: 'Playwright' },
  firefox: { name: 'E2E · Firefox', layer: 'e2e', tool: 'Playwright' },
  webkit: { name: 'E2E · WebKit', layer: 'e2e', tool: 'Playwright' },
  mobile: { name: 'E2E · Mobile (Pixel 7)', layer: 'e2e', tool: 'Playwright' },
  a11y: { name: 'Accessibility · 4 themes', layer: 'a11y', tool: '@axe-core/playwright' },
  visual: { name: 'Visual regression', layer: 'visual', tool: 'Playwright screenshots' },
}

function* walk(suites: PwSuite[]): Generator<PwTest> {
  for (const s of suites) {
    for (const spec of s.specs ?? []) yield* spec.tests
    if (s.suites) yield* walk(s.suites)
  }
}

export function fromPlaywright(json: PwJson): Suite[] {
  const byProject = new Map<string, { counts: Counts; durationMs: number }>()
  for (const t of walk(json.suites)) {
    const entry = byProject.get(t.projectName) ?? { counts: emptyCounts(), durationMs: 0 }
    const key = (
      { expected: 'passed', unexpected: 'failed', flaky: 'flaky', skipped: 'skipped' } as const
    )[t.status]
    entry.counts[key] += 1
    entry.durationMs += t.results.reduce((sum, r) => sum + r.duration, 0)
    byProject.set(t.projectName, entry)
  }
  return Object.entries(PROJECTS).map(([id, meta]) => {
    const entry = byProject.get(id)
    return {
      id,
      ...meta,
      status: entry ? statusOf(entry.counts) : 'not-run',
      counts: entry?.counts ?? emptyCounts(),
      durationMs: entry?.durationMs ?? 0,
    }
  })
}

// ---- Coverage (json-summary) and Lighthouse CI ---------------------------------------------

type CoverageSummary = {
  total: Record<'lines' | 'statements' | 'functions' | 'branches', { pct: number }>
}

export function fromCoverage(json: CoverageSummary): NonNullable<QualityRun['coverage']> {
  const t = json.total
  return {
    lines: t.lines.pct,
    statements: t.statements.pct,
    functions: t.functions.pct,
    branches: t.branches.pct,
  }
}

type LhciManifestEntry = {
  url: string
  isRepresentativeRun: boolean
  summary: Record<'performance' | 'accessibility' | 'best-practices' | 'seo', number>
}

/** Lowest representative score per category across audited URLs (the number the budget guards). */
export function fromLighthouse(manifest: LhciManifestEntry[]): QualityRun['lighthouse'] {
  const runs = manifest.filter((m) => m.isRepresentativeRun)
  if (runs.length === 0) return null
  const min = (k: keyof LhciManifestEntry['summary']) =>
    Math.round(Math.min(...runs.map((r) => r.summary[k])) * 100)
  return {
    url: `${runs.length} page${runs.length === 1 ? '' : 's'}`,
    performance: min('performance'),
    accessibility: min('accessibility'),
    bestPractices: min('best-practices'),
    seo: min('seo'),
  }
}

export function formatDuration(ms: number) {
  if (ms < 1000) return `${Math.round(ms)} ms`
  const s = ms / 1000
  if (s < 60) return `${s.toFixed(1)} s`
  return `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`
}
