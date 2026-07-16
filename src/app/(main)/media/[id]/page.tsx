import * as React from 'react'
import { MediaDetail } from '@/components/media/MediaDetail'
import { ReviewList } from '@/components/reviews/ReviewList'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { AddToLibraryButton } from '@/components/media/AddToLibraryButton'
import { ProgressTracker } from '@/components/media/ProgressTracker'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PenSquare, Users } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Media ${id}` }
}

export default async function MediaPage({ params }: Props) {
  const { id } = await params
  const hasReview = false

  const mockMedia = {
    id,
    title: 'The Great Adventure',
    type: 'movie' as const,
    description: 'A fantastic journey through time and space.',
    cover_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    release_date: '2024-01-01',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    creators: ['Director Name'],
    external_id: '123',
    api_source: 'tmdb' as const
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-12">
      {/* Detail Block */}
      <div className="relative">
        <MediaDetail item={mockMedia} />
        <div className="mt-6 flex flex-wrap gap-4">
          <AddToLibraryButton currentStatus={undefined} onUpdate={() => {}} />
          <Button variant="secondary" className="gap-2"><Users className="h-4 w-4" /> Add to Group Pool</Button>
        </div>
      </div>

      {/* Progress (if watching/reading) */}
      <section>
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Progress</h2>
          <ProgressTracker 
            label="Episodes"
            current={0} 
            total={100} 
            onUpdate={() => {}} 
          />
        </div>
      </section>

      {/* Reviews */}
      <section>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h2>
          {!hasReview && (
            <Button className="gap-2"><PenSquare className="h-4 w-4" /> Write Review</Button>
          )}
        </div>
        
        <ReviewList reviews={[]} />
      </section>
    </div>
  )
}
