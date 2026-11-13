'use client'

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

/** Wrap the app (or a toolbar) once so neighboring tooltips open instantly after the first. */
export function TooltipProvider({
  delay = 400,
  ...props
}: ComponentProps<typeof BaseTooltip.Provider>) {
  return <BaseTooltip.Provider delay={delay} {...props} />
}

/**
 * Supplementary label for a control, shown on hover and keyboard focus. Never put essential
 * information only in a tooltip: touch users can't see it.
 */
export const Tooltip = BaseTooltip.Root

export type TooltipTriggerProps = ComponentProps<typeof BaseTooltip.Trigger>

export function TooltipTrigger(props: TooltipTriggerProps) {
  return <BaseTooltip.Trigger data-slot="tooltip-trigger" {...props} />
}

export type TooltipContentProps = ComponentProps<typeof BaseTooltip.Popup> &
  Pick<ComponentProps<typeof BaseTooltip.Positioner>, 'side' | 'align' | 'sideOffset'>

export function TooltipContent({
  className,
  children,
  side = 'top',
  align,
  sideOffset = 6,
  ...props
}: TooltipContentProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        className="z-tooltip"
        side={side}
        align={align}
        sideOffset={sideOffset}
      >
        <BaseTooltip.Popup
          data-slot="tooltip-content"
          className={cn(
            // foreground on background is the highest-contrast pair in every mode.
            'max-w-xs origin-(--transform-origin) rounded-md bg-foreground px-2 py-1 text-caption text-background',
            'transition-all duration-fast ease-standard data-instant:transition-none',
            'data-starting-style:opacity-0 data-ending-style:opacity-0',
            'motion-safe:data-starting-style:scale-95 motion-safe:data-ending-style:scale-95',
            className,
          )}
          {...props}
        >
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}
