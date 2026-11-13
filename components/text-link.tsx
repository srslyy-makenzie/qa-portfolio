import NextLink from 'next/link'
import type { ReactNode } from 'react'
import { Link } from '@/components/ui/link'

/** mak UI Link, routed client-side for internal paths and marked external for everything else. */
export function TextLink({
  href,
  children,
  variant,
  className,
  testId,
}: {
  href: string
  children: ReactNode
  variant?: 'inline' | 'standalone' | 'muted'
  className?: string
  testId?: string
}) {
  // App routes use client-side navigation; files and the static HTML reports under /reports/ are
  // not Next pages, so they get a plain <a> (Next would prefetch route data that doesn't exist).
  const internal = href.startsWith('/') && !/\.\w+$/.test(href) && !href.startsWith('/reports/')
  return internal ? (
    <Link variant={variant} className={className} data-testid={testId} render={<NextLink href={href} />}>
      {children}
    </Link>
  ) : (
    <Link
      variant={variant}
      className={className}
      data-testid={testId}
      href={href}
      external={!href.startsWith('mailto:') && !href.startsWith('/')}
    >
      {children}
    </Link>
  )
}
