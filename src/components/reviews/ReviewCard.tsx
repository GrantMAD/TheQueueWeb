import * as React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Heart, MessageSquare, Star, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ReviewCardProps {
  username: string
  avatarUrl?: string
  rating?: number
  hookText: string
  bodyText?: string
  isSpoiler?: boolean
  likes: number
  comments: number
  createdAt: string
  onLike?: () => void
  onComment?: () => void
}

export function ReviewCard({ username, avatarUrl, rating, hookText, bodyText, isSpoiler, likes, comments, createdAt, onLike, onComment }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [revealSpoiler, setRevealSpoiler] = React.useState(false)

  const isBlurred = isSpoiler && !revealSpoiler

  return (
    <Card className="w-full bg-black/40 border border-white/10 shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar src={avatarUrl} fallback={username} size="md" />
            <div>
              <p className="font-medium text-white">{username}</p>
              <p className="text-xs text-gray-400">{createdAt}</p>
            </div>
          </div>
          {rating !== undefined && (
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-white">{rating}/10</span>
            </div>
          )}
        </div>

        <div className="relative">
          {isBlurred && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-xl border border-red-500/20 shadow-inner">
              <AlertTriangle className="h-6 w-6 text-red-500/50 mb-2" />
              <button 
                onClick={() => setRevealSpoiler(true)}
                className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors"
              >
                Reveal Spoiler
              </button>
            </div>
          )}
          
          <div className={cn("transition-all duration-500", isBlurred ? "opacity-0 select-none blur-sm" : "opacity-100")}>
            <p className="text-lg font-medium text-gray-200 leading-snug">
              "{hookText}"
            </p>

            {bodyText && (
              <div className={cn(
                "mt-3 text-gray-400 text-sm leading-relaxed overflow-hidden transition-all duration-500 ease-in-out", 
                isExpanded ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0 m-0"
              )}>
                <div className="h-px w-full bg-white/10 mb-4" />
                <p className="whitespace-pre-wrap">{bodyText}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex gap-4">
            <button onClick={onLike} className="flex items-center gap-1.5 text-gray-400 hover:text-pink-400 transition-colors group">
              <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{likes}</span>
            </button>
            <button onClick={onComment} className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-400 transition-colors group">
              <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{comments}</span>
            </button>
          </div>
          
          {bodyText && !isBlurred && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
            >
              {isExpanded ? (
                <>Read Less <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Read More <ChevronDown className="h-4 w-4" /></>
              )}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
