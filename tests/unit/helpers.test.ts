import { extractLinks, isCheckable } from '@/lib/links'
import { describeChange, formatValue } from '@/lib/metrics'
import { isActive } from '@/lib/nav'
import { sectionHeadings, splitAtReflection } from '@/lib/sections'
import { resolveFile } from '@/scripts/static-server'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

describe('describeChange', () => {
  it('lower-is-better going down is an improvement', () => {
    expect(describeChange({ before: 16, after: 4, better: 'lower' })).toEqual({ improved: true, direction: 'down', text: 'Improved: down 75%' })
  })
  it('higher-is-better going down is worse', () => {
    expect(describeChange({ before: 10, after: 5, better: 'higher' }).text).toBe('Worse: down 50%')
  })
  it('handles a zero baseline without a percentage', () => {
    expect(describeChange({ before: 0, after: 41, better: 'higher' }).text).toBe('Improved: up')
  })
  it('handles no change', () => {
    expect(describeChange({ before: 3, after: 3, better: 'lower' })).toMatchObject({ improved: false, text: 'No change' })
  })
})

describe('formatValue', () => {
  it.each([
    [16, 'hours', '16 hours'],
    [0.8, '%', '0.8%'],
    [27, '', '27'],
  ])('%s %s → %s', (v, unit, out) => expect(formatValue(v, unit)).toBe(out))
})

describe('isActive', () => {
  it.each([
    ['/', '/', true],
    ['/work/', '/', false],
    ['/work/', '/work/', true],
    ['/work/some-study/', '/work/', true],
    ['/work', '/work/', true],
    ['/workshop/', '/work/', false],
  ])('%s with %s → %s', (path, href, active) => expect(isActive(path, href)).toBe(active))
})

describe('sections', () => {
  const body = '## Quality problem\nA\n\n## Strategy\nB\n\n## Reflection\nC\n'
  it('lists h2 headings', () => expect(sectionHeadings(body)).toEqual(['Quality problem', 'Strategy', 'Reflection']))
  it('splits at Reflection', () => {
    const [before, after] = splitAtReflection(body)
    expect(before).not.toContain('Reflection')
    expect(after.startsWith('## Reflection')).toBe(true)
  })
  it('keeps everything when there is no Reflection', () => expect(splitAtReflection('## A\n')).toEqual(['## A\n', '']))
})

describe('link extraction', () => {
  it('finds href and src and decodes &amp;', () => {
    expect(extractLinks('<a href="/a/?x=1&amp;y=2">a</a><img src="/i.png">')).toEqual(['/a/?x=1&y=2', '/i.png'])
  })
  it.each(['#main', 'mailto:a@b.co', 'tel:1', 'data:image/png;base64,x'])('skips %s', (l) => expect(isCheckable(l)).toBe(false))
  it('checks site paths and URLs', () => {
    expect(isCheckable('/work/')).toBe(true)
    expect(isCheckable('https://github.com')).toBe(true)
  })
})

describe('static server file resolution', () => {
  const root = mkdtempSync(join(tmpdir(), 'out-'))
  mkdirSync(join(root, 'work'))
  writeFileSync(join(root, 'index.html'), '')
  writeFileSync(join(root, 'work', 'index.html'), '')
  writeFileSync(join(root, 'resume.pdf'), '')

  it.each([
    ['/', 'index.html'],
    ['/work/', 'work/index.html'],
    ['/work', 'work/index.html'],
    ['/resume.pdf', 'resume.pdf'],
    ['/work/?q=1', 'work/index.html'],
  ])('%s → %s', (url, file) => expect(resolveFile(root, url)).toBe(join(root, file)))

  it('returns null for missing files and path traversal', () => {
    expect(resolveFile(root, '/nope/')).toBeNull()
    expect(resolveFile(root, '/../../etc/passwd')).toBeNull()
  })
})
