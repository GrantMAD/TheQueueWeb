'use client'
import * as React from 'react'
import { ProgressFeed } from '@/components/groups/ProgressFeed'
import { useParams } from 'next/navigation'
import { useProgressFeed } from '@/hooks/useGroups'

export default function GroupProgressPage() {
  const { id } = useParams<{ id: string }>()
  const { data: progressEntries, isLoading } = useProgressFeed(id)

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Progress Updates</h1>
      <p className="text-gray-400 mb-8">See where everyone is up to.</p>
      <ProgressFeed entries={progressEntries || []} isLoading={isLoading} />
    </div>
  )
}
