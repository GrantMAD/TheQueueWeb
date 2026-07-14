import * as React from 'react'
import { MediaItem } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { AddToLibraryButton } from './AddToLibraryButton'
import { ProgressTracker } from './ProgressTracker'
import { formatRuntime } from '@/lib/utils/formatters'

interface MediaDetailProps {
  item: MediaItem
  isLoading?: boolean
  userStatus?: any // will refine types when wiring up
  userProgress?: number
}

export function MediaDetail({ item, isLoading, userStatus, userProgress = 0 }: MediaDetailProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full max-w-6xl mx-auto">
        <Skeleton className="w-full md:w-72 lg:w-80 aspect-[2/3] shrink-0 rounded-2xl shadow-2xl" />
        <div className="flex-1 space-y-6 pt-4">
          <Skeleton className="h-12 w-3/4" />
          <div className="flex gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="space-y-3 pt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  const handleStatusUpdate = (status: any) => { console.log('Update status', status) }
  const handleProgressUpdate = (val: number) => { console.log('Update progress', val) }

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative z-10 w-full max-w-6xl mx-auto">
      {/* Cover Column */}
      <div className="w-full max-w-xs md:max-w-none md:w-72 lg:w-80 shrink-0 mx-auto md:mx-0">
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50 ring-1 ring-white/5 relative group">
          {item.cover_url ? (
            <img 
              src={item.cover_url} 
              alt={item.title} 
              className="w-full h-auto object-cover aspect-[2/3] transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-gray-500">No Cover</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="mt-6 space-y-4">
          <AddToLibraryButton currentStatus={userStatus} onUpdate={handleStatusUpdate} />
          
          {userStatus && item.type !== 'movie' && (
            <ProgressTracker 
              label={item.type === 'book' ? 'Page' : item.type === 'album' || item.type === 'podcast' ? 'Track' : 'Episode'} 
              current={userProgress} 
              total={item.metadata?.episodes || item.metadata?.page_count || item.metadata?.tracks}
              onUpdate={handleProgressUpdate} 
            />
          )}
        </div>
      </div>

      {/* Info Column */}
      <div className="flex-1 pt-2 md:pt-4">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge className="capitalize text-indigo-300 bg-indigo-500/10 border-indigo-500/20 px-3 py-1 text-sm shadow-inner">{item.type}</Badge>
          {item.release_year && <span className="text-gray-400 font-medium">{item.release_year}</span>}
          {item.metadata?.runtime && <span className="text-gray-400 font-medium">• {formatRuntime(item.metadata.runtime)}</span>}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-8 leading-tight drop-shadow-sm">{item.title}</h1>
        
        {item.genres && item.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {item.genres.map(g => (
              <Badge key={g} variant="default" className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors text-gray-300">{g}</Badge>
            ))}
          </div>
        )}
        
        <div className="prose prose-invert prose-p:text-gray-300 prose-p:leading-relaxed prose-lg max-w-none bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-inner">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block" />
            Overview
          </h3>
          <p>{item.description || 'No description available for this item.'}</p>
        </div>
      </div>
    </div>
  )
}
