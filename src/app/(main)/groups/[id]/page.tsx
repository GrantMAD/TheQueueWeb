'use client'
import * as React from 'react'
import Link from 'next/link'
import { GroupHeader } from '@/components/groups/GroupHeader'
import { GroupMediaPool } from '@/components/groups/GroupMediaPool'
import { Button } from '@/components/ui/Button'
import { Vote } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useGroup, useGroupMembers, useGroupPool, useGroupMutations } from '@/hooks/useGroups'
import { useAuthStore } from '@/store/authStore'
import { Skeleton } from '@/components/ui/Skeleton'

export default function GroupPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  
  const { data: group, isLoading } = useGroup(id)
  const { data: members, isLoading: membersLoading } = useGroupMembers(id)
  const { data: poolItems, isLoading: poolLoading } = useGroupPool(id)
  const { removeFromPool } = useGroupMutations()

  if (isLoading || membersLoading) {
    return <div className="p-8 max-w-7xl mx-auto space-y-8"><Skeleton className="h-64 w-full rounded-3xl" /></div>
  }

  if (!group) return <div className="p-8 text-center text-gray-400">Group not found</div>

  const myMember = members?.find(m => m.id === user?.id)
  const isMember = !!myMember
  const isOwner = myMember?.role === 'owner'
  
  const groupProps = {
    id: group.id,
    name: group.name,
    description: group.description,
    coverUrl: undefined, // Add if group has cover_url later
    memberCount: members?.length || 0,
    type: group.type,
    isOwner,
    votingEnabled: group.voting_enabled
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <GroupHeader {...groupProps} />

      {/* Group Nav */}
      <nav className="flex gap-2 border-b border-white/10 pb-0 overflow-x-auto">
        {[
          { label: 'Pool', href: `/groups/${id}/pool` },
          { label: 'Vote', href: `/groups/${id}/vote` },
          { label: 'History', href: `/groups/${id}/history` },
          ...(group.type === 'private' ? [{ label: 'Progress', href: `/groups/${id}/progress` }] : []),
        ].map(link => (
          <Link key={link.href} href={link.href}
            className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border-b-2 border-transparent hover:border-indigo-500/50 transition-all whitespace-nowrap">
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Recent pool preview */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Media Pool</h2>
          <Link href={`/groups/${id}/pool`}>
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>
        <GroupMediaPool 
          items={poolItems?.slice(0, 5) || []} 
          isLoading={poolLoading} 
          isMember={isMember} 
          isOwner={isOwner}
          currentUserId={user?.id}
          onRemove={(poolId) => removeFromPool.mutate({ poolItemId: poolId })}
        />
      </section>
    </div>
  )
}
