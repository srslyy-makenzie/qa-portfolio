import {
  formatDuration,
  fromCoverage,
  fromLighthouse,
  fromPlaywright,
  fromVitest,
  overallStatus,
  qualityRunSchema,
  statusOf,
} from '@/lib/quality'

const test = (projectName: string, status: 'expected' | 'unexpected' | 'flaky' | 'skipped', ms = 100) => ({
  projectName,
  status,
  results: [{ duration: ms }],
})

describe('statusOf', () => {
  it.each([
    [{ passed: 3, failed: 1, flaky: 1, skipped: 0 }, 'failed'],
    [{ passed: 3, failed: 0, flaky: 1, skipped: 0 }, 'flaky'],
    [{ passed: 3, failed: 0, flaky: 0, skipped: 2 }, 'passed'],
    [{ passed: 0, failed: 0, flaky: 0, skipped: 2 }, 'skipped'],
    [{ passed: 0, failed: 0, flaky: 0, skipped: 0 }, 'not-run'],
  ] as const)('%o → %s', (counts, expected) => {
    expect(statusOf(counts)).toBe(expected)
  })
})

describe('fromPlaywright', () => {
  const json = {
    suites: [
      {
        specs: [{ tests: [test('chromium', 'expected'), test('firefox', 'flaky', 300)] }],
        suites: [{ specs: [{ tests: [test('chromium', 'unexpected', 50), test('a11y', 'skipped', 0)] }] }],
      },
    ],
  }

  it('counts nested tests per project', () => {
    const suites = fromPlaywright(json)
    const chromium = suites.find((s) => s.id === 'chromium')!
    expect(chromium.counts).toEqual({ passed: 1, failed: 1, flaky: 0, skipped: 0 })
    expect(chromium.status).toBe('failed')
    expect(chromium.durationMs).toBe(150)
  })

  it('reports a retry-pass as flaky, never as passed', () => {
    const firefox = fromPlaywright(json).find((s) => s.id === 'firefox')!
    expect(firefox.status).toBe('flaky')
    expect(firefox.counts.passed).toBe(0)
  })

  it('lists projects that did not run as not-run', () => {
    expect(fromPlaywright(json).find((s) => s.id === 'visual')!.status).toBe('not-run')
    expect(fromPlaywright({ suites: [] }).every((s) => s.status === 'not-run')).toBe(true)
  })
})

describe('fromVitest', () => {
  it('maps counts and duration', () => {
    const suite = fromVitest({
      numPassedTests: 10,
      numFailedTests: 0,
      numPendingTests: 1,
      numTodoTests: 1,
      startTime: 1000,
      testResults: [{ endTime: 1800 }, { endTime: 2500 }],
    })
    expect(suite.counts).toEqual({ passed: 10, failed: 0, flaky: 0, skipped: 2 })
    expect(suite.durationMs).toBe(1500)
    expect(suite.status).toBe('passed')
  })
})

describe('overallStatus', () => {
  it('ignores suites that did not run', () => {
    const suites = fromPlaywright({ suites: [{ specs: [{ tests: [test('chromium', 'expected')] }] }] })
    expect(overallStatus({ suites })).toBe('passed')
  })

  it('is not-run when nothing ran', () => {
    expect(overallStatus({ suites: fromPlaywright({ suites: [] }) })).toBe('not-run')
  })
})

describe('fromLighthouse', () => {
  const entry = (url: string, perf: number, rep = true) => ({
    url,
    isRepresentativeRun: rep,
    summary: { performance: perf, accessibility: 1, 'best-practices': 0.96, seo: 1 },
  })

  it('takes the lowest representative score per category', () => {
    const r = fromLighthouse([entry('/a', 0.99), entry('/b', 0.95), entry('/b', 0.5, false)])
    expect(r).toMatchObject({ performance: 95, accessibility: 100, bestPractices: 96, seo: 100, url: '2 pages' })
  })

  it('returns null with no representative runs', () => {
    expect(fromLighthouse([entry('/a', 1, false)])).toBeNull()
  })
})

describe('fromCoverage', () => {
  it('reads total percentages', () => {
    const pct = (n: number) => ({ pct: n })
    expect(fromCoverage({ total: { lines: pct(90), statements: pct(89), functions: pct(80), branches: pct(70) } })).toEqual({
      lines: 90,
      statements: 89,
      functions: 80,
      branches: 70,
    })
  })
})

describe('formatDuration', () => {
  it.each([
    [450, '450 ms'],
    [1500, '1.5 s'],
    [125000, '2 min 5 s'],
  ])('%i → %s', (ms, text) => expect(formatDuration(ms)).toBe(text))
})

describe('qualityRunSchema', () => {
  it('rejects a run with an invalid status', () => {
    const r = qualityRunSchema.safeParse({
      generatedAt: 'x',
      commit: null,
      branch: null,
      runUrl: null,
      source: 'local',
      suites: [{ id: 'u', name: 'U', layer: 'unit', tool: 't', status: 'green', counts: { passed: 1, failed: 0, flaky: 0, skipped: 0 }, durationMs: 1 }],
      coverage: null,
      lighthouse: null,
      links: null,
      reports: { playwright: null, coverage: null },
    })
    expect(r.success).toBe(false)
  })
})
