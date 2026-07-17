'use client'
import * as React from 'react'
import { Tabs } from '@/components/ui/Tabs'
import { MediaGrid } from '@/components/media/MediaGrid'
import { Input } from '@/components/ui/Input'
import { Search, ArrowDownAZ, Star, CalendarDays } from 'lucide-react'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { ChevronDown } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { useLibrary } from '@/hooks/useLibrary'

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Watching', value: 'current' },
  { label: 'Want', value: 'want' },
  { label: 'Completed', value: 'completed' },
  { label: 'Paused', value: 'paused' },
  { label: 'Dropped', value: 'dropped' },
]

const sortOptions = [
  { label: 'Date Added', value: 'date', icon: CalendarDays },
  { label: 'My Rating', value: 'rating', icon: Star },
  { label: 'Title A–Z', value: 'title', icon: ArrowDownAZ },
]

export default function LibraryPage() {
  const { user } = useUser()
  const { data: libraryItems, isLoading } = useLibrary(user?.id)

  const [activeTab, setActiveTab] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sortBy, setSortBy] = React.useState('date')

  const activeSort = sortOptions.find(s => s.value === sortBy)!

  const filteredAndSortedItems = React.useMemo(() => {
    let items = libraryItems || []

    // Filter by status tab
    if (activeTab !== 'all') {
      items = items.filter(item => item.status === activeTab)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(item => item.title.toLowerCase().includes(q))
    }

    // Sort
    return items.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      if (sortBy === 'rating') {
        return (b.personal_rating || 0) - (a.personal_rating || 0)
      }
      // default: date added (newest first)
      return new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
    })
  }, [libraryItems, activeTab, searchQuery, sortBy])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">My Library</h1>
          <p className="text-gray-400">Everything you've added to your Queue.</p>
        </div>
        <Dropdown 
          trigger={
            <Button variant="secondary" className="gap-2">
              <activeSort.icon className="h-4 w-4" />
              {activeSort.label}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          }
        >
          {sortOptions.map(opt => (
            <DropdownItem key={opt.value} onClick={() => setSortBy(opt.value)} className={sortBy === opt.value ? 'text-indigo-300 bg-indigo-500/10' : ''}>
              <opt.icon className="h-4 w-4 mr-2 inline" /> {opt.label}
            </DropdownItem>
          ))}
        </Dropdown>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input 
          placeholder="Filter your library..."
          icon={<Search className="h-4 w-4" />}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tabs */}
      <div className="mb-8 overflow-x-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} tabs={statusTabs} className="w-max min-w-full sm:w-full" />
      </div>

      {/* Grid */}
      <MediaGrid 
        items={filteredAndSortedItems}
        isLoading={isLoading}
        emptyMessage={activeTab === 'all' 
          ? "Your library is empty. Search for something and add it!" 
          : `Nothing in your "${statusTabs.find(t => t.value === activeTab)?.label}" list yet.`
        }
      />
    </div>
  )
}
