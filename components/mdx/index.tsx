import type { MDXComponents } from 'mdx/types'
import type { ComponentProps } from 'react'
import { CodeFrame } from '@/components/code-frame'
import { TextLink } from '@/components/text-link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CodeTab, CodeTabs } from './code-tabs'
import { Decisions } from './decisions'
import { Pipeline } from './pipeline'

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Alert variant="info" className="my-6">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }: ComponentProps<'h2'>) => (
    <h2 className="mt-12 mb-4 text-title-2 first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentProps<'h3'>) => (
    <h3 className="mt-8 mb-3 text-title-3" {...props}>
      {children}
    </h3>
  ),
  p: (props: ComponentProps<'p'>) => <p className="my-4 text-body text-pretty" {...props} />,
  ul: (props: ComponentProps<'ul'>) => <ul className="my-4 list-disc space-y-2 pl-6 text-body" {...props} />,
  ol: (props: ComponentProps<'ol'>) => <ol className="my-4 list-decimal space-y-2 pl-6 text-body" {...props} />,
  a: ({ href = '', children }: ComponentProps<'a'>) => <TextLink href={href}>{children}</TextLink>,
  code: (props: ComponentProps<'code'>) => (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-code" {...props} />
  ),
  pre: CodeFrame,
  Callout,
  Decisions,
  Pipeline,
  CodeTabs,
  CodeTab,
}
