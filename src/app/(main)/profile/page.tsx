'use client'
import * as React from 'react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileLibrary } from '@/components/profile/ProfileLibrary'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { User, Settings } from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false)
  const [displayName, setDisplayName] = React.useState('My Profile')
  const [bio, setBio] = React.useState('')

  const mockUser = {
    id: '1',
    display_name: displayName,
    username: 'currentuser',
    bio,
    created_at: new Date().toISOString(),
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <ProfileHeader 
        user={mockUser} 
        followerCount={10} 
        followingCount={25} 
        isOwnProfile 
        onEdit={() => setIsEditing(true)} 
      />

      <div className="mt-12">
        <ProfileLibrary items={[]} isPublic={true} isFollower={true} isOwnProfile={true} />
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile">
        <div className="space-y-5">
          <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <User className="h-10 w-10 text-gray-500 mb-2" />
            <p className="text-sm text-gray-400">Click to upload avatar</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Display Name</label>
            <Input value={displayName} onChange={e => setDisplayName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
            />
          </div>
          <Button onClick={handleSave} className="w-full mt-4">Save Changes</Button>
        </div>
      </Modal>
    </div>
  )
}
