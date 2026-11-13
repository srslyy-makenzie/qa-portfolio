import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

/** A link that looks like a button: it navigates, so it stays an <a> (links navigate, buttons act). */
export function LinkButton({
  variant = 'outline',
  size = 'md',
  className,
  external,
  download,
  ...props
}: ComponentProps<typeof NextLink> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  external?: boolean
  download?: boolean | string
}) {
  const classes = cn(buttonVariants({ variant, size }), className)
  if (external || download) {
    const { href, children, ...rest } = props
    return (
      <a
        href={String(href)}
        className={classes}
        download={download}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(rest as ComponentProps<'a'>)}
      >
        {children}
        {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    )
  }
  return <NextLink className={classes} {...props} />
}
