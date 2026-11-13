import { test as base, expect, type Page } from '@playwright/test'

export const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/work/', name: 'Work' },
  { path: '/work/extensible-playwright-framework/', name: 'Case study: framework' },
  { path: '/work/flaky-suite-to-trusted-gate/', name: 'Case study: reliability' },
  { path: '/quality/', name: 'Quality' },
  { path: '/projects/', name: 'Projects' },
  { path: '/about/', name: 'About' },
  { path: '/resume/', name: 'Resume' },
  { path: '/contact/', name: 'Contact' },
] as const

export const THEMES = [
  { name: 'light', scheme: 'light', contrast: false },
  { name: 'dark', scheme: 'dark', contrast: false },
  { name: 'hc-light', scheme: 'light', contrast: true },
  { name: 'hc-dark', scheme: 'dark', contrast: true },
] as const

export type Theme = (typeof THEMES)[number]

/** Sets the saved theme before any page script runs, the way a returning visitor arrives. */
export async function useTheme(page: Page, theme: Theme) {
  await page.addInitScript((t) => {
    localStorage.setItem('ds-theme', JSON.stringify({ scheme: t.scheme, contrast: t.contrast }))
  }, theme)
}

export const test = base.extend<{ nav: (label: string) => Promise<void> }>({
  /** Navigates with the site's own menu: desktop nav, or the Sheet on small screens. */
  nav: async ({ page, isMobile }, use) => {
    await use(async (label) => {
      if (isMobile) {
        await page.getByRole('button', { name: 'Open menu' }).click()
        const sheet = page.getByRole('dialog', { name: 'Menu' })
        await sheet.getByRole('link', { name: label, exact: true }).click()
        await expect(sheet).toBeHidden()
      } else {
        await page
          .getByTestId('desktop-nav')
          .getByRole('link', { name: label, exact: true })
          .click()
      }
    })
  },
})

export { expect }
