'use client'
import * as React from 'react'
import { GroupHistory } from '@/components/groups/GroupHistory'
import { useParams } from 'next/navigation'
import { useGroupHistory } from '@/hooks/useGroups'

export default function GroupHistoryPage() {
  const { id } = useParams<{ id: string }>()
  const { data: historyEntries, isLoading } = useGroupHistory(id)

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Winner History</h1>
      <p className="text-gray-400 mb-8">Every pick your group has decided on, in order.</p>
      <GroupHistory entries={historyEntries || []} isLoading={isLoading} />
    </div>
  )
}
