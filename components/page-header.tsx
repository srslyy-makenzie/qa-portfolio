import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string
  title: string
  lede?: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="flex max-w-3xl flex-col gap-3 pb-10">
      {eyebrow ? <p className="text-body-sm font-medium text-primary">{eyebrow}</p> : null}
      <h1 className="text-title-1 text-balance">{title}</h1>
      {lede ? <p className="text-body text-muted-foreground text-pretty">{lede}</p> : null}
      {children}
    </header>
  )
}

export function Section({
  title,
  id,
  description,
  children,
}: {
  title: string
  id?: string
  description?: ReactNode
  children: ReactNode
}) {
  const headingId = id ? `${id}-heading` : undefined
  return (
    <section aria-labelledby={headingId} id={id} className="flex scroll-mt-24 flex-col gap-4 py-8">
      <div className="flex flex-col gap-1">
        <h2 id={headingId} className="text-title-2">
          {title}
        </h2>
        {description ? <p className="max-w-3xl text-body-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}
