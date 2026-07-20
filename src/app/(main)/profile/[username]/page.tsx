'use client'
import * as React from 'react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileLibrary } from '@/components/profile/ProfileLibrary'
import { useParams, useRouter } from 'next/navigation'
import { useProfileByUsername, useUser } from '@/hooks/useUser'
import { useLibrary } from '@/hooks/useLibrary'
import { useFollowStatus, useFollowCounts, useFollowMutations } from '@/hooks/useFollows'
import { Skeleton } from '@/components/ui/Skeleton'

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const router = useRouter()
  
  const { user } = useUser()
  const { data: profile, isLoading } = useProfileByUsername(username)
  
  const isOwnProfile = user?.id === profile?.id
  if (isOwnProfile) {
    router.push('/profile')
  }

  const { data: libraryItems, isLoading: libraryLoading } = useLibrary(profile?.id)
  const { data: isFollowing } = useFollowStatus(profile?.id ?? '')
  const { data: followCounts } = useFollowCounts(profile?.id ?? '')
  const { follow, unfollow } = useFollowMutations()

  if (isLoading) {
    return <div className="p-8 max-w-6xl mx-auto"><Skeleton className="h-64 w-full rounded-2xl" /></div>
  }

  if (!profile) {
    return <div className="p-8 text-center text-gray-400">User not found.</div>
  }

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollow.mutate(profile.id)
    } else {
      follow.mutate(profile.id)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <ProfileHeader 
        user={profile} 
        followerCount={followCounts?.followers ?? 0} 
        followingCount={followCounts?.following ?? 0} 
        isOwnProfile={false}
        isFollowing={isFollowing ?? false}
        onFollow={handleFollowToggle}
        isLoading={follow.isPending || unfollow.isPending}
      />

      <div className="mt-12">
        <ProfileLibrary 
          items={libraryItems || []} 
          isLoading={libraryLoading}
          isPublic={!profile.is_private} 
          isFollower={isFollowing ?? false} 
          isOwnProfile={false} 
        />
      </div>
    </div>
  )
}

