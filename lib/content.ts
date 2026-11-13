// Build-time content loaders. Content lives in content/ as JSON (structure) and MDX (narrative);
// adding a case study means adding a folder there, never touching component code.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { qualityRunSchema, type QualityRun } from './quality.ts'
import {
  aboutSchema,
  caseStudySchema,
  projectsSchema,
  qualityStrategySchema,
  reposSchema,
  resumeSchema,
  siteSchema,
  type CaseStudy,
} from './schemas.ts'

export const CONTENT_DIR = join(process.cwd(), 'content')

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(join(CONTENT_DIR, path), 'utf8'))
}

function parse<T>(schema: { parse: (v: unknown) => T }, path: string): T {
  try {
    return schema.parse(readJson(path))
  } catch (err) {
    throw new Error(`Invalid content in content/${path}: ${(err as Error).message}`, { cause: err })
  }
}

export const getSite = () => parse(siteSchema, 'site.json')

/** Download name for the resume PDF, e.g. "Donovan-Cadena-QA-Automation-Engineer.pdf". */
export function resumeFileName(site: { name: string; title: string }) {
  return `${`${site.name} ${site.title}`.trim().replace(/[^A-Za-z0-9]+/g, '-')}.pdf`
}
export const getAbout = () => parse(aboutSchema, 'about.json')
export const getResume = () => parse(resumeSchema, 'resume.json')
export const getQualityStrategy = () => parse(qualityStrategySchema, 'quality/strategy.json')
export const getProjects = () => parse(projectsSchema, 'projects.json')

export function getRepos() {
  const path = 'repos.generated.json'
  if (!existsSync(join(CONTENT_DIR, path))) return { fetchedAt: null, repos: {} }
  return parse(reposSchema, path)
}

export function getQualityRun(): QualityRun | null {
  const path = 'quality/latest-run.json'
  if (!existsSync(join(CONTENT_DIR, path))) return null
  return parse(qualityRunSchema, path)
}

export type CaseStudyEntry = CaseStudy & { body: string }

export function getCaseStudies(dir = join(CONTENT_DIR, 'work')): CaseStudyEntry[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const folder = join(dir, d.name)
      let meta: CaseStudy
      try {
        meta = caseStudySchema.parse(JSON.parse(readFileSync(join(folder, 'meta.json'), 'utf8')))
      } catch (err) {
        throw new Error(`Invalid case study content/work/${d.name}: ${(err as Error).message}`, {
          cause: err,
        })
      }
      if (meta.slug !== d.name) {
        throw new Error(`content/work/${d.name}: slug "${meta.slug}" must match its folder name`)
      }
      return { ...meta, body: readFileSync(join(folder, 'index.mdx'), 'utf8') }
    })
    .sort((a, b) => a.order - b.order)
}

export function getCaseStudy(slug: string) {
  return getCaseStudies().find((c) => c.slug === slug)
}
