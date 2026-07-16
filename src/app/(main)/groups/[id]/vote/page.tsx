import * as React from 'react'
import { VotingRound } from '@/components/groups/VotingRound'
import { Vote } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: Promise<{ id: string }> }
export const metadata: Metadata = { title: 'Vote' }

export default async function GroupVotePage({ params }: Props) {
  const { id } = await params
  const hasActiveRound = false

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Voting Round</h1>
      <p className="text-gray-400 mb-8">Cast your votes for the next pick.</p>

      {!hasActiveRound ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-2xl bg-black/20">
          <Vote className="h-12 w-12 text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No active vote</h2>
          <p className="text-gray-400 max-w-xs">The group owner can start a voting round from the group page.</p>
        </div>
      ) : (
        <VotingRound
          round={{ id: '', ends_at: '', votes_per_member: 3 }}
          poolItems={[]}
          userVoteIds={[]}
          onVote={() => {}}
          onRetract={() => {}}
          onEnd={() => {}}
        />
      )}
    </div>
  )
}
