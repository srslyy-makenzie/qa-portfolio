import { CiStatus } from '@/components/ci-status'
import { TextLink } from '@/components/text-link'
import type { QualityRun } from '@/lib/quality'
import type { Site } from '@/lib/schemas'

export function SiteFooter({ site, run }: { site: Site; run: QualityRun | null }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-body-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <p>
          © {new Date().getFullYear()} {site.name}. Built with{' '}
          <TextLink href="https://mak-ui.makenziemoore.workers.dev/" variant="muted">
            mak UI
          </TextLink>
          .
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <CiStatus run={run} />
          <TextLink href={site.siteRepo} variant="muted">
            Source
          </TextLink>
          <TextLink href={`mailto:${site.links.email}`} variant="muted">
            Email
          </TextLink>
        </div>
      </div>
    </footer>
  )
}
