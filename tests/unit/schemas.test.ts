import { caseStudySchema, siteSchema } from '@/lib/schemas'

const valid = {
  slug: 'example',
  title: 'Example',
  claim: 'Proves a point.',
  summary: 'Summary.',
  status: 'published',
  order: 1,
  angle: 'Framework',
  context: { company: 'Co', team: 'Team', role: 'Role', timeframe: '3 months' },
  stack: ['Playwright'],
  metrics: [{ label: 'Runtime', before: 10, after: 5, unit: 'min', better: 'lower' }],
  links: { repo: 'https://github.com/a/b', ciRun: 'https://github.com/a/b/actions/runs/1', report: '/reports/x/' },
  credits: 'Thanks',
  updated: '2026-11-12',
}

describe('caseStudySchema', () => {
  it('accepts a complete case study', () => {
    expect(caseStudySchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a case study with no before/after metric', () => {
    const r = caseStudySchema.safeParse({ ...valid, metrics: [] })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toMatch(/before\/after/)
  })

  it('rejects missing evidence links without a reason', () => {
    const r = caseStudySchema.safeParse({ ...valid, links: { repo: valid.links.repo } })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toMatch(/unavailableReason/)
  })

  it('accepts missing links when the reason is given', () => {
    expect(caseStudySchema.safeParse({ ...valid, links: { unavailableReason: 'Proprietary' } }).success).toBe(true)
  })

  it.each(['Has Spaces', 'UPPER', 'under_score'])('rejects slug %j', (slug) => {
    expect(caseStudySchema.safeParse({ ...valid, slug }).success).toBe(false)
  })

  it('rejects a non-ISO date', () => {
    expect(caseStudySchema.safeParse({ ...valid, updated: 'Nov 12' }).success).toBe(false)
  })

  it('defaults unit and featured', () => {
    const { metrics, featured } = caseStudySchema.parse({
      ...valid,
      metrics: [{ label: 'Count', before: 1, after: 2, better: 'higher' }],
    })
    expect(metrics[0].unit).toBe('')
    expect(featured).toBe(false)
  })
})

describe('siteSchema', () => {
  it('rejects an invalid email', () => {
    const r = siteSchema.safeParse({ links: { email: 'nope' } })
    expect(r.success).toBe(false)
  })
})
