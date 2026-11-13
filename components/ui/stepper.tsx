import { Check } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export type Step = { title: string; description?: string }

export type StepperProps = Omit<ComponentProps<'nav'>, 'children'> & {
  steps: Step[]
  /** Zero-based index of the current step. */
  current: number
  /** Names the steps for screen readers. */
  label?: string
}

/**
 * Progress through a multi-step flow. The current step has aria-current="step"; completed steps
 * say "completed" to screen readers, not just with a check mark. Server-component safe.
 */
export function Stepper({ steps, current, label = 'Progress', className, ...props }: StepperProps) {
  return (
    <nav aria-label={label} data-slot="stepper" className={className} {...props}>
      <ol className="flex flex-col gap-4 sm:flex-row sm:gap-2">
        {steps.map((step, i) => {
          const state = i < current ? 'complete' : i === current ? 'current' : 'upcoming'
          return (
            <li
              key={step.title}
              aria-current={state === 'current' ? 'step' : undefined}
              className="flex flex-1 items-start gap-3"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border text-caption',
                  state === 'complete' && 'border-primary bg-primary text-primary-foreground',
                  state === 'current' && 'border-primary text-primary',
                  state === 'upcoming' && 'border-input text-muted-foreground',
                )}
              >
                {state === 'complete' ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              <span className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    'text-body-sm font-medium',
                    state === 'upcoming' && 'text-muted-foreground',
                  )}
                >
                  {step.title}
                  {state === 'complete' ? <span className="sr-only"> (completed)</span> : null}
                </span>
                {step.description ? (
                  <span className="text-caption text-muted-foreground">{step.description}</span>
                ) : null}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
