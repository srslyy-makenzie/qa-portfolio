'use client'

import { Button as BaseButton } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { buttonVariants } from './button-variants'

const iconButtonSizes = cva('px-0', {
  variants: {
    size: {
      sm: 'size-control-sm [&_svg]:size-4',
      md: 'size-control-md [&_svg]:size-4',
      lg: 'size-control-lg [&_svg]:size-5',
    },
  },
  defaultVariants: { size: 'md' },
})

export type IconButtonProps = Omit<ComponentProps<typeof BaseButton>, 'children'> &
  Pick<VariantProps<typeof buttonVariants>, 'variant'> &
  VariantProps<typeof iconButtonSizes> & {
    /** Accessible name. Required: an icon alone has none (WCAG 4.1.2). */
    label: string
    /** The icon. It is hidden from assistive technology; `label` names the button. */
    children: ReactNode
  }

export function IconButton({
  className,
  variant = 'ghost',
  size,
  label,
  children,
  ...props
}: IconButtonProps) {
  return (
    <BaseButton
      data-slot="icon-button"
      aria-label={label}
      className={cn(buttonVariants({ variant }), iconButtonSizes({ size }), className)}
      {...props}
    >
      <span aria-hidden="true" className="contents">
        {children}
      </span>
    </BaseButton>
  )
}
