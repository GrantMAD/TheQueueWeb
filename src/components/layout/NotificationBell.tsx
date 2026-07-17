'use client'
import * as React from 'react'
import { Bell } from 'lucide-react'
import { Dropdown } from '@/components/ui/Dropdown'
import Link from 'next/link'

export function NotificationBell() {
  const unreadCount = 0 // Mock data for now

  return (
    <Dropdown 
      trigger={
        <button aria-label="Notifications" className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-black animate-pulse" />
          )}
        </button>
      }
    >
      <div className="p-3 pb-2 border-b border-white/10">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h4>
      </div>
      <div className="flex flex-col max-h-80 overflow-y-auto p-1">
        <div className="p-4 text-sm text-gray-400 text-center">
          You're all caught up!
        </div>
      </div>
      <div className="border-t border-white/10 p-2 text-center">
        <Link href="/notifications" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
          View All
        </Link>
      </div>
    </Dropdown>
  )
}
