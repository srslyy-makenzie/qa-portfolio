import { PageHeader } from '@/components/page-header'
import { RepoCard } from '@/components/repo-card'
import { getProjects, getRepos } from '@/lib/content'
import { pageMetadata } from '@/lib/metadata'

const description = 'Smaller repos, utilities, test plans and bug-report samples.'
export const metadata = pageMetadata({ title: 'Projects', description, path: '/projects/' })

export default function ProjectsPage() {
  const projects = getProjects()
  const { repos, fetchedAt } = getRepos()
  return (
    <>
      <PageHeader eyebrow="Projects" title="Sampler" lede={description}>
        {fetchedAt ? (
          <p className="text-caption text-muted-foreground">
            Repo details fetched from GitHub at build time, <time dateTime={fetchedAt}>{fetchedAt.slice(0, 10)}</time>.
          </p>
        ) : null}
      </PageHeader>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.title}>
            <RepoCard project={p} repo={p.repo ? repos[p.repo] : undefined} />
          </li>
        ))}
      </ul>
    </>
  )
}
