import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import { Analytics } from '@/components/analytics'
import { Providers } from '@/components/providers'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getQualityRun, getSite } from '@/lib/content'
import { themeScript } from '@/lib/theme'
import './globals.css'

// mak UI brand faces, self-hosted by Next at build time; globals.css points the font tokens at them.
const sans = Geist({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-brand', display: 'swap' })
const mono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-brand-mono', display: 'swap' })

const site = getSite()

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: `${site.name} · ${site.title}`, template: `%s · ${site.name}` },
  description: site.positioning,
  authors: [{ name: site.name }],
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const run = getQualityRun()
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        <a
          href="#main"
          className="sr-only z-tooltip rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Providers>
          <SiteHeader name={site.name} />
          <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 outline-none md:px-6">
            {children}
          </main>
          <SiteFooter site={site} run={run} />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
