'use client'
import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { UserPlus, UserMinus } from 'lucide-react'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onToggle: (userId: string, isFollowing: boolean) => Promise<void>
}

export function FollowButton({ userId, isFollowing, onToggle }: FollowButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [optimisticState, setOptimisticState] = React.useState(isFollowing)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)
    setOptimisticState(!optimisticState)
    try {
      await onToggle(userId, optimisticState)
    } catch {
      // Revert on error
      setOptimisticState(optimisticState)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant={optimisticState ? 'secondary' : 'primary'} 
      size="sm" 
      onClick={handleClick}
      isLoading={isLoading}
      className={optimisticState ? 'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' : ''}
    >
      {optimisticState ? (
        <span className="flex items-center gap-1.5"><UserMinus className="h-3.5 w-3.5" /> Unfollow</span>
      ) : (
        <span className="flex items-center gap-1.5"><UserPlus className="h-3.5 w-3.5" /> Follow</span>
      )}
    </Button>
  )
}
