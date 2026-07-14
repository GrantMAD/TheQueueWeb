import * as React from 'react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileLibrary } from '@/components/profile/ProfileLibrary'
import type { Metadata } from 'next'

interface Props { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return { title: `@${username} | Profile` }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params

  const mockUser = {
    id: '2',
    display_name: 'John Doe',
    username,
    bio: 'Avid watcher of things.',
    created_at: '2025-01-01T00:00:00Z',
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <ProfileHeader 
        user={mockUser} 
        followerCount={105} 
        followingCount={42} 
        isOwnProfile={false}
        isFollowing={false}
        onFollow={() => {}}
      />

      <div className="mt-12">
        {/* If user is private and we aren't following, the component will handle showing the locked state */}
        <ProfileLibrary items={[]} isPublic={true} isFollower={false} isOwnProfile={false} />
      </div>
    </div>
  )
}
