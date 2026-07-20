'use client'
import * as React from 'react'
import { VotingRound } from '@/components/groups/VotingRound'
import { Vote } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useVoting } from '@/hooks/useVoting'
import { useGroupPool, useGroupMembers, useGroupMutations } from '@/hooks/useGroups'
import { useAuthStore } from '@/store/authStore'
import { useRealtime } from '@/hooks/useRealtime'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

export default function GroupVotePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()

  // Subscribe to realtime updates for this group
  useRealtime(id)

  const { activeRound, userVoteIds, createRound, vote, retract, endRound } = useVoting(id)
  const { data: poolItems, isLoading: poolLoading } = useGroupPool(id)
  const { data: members } = useGroupMembers(id)

  const myMember = members?.find(m => m.id === user?.id)
  const isOwner = myMember?.role === 'owner'

  if (activeRound.isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[2/3] rounded-2xl" />)}
        </div>
      </div>
    )
  }

  const group = members && members.length > 0 ? { voting_duration_hours: 48, votes_per_member: 3 } : null

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Voting Round</h1>
        {isOwner && !activeRound.data && (
          <Button
            onClick={() => createRound.mutate({ durationHours: 48 })}
            isLoading={createRound.isPending}
            className="gap-2"
          >
            <Vote className="h-4 w-4" /> Start Vote
          </Button>
        )}
      </div>
      <p className="text-gray-400 mb-8">Cast your votes for the next pick.</p>

      {!activeRound.data ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-2xl bg-black/20">
          <Vote className="h-12 w-12 text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No active vote</h2>
          <p className="text-gray-400 max-w-xs">
            {isOwner ? 'Click "Start Vote" above to kick off a new round.' : 'The group owner can start a voting round from this page.'}
          </p>
        </div>
      ) : (
        <VotingRound
          round={activeRound.data}
          poolItems={poolItems || []}
          userVoteIds={userVoteIds}
          isOwner={isOwner}
          isLoading={poolLoading}
          onVote={(poolItemId) => vote.mutate(poolItemId)}
          onRetract={(poolItemId) => retract.mutate(poolItemId)}
          onEnd={() => endRound.mutate()}
        />
      )}
    </div>
  )
}

