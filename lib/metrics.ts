import type { Metric } from './schemas.ts'

/** Before → after change, described in words so it never relies on color. */
export function describeChange(m: Pick<Metric, 'before' | 'after' | 'better'>) {
  const delta = m.after - m.before
  const improved = m.better === 'lower' ? delta < 0 : delta > 0
  const pct = m.before === 0 ? null : Math.round((Math.abs(delta) / Math.abs(m.before)) * 100)
  const direction = delta === 0 ? 'unchanged' : delta < 0 ? 'down' : 'up'
  return {
    improved: delta !== 0 && improved,
    direction,
    text:
      delta === 0
        ? 'No change'
        : `${improved ? 'Improved' : 'Worse'}: ${direction}${pct === null ? '' : ` ${pct}%`}`,
  }
}

export function formatValue(value: number, unit: string) {
  const n = Number.isInteger(value) ? String(value) : value.toFixed(1)
  if (!unit) return n
  return unit === '%' ? `${n}%` : `${n} ${unit}`
}
