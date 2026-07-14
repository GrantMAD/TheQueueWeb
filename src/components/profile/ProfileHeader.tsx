'use client'
import * as React from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Settings, Users, Link as LinkIcon, Calendar } from 'lucide-react'

interface ProfileHeaderProps {
  user: {
    id: string
    display_name: string
    username: string
    avatar_url?: string
    bio?: string
    created_at: string
  }
  followerCount: number
  followingCount: number
  isOwnProfile?: boolean
  isFollowing?: boolean
  onFollow?: () => void
  onEdit?: () => void
}

export function ProfileHeader({ user, followerCount, followingCount, isOwnProfile, isFollowing, onFollow, onEdit }: ProfileHeaderProps) {
  return (
    <div className="relative mb-12">
      {/* Banner */}
      <div className="h-32 md:h-48 w-full rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black border border-white/5" />
      
      {/* Profile Info */}
      <div className="px-6 md:px-10 -mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
          <Avatar 
            src={user.avatar_url} 
            fallback={user.display_name} 
            className="h-32 w-32 md:h-40 md:w-40 border-4 border-[#0F0F13] shadow-2xl rounded-3xl" 
          />
          <div className="pb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">{user.display_name}</h1>
            <p className="text-indigo-400 font-medium text-lg">@{user.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pb-2 shrink-0">
          {isOwnProfile ? (
            <Button variant="secondary" onClick={onEdit} className="gap-2">
              <Settings className="h-4 w-4" /> Edit Profile
            </Button>
          ) : (
            <Button onClick={onFollow} variant={isFollowing ? 'secondary' : 'primary'} className="w-32">
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
      </div>

      <div className="px-6 md:px-10 mt-6 max-w-3xl">
        {user.bio && (
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">{user.bio}</p>
        )}
        
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex gap-4">
            <p className="text-gray-400"><span className="text-white font-bold text-base">{followerCount}</span> followers</p>
            <p className="text-gray-400"><span className="text-white font-bold text-base">{followingCount}</span> following</p>
          </div>
          <div className="h-1 w-1 rounded-full bg-white/20 hidden sm:block" />
          <p className="text-gray-500 flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Joined {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
