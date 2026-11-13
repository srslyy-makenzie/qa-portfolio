import { FileText, GitBranch, PlayCircle } from 'lucide-react'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'
import { MetricsTable } from '@/components/metrics-table'
import { TextLink } from '@/components/text-link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { getCaseStudies, getCaseStudy } from '@/lib/content'
import { renderMdx } from '@/lib/mdx'
import { pageMetadata } from '@/lib/metadata'
import { splitAtReflection } from '@/lib/sections'

export const dynamicParams = false

export function generateStaticParams() {
  return getCaseStudies().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>) {
  const study = getCaseStudy((await params).slug)
  if (!study) return {}
  return pageMetadata({ title: study.title, description: study.summary, path: `/work/${study.slug}/` })
}

export default async function CaseStudyPage({ params }: PageProps<'/work/[slug]'>) {
  const study = getCaseStudy((await params).slug)
  if (!study) notFound()
  const [before, after] = splitAtReflection(study.body)
  const [bodyBefore, bodyAfter] = await Promise.all([renderMdx(before), after ? renderMdx(after) : null])

  const evidence = [
    { label: 'Repository', href: study.links.repo, icon: GitBranch },
    { label: 'CI run', href: study.links.ciRun, icon: PlayCircle },
    { label: 'Test report', href: study.links.report, icon: FileText },
  ]

  return (
    <article className="mx-auto max-w-3xl" data-testid="case-study">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<NextLink href="/work/" />}>Work</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{study.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="flex flex-col gap-4">
        <p className="text-body-sm font-medium text-primary">{study.angle}</p>
        <h1 className="text-title-1 text-balance">{study.title}</h1>
        <p className="text-title-3 font-normal text-pretty" data-testid="claim">
          {study.claim}
        </p>
        {study.status === 'draft' ? (
          <Alert variant="warning" data-testid="draft-notice">
            <AlertTitle>Draft case study</AlertTitle>
            <AlertDescription>
              The narrative is a sample and the numbers are placeholders until the real metrics are
              gathered.
            </AlertDescription>
          </Alert>
        ) : null}
        <dl className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2" data-testid="context">
          {(
            [
              ['Company', study.context.company],
              ['Team', study.context.team],
              ['My role', study.context.role],
              ['Timeframe', study.context.timeframe],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5">
              <dt className="text-caption text-muted-foreground">{k}</dt>
              <dd className="text-body-sm">{v}</dd>
            </div>
          ))}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <dt className="text-caption text-muted-foreground">Stack</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {study.stack.map((s) => (
                  <li key={s}>
                    <Badge variant="secondary">{s}</Badge>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </header>

      <Separator className="my-10" />

      <div data-testid="case-study-body">{bodyBefore}</div>

      <section aria-labelledby="results" className="mt-12">
        <h2 id="results" className="mb-4 text-title-2">
          Results
        </h2>
        <MetricsTable metrics={study.metrics} caption={`Before and after: ${study.title}`} />
      </section>

      <section aria-labelledby="see-it-run" className="mt-12" data-testid="see-it-run">
        <h2 id="see-it-run" className="mb-4 text-title-2">
          See it run
        </h2>
        <ul className="flex flex-col gap-2">
          {evidence.map(({ label, href, icon: Icon }) => (
            <li key={label} className="flex items-center gap-2 text-body">
              <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
              {href ? (
                <TextLink href={href}>{label}</TextLink>
              ) : (
                <span className="text-muted-foreground">{label}: not public</span>
              )}
            </li>
          ))}
        </ul>
        {study.links.unavailableReason ? (
          <Alert variant="info" className="mt-4">
            <AlertTitle>Why some links are missing</AlertTitle>
            <AlertDescription>
              {study.links.unavailableReason}{' '}
              <TextLink href="/quality/">See this site’s live suite</TextLink>.
            </AlertDescription>
          </Alert>
        ) : null}
      </section>

      {bodyAfter ? <div className="mt-12">{bodyAfter}</div> : null}

      <footer className="mt-12 border-t border-border pt-6 text-body-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Credits: </span>
          {study.credits}
        </p>
        <p className="mt-2">
          Updated <time dateTime={study.updated}>{study.updated}</time>
        </p>
      </footer>
    </article>
  )
}
