'use client'

import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export type TabsProps = ComponentProps<typeof BaseTabs.Root>

/** Switches between views of related content in one place. Not for site navigation. */
export function Tabs({ className, ...props }: TabsProps) {
  return (
    <BaseTabs.Root data-slot="tabs" className={cn('flex flex-col gap-4', className)} {...props} />
  )
}

export type TabsListProps = ComponentProps<typeof BaseTabs.List>

export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      className={cn(
        'relative flex w-fit max-w-full items-center gap-1 overflow-x-auto border-b border-border',
        className,
      )}
      {...props}
    >
      {children}
      {/* Moving underline under the active tab; color plus shape marks the selection (WCAG 1.4.1). */}
      <BaseTabs.Indicator className="absolute bottom-0 left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-primary transition-all duration-base ease-standard motion-reduce:transition-none" />
    </BaseTabs.List>
  )
}

export type TabsTriggerProps = ComponentProps<typeof BaseTabs.Tab>

export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <BaseTabs.Tab
      data-slot="tabs-trigger"
      className={cn(
        'inline-flex h-control-md shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-t-md px-3 text-body-sm font-medium',
        'text-muted-foreground hover:text-foreground focus-ring transition-colors duration-fast',
        'data-active:text-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}

export type TabsContentProps = ComponentProps<typeof BaseTabs.Panel>

export function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-content"
      className={cn('rounded-md focus-ring', className)}
      {...props}
    />
  )
}
