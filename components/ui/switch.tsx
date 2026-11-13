'use client'

import { Switch as BaseSwitch } from '@base-ui/react/switch'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export type SwitchProps = ComponentProps<typeof BaseSwitch.Root>

/**
 * An on/off setting that takes effect immediately. For a choice submitted with a form, use
 * Checkbox. Label it by wrapping it in a Label: `<Label><Switch /> Notifications</Label>`.
 */
export function Switch({ className, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root
      data-slot="switch"
      className={cn(
        // Unchecked track uses --input so its outline meets 3:1 against the page (WCAG 1.4.11).
        'touch-target inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-input p-0.5 focus-ring',
        'transition-colors duration-fast ease-standard',
        'data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb
        className={cn(
          'block size-4 rounded-full bg-background shadow-elevation-1',
          'transition-transform duration-fast ease-standard motion-reduce:transition-none',
          'data-checked:translate-x-4',
        )}
      />
    </BaseSwitch.Root>
  )
}
