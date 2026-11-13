import { getAbout, getCaseStudies, getProjects, getQualityStrategy, getResume, getSite } from '@/lib/content'
import { REQUIRED_SECTIONS, sectionHeadings } from '@/lib/sections'

// The committed content is the part of the site that changes most, so every file is validated
// here as well as at build time.
describe('content files', () => {
  it('parse against their schemas', () => {
    expect(() => getSite()).not.toThrow()
    expect(() => getAbout()).not.toThrow()
    expect(() => getResume()).not.toThrow()
    expect(() => getProjects()).not.toThrow()
    expect(() => getQualityStrategy()).not.toThrow()
  })

  it('has 2–4 case studies, with 2–4 featured on the home page', () => {
    const studies = getCaseStudies()
    expect(studies.length).toBeGreaterThanOrEqual(2)
    expect(studies.length).toBeLessThanOrEqual(4)
    const featured = studies.filter((s) => s.featured).length
    expect(featured).toBeGreaterThanOrEqual(1)
    expect(featured).toBeLessThanOrEqual(3)
  })

  it('gives case studies unique slugs and orders', () => {
    const studies = getCaseStudies()
    expect(new Set(studies.map((s) => s.slug)).size).toBe(studies.length)
    expect(new Set(studies.map((s) => s.order)).size).toBe(studies.length)
  })

  describe.each(getCaseStudies().map((s) => [s.slug, s] as const))('case study %s', (_slug, study) => {
    it('follows the template: required sections, in order', () => {
      const headings = sectionHeadings(study.body).filter((h) => REQUIRED_SECTIONS.includes(h))
      expect(headings).toEqual(REQUIRED_SECTIONS)
    })

    it('does not hand-write sections the page renders from metadata', () => {
      const headings = sectionHeadings(study.body)
      expect(headings).not.toContain('Results')
      expect(headings).not.toContain('See it run')
    })

    it('has at least one before/after number', () => {
      expect(study.metrics.length).toBeGreaterThan(0)
    })

    it('links repo, CI run and report, or explains why not', () => {
      const { repo, ciRun, report, unavailableReason } = study.links
      expect(Boolean(repo && ciRun && report) || Boolean(unavailableReason)).toBe(true)
    })
  })
})

describe('resumeFileName', () => {
  it('builds a safe file name from name and title', async () => {
    const { resumeFileName } = await import('@/lib/content')
    expect(resumeFileName({ name: 'Donovan Cadena', title: 'QA Automation Engineer' })).toBe('Donovan-Cadena-QA-Automation-Engineer.pdf')
  })
})
