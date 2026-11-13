'use client'

import { Contrast, Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { applyTheme, DEFAULT_THEME, parseTheme, THEME_KEY, type Scheme, type ThemeState } from '@/lib/theme'

const ICON = { system: Monitor, light: Sun, dark: Moon } as const
const LABEL = { system: 'System', light: 'Light', dark: 'Dark' } as const

export function ThemeSwitcher() {
  const [state, setState] = useState<ThemeState>(DEFAULT_THEME)

  useEffect(() => {
    try {
      // Sync React state with what the pre-paint script already applied.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(parseTheme(localStorage.getItem(THEME_KEY)))
    } catch {
      // Storage blocked: keep defaults; the OS preference still applies.
    }
  }, [])

  const update = (next: ThemeState) => {
    setState(next)
    applyTheme(document.documentElement, next)
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(next))
    } catch {
      // Storage blocked (private window): the theme still applies to this page.
    }
  }

  const Icon = ICON[state.scheme]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="sm" data-testid="theme-trigger" />}
        aria-label={`Theme: ${LABEL[state.scheme]}${state.contrast ? ', high contrast' : ''}`}
      >
        <Icon aria-hidden="true" />
        <span className="hidden lg:inline">Theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-testid="theme-menu">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Color scheme</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={state.scheme}
            onValueChange={(v) => update({ ...state, scheme: v as Scheme })}
          >
            {(['system', 'light', 'dark'] as const).map((s) => {
              const ItemIcon = ICON[s]
              return (
                <DropdownMenuRadioItem key={s} value={s} data-testid={`theme-${s}`}>
                  <ItemIcon aria-hidden="true" />
                  {LABEL[s]}
                </DropdownMenuRadioItem>
              )
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={state.contrast}
          onCheckedChange={(checked) => update({ ...state, contrast: checked })}
          data-testid="theme-contrast"
        >
          <Contrast aria-hidden="true" />
          High contrast
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
