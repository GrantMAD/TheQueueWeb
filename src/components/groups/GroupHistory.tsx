import * as React from 'react'
import { Trophy, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

interface HistoryEntry {
  id: string
  media_item: any
  decided_at: string
  vote_count: number
}

interface GroupHistoryProps {
  entries: HistoryEntry[]
  isLoading?: boolean
}

export function GroupHistory({ entries, isLoading }: GroupHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-5 animate-pulse">
            <div className="w-16 h-24 rounded-xl bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2 pt-2">
              <div className="h-4 w-1/3 bg-white/10 rounded" />
              <div className="h-4 w-1/2 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-black/20">
        <Trophy className="h-10 w-10 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No winners yet. Start a voting round!</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10" />

      <div className="space-y-8">
        {entries.map((entry, idx) => (
          <div key={entry.id} className="flex gap-5 relative">
            {/* Timeline dot */}
            <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${idx === 0 ? 'bg-amber-500/20 border-amber-500/40' : 'bg-white/10 border-white/10'}`}>
                <Trophy className={`h-5 w-5 ${idx === 0 ? 'text-amber-400' : 'text-gray-500'}`} />
              </div>
            </div>

            {/* Cover thumbnail */}
            <div className="h-24 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg">
              {entry.media_item?.cover_url && (
                <img src={entry.media_item.cover_url} alt={entry.media_item?.title} className="h-full w-full object-cover" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pt-2">
              <p className="font-bold text-white text-lg leading-tight">{entry.media_item?.title}</p>
              <p className="text-sm text-indigo-300 capitalize mt-0.5">{entry.media_item?.type}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(entry.decided_at).toLocaleDateString()}
                </span>
                <Badge variant="default" className="text-xs">{entry.vote_count} votes</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
