'use client'
import * as React from 'react'
import { Bell } from 'lucide-react'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import Link from 'next/link'
import { useNotifications } from '@/hooks/useNotifications'

export function NotificationBell() {
  const { notifications, unreadCount, markRead } = useNotifications()
  const recent = (notifications.data ?? []).slice(0, 5)

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
      <div className="p-3 pb-2 border-b border-white/10 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h4>
        {unreadCount > 0 && (
          <span className="text-xs text-indigo-400 font-medium">{unreadCount} unread</span>
        )}
      </div>
      <div className="flex flex-col max-h-80 overflow-y-auto">
        {recent.length === 0 ? (
          <div className="p-4 text-sm text-gray-400 text-center">You're all caught up!</div>
        ) : (
          recent.map((n: any) => (
            <DropdownItem
              key={n.id}
              onClick={() => !n.is_read && markRead.mutate(n.id)}
              className={`p-3 ${!n.is_read ? 'bg-indigo-500/5' : ''}`}
            >
              <div className="flex items-start gap-2">
                {!n.is_read && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />}
                <p className={`text-xs leading-relaxed ${n.is_read ? 'text-gray-400' : 'text-gray-200'}`}>{n.message}</p>
              </div>
            </DropdownItem>
          ))
        )}
      </div>
      <div className="border-t border-white/10 p-2 text-center">
        <Link href="/notifications" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
          View All
        </Link>
      </div>
    </Dropdown>
  )
}

