import { CircleCheck, CircleDashed, CircleX, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { Status } from '@/lib/quality'

// One mapping from test status to token, text and icon, used everywhere on the site.
// Status is never carried by color alone: every badge has its word and an icon.
const STATUS: Record<
  Status | 'running',
  { label: string; variant: BadgeProps['variant']; icon: ReactNode }
> = {
  passed: { label: 'Passed', variant: 'success', icon: <CircleCheck aria-hidden="true" /> },
  failed: { label: 'Failed', variant: 'destructive', icon: <CircleX aria-hidden="true" /> },
  flaky: { label: 'Flaky', variant: 'warning', icon: <TriangleAlert aria-hidden="true" /> },
  skipped: { label: 'Skipped', variant: 'warning', icon: <TriangleAlert aria-hidden="true" /> },
  running: { label: 'Running', variant: 'info', icon: <Info aria-hidden="true" /> },
  'not-run': { label: 'Not run yet', variant: 'outline', icon: <CircleDashed aria-hidden="true" /> },
}

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: Status | 'running'
  /** Overrides the default word, e.g. "CI passing". Keep the status word in it. */
  label?: string
  className?: string
}) {
  const s = STATUS[status]
  return (
    <Badge variant={s.variant} className={className} data-testid="status-badge" data-status={status}>
      {s.icon}
      {label ?? s.label}
    </Badge>
  )
}
