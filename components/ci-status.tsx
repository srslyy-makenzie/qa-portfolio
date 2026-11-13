import NextLink from 'next/link'
import { StatusBadge } from '@/components/status-badge'
import { overallStatus, type QualityRun } from '@/lib/quality'

/** This site's own latest test run, linking to the Quality page for details. */
export function CiStatus({ run }: { run: QualityRun | null }) {
  const status = run ? overallStatus(run) : 'not-run'
  const word = { passed: 'passing', failed: 'failing', flaky: 'flaky', skipped: 'skipped', 'not-run': 'not run yet' }[status]
  return (
    <NextLink
      href="/quality/"
      className="focus-ring inline-flex rounded-md"
      data-testid="ci-status"
    >
      {/* The accessible name starts with the visible words (WCAG 2.5.3 label in name). */}
      <StatusBadge status={status} label={`Site tests ${word}`} />
      <span className="sr-only"> (details on the Quality page)</span>
    </NextLink>
  )
}
