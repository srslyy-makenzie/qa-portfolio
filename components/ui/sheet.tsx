'use client'

import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'
import { buttonVariants } from './button-variants'

/**
 * A modal panel that slides in from an edge: filters, record details, mobile navigation.
 * Same behavior as Dialog (focus trap, Esc, focus return), different placement.
 */
export const Sheet = BaseDialog.Root

export type SheetTriggerProps = ComponentProps<typeof BaseDialog.Trigger>

export function SheetTrigger(props: SheetTriggerProps) {
  return <BaseDialog.Trigger data-slot="sheet-trigger" {...props} />
}

export const SheetClose = BaseDialog.Close

const sheetVariants = cva(
  [
    'fixed z-modal flex flex-col gap-3 overflow-y-auto bg-popover p-5 text-popover-foreground shadow-elevation-3 outline-none',
    'transition-all duration-slow ease-standard data-starting-style:opacity-0 data-ending-style:opacity-0',
  ],
  {
    variants: {
      side: {
        right:
          'inset-y-0 right-0 w-full max-w-sm border-l border-border motion-safe:data-starting-style:translate-x-full motion-safe:data-ending-style:translate-x-full',
        left: 'inset-y-0 left-0 w-full max-w-sm border-r border-border motion-safe:data-starting-style:-translate-x-full motion-safe:data-ending-style:-translate-x-full',
        top: 'inset-x-0 top-0 max-h-full border-b border-border motion-safe:data-starting-style:-translate-y-full motion-safe:data-ending-style:-translate-y-full',
        bottom:
          'inset-x-0 bottom-0 max-h-full rounded-t-lg border-t border-border motion-safe:data-starting-style:translate-y-full motion-safe:data-ending-style:translate-y-full',
      },
    },
    defaultVariants: { side: 'right' },
  },
)

export type SheetContentProps = ComponentProps<typeof BaseDialog.Popup> &
  VariantProps<typeof sheetVariants> & { showCloseButton?: boolean }

export function SheetContent({
  className,
  side,
  children,
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-overlay bg-scrim transition-opacity duration-slow ease-standard data-starting-style:opacity-0 data-ending-style:opacity-0" />
      <BaseDialog.Popup
        data-slot="sheet-content"
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <BaseDialog.Close
            aria-label="Close"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'absolute top-3 right-3 size-control-sm px-0',
            )}
          >
            <X aria-hidden="true" className="size-4" />
          </BaseDialog.Close>
        ) : null}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}

export function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 pr-8', className)}
      {...props}
    />
  )
}

export function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

/** Required: names the sheet for screen readers. */
export function SheetTitle({ className, ...props }: ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      data-slot="sheet-title"
      className={cn('text-title-3', className)}
      {...props}
    />
  )
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      data-slot="sheet-description"
      className={cn('text-body-sm text-muted-foreground', className)}
      {...props}
    />
  )
}
