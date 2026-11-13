import { applyTheme, parseTheme, THEME_KEY, themeScript, type ThemeState } from '@/lib/theme'

const states: ThemeState[] = [
  { scheme: 'system', contrast: false },
  { scheme: 'light', contrast: false },
  { scheme: 'dark', contrast: true },
  { scheme: 'system', contrast: true },
]

describe('parseTheme', () => {
  it.each([null, '', 'not json', '{"scheme":"neon"}'])('falls back to defaults for %j', (raw) => {
    expect(parseTheme(raw).scheme).toBe('system')
  })
  it('only treats contrast === true as on', () => {
    expect(parseTheme('{"scheme":"dark","contrast":"yes"}')).toEqual({ scheme: 'dark', contrast: false })
  })
})

describe('applyTheme', () => {
  it('switches classes and contrast without leaving stale state', () => {
    const root = document.createElement('html')
    applyTheme(root, { scheme: 'dark', contrast: true })
    applyTheme(root, { scheme: 'light', contrast: false })
    expect([...root.classList]).toEqual(['light'])
    expect(root.dataset.contrast).toBeUndefined()
  })
})

// The inline pre-paint script is a string; make sure it agrees with applyTheme.
describe.each(states)('pre-paint script for %o', (state) => {
  it('matches applyTheme', () => {
    const root = document.documentElement
    root.className = ''
    delete root.dataset.contrast
    localStorage.setItem(THEME_KEY, JSON.stringify(state))
    new Function(themeScript)()
    const fromScript = { classes: root.className, contrast: root.dataset.contrast }

    const expected = document.createElement('html')
    applyTheme(expected, state)
    expect(fromScript).toEqual({ classes: expected.className, contrast: expected.dataset.contrast })
  })
})
