import { CircleDashed } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { TextLink } from '@/components/text-link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Project, RepoInfo } from '@/lib/schemas'

const CI = {
  passing: { status: 'passed', label: 'CI passing' },
  failing: { status: 'failed', label: 'CI failing' },
  running: { status: 'running', label: 'CI running' },
} as const

export function RepoCard({ project, repo }: { project: Project; repo?: RepoInfo }) {
  const href = repo?.available ? repo.url : project.href
  return (
    <Card className="h-full" data-testid="project-card">
      <CardHeader>
        <p className="text-caption font-medium text-primary">{project.kind}</p>
        <CardTitle as="h2">{href ? <TextLink href={href} variant="standalone">{project.title}</TextLink> : project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          {project.tags.map((t) => (
            <li key={t}>
              <Badge variant="secondary">{t}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
      {project.repo ? (
        <CardFooter className="flex-wrap text-caption text-muted-foreground" data-testid="repo-meta">
          {repo?.available ? (
            <>
              {repo.language ? <span>{repo.language}</span> : null}
              {repo.pushedAt ? (
                <span>
                  Updated <time dateTime={repo.pushedAt}>{new Date(repo.pushedAt).toLocaleDateString('en-US', { dateStyle: 'medium', timeZone: 'UTC' })}</time>
                </span>
              ) : null}
              {repo.ci in CI ? (
                <StatusBadge status={CI[repo.ci as keyof typeof CI].status} label={CI[repo.ci as keyof typeof CI].label} />
              ) : (
                <Badge variant="outline">No CI yet</Badge>
              )}
            </>
          ) : (
            <Badge variant="outline">
              <CircleDashed aria-hidden="true" /> Repo not public yet
            </Badge>
          )}
        </CardFooter>
      ) : null}
    </Card>
  )
}
