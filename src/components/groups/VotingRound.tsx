'use client'
import * as React from 'react'
import { VoteCard } from './VoteCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Clock, Vote, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'

interface VotingRoundProps {
  round: {
    id: string
    ends_at: string
    votes_per_member: number
  }
  poolItems: any[]
  userVoteIds: string[]
  isOwner?: boolean
  isLoading?: boolean
  onVote: (poolItemId: string) => void
  onRetract: (poolItemId: string) => void
  onEnd: () => void
}

function useCountdown(endsAt: string) {
  const calc = () => {
    const diff = new Date(endsAt).getTime() - Date.now()
    if (diff <= 0) return { h: 0, m: 0, s: 0, expired: true }
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { h, m, s, expired: false }
  }
  const [time, setTime] = React.useState(calc)
  React.useEffect(() => {
    const interval = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(interval)
  }, [endsAt])
  return time
}

export function VotingRound({ round, poolItems, userVoteIds, isOwner, isLoading, onVote, onRetract, onEnd }: VotingRoundProps) {
  const countdown = useCountdown(round.ends_at)
  const votesRemaining = round.votes_per_member - userVoteIds.length

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[2/3] rounded-2xl" />)}
      </div>
    )
  }

  return (
    <div>
      {/* Round Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Vote className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Voting Round Active</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3" />
              {countdown.expired ? 'Ended' : `${String(countdown.h).padStart(2,'0')}:${String(countdown.m).padStart(2,'0')}:${String(countdown.s).padStart(2,'0')} remaining`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={votesRemaining > 0 ? 'want' : 'dropped'} className="text-sm px-3 py-1">
            {votesRemaining} vote{votesRemaining !== 1 ? 's' : ''} left
          </Badge>
          {isOwner && (
            <Button variant="destructive" size="sm" onClick={onEnd}>End Round</Button>
          )}
        </div>
      </div>

      {votesRemaining === 0 && (
        <div className="mb-6 flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          You've used all your votes. You can still retract a vote to switch.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {poolItems.map(poolItem => (
          <VoteCard
            key={poolItem.id}
            poolItemId={poolItem.id}
            mediaItem={poolItem.media_item}
            voteCount={poolItem.vote_count || 0}
            hasVoted={userVoteIds.includes(poolItem.id)}
            votesRemaining={votesRemaining}
            onVote={onVote}
            onRetract={onRetract}
          />
        ))}
      </div>
    </div>
  )
}
