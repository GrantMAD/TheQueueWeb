import * as React from 'react'
import { MediaItem } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Film, Tv, Book, Headphones, PlaySquare, Disc } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface MediaCardProps {
  item: MediaItem
  status?: 'want' | 'current' | 'completed' | 'dropped' | 'paused'
  onClick?: () => void
  className?: string
}

export function MediaCard({ item, status, onClick, className }: MediaCardProps) {
  const TypeIcon = {
    movie: Film,
    tv: Tv,
    book: Book,
    podcast: Headphones,
    anime: PlaySquare,
    album: Disc
  }[item.type] || Film

  return (
    <Card isClickable onClick={onClick} className={cn("group relative flex flex-col h-full", className)}>
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-white/5">
        {item.cover_url ? (
          <img 
            src={item.cover_url} 
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-500 bg-white/5">
            <TypeIcon className="h-12 w-12 opacity-30" />
          </div>
        )}
        
        {/* Gradients and Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {status && <Badge variant={status} className="shadow-lg backdrop-blur-md">{status}</Badge>}
        </div>
        
        <div className="absolute top-3 right-3">
          <div className="rounded-full bg-black/50 p-1.5 backdrop-blur-md border border-white/10 text-white shadow-lg">
            <TypeIcon className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="line-clamp-2 text-sm font-bold text-white leading-tight drop-shadow-md">
            {item.title}
          </h3>
          <p className="mt-1 text-xs text-gray-300 font-medium">
            {item.release_year || 'Unknown Year'}
          </p>
        </div>
      </div>
    </Card>
  )
}
