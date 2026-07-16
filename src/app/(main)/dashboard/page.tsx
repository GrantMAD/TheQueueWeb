'use client'
import * as React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Activity, Clock, Vote } from 'lucide-react'

function SectionHeader({ title, icon: Icon }: { title: string, icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="h-7 w-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
        <Icon className="h-4 w-4 text-indigo-400" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-12 max-w-6xl mx-auto">
      {/* Welcome Hero */}
      <section>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Your Queue</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mb-6 leading-relaxed">
          Your personal hub for tracking everything you watch, read, and listen to — and sharing it with the people who matter.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Track your progress on any media
          </div>
          <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium">
            <Vote className="h-4 w-4" />
            Vote with groups on what to watch next
          </div>
          <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-sm font-medium">
            <Activity className="h-4 w-4" />
            Follow friends &amp; see what they're into
          </div>
        </div>
      </section>

      {/* Continue Watching / Reading */}
      <section>
        <SectionHeader title="Continue Where You Left Off" icon={Clock} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Skeleton placeholders until data loads */}
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-2xl" />
          ))}
        </div>
      </section>

      {/* Active Group Votes */}
      <section>
        <SectionHeader title="Active Votes in Your Groups" icon={Vote} />
        <Card className="border-dashed border-indigo-500/20 bg-indigo-500/5">
          <CardContent className="py-10 text-center">
            <Vote className="h-10 w-10 text-indigo-400/40 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No active voting rounds.</p>
            <p className="text-sm text-gray-600 mt-1">Join a group and start one!</p>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity Preview */}
      <section>
        <SectionHeader title="Recent Friend Activity" icon={Activity} />
        <Card className="border-dashed border-white/10 bg-white/[0.02]">
          <CardContent className="py-10 text-center">
            <Activity className="h-10 w-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No activity yet.</p>
            <p className="text-sm text-gray-600 mt-1">Follow some people to see their updates here.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
