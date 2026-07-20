'use client'
import * as React from 'react'
import { useParams } from 'next/navigation'
import { MediaDetail } from '@/components/media/MediaDetail'
import { ReviewList } from '@/components/reviews/ReviewList'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { ReviewThread } from '@/components/reviews/ReviewThread'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { PenSquare, Users } from 'lucide-react'
import { useMediaItem } from '@/hooks/useMedia'
import { useReviews, useMyReview, useReviewMutations, useReviewComments } from '@/hooks/useReviews'
import { useUser } from '@/hooks/useUser'
import { useUiStore } from '@/store/uiStore'

function CommentSection({ reviewId }: { reviewId: string }) {
  const { data: comments = [], isLoading } = useReviewComments(reviewId)
  const { addComment } = useReviewMutations()

  return (
    <ReviewThread
      comments={(comments as any[]).map(c => ({
        ...c,
        user: {
          display_name: c.user?.display_name || c.user?.username || 'Anonymous',
          avatar_url: c.user?.avatar_url
        }
      }))}
      onAddComment={(content) => addComment.mutate({ reviewId, content })}
      isLoading={addComment.isPending}
    />
  )
}

export default function MediaPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const { addToast } = useUiStore()

  // Fetch media item from Supabase
  const { data: mediaItem, isLoading: mediaLoading } = useMediaItem(id)

  // Reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(id)
  const { data: myReview } = useMyReview(id)
  const { createReview, updateReview, deleteReview, likeReview } = useReviewMutations()

  // UI state
  const [isReviewOpen, setIsReviewOpen] = React.useState(false)
  const [editingReview, setEditingReview] = React.useState<any>(null)
  const [openCommentId, setOpenCommentId] = React.useState<string | null>(null)

  // Fallback item while loading (needed since MediaDetail requires item)
  const fallbackItem = {
    external_id: id,
    api_source: 'tmdb' as const,
    type: 'movie' as const,
    title: 'Loading...',
  }

  const item = (mediaItem as any) || fallbackItem

  const handleOpenReview = () => {
    if (myReview) {
      setEditingReview(myReview)
    }
    setIsReviewOpen(true)
  }

  const handleSubmitReview = (formData: any) => {
    if (editingReview) {
      updateReview.mutate(
        { reviewId: editingReview.id, mediaItemId: id, ...formData },
        { onSuccess: () => { addToast({ type: 'success', message: 'Review updated!' }); setEditingReview(null) } }
      )
    } else {
      createReview.mutate(
        { mediaItemId: id, ...formData },
        { onSuccess: () => addToast({ type: 'success', message: 'Review published!' }) }
      )
    }
    setIsReviewOpen(false)
  }

  const handleDeleteReview = (reviewId: string) => {
    if (!confirm('Delete this review?')) return
    deleteReview.mutate(
      { reviewId, mediaItemId: id },
      { onSuccess: () => addToast({ type: 'success', message: 'Review deleted.' }) }
    )
  }

  const handleLike = (reviewId: string, isLiked: boolean) => {
    likeReview.mutate({ reviewId, mediaItemId: id, liked: isLiked })
  }

  const handleToggleComments = (reviewId: string) => {
    setOpenCommentId(prev => (prev === reviewId ? null : reviewId))
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-12">
      {/* Detail Block */}
      <div className="relative">
        <MediaDetail item={item as any} isLoading={mediaLoading} />
        <div className="mt-6 flex flex-wrap gap-4">
          <Button variant="secondary" className="gap-2">
            <Users className="h-4 w-4" /> Add to Group Pool
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reviews <span className="text-gray-500 font-normal text-lg">({reviews.length})</span>
          </h2>
          {user && (
            <Button className="gap-2" onClick={handleOpenReview}>
              <PenSquare className="h-4 w-4" />
              {myReview ? 'Edit My Review' : 'Write Review'}
            </Button>
          )}
        </div>

        {reviewsLoading ? (
          <div className="space-y-6">
            {[1, 2].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id}>
                <ReviewList
                  reviews={[review]}
                  currentUserId={user?.id}
                  onLike={handleLike}
                  onComment={handleToggleComments}
                  onEdit={(r) => { setEditingReview(r); setIsReviewOpen(true) }}
                  onDelete={handleDeleteReview}
                />
                {openCommentId === review.id && (
                  <CommentSection reviewId={review.id} />
                )}
              </div>
            ))}
            {reviews.length === 0 && (
              <ReviewList reviews={[]} />
            )}
          </div>
        )}
      </section>

      {/* Review Form Modal */}
      <ReviewForm
        isOpen={isReviewOpen}
        onClose={() => { setIsReviewOpen(false); setEditingReview(null) }}
        mediaTitle={item.title}
        initialData={editingReview}
        onSubmit={handleSubmitReview}
      />
    </div>
  )
}

