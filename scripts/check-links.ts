// Link checker for the build output. Internal links (href/src) must resolve to a file in out/;
// with --external, absolute links are requested too and 4xx/5xx fail the check.
// Writes test-results/links.json for the Quality page.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { extractLinks, isCheckable } from '../lib/links.ts'
import { resolveFile } from './static-server.ts'

const root = resolve('out')
const external = process.argv.includes('--external')

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name)
    if (d.isDirectory()) return p.includes(`${root}/reports`) ? [] : htmlFiles(p)
    return d.name.endsWith('.html') ? [p] : []
  })
}

const broken: { page: string; link: string; reason: string }[] = []
const externalLinks = new Map<string, string>()
let checked = 0

for (const file of htmlFiles(root)) {
  const page = `/${relative(root, file)}`
  for (const link of extractLinks(readFileSync(file, 'utf8'))) {
    if (!isCheckable(link)) continue
    checked++
    if (/^https?:\/\//.test(link)) {
      externalLinks.set(link, page)
      continue
    }
    const target = new URL(link, `http://x${page}`).pathname
    if (!resolveFile(root, target)) broken.push({ page, link, reason: 'no such file in out/' })
  }
}

if (external) {
  // Some sites refuse automated requests (LinkedIn answers 999); those are reported, not failed.
  const SKIP = [/linkedin\.com/]
  await Promise.all(
    [...externalLinks].map(async ([link, page]) => {
      if (SKIP.some((r) => r.test(link))) return
      try {
        const res = await fetch(link, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15000) })
        if (res.status >= 400) broken.push({ page, link, reason: `HTTP ${res.status}` })
      } catch (err) {
        broken.push({ page, link, reason: (err as Error).message })
      }
    }),
  )
}

mkdirSync('test-results', { recursive: true })
writeFileSync('test-results/links.json', JSON.stringify({ checked, broken: broken.length, details: broken }, null, 2))
for (const b of broken) console.error(`✗ ${b.page} → ${b.link} (${b.reason})`)
console.log(`Checked ${checked} links (${externalLinks.size} external${external ? '' : ', not requested'}); ${broken.length} broken.`)
process.exit(broken.length ? 1 : 0)
