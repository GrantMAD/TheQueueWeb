'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileLibrary } from '@/components/profile/ProfileLibrary'
import { useLibrary } from '@/hooks/useLibrary'
import { useFollowCounts } from '@/hooks/useFollows'
import { useUser } from '@/hooks/useUser'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, isLoading } = useUser()
  const { data: libraryItems, isLoading: libraryLoading } = useLibrary(profile?.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 gap-2">
        <p className="text-lg">Could not load profile.</p>
        <p className="text-sm">Please make sure you are signed in.</p>
      </div>
    )
  }

  const profileUser = {
    id: profile.id,
    display_name: profile.display_name || user.email?.split('@')[0] || 'User',
    username: profile.username || user.email?.split('@')[0] || 'user',
    avatar_url: profile.avatar_url ?? undefined,
    bio: profile.bio ?? undefined,
    created_at: user.created_at,
  }

  const { data: followCounts } = useFollowCounts(profileUser.id)

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <ProfileHeader 
        user={profileUser}
        email={user.email ?? undefined}
        followerCount={followCounts?.followers ?? 0} 
        followingCount={followCounts?.following ?? 0} 
        isOwnProfile 
        onEdit={() => router.push('/settings')} 
      />

      <div className="mt-12">
        <ProfileLibrary 
          items={libraryItems || []} 
          isLoading={libraryLoading}
          isPublic={true} 
          isFollower={true} 
          isOwnProfile={true} 
        />
      </div>
    </div>
  )
}
