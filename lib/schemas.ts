// Content schemas. Every structured content file is parsed through one of these at build time,
// so a typo in a case study's metadata fails the build (and the unit tests) instead of shipping.
// Kept free of path aliases so the Node scripts in scripts/ can import it directly.
import { z } from 'zod'

const url = z.url()
/** Site-relative path (/resume.pdf) or absolute URL. */
const href = z.union([z.string().regex(/^\/[^\s]*$/), url])

export const siteSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  altTitles: z.array(z.string()),
  positioning: z.string().min(1),
  summary: z.string().min(1),
  location: z.string(),
  siteUrl: url,
  /** Repository that holds this site's source, tests and CI. */
  siteRepo: url,
  links: z.object({
    email: z.email(),
    linkedin: url,
    github: url,
  }),
  coreStack: z.array(z.object({ group: z.string(), items: z.array(z.string()).min(1) })),
})
export type Site = z.infer<typeof siteSchema>

export const metricSchema = z.object({
  label: z.string(),
  before: z.number(),
  after: z.number(),
  unit: z.string().default(''),
  /** Which way is better, so the page can say "improved" without relying on color. */
  better: z.enum(['lower', 'higher']),
  note: z.string().optional(),
})
export type Metric = z.infer<typeof metricSchema>

export const caseStudySchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string(),
    /** One line: what this case study proves. */
    claim: z.string(),
    summary: z.string(),
    /** draft = sample narrative and placeholder numbers; the page says so. */
    status: z.enum(['draft', 'published']),
    order: z.number().int(),
    featured: z.boolean().default(false),
    angle: z.string(),
    context: z.object({
      company: z.string(),
      team: z.string(),
      role: z.string(),
      timeframe: z.string(),
    }),
    stack: z.array(z.string()).min(1),
    metrics: z.array(metricSchema).min(1, 'Every case study needs at least one before/after number'),
    links: z.object({
      repo: url.optional(),
      ciRun: url.optional(),
      report: href.optional(),
      /** Required when any of the three links is missing (PRD requirement 5). */
      unavailableReason: z.string().optional(),
    }),
    credits: z.string(),
    updated: z.iso.date(),
  })
  .refine(
    (cs) =>
      (cs.links.repo && cs.links.ciRun && cs.links.report) || Boolean(cs.links.unavailableReason),
    { message: 'Link a repo, CI run and report, or say why not (links.unavailableReason)' },
  )
export type CaseStudy = z.infer<typeof caseStudySchema>

export const projectSchema = z.object({
  title: z.string(),
  kind: z.enum(['Repo', 'Test plan', 'Bug report', 'Utility', 'Writing', 'Talk']),
  description: z.string(),
  /** GitHub "owner/name"; repo cards get language, last update and CI status at build time. */
  repo: z
    .string()
    .regex(/^[\w.-]+\/[\w.-]+$/)
    .optional(),
  href: href.optional(),
  tags: z.array(z.string()),
})
export const projectsSchema = z.array(projectSchema)
export type Project = z.infer<typeof projectSchema>

export const repoInfoSchema = z.object({
  url,
  language: z.string().nullable(),
  pushedAt: z.string().nullable(),
  ci: z.enum(['passing', 'failing', 'running', 'none', 'unknown']),
  available: z.boolean(),
})
export const reposSchema = z.object({
  fetchedAt: z.string().nullable(),
  repos: z.record(z.string(), repoInfoSchema),
})
export type RepoInfo = z.infer<typeof repoInfoSchema>

export const aboutSchema = z.object({
  intro: z.string(),
  philosophy: z.array(z.object({ title: z.string(), body: z.string() })),
  narrative: z.array(z.object({ heading: z.string(), body: z.string() })),
  workingWith: z.array(z.object({ question: z.string(), answer: z.string() })),
})
export type About = z.infer<typeof aboutSchema>

export const resumeSchema = z.object({
  headline: z.string(),
  summary: z.string(),
  skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      timeframe: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
  education: z.array(z.object({ credential: z.string(), school: z.string(), timeframe: z.string() })),
  certifications: z.array(z.string()),
})
export type Resume = z.infer<typeof resumeSchema>

export const qualityStrategySchema = z.object({
  intro: z.string(),
  layers: z.array(
    z.object({
      id: z.enum(['static', 'unit', 'e2e', 'a11y', 'visual']),
      name: z.string(),
      tool: z.string(),
      what: z.string(),
      why: z.string(),
    }),
  ),
  notAutomated: z.array(z.object({ area: z.string(), why: z.string() })),
  pipeline: z.array(z.object({ title: z.string(), description: z.string().optional() })),
  gates: z.array(z.object({ gate: z.string(), tool: z.string(), purpose: z.string() })),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
})
export type QualityStrategy = z.infer<typeof qualityStrategySchema>
