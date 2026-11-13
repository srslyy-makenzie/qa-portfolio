import { Download } from 'lucide-react'
import { LinkButton } from '@/components/link-button'
import { Section } from '@/components/page-header'
import { TextLink } from '@/components/text-link'
import { Badge } from '@/components/ui/badge'
import { getResume, getSite, resumeFileName } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

export const metadata = pageMetadata({
  title: 'Resume',
  description: 'Resume: QA automation experience, skills and education. Download as PDF.',
  path: '/resume/',
})

export default function ResumePage() {
  const site = getSite()
  const resume = getResume()
  return (
    <div className="mx-auto max-w-3xl" data-testid="resume">
      <header className="flex flex-col gap-3 border-b border-border pb-8">
        <h1 className="text-title-1">{site.name}</h1>
        <p className="text-title-3 font-normal">{resume.headline}</p>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm text-muted-foreground">
          <TextLink href={`mailto:${site.links.email}`} variant="muted">{site.links.email}</TextLink>
          <TextLink href={site.links.linkedin} variant="muted">LinkedIn</TextLink>
          <TextLink href={site.links.github} variant="muted">GitHub</TextLink>
          <span>{site.location}</span>
        </p>
        <p className="text-body">{resume.summary}</p>
        <div data-print="hide">
          <LinkButton href="/resume.pdf" variant="primary" download={resumeFileName(site)} data-testid="resume-download">
            <Download aria-hidden="true" /> Download PDF
          </LinkButton>
        </div>
      </header>

      <Section title="Experience" id="experience">
        <ol className="flex flex-col gap-8">
          {resume.experience.map((job) => (
            <li key={`${job.title}-${job.company}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-headline">
                  {job.title} · <span className="font-normal">{job.company}</span>
                </h3>
                <span className="text-body-sm text-muted-foreground">{job.timeframe}</span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-body-sm">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Skills" id="skills">
        <dl className="flex flex-col gap-3">
          {resume.skills.map((g) => (
            <div key={g.group} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
              <dt className="w-40 shrink-0 text-body-sm font-semibold">{g.group}</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <li key={s}>
                      <Badge variant="outline">{s}</Badge>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Education & certifications" id="education">
        <ul className="flex flex-col gap-2 text-body-sm">
          {resume.education.map((e) => (
            <li key={e.credential}>
              <span className="font-medium">{e.credential}</span>, {e.school} · {e.timeframe}
            </li>
          ))}
          {resume.certifications.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
