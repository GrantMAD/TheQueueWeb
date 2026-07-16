import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Users, Lock, Globe } from 'lucide-react'

interface GroupCardProps {
  id: string
  name: string
  description?: string
  coverUrl?: string
  memberCount: number
  type: 'public' | 'private'
  isMember?: boolean
  onJoin?: () => void
}

export function GroupCard({ id, name, description, coverUrl, memberCount, type, isMember, onJoin }: GroupCardProps) {
  const TypeIcon = type === 'private' ? Lock : Globe

  return (
    <Card isClickable className="overflow-hidden">
      {/* Cover image */}
      <div className="h-28 relative overflow-hidden bg-gradient-to-br from-indigo-900/50 to-purple-900/50">
        {coverUrl ? (
          <img src={coverUrl} alt={name} className="h-full w-full object-cover opacity-70" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Users className="h-10 w-10 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge variant="default" className="bg-black/50 backdrop-blur-md border-white/20 gap-1">
            <TypeIcon className="h-3 w-3" />
            {type === 'private' ? 'Private' : 'Public'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white truncate mb-1">{name}</h3>
        {description && <p className="text-sm text-gray-400 line-clamp-2 mb-3">{description}</p>}
        
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="h-3.5 w-3.5" />
            {memberCount} member{memberCount !== 1 ? 's' : ''}
          </span>
          {isMember ? (
            <Link href={`/groups/${id}`}>
              <Button size="sm" variant="secondary">View</Button>
            </Link>
          ) : (
            <Button size="sm" onClick={onJoin}>Join</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
