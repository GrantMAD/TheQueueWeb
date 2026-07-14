'use client'
import * as React from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AlertTriangle, Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ReviewFormProps {
  isOpen: boolean
  onClose: () => void
  mediaTitle: string
  initialData?: any // edit mode
  onSubmit: (data: any) => void
}

export function ReviewForm({ isOpen, onClose, mediaTitle, initialData, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = React.useState(initialData?.rating || 0)
  const [hook, setHook] = React.useState(initialData?.hook_text || '')
  const [body, setBody] = React.useState(initialData?.body_text || '')
  const [isSpoiler, setIsSpoiler] = React.useState(initialData?.is_spoiler || false)

  const maxHookLength = 280

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ rating, hook_text: hook, body_text: body, is_spoiler: isSpoiler })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Review: ${mediaTitle}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            Rating: <span className="font-bold text-white">{rating}/10</span>
          </label>
          <input 
            type="range" 
            min="0" max="10" step="1"
            value={rating} 
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="w-full accent-indigo-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-medium text-gray-300">The Hook <span className="text-gray-500 font-normal">(Required)</span></label>
            <span className={cn("text-xs font-mono", hook.length > maxHookLength ? "text-red-400 font-bold" : "text-gray-500")}>
              {hook.length}/{maxHookLength}
            </span>
          </div>
          <Input 
            placeholder="Sum up your thoughts in a single sentence..." 
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            error={hook.length > maxHookLength ? "Hook is too long" : undefined}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Review <span className="text-gray-500 font-normal">(Optional)</span></label>
          <textarea 
            rows={5}
            placeholder="Elaborate on your thoughts, share deep analysis, or just rant..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y transition-all duration-200 shadow-inner"
          />
        </div>

        <div className={cn(
          "flex items-center gap-3 border rounded-xl p-3 transition-colors duration-200",
          isSpoiler ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/10 hover:bg-white/10"
        )}>
          <input 
            type="checkbox" 
            id="spoiler"
            checked={isSpoiler}
            onChange={(e) => setIsSpoiler(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500 focus:ring-offset-gray-900 cursor-pointer"
          />
          <label htmlFor="spoiler" className="flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer select-none w-full">
            <AlertTriangle className={cn("h-4 w-4 transition-colors", isSpoiler ? "text-red-400" : "text-gray-500")} />
            Contains Spoilers
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={hook.length > maxHookLength || hook.trim().length === 0}>
            {initialData ? 'Save Changes' : 'Publish Review'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
