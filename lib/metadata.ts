import type { Metadata } from 'next'
import { getSite } from './content.ts'

/** Per-page title, description, canonical URL and Open Graph / Twitter cards. */
export function pageMetadata({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const site = getSite()
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} · ${site.title}`
  return {
    title: title ?? { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: `${site.name} · ${site.title}`,
      title: fullTitle,
      description,
      url: path,
      locale: 'en_US',
    },
    twitter: { card: 'summary', title: fullTitle, description },
  }
}
