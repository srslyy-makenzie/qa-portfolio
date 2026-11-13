import { FileText, Mail } from 'lucide-react'
import { CaseStudyCard } from '@/components/case-study-card'
import { CiStatus } from '@/components/ci-status'
import { LinkButton } from '@/components/link-button'
import { Section } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { TextLink } from '@/components/text-link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getCaseStudies, getQualityRun, getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'
import { overallStatus, total } from '@/lib/quality'

export const metadata = pageMetadata({
  description: getSite().positioning,
  path: '/',
})

export default function HomePage() {
  const site = getSite()
  const featured = getCaseStudies().filter((c) => c.featured)
  const run = getQualityRun()
  const testCount = run?.suites.reduce((n, s) => n + total(s.counts), 0) ?? 0

  return (
    <>
      <section aria-labelledby="hero-heading" className="flex flex-col gap-6 pb-12" data-testid="hero">
        <div className="flex flex-wrap items-center gap-2">
          <CiStatus run={run} />
          <span className="text-body-sm text-muted-foreground">{site.location}</span>
        </div>
        <div className="flex max-w-3xl flex-col gap-3">
          <p className="text-title-3 text-muted-foreground">{site.name}</p>
          <h1 id="hero-heading" className="text-display text-balance">
            {site.title}
          </h1>
          <p className="text-title-3 font-normal text-pretty" data-testid="positioning">
            {site.positioning}
          </p>
          <p className="text-body text-muted-foreground text-pretty">{site.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/work/" variant="primary" size="lg">
            View case studies
          </LinkButton>
          <LinkButton href="/resume/" size="lg">
            <FileText aria-hidden="true" /> Resume
          </LinkButton>
          <LinkButton href={site.links.github} size="lg" external>
            GitHub
          </LinkButton>
          <LinkButton href="/contact/" size="lg">
            <Mail aria-hidden="true" /> Contact
          </LinkButton>
        </div>
      </section>

      <Section title="Core stack" id="stack">
        <dl className="grid gap-6 sm:grid-cols-3" data-testid="core-stack">
          {site.coreStack.map((g) => (
            <div key={g.group} className="flex flex-col gap-2">
              <dt className="text-body-sm font-semibold">{g.group}</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <li key={item}>
                      <Badge variant="outline">{item}</Badge>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        title="Featured work"
        id="featured"
        description="Each case study makes one point about how I approach quality, with the strategy, code and before/after numbers behind it."
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {featured.map((study) => (
            <li key={study.slug}>
              <CaseStudyCard study={study} />
            </li>
          ))}
          <li>
            <Card className="relative h-full border-primary" data-testid="quality-card">
              <CardHeader>
                <p className="text-caption font-medium text-primary">Flagship · Live</p>
                <CardTitle>
                  <TextLink href="/quality/" variant="standalone" className="after:absolute after:inset-0">
                    This site is the test
                  </TextLink>
                </CardTitle>
                <CardDescription>
                  The suite, pipeline and latest results behind the page you’re reading.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-2">
                <p className="text-headline tabular-nums">{testCount} automated checks</p>
                <p className="text-body-sm text-muted-foreground">
                  Unit, E2E in 3 browsers + mobile, axe in 4 themes, visual regression, Lighthouse.
                </p>
              </CardContent>
              <CardFooter>
                <StatusBadge status={run ? overallStatus(run) : 'not-run'} />
              </CardFooter>
            </Card>
          </li>
        </ul>
      </Section>
    </>
  )
}
