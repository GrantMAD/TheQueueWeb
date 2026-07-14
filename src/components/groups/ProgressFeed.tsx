import * as React from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { BookOpen, Tv } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'

interface ProgressEntry {
  id: string
  user: { display_name: string; avatar_url?: string }
  media_item: any
  progress_value: number
  total?: number
  note?: string
  updated_at: string
}

interface ProgressFeedProps {
  entries: ProgressEntry[]
  isLoading?: boolean
}

export function ProgressFeed({ entries, isLoading }: ProgressFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-black/20">
        <BookOpen className="h-10 w-10 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No progress updates yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map(entry => {
        const ProgressIcon = entry.media_item?.type === 'book' ? BookOpen : Tv
        const label = entry.media_item?.type === 'book' ? 'page' : 'episode'
        return (
          <div key={entry.id} className="flex gap-4 p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
            <Avatar src={entry.user.avatar_url} fallback={entry.user.display_name} size="sm" className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-white">{entry.user.display_name}</span>
                <span className="text-gray-400 text-sm">
                  reached <span className="text-indigo-300 font-semibold">{label} {entry.progress_value}</span>
                  {entry.total ? <span className="text-gray-500"> / {entry.total}</span> : ''} of
                </span>
                <span className="font-semibold text-white text-sm">{entry.media_item?.title}</span>
              </div>
              {entry.note && (
                <p className="mt-2 text-sm text-gray-300 bg-white/5 border border-white/5 rounded-xl px-3 py-2">
                  "{entry.note}"
                </p>
              )}
              <p className="text-xs text-gray-600 mt-2">{new Date(entry.updated_at).toLocaleString()}</p>
            </div>
            <ProgressIcon className="h-4 w-4 text-indigo-400/50 shrink-0 mt-1" />
          </div>
        )
      })}
    </div>
  )
}
