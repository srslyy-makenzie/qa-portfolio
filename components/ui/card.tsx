import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

/** A raised surface grouping related content. Server-component safe. */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-border bg-card py-4 text-card-foreground shadow-elevation-1',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="card-header" className={cn('flex flex-col gap-1 px-4', className)} {...props} />
  )
}

export type CardTitleProps = ComponentProps<'h3'> & {
  /** Heading element. Pick the level that fits the page outline; the page owns heading order. */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
}

export function CardTitle({ className, as: Tag = 'h3', ...props }: CardTitleProps) {
  return <Tag data-slot="card-title" className={cn('text-title-3', className)} {...props} />
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-body-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-4', className)} {...props} />
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center gap-2 px-4', className)}
      {...props}
    />
  )
}
