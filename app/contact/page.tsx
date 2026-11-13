import { AtSign, GitBranch, Mail } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { TextLink } from '@/components/text-link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

const description = 'Hiring for QA automation, SDET or quality engineering? Email is fastest.'
export const metadata = pageMetadata({ title: 'Contact', description, path: '/contact/' })

export default function ContactPage() {
  const site = getSite()
  const channels = [
    { title: 'Email', body: 'Fastest. I reply within two working days.', href: `mailto:${site.links.email}`, label: site.links.email, icon: Mail, testId: 'contact-email' },
    { title: 'LinkedIn', body: 'Career history and recommendations.', href: site.links.linkedin, label: 'Message on LinkedIn', icon: AtSign, testId: 'contact-linkedin' },
    { title: 'GitHub', body: 'Frameworks, test suites and this site’s source.', href: site.links.github, label: 'View GitHub profile', icon: GitBranch, testId: 'contact-github' },
  ]
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let’s talk about quality" lede={description} />
      <ul className="grid gap-4 md:grid-cols-3">
        {channels.map((c) => (
          <li key={c.title}>
            <Card className="h-full">
              <CardHeader>
                <c.icon aria-hidden="true" className="size-5 text-primary" />
                <CardTitle as="h2">{c.title}</CardTitle>
                <CardDescription>{c.body}</CardDescription>
              </CardHeader>
              <CardContent>
                <TextLink href={c.href} testId={c.testId} className="break-all">
                  {c.label}
                </TextLink>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
