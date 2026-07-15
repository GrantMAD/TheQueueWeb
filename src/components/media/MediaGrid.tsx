import * as React from 'react'
import { MediaItem } from '@/types'
import { MediaCard } from './MediaCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { FolderHeart } from 'lucide-react'

interface MediaGridProps {
  items: MediaItem[]
  isLoading?: boolean
  loadingCount?: number
  onItemClick?: (item: MediaItem) => void
  emptyMessage?: string
}

export function MediaGrid({ 
  items, 
  isLoading = false, 
  loadingCount = 10,
  onItemClick,
  emptyMessage = "No media found."
}: MediaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: loadingCount }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] w-full rounded-2xl" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-24 text-center">
        <div className="rounded-full bg-white/5 p-4 mb-4 text-gray-400">
          <FolderHeart className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">It's pretty empty here</h3>
        <p className="text-sm text-gray-400 max-w-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {items.map((item, idx) => (
        <MediaCard 
          key={`${item.external_id || item.id}-${idx}`} 
          item={item} 
          onClick={() => onItemClick?.(item)} 
        />
      ))}
    </div>
  )
}
