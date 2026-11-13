import { ArrowRight } from 'lucide-react'
import NextLink from 'next/link'
import { HeadlineMetric } from '@/components/metrics-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { CaseStudy } from '@/lib/schemas'

export function CaseStudyCard({ study, headingLevel = 'h3' }: { study: CaseStudy; headingLevel?: 'h2' | 'h3' }) {
  return (
    <Card className="group relative h-full transition-shadow duration-fast hover:shadow-elevation-2" data-testid="case-study-card">
      <CardHeader>
        <p className="text-caption font-medium text-primary">{study.angle}</p>
        <CardTitle as={headingLevel}>
          {/* The title link covers the card (::after) so the whole card is one target, one tab stop. */}
          <NextLink
            href={`/work/${study.slug}/`}
            className="focus-ring rounded-sm after:absolute after:inset-0 group-hover:underline"
          >
            {study.title}
          </NextLink>
        </CardTitle>
        <CardDescription>{study.claim}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <HeadlineMetric metric={study.metrics[0]} />
        <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
          {study.stack.map((s) => (
            <li key={s}>
              <Badge variant="secondary">{s}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="text-body-sm font-medium text-primary">
        <span aria-hidden="true" className="inline-flex items-center gap-1">
          Read case study <ArrowRight className="size-4 transition-transform duration-fast motion-safe:group-hover:translate-x-0.5" />
        </span>
        {study.status === 'draft' ? <Badge variant="warning" className="ml-auto">Draft</Badge> : null}
      </CardFooter>
    </Card>
  )
}
