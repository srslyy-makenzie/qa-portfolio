import { SearchX } from 'lucide-react'
import { LinkButton } from '@/components/link-button'
import { EmptyState } from '@/components/ui/empty-state'

export default function NotFound() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-title-1">Page not found</h1>
      <EmptyState
        icon={<SearchX />}
        title="This page doesn’t exist"
        description="The link may be out of date. The link checker should have caught it, so I'd like to hear about it."
        action={<LinkButton href="/" variant="primary">Go home</LinkButton>}
      />
    </div>
  )
}
