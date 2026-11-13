'use client'

import { Check, Copy } from 'lucide-react'
import { useRef, useState, type ComponentProps } from 'react'
import { IconButton } from '@/components/ui/icon-button'
import { useToast } from '@/components/ui/toast'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type PreProps = ComponentProps<'pre'> & { 'data-title'?: string; 'data-language'?: string }

/** Wraps Shiki's <pre> (highlighted at build time) with a title bar and a copy button. */
export function CodeFrame({ className, children, ...props }: PreProps) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const toast = useToast()
  const title = props['data-title']
  const language = props['data-language']
  const name = title ?? `${language ?? 'Code'} example`

  const copy = async () => {
    // Copy the code as written, without the diff "removed" lines a reader shouldn't paste.
    const lines = [...(ref.current?.querySelectorAll('.line') ?? [])]
      .filter((l) => !l.classList.contains('remove'))
      .map((l) => l.textContent ?? '')
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: 'Copied to clipboard', description: name, type: 'success', timeout: 3000 })
    } catch {
      toast({ title: 'Couldn’t copy', description: 'Select the code and copy it manually.', type: 'error' })
    }
  }

  return (
    <figure className="my-6 overflow-hidden rounded-lg border border-border bg-background" data-testid="code-block">
      <figcaption className="flex items-center justify-between gap-2 border-b border-border bg-muted py-1 pr-1 pl-4">
        <span className="truncate font-mono text-caption text-muted-foreground">{title ?? language}</span>
        <Tooltip>
          <TooltipTrigger
            render={
              <IconButton label={copied ? 'Copied' : `Copy ${name}`} size="sm" onClick={copy} data-testid="copy-code">
                {copied ? <Check /> : <Copy />}
              </IconButton>
            }
          />
          <TooltipContent>{copied ? 'Copied' : 'Copy code'}</TooltipContent>
        </Tooltip>
      </figcaption>
      {/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- scrollable code must be keyboard-scrollable (axe: scrollable-region-focusable) */}
      <pre
        ref={ref}
        tabIndex={0}
        aria-label={name}
        className={cn('code-block focus-ring overflow-x-auto py-4 font-mono text-code', className)}
        {...props}
      >
        {children}
      </pre>
      {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
    </figure>
  )
}
