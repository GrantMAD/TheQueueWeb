'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileLibrary } from '@/components/profile/ProfileLibrary'

export default function ProfilePage() {
  const router = useRouter()
  // Mock data for now
  const [displayName, setDisplayName] = React.useState('My Profile')
  const [bio, setBio] = React.useState('')

  const mockUser = {
    id: '1',
    display_name: displayName,
    username: 'currentuser',
    bio,
    created_at: new Date().toISOString(),
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <ProfileHeader 
        user={mockUser} 
        followerCount={10} 
        followingCount={25} 
        isOwnProfile 
        onEdit={() => router.push('/settings')} 
      />

      <div className="mt-12">
        <ProfileLibrary items={[]} isPublic={true} isFollower={true} isOwnProfile={true} />
      </div>
    </div>
  )
}
