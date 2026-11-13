import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CaseStudyCard } from '@/components/case-study-card'
import { CodeFrame } from '@/components/code-frame'
import { Decisions } from '@/components/mdx/decisions'
import { Providers } from '@/components/providers'
import { RepoCard } from '@/components/repo-card'
import { getCaseStudies } from '@/lib/content'
import type { Project } from '@/lib/schemas'

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

describe('CaseStudyCard', () => {
  const study = getCaseStudies()[0]

  it('is one link named by the title, with the claim and headline metric', () => {
    render(<CaseStudyCard study={study} />)
    const card = screen.getByTestId('case-study-card')
    expect(within(card).getAllByRole('link')).toHaveLength(1)
    expect(within(card).getByRole('link', { name: study.title })).toHaveAttribute('href', `/work/${study.slug}/`)
    expect(card).toHaveTextContent(study.claim)
    expect(card).toHaveTextContent(study.metrics[0].label)
  })

  it('marks drafts with a text badge', () => {
    render(<CaseStudyCard study={{ ...study, status: 'draft' }} />)
    expect(screen.getByText('Draft')).toBeInTheDocument()
  })

  it('uses the requested heading level', () => {
    render(<CaseStudyCard study={study} headingLevel="h2" />)
    expect(screen.getByRole('heading', { level: 2, name: study.title })).toBeInTheDocument()
  })
})

describe('RepoCard', () => {
  const project: Project = { title: 'Suite', kind: 'Repo', description: 'D', repo: 'a/b', tags: ['Playwright'] }

  it('shows language, date and CI status from build-time data', () => {
    render(
      <RepoCard
        project={project}
        repo={{ url: 'https://github.com/a/b', language: 'TypeScript', pushedAt: '2026-11-01T00:00:00Z', ci: 'passing', available: true }}
      />,
    )
    const meta = screen.getByTestId('repo-meta')
    expect(meta).toHaveTextContent('TypeScript')
    expect(meta).toHaveTextContent('Nov 1, 2026')
    expect(meta).toHaveTextContent('CI passing')
    expect(screen.getByRole('link', { name: /Suite/ })).toHaveAttribute('href', 'https://github.com/a/b')
  })

  it.each([
    ['failing', 'CI failing'],
    ['none', 'No CI yet'],
  ] as const)('CI %s → %s', (ci, text) => {
    render(<RepoCard project={project} repo={{ url: 'https://github.com/a/b', language: null, pushedAt: null, ci, available: true }} />)
    expect(screen.getByTestId('repo-meta')).toHaveTextContent(text)
  })

  it('says when a repo is not public instead of linking to a 404', () => {
    render(<RepoCard project={project} repo={{ url: 'https://github.com/a/b', language: null, pushedAt: null, ci: 'unknown', available: false }} />)
    expect(screen.getByText('Repo not public yet')).toBeInTheDocument()
    expect(screen.queryByRole('link')).toBeNull()
  })
})

describe('Decisions', () => {
  it('has a caption and row headers', () => {
    render(<Decisions caption="Layers" rows={[{ area: 'Checkout', layer: 'UI', decision: 'Automated', why: 'Revenue' }]} />)
    expect(screen.getByRole('table', { name: 'Layers' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Checkout' })).toBeInTheDocument()
  })
})

describe('CodeFrame', () => {
  it('copies the code without diff-removed lines and confirms with a toast', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    render(
      <Providers>
        <CodeFrame data-title="example.ts" data-language="ts">
          <code>
            <span className="line">const a = 1</span>
            {'\n'}
            <span className="line diff remove">old()</span>
            {'\n'}
            <span className="line diff add">next()</span>
          </code>
        </CodeFrame>
      </Providers>,
    )
    expect(screen.getByLabelText('example.ts')).toHaveAttribute('tabindex', '0')
    await user.click(screen.getByRole('button', { name: 'Copy example.ts' }))
    expect(writeText).toHaveBeenCalledWith('const a = 1\nnext()')
    expect(await screen.findByText('Copied to clipboard')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })
})
