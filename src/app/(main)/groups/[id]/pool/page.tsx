import * as React from 'react'
import { GroupMediaPool } from '@/components/groups/GroupMediaPool'
import type { Metadata } from 'next'

interface Props { params: Promise<{ id: string }> }
export const metadata: Metadata = { title: 'Group Pool' }

export default async function GroupPoolPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Media Pool</h1>
      <p className="text-gray-400 mb-8">All the titles your group wants to experience.</p>
      <GroupMediaPool items={[]} isMember isLoading={false} />
    </div>
  )
}
