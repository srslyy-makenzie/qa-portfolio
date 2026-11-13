'use client'

import { NavigationMenu as BaseNav } from '@base-ui/react/navigation-menu'
import { ChevronDown } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export type NavigationMenuProps = ComponentProps<typeof BaseNav.Root>

/**
 * Site navigation with dropdown panels of links. Panels render in one shared popup under the
 * list. For actions (not navigation), use Dropdown Menu.
 */
export function NavigationMenu({ className, children, ...props }: NavigationMenuProps) {
  return (
    <BaseNav.Root data-slot="navigation-menu" className={cn('relative', className)} {...props}>
      {children}
      <BaseNav.Portal>
        <BaseNav.Positioner className="z-dropdown" sideOffset={6} align="start">
          <BaseNav.Popup
            className={cn(
              'h-(--popup-height) w-(--popup-width) origin-(--transform-origin) overflow-hidden rounded-lg border border-border',
              'bg-popover text-popover-foreground shadow-elevation-2',
              'transition-all duration-base ease-standard',
              'data-starting-style:opacity-0 data-ending-style:opacity-0',
              'motion-safe:data-starting-style:scale-95 motion-safe:data-ending-style:scale-95',
            )}
          >
            <BaseNav.Viewport className="relative size-full overflow-hidden" />
          </BaseNav.Popup>
        </BaseNav.Positioner>
      </BaseNav.Portal>
    </BaseNav.Root>
  )
}

export function NavigationMenuList({ className, ...props }: ComponentProps<typeof BaseNav.List>) {
  return (
    <BaseNav.List
      data-slot="navigation-menu-list"
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  )
}

export const NavigationMenuItem = BaseNav.Item

const triggerClassName =
  'group inline-flex h-control-md items-center gap-1 rounded-md px-3 text-body-sm font-medium focus-ring hover:bg-accent hover:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground'

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseNav.Trigger>) {
  return (
    <BaseNav.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(triggerClassName, className)}
      {...props}
    >
      {children}
      <BaseNav.Icon className="transition-transform duration-fast group-data-popup-open:rotate-180 motion-reduce:transition-none">
        <ChevronDown aria-hidden="true" className="size-4" />
      </BaseNav.Icon>
    </BaseNav.Trigger>
  )
}

export function NavigationMenuContent({
  className,
  ...props
}: ComponentProps<typeof BaseNav.Content>) {
  return (
    <BaseNav.Content
      data-slot="navigation-menu-content"
      className={cn('grid w-max max-w-lg gap-1 p-2 sm:grid-cols-2', className)}
      {...props}
    />
  )
}

export type NavigationMenuLinkProps = ComponentProps<typeof BaseNav.Link> & { description?: string }

/** A link inside a panel, with an optional one-line description. */
export function NavigationMenuLink({
  className,
  children,
  description,
  ...props
}: NavigationMenuLinkProps) {
  return (
    <BaseNav.Link
      data-slot="navigation-menu-link"
      className={cn(
        'flex flex-col gap-0.5 rounded-md px-3 py-2 focus-ring hover:bg-accent hover:text-accent-foreground',
        'data-active:bg-accent data-active:text-accent-foreground',
        className,
      )}
      {...props}
    >
      <span className="text-body-sm font-medium">{children}</span>
      {description ? (
        <span className="text-caption text-muted-foreground">{description}</span>
      ) : null}
    </BaseNav.Link>
  )
}

/** A top-level link styled like a trigger, for items without a panel. */
export function NavigationMenuTopLink({
  className,
  ...props
}: ComponentProps<typeof BaseNav.Link>) {
  return (
    <BaseNav.Link
      data-slot="navigation-menu-top-link"
      className={cn(triggerClassName, className)}
      {...props}
    />
  )
}
