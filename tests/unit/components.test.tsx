import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CiStatus } from '@/components/ci-status'
import { MetricsTable } from '@/components/metrics-table'
import { StatusBadge } from '@/components/status-badge'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { fromPlaywright, type QualityRun } from '@/lib/quality'
import { THEME_KEY } from '@/lib/theme'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

describe('StatusBadge', () => {
  it.each([
    ['passed', 'Passed'],
    ['failed', 'Failed'],
    ['flaky', 'Flaky'],
    ['skipped', 'Skipped'],
    ['running', 'Running'],
    ['not-run', 'Not run yet'],
  ] as const)('%s carries a word and an icon, not just color', (status, word) => {
    render(<StatusBadge status={status} />)
    const badge = screen.getByTestId('status-badge')
    expect(badge).toHaveTextContent(word)
    expect(badge.querySelector('svg[aria-hidden="true"]')).not.toBeNull()
  })
})

describe('CiStatus', () => {
  const run = (status: 'expected' | 'unexpected'): QualityRun => ({
    generatedAt: '2026-11-12T00:00:00Z',
    commit: null,
    branch: null,
    runUrl: null,
    source: 'local',
    suites: fromPlaywright({ suites: [{ specs: [{ tests: [{ projectName: 'chromium', status, results: [] }] }] }] }),
    coverage: null,
    lighthouse: null,
    links: null,
    reports: { playwright: null, coverage: null },
  })

  it('links to the Quality page with a full description', () => {
    render(<CiStatus run={run('expected')} />)
    const link = screen.getByRole('link', { name: /^Site tests passing/ })
    expect(link).toHaveAttribute('href', '/quality/')
  })

  it('says failing when a suite failed', () => {
    render(<CiStatus run={run('unexpected')} />)
    expect(screen.getByRole('link', { name: /^Site tests failing/ })).toBeInTheDocument()
  })

  it('says not run yet with no data', () => {
    render(<CiStatus run={null} />)
    expect(screen.getByText('Site tests not run yet')).toBeInTheDocument()
  })
})

describe('MetricsTable', () => {
  it('renders a captioned table with row headers and worded change', () => {
    render(
      <MetricsTable
        caption="Before and after"
        metrics={[
          { label: 'Suite runtime', before: 38, after: 9, unit: 'min', better: 'lower' },
          { label: 'Coverage', before: 60, after: 50, unit: '%', better: 'higher' },
        ]}
      />,
    )
    const table = screen.getByRole('table', { name: 'Before and after' })
    const row = within(table).getByRole('row', { name: /Suite runtime/ })
    expect(within(row).getByRole('rowheader')).toHaveTextContent('Suite runtime')
    expect(row).toHaveTextContent('38 min')
    expect(row).toHaveTextContent('Improved: down 76%')
    expect(within(table).getByRole('row', { name: /Coverage/ })).toHaveTextContent('Worse: down 17%')
  })
})

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    delete document.documentElement.dataset.contrast
  })

  it('applies and saves a color scheme and high contrast', async () => {
    const user = userEvent.setup()
    render(<ThemeSwitcher />)
    await user.click(screen.getByRole('button', { name: /Theme: System/ }))
    await user.click(await screen.findByRole('menuitemradio', { name: 'Dark' }))
    expect(document.documentElement).toHaveClass('dark')

    // Radio items keep the menu open in browsers; jsdom may close it, so reopen only if needed.
    if (!screen.queryByRole('menu')) await user.click(screen.getByRole('button', { name: /Theme: Dark/ }))
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'High contrast' }))
    expect(document.documentElement.dataset.contrast).toBe('more')
    expect(JSON.parse(localStorage.getItem(THEME_KEY)!)).toEqual({ scheme: 'dark', contrast: true })
  })

  it('restores the saved theme in its label', async () => {
    localStorage.setItem(THEME_KEY, JSON.stringify({ scheme: 'light', contrast: true }))
    render(<ThemeSwitcher />)
    expect(await screen.findByRole('button', { name: 'Theme: Light, high contrast' })).toBeInTheDocument()
  })
})
