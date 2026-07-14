import * as React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { ThumbsUp, Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'

interface VoteCardProps {
  poolItemId: string
  mediaItem: any
  voteCount: number
  hasVoted: boolean
  votesRemaining: number
  onVote: (poolItemId: string) => void
  onRetract: (poolItemId: string) => void
  isOwner?: boolean
}

export function VoteCard({ poolItemId, mediaItem, voteCount, hasVoted, votesRemaining, onVote, onRetract }: VoteCardProps) {
  const canVote = !hasVoted && votesRemaining > 0

  return (
    <Card className={cn("overflow-hidden transition-all duration-300", hasVoted ? "ring-2 ring-indigo-500/50 shadow-indigo-500/20 shadow-xl" : "")}>
      {/* Cover */}
      <div className="aspect-[2/3] relative overflow-hidden bg-white/5">
        {mediaItem?.cover_url ? (
          <img src={mediaItem.cover_url} alt={mediaItem.title} className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-sm font-bold text-white line-clamp-2 leading-tight">{mediaItem?.title}</p>
        </div>
      </div>

      {/* Vote area */}
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ThumbsUp className={cn("h-4 w-4", hasVoted ? "text-indigo-400 fill-indigo-400/20" : "text-gray-500")} />
            <span className="text-sm font-bold text-white">{voteCount}</span>
          </div>

          <button
            onClick={() => hasVoted ? onRetract(poolItemId) : onVote(poolItemId)}
            disabled={!canVote && !hasVoted}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 flex items-center gap-1",
              hasVoted 
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                : canVote
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30"
                  : "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
            )}
          >
            {hasVoted ? <><Check className="h-3 w-3" /> Voted</> : 'Vote'}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
