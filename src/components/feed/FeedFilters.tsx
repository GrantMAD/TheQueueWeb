'use client'
import * as React from 'react'
import { Badge } from '@/components/ui/Badge'

interface FeedFiltersProps {
  mediaFilter: string;
  setMediaFilter: (f: string) => void;
  activityFilter: string;
  setActivityFilter: (f: string) => void;
}

const mediaFilters = ['All', 'Movies', 'TV', 'Books', 'Anime']
const activityFilters = ['All', 'Status update', 'Review']

export function FeedFilters({ mediaFilter, setMediaFilter, activityFilter, setActivityFilter }: FeedFiltersProps) {
  return (
    <div className="space-y-3 mb-10">
      <div className="flex flex-wrap gap-2">
        {mediaFilters.map(f => (
          <button key={f} onClick={() => setMediaFilter(f)}>
            <Badge variant={mediaFilter === f ? 'want' : 'default'} className="cursor-pointer px-3 py-1 text-sm">{f}</Badge>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {activityFilters.map(f => (
          <button key={f} onClick={() => setActivityFilter(f)}>
            <Badge variant={activityFilter === f ? 'current' : 'default'} className="cursor-pointer px-3 py-1 text-sm">{f}</Badge>
          </button>
        ))}
      </div>
    </div>
  )
}
