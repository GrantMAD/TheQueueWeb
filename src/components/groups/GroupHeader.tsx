'use client'
import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Users, Settings, Vote, Lock, Globe } from 'lucide-react'

interface GroupHeaderProps {
  id: string
  name: string
  description?: string
  coverUrl?: string
  memberCount: number
  type: 'public' | 'private'
  isOwner?: boolean
  votingEnabled?: boolean
  onStartVote?: () => void
}

export function GroupHeader({ id, name, description, coverUrl, memberCount, type, isOwner, votingEnabled, onStartVote }: GroupHeaderProps) {
  const TypeIcon = type === 'private' ? Lock : Globe

  return (
    <div className="relative w-full">
      {/* Banner */}
      <div className="h-48 md:h-64 w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-black">
        {coverUrl ? (
          <img src={coverUrl} alt={name} className="h-full w-full object-cover opacity-50" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="bg-black/50 backdrop-blur-md border-white/20 gap-1 text-xs">
                <TypeIcon className="h-3 w-3" />
                {type === 'private' ? 'Private' : 'Public'}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white drop-shadow-lg">{name}</h1>
            {description && <p className="text-gray-300 mt-1 max-w-2xl text-sm">{description}</p>}
            <p className="flex items-center gap-1.5 text-sm text-gray-400 mt-2">
              <Users className="h-4 w-4" />
              {memberCount} member{memberCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isOwner && votingEnabled && (
              <Button onClick={onStartVote} size="sm" className="gap-2 shadow-lg">
                <Vote className="h-4 w-4" /> Start Vote
              </Button>
            )}
            {isOwner && (
              <Link href={`/groups/${id}/settings`}>
                <Button variant="secondary" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
