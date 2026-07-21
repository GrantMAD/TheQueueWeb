'use client'
import * as React from 'react'
import { useFeed } from '@/hooks/useFeed'
import { ActivityFeed } from '@/components/feed/ActivityFeed'
import { FeedFilters } from '@/components/feed/FeedFilters'

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
      <FeedFilters 
        mediaFilter={mediaFilter} 
        setMediaFilter={setMediaFilter} 
        activityFilter={activityFilter} 
        setActivityFilter={setActivityFilter} 
      />

      {/* Content */}
      <ActivityFeed items={filteredItems} isLoading={isLoading} />
    </div>
  )
}
