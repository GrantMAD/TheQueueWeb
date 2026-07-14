'use client'
import * as React from 'react'
import { GroupSettings } from '@/components/groups/GroupSettings'
import { useParams } from 'next/navigation'

export default function GroupSettingsPage() {
  const params = useParams()
  const id = params.id as string

  const mockGroup = {
    id,
    name: 'My Group',
    description: '',
    type: 'public' as const,
    voting_enabled: true,
    voting_duration_hours: 48,
    votes_per_member: 3,
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-extrabold text-white mb-8">Group Settings</h1>
      <GroupSettings
        group={mockGroup}
        members={[]}
        onSave={(data) => console.log('save', data)}
        onKick={(id) => console.log('kick', id)}
        onDelete={() => console.log('delete')}
      />
    </div>
  )
}
