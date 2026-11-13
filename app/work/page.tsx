import { CaseStudyCard } from '@/components/case-study-card'
import { PageHeader } from '@/components/page-header'
import { TextLink } from '@/components/text-link'
import { getCaseStudies } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

const description =
  'Automation case studies: framework architecture, CI reliability and the decisions behind them, each with before/after numbers.'

export const metadata = pageMetadata({ title: 'Work', description, path: '/work/' })

export default function WorkPage() {
  const studies = getCaseStudies()
  return (
    <>
      <PageHeader eyebrow="Work" title="Automation case studies" lede={description}>
        <p className="text-body-sm text-muted-foreground">
          Looking for live evidence? This site’s own test suite is on the{' '}
          <TextLink href="/quality/">Quality page</TextLink>.
        </p>
      </PageHeader>
      <ul className="grid gap-4 md:grid-cols-2" data-testid="case-study-list">
        {studies.map((study) => (
          <li key={study.slug}>
            <CaseStudyCard study={study} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </>
  )
}
