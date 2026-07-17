'use client'
import * as React from 'react'
import { MediaGrid } from '@/components/media/MediaGrid'
import { Tabs } from '@/components/ui/Tabs'
import { Lock } from 'lucide-react'

interface ProfileLibraryProps {
  items: any[]
  isPublic: boolean
  isFollower: boolean
  isOwnProfile: boolean
  isLoading?: boolean
}

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Watching', value: 'current' },
  { label: 'Want', value: 'want' },
  { label: 'Completed', value: 'completed' },
]

export function ProfileLibrary({ items, isPublic, isFollower, isOwnProfile, isLoading }: ProfileLibraryProps) {
  const [activeTab, setActiveTab] = React.useState('all')

  const canView = isOwnProfile || isPublic || isFollower

  if (!canView) {
    return (
      <div className="py-32 text-center border border-dashed border-white/10 rounded-2xl bg-black/20">
        <Lock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">This library is private</h2>
        <p className="text-gray-400">Follow this user to see what they are watching.</p>
      </div>
    )
  }

  const filteredItems = React.useMemo(() => {
    if (activeTab === 'all') return items
    return items.filter(item => item.status === activeTab)
  }, [items, activeTab])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Library</h2>
      </div>

      <div className="mb-8 overflow-x-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} tabs={statusTabs} className="w-max min-w-full sm:w-full" />
      </div>

      <MediaGrid 
        items={filteredItems} 
        isLoading={isLoading} 
        emptyMessage={`No media items in "${statusTabs.find(t => t.value === activeTab)?.label}".`} 
      />
    </div>
  )
}
