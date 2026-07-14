import * as React from 'react'
import Link from 'next/link'
import { GroupHeader } from '@/components/groups/GroupHeader'
import { GroupMediaPool } from '@/components/groups/GroupMediaPool'
import { Button } from '@/components/ui/Button'
import { Vote } from 'lucide-react'

interface Props { params: Promise<{ id: string }> }

export default async function GroupPage({ params }: Props) {
  const { id } = await params
  // Data will be fetched in Phase 10 hooks
  const mockGroup = { id, name: 'Group', description: '', coverUrl: undefined, memberCount: 0, type: 'public' as 'public' | 'private', isOwner: false, votingEnabled: true }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <GroupHeader {...mockGroup} />

      {/* Group Nav */}
      <nav className="flex gap-2 border-b border-white/10 pb-0">
        {[
          { label: 'Pool', href: `/groups/${id}/pool` },
          { label: 'Vote', href: `/groups/${id}/vote` },
          { label: 'History', href: `/groups/${id}/history` },
          ...(mockGroup.type === 'private' ? [{ label: 'Progress', href: `/groups/${id}/progress` }] : []),
        ].map(link => (
          <Link key={link.href} href={link.href}
            className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border-b-2 border-transparent hover:border-indigo-500/50 transition-all">
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Recent pool preview */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Media Pool</h2>
          <Link href={`/groups/${id}/pool`}>
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>
        <GroupMediaPool items={[]} isLoading={false} isMember />
      </section>
    </div>
  )
}
