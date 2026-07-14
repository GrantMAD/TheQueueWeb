'use client'
import * as React from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SendHorizontal } from 'lucide-react'

interface Comment {
  id: string
  user: { display_name: string; avatar_url?: string }
  content: string
  created_at: string
}

interface ReviewThreadProps {
  comments: Comment[]
  onAddComment: (content: string) => void
  isLoading?: boolean
}

export function ReviewThread({ comments, onAddComment, isLoading }: ReviewThreadProps) {
  const [newComment, setNewComment] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(newComment.trim())
      setNewComment('')
    }
  }

  return (
    <div className="mt-6 ml-4 md:ml-12 pl-4 border-l-2 border-white/10 space-y-6 relative">
      {/* Visual connector line to parent review */}
      <div className="absolute -top-6 left-0 w-4 h-6 border-b-2 border-l-2 border-white/10 rounded-bl-xl" />

      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1">
          <Input 
            placeholder="Write a reply..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-black/40 shadow-inner rounded-xl h-11"
          />
        </div>
        <Button type="submit" size="md" disabled={!newComment.trim() || isLoading} className="w-11 px-0 flex justify-center">
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </form>

      <div className="space-y-6 pt-2">
        {comments.map(c => (
          <div key={c.id} className="flex gap-3 group">
            <Avatar src={c.user.avatar_url} fallback={c.user.display_name} size="sm" className="mt-1 shrink-0 shadow-sm" />
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-sm font-semibold text-gray-200 group-hover:text-indigo-300 transition-colors">{c.user.display_name}</span>
                <span className="text-xs text-gray-500 font-mono">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-sm inline-block shadow-sm">
                {c.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
