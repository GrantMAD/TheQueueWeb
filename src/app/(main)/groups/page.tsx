import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { GroupCard } from '@/components/groups/GroupCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Plus, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Groups' }

export default function GroupsPage() {
  const isLoading = false
  const groups: any[] = []

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">My Groups</h1>
          <p className="text-gray-400">All the groups you belong to.</p>
        </div>
        <Link href="/groups/create">
          <Button className="gap-2 shadow-lg shadow-indigo-500/20">
            <Plus className="h-4 w-4" /> Create Group
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-2xl bg-black/20">
          <Users className="h-12 w-12 text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No groups yet</h2>
          <p className="text-gray-400 max-w-sm mb-6">Create your own or discover public groups from the Discover page.</p>
          <Link href="/groups/create">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Create Your First Group</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {groups.map((g: any) => (
            <GroupCard key={g.id} {...g} isMember />
          ))}
        </div>
      )}
    </div>
  )
}
