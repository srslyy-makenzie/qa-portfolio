import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { describeChange, formatValue } from '@/lib/metrics'
import type { Metric } from '@/lib/schemas'
import { cn } from '@/lib/utils'

export function MetricsTable({ metrics, caption }: { metrics: Metric[]; caption: string }) {
  return (
    <Table data-testid="metrics-table">
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead className="text-right">Before</TableHead>
          <TableHead className="text-right">After</TableHead>
          <TableHead>Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metrics.map((m) => {
          const change = describeChange(m)
          const Icon = change.direction === 'up' ? ArrowUpRight : change.direction === 'down' ? ArrowDownRight : Minus
          return (
            <TableRow key={m.label}>
              <TableHead scope="row" className="min-w-48 py-2 whitespace-normal text-foreground">
                {m.label}
                {m.note ? <span className="block text-caption text-muted-foreground">{m.note}</span> : null}
              </TableHead>
              <TableCell className="text-right tabular-nums">{formatValue(m.before, m.unit)}</TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{formatValue(m.after, m.unit)}</TableCell>
              <TableCell>
                <span className={cn('inline-flex items-center gap-1 whitespace-nowrap', change.improved ? 'text-success' : 'text-muted-foreground')}>
                  <Icon aria-hidden="true" className="size-4" />
                  {change.text}
                </span>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

/** Compact headline number for cards: the first metric, before → after. */
export function HeadlineMetric({ metric }: { metric: Metric }) {
  const change = describeChange(metric)
  return (
    <p className="flex flex-col gap-0.5">
      <span className="text-caption text-muted-foreground">{metric.label}</span>
      <span className="text-headline tabular-nums">
        {formatValue(metric.before, metric.unit)} → {formatValue(metric.after, metric.unit)}
        <span className="sr-only"> ({change.text})</span>
      </span>
    </p>
  )
}
