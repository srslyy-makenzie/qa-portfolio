import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

/**
 * A placeholder shape while content loads. Decorative: put aria-busy="true" on the region that
 * is loading so assistive technology knows to wait. The pulse stops under reduced motion.
 * Server-component safe.
 */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('rounded-md bg-muted motion-safe:animate-pulse', className)}
      {...props}
    />
  )
}
