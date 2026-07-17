import * as React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Star, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ActivityData {
  activity_type: 'status_update' | 'review'
  actor_id: string
  username: string
  display_name: string
  avatar_url: string | null
  media_item_id: string
  media_title: string
  media_type: string
  media_cover_url: string | null
  status: string | null
  rating: number | null
  hook_text: string | null
  current_episode: number | null
  current_season: number | null
  occurred_at: string
}

export function ActivityCard({ activity }: { activity: ActivityData }) {
  const isReview = activity.activity_type === 'review'
  const timeAgo = formatDistanceToNow(new Date(activity.occurred_at), { addSuffix: true })

  const getStatusText = () => {
    if (isReview) return 'wrote a review for'
    switch (activity.status) {
      case 'completed': return 'completed'
      case 'current': 
        if (activity.current_episode) {
          return `watched episode ${activity.current_episode} of`
        }
        return 'is currently enjoying'
      case 'want': return 'wants to watch'
      case 'dropped': return 'dropped'
      case 'paused': return 'paused'
      default: return 'updated their status for'
    }
  }

  return (
    <Card className="overflow-hidden hover:bg-white/[0.02] transition-colors border-white/5 bg-black/20">
      <CardContent className="p-4 sm:p-5 flex gap-4">
        {/* User Avatar */}
        <Link href={`/profile/${activity.username}`} className="shrink-0 mt-1">
          <Avatar src={activity.avatar_url || undefined} alt={activity.display_name || activity.username} fallback={(activity.display_name || activity.username || '?').charAt(0).toUpperCase()} size="md" />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <div className="text-sm text-gray-400 flex items-center gap-2 flex-wrap">
              <Link href={`/profile/${activity.username}`} className="font-bold text-gray-900 dark:text-white hover:underline">
                {activity.display_name || activity.username}
              </Link>
              <span>{getStatusText()}</span>
              <span className="text-xs opacity-60 ml-auto">{timeAgo}</span>
            </div>
            <Link href={`/media/${activity.media_item_id}`} className="inline-block font-bold text-lg text-indigo-400 hover:text-indigo-300 transition-colors mt-0.5 line-clamp-1">
              {activity.media_title}
            </Link>
          </div>

          {/* Optional Review or Rating block */}
          {(activity.rating || activity.hook_text) && (
            <div className={cn(
              "rounded-xl p-4 mt-2 border border-white/5",
              isReview ? "bg-indigo-500/10" : "bg-black/20"
            )}>
              {activity.rating && (
                <div className="flex items-center gap-1.5 mb-2 text-yellow-500 font-bold text-sm">
                  <Star className="h-4 w-4 fill-current" />
                  {activity.rating} / 10
                </div>
              )}
              {activity.hook_text && (
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{activity.hook_text}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Media Thumbnail */}
        {activity.media_cover_url && (
          <Link href={`/media/${activity.media_item_id}`} className="shrink-0 hidden sm:block">
            <div className="w-16 h-24 rounded-lg overflow-hidden bg-white/10 relative shadow-sm group">
              <img 
                src={activity.media_cover_url} 
                alt={activity.media_title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
