'use client'
import * as React from 'react'
import { GroupMediaPool } from '@/components/groups/GroupMediaPool'
import { useParams } from 'next/navigation'
import { useGroupMembers, useGroupPool, useGroupMutations } from '@/hooks/useGroups'
import { useAuthStore } from '@/store/authStore'

export default function GroupPoolPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  
  const { data: members } = useGroupMembers(id)
  const { data: poolItems, isLoading } = useGroupPool(id)
  const { addToPool, removeFromPool } = useGroupMutations()

  const myMember = members?.find(m => m.id === user?.id)
  const isMember = !!myMember
  const isOwner = myMember?.role === 'owner'

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Media Pool</h1>
      <p className="text-gray-400 mb-8">All the titles your group wants to experience.</p>
      <GroupMediaPool 
        items={poolItems || []} 
        isLoading={isLoading} 
        isMember={isMember}
        isOwner={isOwner}
        currentUserId={user?.id}
        onAdd={(item) => addToPool.mutate({ groupId: id, mediaItem: item })}
        onRemove={(poolItemId) => removeFromPool.mutate({ poolItemId })}
      />
    </div>
  )
}
