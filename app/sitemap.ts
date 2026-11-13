import type { MetadataRoute } from 'next'
import { getCaseStudies, getSite } from '@/lib/content'
import { NAV } from '@/lib/nav'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSite().siteUrl
  return [
    ...NAV.map((n) => ({ url: new URL(n.href, base).href })),
    ...getCaseStudies().map((c) => ({ url: new URL(`/work/${c.slug}/`, base).href, lastModified: c.updated })),
  ]
}
