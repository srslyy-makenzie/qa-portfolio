'use client'

import { Radio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export type RadioGroupProps = ComponentProps<typeof BaseRadioGroup>

/**
 * One choice from a short list (up to about 5 options; use Select beyond that).
 * Name the group with `aria-labelledby`, or render it inside a Fieldset with a legend.
 */
export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <BaseRadioGroup
      data-slot="radio-group"
      className={cn('flex flex-col gap-3', className)}
      {...props}
    />
  )
}

export type RadioGroupItemProps = ComponentProps<typeof Radio.Root>

/** One option. Label it by wrapping it in a Label: `<Label><RadioGroupItem value="a" /> A</Label>`. */
export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <Radio.Root
      data-slot="radio-group-item"
      className={cn(
        'touch-target inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-background focus-ring',
        'transition-colors duration-fast',
        'data-checked:border-primary data-invalid:border-destructive',
        'data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <Radio.Indicator className="size-2 rounded-full bg-primary data-unchecked:hidden" />
    </Radio.Root>
  )
}
