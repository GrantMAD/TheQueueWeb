import * as React from 'react'
import { GroupHistory } from '@/components/groups/GroupHistory'
import type { Metadata } from 'next'

interface Props { params: Promise<{ id: string }> }
export const metadata: Metadata = { title: 'Group History' }

export default async function GroupHistoryPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-2">Winner History</h1>
      <p className="text-gray-400 mb-8">Every pick your group has decided on, in order.</p>
      <GroupHistory entries={[]} />
    </div>
  )
}
