'use client'

import { Menu } from '@base-ui/react/menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

const popupClassName = [
  'min-w-48 origin-(--transform-origin) rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-elevation-2 outline-none',
  'transition-all duration-fast ease-standard',
  'data-starting-style:opacity-0 data-ending-style:opacity-0',
  'motion-safe:data-starting-style:scale-95 motion-safe:data-ending-style:scale-95',
].join(' ')

const itemClassName = [
  'relative flex min-h-8 cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-body-sm outline-none select-none',
  'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
  'data-disabled:pointer-events-none data-disabled:opacity-50',
  '[&_svg]:size-4 [&_svg]:shrink-0',
].join(' ')

/** A list of actions or options that opens from a button. For navigation menus, use links. */
export const DropdownMenu = Menu.Root

export type DropdownMenuTriggerProps = ComponentProps<typeof Menu.Trigger>

/** Opens the menu. Style it with `render={<Button variant="outline" />}`. */
export function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  return <Menu.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

export type DropdownMenuContentProps = ComponentProps<typeof Menu.Popup> &
  Pick<ComponentProps<typeof Menu.Positioner>, 'side' | 'align' | 'sideOffset'>

export function DropdownMenuContent({
  className,
  side,
  align = 'start',
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        className="z-dropdown outline-none"
        side={side}
        align={align}
        sideOffset={sideOffset}
      >
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cn(popupClassName, className)}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
}

export type DropdownMenuItemProps = ComponentProps<typeof Menu.Item> & {
  /** Destructive actions use the destructive color. Confirm them with a Dialog. */
  variant?: 'default' | 'destructive'
}

export function DropdownMenuItem({
  className,
  variant = 'default',
  ...props
}: DropdownMenuItemProps) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={cn(
        itemClassName,
        variant === 'destructive' &&
          'text-destructive data-highlighted:bg-destructive data-highlighted:text-destructive-foreground',
        className,
      )}
      {...props}
    />
  )
}

export type DropdownMenuLinkItemProps = ComponentProps<typeof Menu.LinkItem>

/** A menu item that navigates. Renders an `<a>`. */
export function DropdownMenuLinkItem({ className, ...props }: DropdownMenuLinkItemProps) {
  return (
    <Menu.LinkItem
      data-slot="dropdown-menu-link-item"
      className={cn(itemClassName, className)}
      {...props}
    />
  )
}

export type DropdownMenuCheckboxItemProps = ComponentProps<typeof Menu.CheckboxItem>

export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <Menu.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(itemClassName, 'pl-8', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <Menu.CheckboxItemIndicator>
          <Check aria-hidden="true" />
        </Menu.CheckboxItemIndicator>
      </span>
      {children}
    </Menu.CheckboxItem>
  )
}

export const DropdownMenuRadioGroup = Menu.RadioGroup

export type DropdownMenuRadioItemProps = ComponentProps<typeof Menu.RadioItem>

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <Menu.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(itemClassName, 'pl-8', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <Menu.RadioItemIndicator>
          <Circle aria-hidden="true" className="size-2! fill-current" />
        </Menu.RadioItemIndicator>
      </span>
      {children}
    </Menu.RadioItem>
  )
}

export const DropdownMenuGroup = Menu.Group

export type DropdownMenuLabelProps = ComponentProps<typeof Menu.GroupLabel>

/** Heading for a DropdownMenuGroup or DropdownMenuRadioGroup. */
export function DropdownMenuLabel({ className, ...props }: DropdownMenuLabelProps) {
  return (
    <Menu.GroupLabel
      data-slot="dropdown-menu-label"
      className={cn('px-2 py-1.5 text-caption text-muted-foreground', className)}
      {...props}
    />
  )
}

export type DropdownMenuSeparatorProps = ComponentProps<typeof Menu.Separator>

export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

/** Keyboard shortcut hint at the end of an item. Visual only; bind the shortcut yourself. */
export function DropdownMenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn('ml-auto pl-4 text-caption text-muted-foreground', className)}
      {...props}
    />
  )
}

export const DropdownMenuSub = Menu.SubmenuRoot

export type DropdownMenuSubTriggerProps = ComponentProps<typeof Menu.SubmenuTrigger>

export function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <Menu.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn(itemClassName, 'data-popup-open:bg-accent', className)}
      {...props}
    >
      {children}
      <ChevronRight aria-hidden="true" className="ml-auto" />
    </Menu.SubmenuTrigger>
  )
}

/** Content of a submenu: the same as DropdownMenuContent, opening to the side. */
export function DropdownMenuSubContent({
  side = 'right',
  align = 'start',
  sideOffset = 0,
  ...props
}: DropdownMenuContentProps) {
  return <DropdownMenuContent side={side} align={align} sideOffset={sideOffset} {...props} />
}
