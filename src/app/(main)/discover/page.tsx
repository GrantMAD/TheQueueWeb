'use client'
import * as React from 'react'
import { MediaSearch } from '@/components/media/MediaSearch'
import { MediaGrid } from '@/components/media/MediaGrid'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Users, Compass } from 'lucide-react'

export default function DiscoverPage() {
  const isLoadingGroups = false
  const publicGroups: any[] = []

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-2">Discover</h1>
      <p className="text-gray-400 mb-10">Find public groups to join and trending media across The Queue.</p>

      {/* Global Media Search */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Compass className="h-5 w-5 text-indigo-400" /> Search All Media
        </h2>
        <MediaSearch onSearch={() => {}} />
      </section>

      {/* Public Groups */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-400" /> Public Groups
        </h2>

        {isLoadingGroups ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-36 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : publicGroups.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-white/[0.02]">
            <CardContent className="py-16 text-center">
              <Users className="h-10 w-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No public groups found.</p>
              <p className="text-sm text-gray-600 mt-1">Be the first to create one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {publicGroups.map((group: any) => (
              <Card key={group.id} isClickable>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white truncate">{group.name}</h3>
                    <Badge variant="default" className="shrink-0 ml-2">Public</Badge>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">{group.description}</p>
                  <p className="text-xs text-gray-500">{group.member_count} members</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
