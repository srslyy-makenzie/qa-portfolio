import { Stepper, type Step } from '@/components/ui/stepper'

/** A CI pipeline drawn as a Stepper. `current` defaults to past the end (every stage complete). */
export function Pipeline({ steps, current, label = 'CI pipeline stages' }: { steps: Step[]; current?: number; label?: string }) {
  return (
    <div className="my-6 rounded-lg border border-border p-4">
      <Stepper steps={steps} current={current ?? steps.length} label={label} />
    </div>
  )
}
