// Build-time repo metadata for the Projects page: language, last push and latest CI conclusion
// on the default branch. Runs before `next build` in CI (GITHUB_TOKEN raises the rate limit);
// the site never calls the GitHub API from the browser. On any error the repo is written as
// unavailable rather than failing the build.
import { readFileSync, writeFileSync } from 'node:fs'
import { projectsSchema, type RepoInfo } from '../lib/schemas.ts'

const projects = projectsSchema.parse(JSON.parse(readFileSync('content/projects.json', 'utf8')))
const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'portfolio-build',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

async function gh(path: string) {
  const res = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`)
  return res.json()
}

const repos: Record<string, RepoInfo> = {}
for (const { repo } of projects) {
  if (!repo) continue
  try {
    const r = await gh(`/repos/${repo}`)
    const runs = await gh(`/repos/${repo}/actions/runs?branch=${r.default_branch}&per_page=1`)
    const latest = runs.workflow_runs?.[0]
    const ci = !latest
      ? 'none'
      : latest.status !== 'completed'
        ? 'running'
        : latest.conclusion === 'success'
          ? 'passing'
          : 'failing'
    repos[repo] = { url: r.html_url, language: r.language, pushedAt: r.pushed_at, ci, available: !r.private }
  } catch (err) {
    console.warn(`Couldn't fetch ${repo}: ${(err as Error).message}`)
    repos[repo] = { url: `https://github.com/${repo}`, language: null, pushedAt: null, ci: 'unknown', available: false }
  }
}

writeFileSync('content/repos.generated.json', `${JSON.stringify({ fetchedAt: new Date().toISOString(), repos }, null, 2)}\n`)
console.log(`Wrote content/repos.generated.json (${Object.keys(repos).length} repos)`)
