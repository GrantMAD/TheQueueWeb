'use client'
import * as React from 'react'
import { GroupSettings } from '@/components/groups/GroupSettings'
import { useParams, useRouter } from 'next/navigation'
import { useGroup, useGroupMembers, useGroupMutations } from '@/hooks/useGroups'
import { Skeleton } from '@/components/ui/Skeleton'

export default function GroupSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  
  const { data: group, isLoading: groupLoading } = useGroup(id)
  const { data: members, isLoading: membersLoading } = useGroupMembers(id)
  const { updateGroup, deleteGroup, kickMember } = useGroupMutations()

  if (groupLoading || membersLoading) {
    return <div className="p-8 max-w-2xl mx-auto"><Skeleton className="h-96 w-full rounded-2xl" /></div>
  }

  if (!group) {
    return <div className="p-8 text-center text-gray-400">Group not found</div>
  }

  const handleSave = (data: any) => {
    updateGroup.mutate({ id, data })
  }

  const handleKick = (memberId: string) => {
    kickMember.mutate({ groupId: id, memberId })
  }

  const handleDelete = () => {
    deleteGroup.mutate(id, {
      onSuccess: () => router.push('/groups') // redirect after delete
    })
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Group Settings</h1>
      <GroupSettings
        group={group}
        members={members || []}
        onSave={handleSave}
        onKick={handleKick}
        onDelete={handleDelete}
        isSaving={updateGroup.isPending}
      />
    </div>
  )
}
