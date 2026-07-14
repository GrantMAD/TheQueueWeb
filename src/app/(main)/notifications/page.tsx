import * as React from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Notifications' }

export default function NotificationsPage() {
  const isLoading = false
  const notifications: any[] = []

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-white">Notifications</h1>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" className="gap-2 text-indigo-400 hover:text-indigo-300">
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border border-white/10 rounded-2xl bg-black/20">
          <Bell className="h-12 w-12 text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">You're all caught up!</h2>
          <p className="text-gray-400 max-w-xs">New follower alerts, group invites, and vote results will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n: any) => (
            <div key={n.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors cursor-pointer ${n.is_read ? 'border-white/5 bg-black/20 hover:bg-white/5' : 'border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10'}`}>
              <Bell className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-200">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.is_read && <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-2 animate-pulse" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
