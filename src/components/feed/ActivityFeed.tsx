'use client'
import * as React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Users } from 'lucide-react'
import { ActivityCard } from './ActivityCard'

interface ActivityFeedProps {
  items: any[];
  isLoading: boolean;
}

export function ActivityFeed({ items, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border border-white/10 rounded-2xl bg-black/20">
        <Users className="h-12 w-12 text-gray-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nothing here yet</h2>
        <p className="text-gray-400 max-w-xs">Follow some people and their activity will show up right here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {items.map((activity: any) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  )
}
