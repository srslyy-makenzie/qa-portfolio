import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type EmptyStateProps = Omit<ComponentProps<'section'>, 'title'> & {
  /** Decorative icon (aria-hidden is added). */
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** The next step, usually one primary Button. */
  action?: ReactNode
  /** Heading level for the title; fit it to the page outline. */
  headingLevel?: 2 | 3 | 4
}

/**
 * What a list or page shows before it has content: what it is, why it's empty and the next step.
 * Server-component safe.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  headingLevel = 2,
  className,
  ...props
}: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <section
      data-slot="empty-state"
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-10 text-center',
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-5"
        >
          {icon}
        </div>
      ) : null}
      <Heading className="text-title-3">{title}</Heading>
      {description ? (
        <p className="max-w-sm text-body-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </section>
  )
}
