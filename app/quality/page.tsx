import { FileText, GitCommit, PlayCircle } from 'lucide-react'
import { Pipeline } from '@/components/mdx/pipeline'
import { PageHeader, Section } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { TextLink } from '@/components/text-link'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getQualityRun, getQualityStrategy } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'
import { addCounts, emptyCounts, formatDuration, overallStatus, statusOf, total, type QualityRun } from '@/lib/quality'
import { cn } from '@/lib/utils'

const description =
  'This site’s own test strategy, CI pipeline and latest results: unit, end-to-end in three browsers, accessibility in four themes, visual regression and Lighthouse.'

export const metadata = pageMetadata({ title: 'Quality', description, path: '/quality/' })

// Pipeline stage (index into strategy.pipeline) where each suite layer runs.
const STAGE = { static: 0, unit: 1, e2e: 3, a11y: 3, visual: 3 } as const

/** Index of the first pipeline stage with a failure, or past the end when everything passed. */
function failingStage(run: QualityRun | null, stages: number) {
  if (!run) return 0
  const failed = run.suites.filter((s) => s.status === 'failed').map((s): number => STAGE[s.layer])
  const lh = run.lighthouse
  if (lh && Math.min(lh.performance, lh.accessibility, lh.bestPractices, lh.seo) < 95) failed.push(4)
  return failed.length ? Math.min(...failed) : stages
}

const PYRAMID_WIDTH = ['w-2/5', 'w-3/5', 'w-4/5', 'w-11/12', 'w-full']

function RunMeta({ run }: { run: QualityRun }) {
  const date = new Date(run.generatedAt)
  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-2 text-body-sm" data-testid="run-meta">
      <div className="flex items-center gap-2">
        <dt className="text-muted-foreground">Latest run</dt>
        <dd>
          <time dateTime={run.generatedAt}>
            {date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC
          </time>
          {run.source === 'local' ? ' (local run)' : null}
        </dd>
      </div>
      {run.commit ? (
        <div className="flex items-center gap-2">
          <dt className="text-muted-foreground">
            <GitCommit aria-hidden="true" className="inline size-4" /> Commit
          </dt>
          <dd className="font-mono">{run.commit.slice(0, 7)}</dd>
        </div>
      ) : null}
      {run.runUrl ? (
        <div className="flex items-center gap-2">
          <dt className="sr-only">CI run</dt>
          <dd>
            <TextLink href={run.runUrl}>View the CI run</TextLink>
          </dd>
        </div>
      ) : null}
    </dl>
  )
}

