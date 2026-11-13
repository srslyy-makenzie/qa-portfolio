'use client'

import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { ChevronDown } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

export type AccordionProps = ComponentProps<typeof BaseAccordion.Root>

/** Stacked sections that expand to reveal content: FAQs, settings groups. */
export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <BaseAccordion.Root
      data-slot="accordion"
      className={cn('flex w-full flex-col', className)}
      {...props}
    />
  )
}

export type AccordionItemProps = ComponentProps<typeof BaseAccordion.Item>

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <BaseAccordion.Item
      data-slot="accordion-item"
      className={cn('border-b border-border last:border-b-0', className)}
      {...props}
    />
  )
}

export type AccordionTriggerProps = ComponentProps<typeof BaseAccordion.Trigger> & {
  /** Heading level of the item header. Fit it to the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

export function AccordionTrigger({
  className,
  children,
  headingLevel = 3,
  ...props
}: AccordionTriggerProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <BaseAccordion.Header render={<Heading />} className="flex">
      <BaseAccordion.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group flex flex-1 items-center justify-between gap-4 rounded-md py-3 text-left text-body-sm font-medium',
          'focus-ring hover:underline underline-offset-4 data-disabled:cursor-not-allowed data-disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-base ease-standard group-data-panel-open:rotate-180 motion-reduce:transition-none"
        />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  )
}

export type AccordionContentProps = ComponentProps<typeof BaseAccordion.Panel>

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  return (
    <BaseAccordion.Panel
      data-slot="accordion-content"
      className={cn(
        'h-(--accordion-panel-height) overflow-hidden text-body-sm',
        'transition-all duration-base ease-standard motion-reduce:transition-none',
        'data-starting-style:h-0 data-ending-style:h-0',
      )}
      {...props}
    >
      <div className={cn('pb-3', className)}>{children}</div>
    </BaseAccordion.Panel>
  )
}
