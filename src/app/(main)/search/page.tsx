'use client'
import * as React from 'react'
import { Input } from '@/components/ui/Input'
import { MediaGrid } from '@/components/media/MediaGrid'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Search, UserPlus } from 'lucide-react'

const searchTabs = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV', value: 'tv' },
  { label: 'Books', value: 'book' },
  { label: 'Anime', value: 'anime' },
  { label: 'People', value: 'users' },
]

export default function SearchPage() {
  const [query, setQuery] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('all')
  const isLoading = false
  const mediaResults: any[] = []
  const userResults: any[] = []

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-6">Search</h1>

      <div className="mb-6">
        <Input
          placeholder="Search for movies, books, people..."
          icon={<Search className="h-4 w-4" />}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="text-base h-14 rounded-full"
        />
      </div>

      <div className="mb-8 overflow-x-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} tabs={searchTabs} className="w-max min-w-full sm:w-full" />
      </div>

      {activeTab === 'users' ? (
        userResults.length === 0 ? (
          <div className="py-24 text-center text-gray-400">
            <UserPlus className="h-10 w-10 mx-auto mb-3 text-gray-600" />
            {query ? `No users found for "${query}"` : 'Search for people by username.'}
          </div>
        ) : (
          <div className="space-y-3">
            {userResults.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar_url} fallback={user.display_name} size="md" />
                  <div>
                    <p className="font-medium text-white">{user.display_name}</p>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" /> Follow
                </Button>
              </div>
            ))}
          </div>
        )
      ) : (
        <MediaGrid
          items={mediaResults}
          isLoading={isLoading}
          emptyMessage={query ? `No ${activeTab === 'all' ? 'results' : activeTab} found for "${query}"` : 'Start typing to search for anything.'}
        />
      )}
    </div>
  )
}
