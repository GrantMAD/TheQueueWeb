import * as React from 'react'
import { ProgressFeed } from '@/components/groups/ProgressFeed'
import type { Metadata } from 'next'

interface Props { params: Promise<{ id: string }> }
export const metadata: Metadata = { title: 'Group Progress' }

export default async function GroupProgressPage({ params }: Props) {
  const { id } = await params
  // Private group check will be enforced by data layer + proxy in Phase 10

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Progress Updates</h1>
      <p className="text-gray-400 mb-8">See where everyone is up to.</p>
      <ProgressFeed entries={[]} />
    </div>
  )
}
