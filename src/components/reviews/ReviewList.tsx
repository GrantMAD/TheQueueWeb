import * as React from 'react'
import { ReviewCard } from './ReviewCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { MessageCircleOff } from 'lucide-react'

interface ReviewListProps {
  reviews: any[] // Will replace with proper Review type when wiring DB
  isLoading?: boolean
  onLike?: (id: string) => void
  onComment?: (id: string) => void
}

export function ReviewList({ reviews, isLoading, onLike, onComment }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="w-full h-48 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-white/10 rounded-2xl bg-black/20 backdrop-blur-sm">
        <div className="bg-white/5 p-4 rounded-full mb-4">
          <MessageCircleOff className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
        <p className="text-sm text-gray-400 max-w-sm">
          Be the first to share your thoughts and help others decide if this is worth experiencing!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <ReviewCard 
          key={review.id}
          username={review.user?.display_name || 'Anonymous'}
          avatarUrl={review.user?.avatar_url}
          rating={review.rating}
          hookText={review.hook_text}
          bodyText={review.body_text}
          isSpoiler={review.is_spoiler}
          likes={review.likes_count || 0}
          comments={review.comments_count || 0}
          createdAt={new Date(review.created_at).toLocaleDateString()}
          onLike={() => onLike?.(review.id)}
          onComment={() => onComment?.(review.id)}
        />
      ))}
    </div>
  )
}
