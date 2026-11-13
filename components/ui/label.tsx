import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export const labelClassName =
  'flex items-center gap-2 text-body-sm font-medium text-foreground select-none has-data-disabled:cursor-not-allowed has-data-disabled:opacity-60'

export type LabelProps = ComponentProps<'label'>

/**
 * A native label. Wrap a Checkbox, RadioGroupItem or Switch in it so the whole row is
 * clickable and names the control: `<Label><Checkbox /> Remember me</Label>`.
 * For text inputs inside a Field, use FieldLabel, which is wired to the control for you.
 * Server-component safe.
 */
export function Label({ className, ...props }: LabelProps) {
  // eslint-disable-next-line jsx-a11y/label-has-associated-control -- the control is passed as a child
  return <label data-slot="label" className={cn(labelClassName, className)} {...props} />
}
