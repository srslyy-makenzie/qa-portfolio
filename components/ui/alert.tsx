import { cva, type VariantProps } from 'class-variance-authority'
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export const alertVariants = cva(
  'relative flex w-full items-start gap-3 rounded-lg border border-border border-l-4 bg-background px-3 py-2.5 text-body-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        info: 'border-l-info [&>svg]:text-info',
        success: 'border-l-success [&>svg]:text-success',
        warning: 'border-l-warning [&>svg]:text-warning',
        destructive: 'border-l-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: { variant: 'info' },
  },
)

type Variant = NonNullable<VariantProps<typeof alertVariants>['variant']>

// Every alert has an icon so status is never conveyed by color alone (WCAG 1.4.1).
const ICONS: Record<Variant, ReactNode> = {
  info: <Info aria-hidden="true" />,
  success: <CircleCheck aria-hidden="true" />,
  warning: <TriangleAlert aria-hidden="true" />,
  destructive: <CircleX aria-hidden="true" />,
}

export type AlertProps = ComponentProps<'div'> &
  VariantProps<typeof alertVariants> & {
    /** Replace the variant's icon. It is always decorative; the title carries the meaning. */
    icon?: ReactNode
  }

/**
 * An inline message about the page or a task. Warnings and errors use role="alert" so they are
 * announced when they appear; info and success use role="status" (WCAG 4.1.3).
 * Server-component safe.
 */
export function Alert({ className, variant, icon, children, ...props }: AlertProps) {
  const v = variant ?? 'info'
  return (
    <div
      data-slot="alert"
      role={v === 'destructive' || v === 'warning' ? 'alert' : 'status'}
      className={cn(alertVariants({ variant: v }), className)}
      {...props}
    >
      {icon ?? ICONS[v]}
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
    </div>
  )
}

export function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('font-semibold text-foreground', className)}
      {...props}
    />
  )
}

export function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  )
}
