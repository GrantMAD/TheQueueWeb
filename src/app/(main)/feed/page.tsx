'use client'
import * as React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Users } from 'lucide-react'
import { useFeed } from '@/hooks/useFeed'
import { ActivityCard } from '@/components/feed/ActivityCard'
const mediaFilters = ['All', 'Movies', 'TV', 'Books', 'Anime']
const activityFilters = ['All', 'Status update', 'Review']

export default function FeedPage() {
  const [mediaFilter, setMediaFilter] = React.useState('All')
  const [activityFilter, setActivityFilter] = React.useState('All')
  const { data, isLoading } = useFeed()
  const allItems = data?.pages.flatMap(page => page.data) || []
  
  // Apply filters locally (basic implementation for now)
  const filteredItems = React.useMemo(() => {
    return allItems.filter((item: any) => {
      // Very basic filtering, just to make the UI interactive
      if (mediaFilter !== 'All') {
        const type = item.media_item?.type
        if (mediaFilter === 'Movies' && type !== 'movie') return false
        if (mediaFilter === 'TV' && type !== 'tv') return false
      }
      if (activityFilter !== 'All') {
        if (activityFilter === 'Review' && item.type !== 'review') return false
        if (activityFilter === 'Status update' && item.type !== 'status') return false
      }
      return true
    })
  }, [allItems, mediaFilter, activityFilter])

  const hasItems = filteredItems.length > 0

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Friend Feed</h1>
      <p className="text-gray-400 mb-8">What your people are up to.</p>

      {/* Filters */}
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

      {/* Content */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
      ) : !hasItems ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-white/10 rounded-2xl bg-black/20">
          <Users className="h-12 w-12 text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nothing here yet</h2>
          <p className="text-gray-400 max-w-xs">Follow some people and their activity will show up right here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredItems.map((activity: any) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}
