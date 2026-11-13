import { PageHeader, Section } from '@/components/page-header'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { getAbout } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

const description = 'How I think about quality, how I moved from manual QA into automation, and how I work with developers and product.'
export const metadata = pageMetadata({ title: 'About', description, path: '/about/' })

export default function AboutPage() {
  const about = getAbout()
  return (
    <>
      <PageHeader eyebrow="About" title="Quality is a team habit, not a phase" lede={about.intro} />

      <Section title="Quality philosophy" id="philosophy">
        <ul className="grid gap-4 md:grid-cols-2" data-testid="philosophy">
          {about.philosophy.map((p) => (
            <li key={p.title} className="rounded-lg border border-border p-5">
              <h3 className="text-headline">{p.title}</h3>
              <p className="mt-2 text-body-sm text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="From QA to automation" id="narrative">
        <ol className="flex max-w-3xl flex-col gap-6 border-l-2 border-border pl-6">
          {about.narrative.map((n) => (
            <li key={n.heading}>
              <h3 className="text-headline">{n.heading}</h3>
              <p className="mt-1 text-body text-muted-foreground">{n.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="How I work" id="working">
        <Accordion className="max-w-3xl">
          {about.workingWith.map((f) => (
            <AccordionItem key={f.question} value={f.question}>
              <AccordionTrigger headingLevel={3}>{f.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  )
}
