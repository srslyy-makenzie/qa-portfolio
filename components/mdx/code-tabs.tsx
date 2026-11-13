'use client'

import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type TabProps = { label: string; children: ReactNode }

/** One tab of a CodeTabs group; its label names the tab. */
export function CodeTab({ children }: TabProps) {
  return <>{children}</>
}

/** Related code excerpts in tabs (fixture / page object / test), keyboard-switchable. */
export function CodeTabs({ label, children }: { label: string; children: ReactNode }) {
  const tabs = Children.toArray(children).filter(
    (c): c is ReactElement<TabProps> => isValidElement(c) && typeof (c.props as TabProps).label === 'string',
  )
  return (
    <Tabs defaultValue={0} className="my-6" data-testid="code-tabs">
      <TabsList aria-label={label}>
        {tabs.map((t, i) => (
          <TabsTrigger key={t.props.label} value={i}>
            {t.props.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t, i) => (
        <TabsContent key={t.props.label} value={i} className="[&_figure]:my-0">
          {t.props.children}
        </TabsContent>
      ))}
    </Tabs>
  )
}
