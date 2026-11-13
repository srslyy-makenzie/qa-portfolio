'use client'

import { Toast } from '@base-ui/react/toast'
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { buttonVariants } from './button-variants'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

const ICONS: Record<ToastType, ReactNode> = {
  info: <Info aria-hidden="true" className="text-info" />,
  success: <CircleCheck aria-hidden="true" className="text-success" />,
  warning: <TriangleAlert aria-hidden="true" className="text-warning" />,
  error: <CircleX aria-hidden="true" className="text-destructive" />,
}

export type ToastOptions = {
  title: ReactNode
  description?: ReactNode
  type?: ToastType
  /** An undo or follow-up action. Keep the label to one or two words. */
  action?: { label: string; onClick: () => void }
  /** ms before auto-dismiss. Errors default to 0 (stay until dismissed, WCAG 2.2.1). */
  timeout?: number
}

/**
 * Brief feedback after an action ("Invoice sent"), announced by screen readers without moving
 * focus (WCAG 4.1.3). Call it from a component inside <Toaster>:
 * `const toast = useToast(); toast({ title: 'Saved', type: 'success' })`.
 */
export function useToast() {
  const manager = Toast.useToastManager()
  return ({ title, description, type = 'info', action, timeout }: ToastOptions) =>
    manager.add({
      title,
      description,
      type,
      // Errors interrupt (assertive) and stay until dismissed; the rest are polite.
      priority: type === 'error' ? 'high' : 'low',
      timeout: timeout ?? (type === 'error' ? 0 : 6000),
      actionProps: action ? { children: action.label, onClick: action.onClick } : undefined,
    })
}

/** Place once near the root of the app; it renders the toast region. */
export function Toaster({ children, limit = 3 }: { children: ReactNode; limit?: number }) {
  return (
    <Toast.Provider limit={limit}>
      {children}
      <Toast.Portal>
        <Toast.Viewport
          data-slot="toaster"
          className="fixed inset-x-4 bottom-4 z-toast flex flex-col-reverse gap-2 outline-none sm:left-auto sm:w-96"
        >
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}

function ToastList() {
  const { toasts } = Toast.useToastManager()
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      data-slot="toast"
      className={cn(
        'flex items-start gap-3 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-elevation-4',
        'transition-all duration-base ease-standard',
        'data-starting-style:opacity-0 data-ending-style:opacity-0 data-limited:hidden',
        'motion-safe:data-starting-style:translate-y-2 motion-safe:data-ending-style:translate-y-2',
        '[&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0',
      )}
    >
      {ICONS[(toast.type as ToastType | undefined) ?? 'info'] ?? ICONS.info}
      <Toast.Content className="flex min-w-0 flex-1 flex-col gap-1">
        <Toast.Title className="text-body-sm font-semibold" />
        <Toast.Description className="text-body-sm text-muted-foreground" />
        {toast.actionProps ? (
          <Toast.Action
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-2 w-fit')}
          />
        ) : null}
      </Toast.Content>
      <Toast.Close
        aria-label="Dismiss notification"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          '-mt-1 -mr-1 size-control-sm px-0',
        )}
      >
        <X aria-hidden="true" className="size-4" />
      </Toast.Close>
    </Toast.Root>
  ))
}