export default function QualityPage() {
  const strategy = getQualityStrategy()
  const run = getQualityRun()
  const status = run ? overallStatus(run) : 'not-run'
  const firstFailing = run?.suites.findIndex((s) => s.status === 'failed') ?? -1

  return (
    <>
      <PageHeader eyebrow="Quality" title="How this site is tested" lede={strategy.intro}>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={status} label={`Overall: ${status === 'not-run' ? 'not run yet' : status}`} />
          {run?.reports.playwright ? (
            <TextLink href={run.reports.playwright} testId="report-link">
              <FileText aria-hidden="true" className="inline size-4" /> Playwright HTML report
            </TextLink>
          ) : null}
          {run?.reports.coverage ? <TextLink href={run.reports.coverage}>Coverage report</TextLink> : null}
        </div>
        {run ? <RunMeta run={run} /> : null}
      </PageHeader>

      {status === 'failed' ? (
        <Alert variant="destructive" className="mb-8">
          <AlertTitle>The latest run has failures</AlertTitle>
          <AlertDescription>Main is protected, so this build was not deployed from a red run.</AlertDescription>
        </Alert>
      ) : null}

      <Section title="Pipeline" id="pipeline" description="Every pull request runs these stages in order; a failure stops the pipeline and blocks the merge.">
        <Pipeline steps={strategy.pipeline} current={failingStage(run, strategy.pipeline.length)} label="CI pipeline stages" />
      </Section>

      <Section title="Latest results" id="results">
        {run ? (
          <ResultsTable run={run} firstFailing={firstFailing} />
        ) : (
          <EmptyState
            icon={<PlayCircle />}
            title="No test run recorded yet"
            description="Run the suite and pnpm quality:collect to populate this page."
            headingLevel={3}
          />
        )}
      </Section>

      <Section title="Test pyramid" id="pyramid" description="Most checks run at the cheapest layer that can catch the risk; the expensive layers cover journeys, not logic.">
        <ol className="flex flex-col items-center gap-2" data-testid="pyramid">
          {[...strategy.layers].reverse().map((layer, i) => {
            const counts = run?.suites.filter((s) => s.layer === layer.id).reduce((acc, s) => addCounts(acc, s.counts), emptyCounts())
            const n = counts ? total(counts) : 0
            return (
              <li key={layer.id} className={cn('rounded-lg border border-border bg-card p-4', PYRAMID_WIDTH[i])}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-headline">{layer.name}</h3>
                  <span className="text-body-sm text-muted-foreground tabular-nums">
                    {layer.id === 'static' ? 'Every file' : `${n} tests`}
                  </span>
                </div>
                <p className="text-body-sm text-muted-foreground">{layer.tool}</p>
                <p className="mt-2 text-body-sm">{layer.what}</p>
                <p className="mt-1 text-body-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Why: </span>
                  {layer.why}
                </p>
              </li>
            )
          })}
        </ol>
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle as="h2">Unit test coverage</CardTitle>
            <CardDescription>From Vitest’s V8 coverage over lib/ and components/.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4" data-testid="coverage">
            {run?.coverage ? (
              (['lines', 'branches', 'functions', 'statements'] as const).map((k) => (
                <Progress key={k} label={k[0].toUpperCase() + k.slice(1)} value={run.coverage![k]} />
              ))
            ) : (
              <p className="text-body-sm text-muted-foreground">No coverage recorded for this run.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle as="h2">Lighthouse (mobile)</CardTitle>
            <CardDescription>Lowest score across audited pages; the CI budget is 95.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4" data-testid="lighthouse">
            {run?.lighthouse ? (
              (
                [
                  ['Performance', run.lighthouse.performance],
                  ['Accessibility', run.lighthouse.accessibility],
                  ['Best practices', run.lighthouse.bestPractices],
                  ['SEO', run.lighthouse.seo],
                ] as const
              ).map(([label, score]) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-body-sm font-medium">{label}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-body-sm tabular-nums">{score}</span>
                    <StatusBadge status={score >= 95 ? 'passed' : 'failed'} label={score >= 95 ? 'Meets budget' : 'Below budget'} />
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-start gap-2">
                <StatusBadge status="not-run" />
                <p className="text-body-sm text-muted-foreground">Lighthouse runs in CI; no scores recorded for this run.</p>
              </div>
            )}
            {run?.links ? (
              <p className="text-body-sm text-muted-foreground">
                Link check: {run.links.checked} links, {run.links.broken} broken.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Section title="Quality gates" id="gates" description="All of these must pass to merge to main.">
        <Table data-testid="gates-table">
          <TableCaption>CI quality gates for this site</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Gate</TableHead>
              <TableHead>Tooling</TableHead>
              <TableHead>Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {strategy.gates.map((g) => (
              <TableRow key={g.gate}>
                <TableHead scope="row" className="py-2 whitespace-normal text-foreground">
                  {g.gate}
                </TableHead>
                <TableCell className="text-muted-foreground">{g.tool}</TableCell>
                <TableCell className="min-w-56">{g.purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title="What I don’t automate, and why" id="manual">
        <ul className="grid gap-4 md:grid-cols-3">
          {strategy.notAutomated.map((item) => (
            <li key={item.area} className="rounded-lg border border-border p-4">
              <h3 className="text-headline">{item.area}</h3>
              <p className="mt-1 text-body-sm text-muted-foreground">{item.why}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="How I test this site" id="faq">
        <Accordion className="max-w-3xl">
          {strategy.faq.map((f) => (
            <AccordionItem key={f.question} value={f.question}>
              <AccordionTrigger headingLevel={3}>{f.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  )
}

function ResultsTable({ run, firstFailing }: { run: QualityRun; firstFailing: number }) {
  const sum = run.suites.reduce((acc, s) => addCounts(acc, s.counts), emptyCounts())
  const duration = run.suites.reduce((n, s) => n + s.durationMs, 0)
  return (
    <Table data-testid="results-table">
      <TableCaption>
        Results by suite{firstFailing >= 0 ? `; first failing suite: ${run.suites[firstFailing].name}` : ''}. Durations are summed test time, not wall-clock.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Suite</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Passed</TableHead>
          <TableHead className="text-right">Failed</TableHead>
          <TableHead className="text-right">Flaky</TableHead>
          <TableHead className="text-right">Skipped</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {run.suites.map((s) => (
          <TableRow key={s.id} data-testid={`suite-${s.id}`}>
            <TableHead scope="row" className="py-2 text-foreground">
              {s.name}
              <span className="block text-caption text-muted-foreground">{s.tool}</span>
            </TableHead>
            <TableCell>
              <StatusBadge status={s.status} />
            </TableCell>
            <TableCell className="text-right tabular-nums">{s.counts.passed}</TableCell>
            <TableCell className="text-right tabular-nums">{s.counts.failed}</TableCell>
            <TableCell className="text-right tabular-nums">{s.counts.flaky}</TableCell>
            <TableCell className="text-right tabular-nums">{s.counts.skipped}</TableCell>
            <TableCell className="text-right whitespace-nowrap tabular-nums">{s.status === 'not-run' ? '—' : formatDuration(s.durationMs)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableHead scope="row" className="text-foreground">
            Total
          </TableHead>
          <TableCell>
            <StatusBadge status={statusOf(sum)} />
          </TableCell>
          <TableCell className="text-right tabular-nums">{sum.passed}</TableCell>
          <TableCell className="text-right tabular-nums">{sum.failed}</TableCell>
          <TableCell className="text-right tabular-nums">{sum.flaky}</TableCell>
          <TableCell className="text-right tabular-nums">{sum.skipped}</TableCell>
          <TableCell className="text-right whitespace-nowrap tabular-nums">{formatDuration(duration)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
