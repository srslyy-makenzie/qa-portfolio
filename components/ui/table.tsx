import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

/**
 * Tabular data with real table semantics, so screen readers announce rows, columns and headers.
 * Wide tables scroll horizontally inside a focusable region instead of breaking the page
 * layout (WCAG 1.4.10). Server-component safe.
 */
export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    // The region is focusable so keyboard users can scroll it; it is named by the caption.
    <div
      data-slot="table-container"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className="relative w-full overflow-x-auto rounded-md focus-ring"
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom border-collapse text-body-sm', className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />
}

export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

export function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn('border-t border-border bg-muted font-medium', className)}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b border-border transition-colors hover:bg-muted data-[state=selected]:bg-accent',
        className,
      )}
      {...props}
    />
  )
}

/** Header cell. Defaults to scope="col"; use scope="row" for row headers. */
export function TableHead({ className, scope = 'col', ...props }: ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      scope={scope}
      className={cn(
        'h-control-md px-3 text-left align-middle font-medium whitespace-nowrap text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td data-slot="table-cell" className={cn('px-3 py-2 align-middle', className)} {...props} />
  )
}

/** Names the table. Strongly recommended; it also names the scroll region. */
export function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-3 text-body-sm text-muted-foreground', className)}
      {...props}
    />
  )
}
