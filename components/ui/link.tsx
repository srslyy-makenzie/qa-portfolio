'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import { ExternalLink } from 'lucide-react'
import { cn } from '../../lib/utils'

export const linkVariants = cva(
  'rounded-sm font-medium underline-offset-4 focus-ring transition-colors duration-fast',
  {
    variants: {
      variant: {
        // Inline links are always underlined: color alone can't mark a link (WCAG 1.4.1).
        inline: 'text-primary underline decoration-1 hover:decoration-2',
        // Standalone links (nav, footers) sit apart from body text, so they can drop the underline.
        standalone: 'text-foreground hover:text-primary hover:underline',
        muted: 'text-muted-foreground underline hover:text-foreground',
      },
    },
    defaultVariants: { variant: 'inline' },
  },
)

export type LinkProps = useRender.ComponentProps<'a'> &
  VariantProps<typeof linkVariants> & {
    /** Opens in a new tab, adds rel="noopener noreferrer" and announces it. */
    external?: boolean
  }

/**
 * Navigation to another page or resource. For an action on this page, use Button.
 * Pass a router link with `render`: `<Link render={<NextLink href="/docs" />}>Docs</Link>`.
 */
export function Link({
  className,
  variant,
  external = false,
  render,
  children,
  ...props
}: LinkProps) {
  const content = external ? (
    <>
      {children}
      <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
      <span className="sr-only"> (opens in a new tab)</span>
    </>
  ) : (
    children
  )

  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      {
        className: cn(
          linkVariants({ variant }),
          external && 'inline-flex items-center gap-1',
          className,
        ),
        ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
      },
      props,
      { children: content },
    ),
  })
}
