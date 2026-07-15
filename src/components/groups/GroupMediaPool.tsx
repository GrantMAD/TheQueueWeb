'use client'
import * as React from 'react'
import { MediaCard } from '@/components/media/MediaCard'
import { MediaSearch } from '@/components/media/MediaSearch'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { Plus, FolderHeart, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'

interface PoolItem {
  id: string
  media_item: any
  added_by: string
}

interface GroupMediaPoolProps {
  items: PoolItem[]
  isLoading?: boolean
  isMember?: boolean
  currentUserId?: string
  isOwner?: boolean
  onRemove?: (poolItemId: string) => void
  onAdd?: (mediaItem: any) => void
}

export function GroupMediaPool({ items, isLoading, isMember, currentUserId, isOwner, onRemove, onAdd }: GroupMediaPoolProps) {
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState<any[]>([])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[2/3] rounded-2xl" />)}
      </div>
    )
  }

  return (
    <div>
      {isMember && (
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add to Pool
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-white/10 text-center bg-black/20">
          <FolderHeart className="h-10 w-10 text-gray-600 mb-3" />
          <p className="text-gray-400 font-medium">The pool is empty.</p>
          {isMember && <p className="text-sm text-gray-600 mt-1">Add media items to get the group discussing.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map(poolItem => (
            <div key={poolItem.id} className="relative group">
              <MediaCard item={poolItem.media_item} />
              {(isOwner || poolItem.added_by === currentUserId) && (
                <button
                  onClick={() => onRemove?.(poolItem.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 backdrop-blur-md"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Media to Pool">
        <MediaSearch 
          onSearch={(q) => console.log('search', q)} 
          results={searchResults}
          onResultClick={(item) => { onAdd?.(item); setShowAddModal(false) }}
        />
      </Modal>
    </div>
  )
}
