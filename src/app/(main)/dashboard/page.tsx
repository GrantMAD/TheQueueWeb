'use client'
import * as React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Card, CardContent } from '@/components/ui/Card'
import { MediaSearch } from '@/components/media/MediaSearch'
import { Badge } from '@/components/ui/Badge'
import { Activity, Clock, Vote } from 'lucide-react'

function SectionHeader({ title, icon: Icon }: { title: string, icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="h-7 w-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
        <Icon className="h-4 w-4 text-indigo-400" />
      </div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-12 max-w-6xl mx-auto">
      {/* Welcome + Search */}
      <section>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Your Queue</h1>
        <p className="text-gray-400 mb-8">What are you adding today?</p>
        <MediaSearch onSearch={() => {}} />
      </section>

      {/* Continue Watching / Reading */}
      <section>
        <SectionHeader title="Continue Where You Left Off" icon={Clock} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
