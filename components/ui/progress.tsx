'use client'

import { Progress as BaseProgress } from '@base-ui/react/progress'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type ProgressProps = ComponentProps<typeof BaseProgress.Root> & {
  /** Visible label; also names the progressbar. Required. */
  label: ReactNode
  /** Show the formatted value (e.g. "40%") next to the label. */
  showValue?: boolean
}

/**
 * Progress of a task with a known (value) or unknown (value={null}) amount of work.
 * For loading placeholders, use Skeleton.
 */
export function Progress({ className, label, showValue = true, ...props }: ProgressProps) {
  return (
    <BaseProgress.Root
      data-slot="progress"
      className={cn('flex w-full flex-col gap-2', className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-4 text-body-sm">
        <BaseProgress.Label className="font-medium">{label}</BaseProgress.Label>
        {showValue ? <BaseProgress.Value className="text-muted-foreground tabular-nums" /> : null}
      </div>
      {/* The unfilled track uses --input so the bar's extent meets 3:1 (WCAG 1.4.11). */}
      <BaseProgress.Track className="relative h-2 w-full overflow-hidden rounded-full bg-muted ring-1 ring-input ring-inset">
        <BaseProgress.Indicator
          className={cn(
            'block h-full rounded-full bg-primary transition-all duration-slow ease-standard',
            'data-indeterminate:w-1/3 motion-safe:data-indeterminate:animate-pulse',
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}
