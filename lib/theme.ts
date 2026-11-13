// Theme state: color scheme on <html> as .light/.dark (none = follow the OS) and
// data-contrast="more" for high contrast. The mak UI token CSS reacts to both.
export type Scheme = 'system' | 'light' | 'dark'
export type ThemeState = { scheme: Scheme; contrast: boolean }

export const THEME_KEY = 'ds-theme'
export const DEFAULT_THEME: ThemeState = { scheme: 'system', contrast: false }

export function parseTheme(raw: string | null): ThemeState {
  if (!raw) return DEFAULT_THEME
  try {
    const v = JSON.parse(raw) as Partial<ThemeState>
    const scheme = v.scheme === 'light' || v.scheme === 'dark' ? v.scheme : 'system'
    return { scheme, contrast: v.contrast === true }
  } catch {
    return DEFAULT_THEME
  }
}

export function applyTheme(root: HTMLElement, { scheme, contrast }: ThemeState) {
  root.classList.remove('light', 'dark')
  if (scheme !== 'system') root.classList.add(scheme)
  if (contrast) root.dataset.contrast = 'more'
  else delete root.dataset.contrast
}

// Runs before first paint (inlined in app/layout.tsx) so there is no flash of the wrong theme.
// Keep in sync with parseTheme/applyTheme above; the unit tests check they agree.
export const themeScript = `(function(){try{var m=JSON.parse(localStorage.getItem('${THEME_KEY}')||'null');if(!m)return;var r=document.documentElement;if(m.scheme==='light'||m.scheme==='dark')r.classList.add(m.scheme);if(m.contrast===true)r.dataset.contrast='more'}catch(e){}})()`
