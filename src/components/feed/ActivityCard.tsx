import * as React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Avatar } from '@/components/ui/Avatar'
import { Star, Eye, Heart, XCircle, PauseCircle, CheckCircle2, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ActivityData {
  activity_type: 'status_update' | 'review'
  actor_id: string
  username: string
  display_name: string
  avatar_url: string | null
  media_item_id: string
  media_title: string
  media_type: string
  media_cover_url: string | null
  status: string | null
  rating: number | null
  hook_text: string | null
  current_episode: number | null
  current_season: number | null
  occurred_at: string
}

// ── Activity config ──────────────────────────────────────────────────────────
type ActivityConfig = {
  label: string
  verb: (activity: ActivityData) => string
  Icon: React.ElementType
  barGradient: string   // left accent bar
  badgeBg: string       // pill bg
  badgeText: string     // pill text
  avatarRing: string    // avatar ring
  verbColor: string     // verb text colour
}

const STATUS_CONFIG: Record<string, ActivityConfig> = {
  completed: {
    label: 'Completed',
    verb: () => 'completed',
    Icon: CheckCircle2,
    barGradient: 'from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    avatarRing: 'ring-emerald-500/50',
    verbColor: 'text-emerald-600 dark:text-emerald-400',
  },
  current: {
    label: 'Watching',
    verb: (a) =>
      a.current_episode
        ? `watched S${a.current_season ?? 1}E${a.current_episode} of`
        : 'is currently watching',
    Icon: Eye,
    barGradient: 'from-indigo-500 to-purple-500',
    badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    avatarRing: 'ring-indigo-500/50',
    verbColor: 'text-indigo-600 dark:text-indigo-400',
  },
  want: {
    label: 'Wants to Watch',
    verb: () => 'wants to watch',
    Icon: Heart,
    barGradient: 'from-pink-500 to-rose-500',
    badgeBg: 'bg-pink-500/10 dark:bg-pink-500/15',
    badgeText: 'text-pink-600 dark:text-pink-400',
    avatarRing: 'ring-pink-500/50',
    verbColor: 'text-pink-600 dark:text-pink-400',
  },
  paused: {
    label: 'Paused',
    verb: () => 'paused',
    Icon: PauseCircle,
    barGradient: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/15',
    badgeText: 'text-amber-600 dark:text-amber-400',
    avatarRing: 'ring-amber-500/50',
    verbColor: 'text-amber-600 dark:text-amber-400',
  },
  dropped: {
    label: 'Dropped',
    verb: () => 'dropped',
    Icon: XCircle,
    barGradient: 'from-red-500 to-rose-600',
    badgeBg: 'bg-red-500/10 dark:bg-red-500/15',
    badgeText: 'text-red-600 dark:text-red-400',
    avatarRing: 'ring-red-500/50',
    verbColor: 'text-red-600 dark:text-red-400',
  },
}

const REVIEW_CONFIG: ActivityConfig = {
  label: 'Review',
  verb: () => 'reviewed',
  Icon: MessageSquare,
  barGradient: 'from-violet-500 to-purple-600',
  badgeBg: 'bg-violet-500/10 dark:bg-violet-500/15',
  badgeText: 'text-violet-600 dark:text-violet-400',
  avatarRing: 'ring-violet-500/50',
  verbColor: 'text-violet-600 dark:text-violet-400',
}

function getConfig(activity: ActivityData): ActivityConfig {
  if (activity.activity_type === 'review') return REVIEW_CONFIG
  return STATUS_CONFIG[activity.status ?? ''] ?? STATUS_CONFIG['current']
}

// ── Star rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, max = 10 }: { rating: number; max?: number }) {
  const stars = 5
  const filled = Math.round((rating / max) * stars * 2) / 2
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: stars }).map((_, i) => {
          const full = i + 1 <= filled
          const half = !full && i + 0.5 <= filled
          return (
            <span key={i} className="relative inline-block w-3.5 h-3.5">
              <Star className="w-3.5 h-3.5 text-gray-200 dark:text-white/10 fill-gray-200 dark:fill-white/10 absolute inset-0" />
              {(full || half) && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: full ? '100%' : '50%' }}>
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                </span>
              )}
            </span>
          )
        })}
      </div>
      <span className="text-yellow-500 dark:text-yellow-400 font-bold text-xs tabular-nums">{rating}</span>
      <span className="text-gray-400 dark:text-white/30 text-xs">/ {max}</span>
    </div>
  )
}

// ── Main card ────────────────────────────────────────────────────────────────
export function ActivityCard({ activity }: { activity: ActivityData }) {
  const cfg = getConfig(activity)
  const timeAgo = formatDistanceToNow(new Date(activity.occurred_at), { addSuffix: true })
  const StatusIcon = cfg.Icon
  const hasCover = !!activity.media_cover_url

  return (
    <div className={cn(
      'group relative flex gap-0 overflow-hidden rounded-2xl',
      // Light mode: white card with a light border and soft shadow
      'bg-white border border-gray-200/80 shadow-sm',
      // Dark mode: dark card
      'dark:bg-[#13131a] dark:border-white/[0.06] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]',
      // Hover
      'hover:border-gray-300 hover:shadow-md',
      'dark:hover:border-white/[0.12] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)]',
      'transition-all duration-300'
    )}>
      {/* Left accent bar */}
      <div className={cn('w-1 shrink-0 bg-gradient-to-b', cfg.barGradient)} />

      {/* Main content */}
      <div className="flex flex-1 gap-4 p-4 sm:p-5 min-w-0">

        {/* Avatar */}
        <Link href={`/profile/${activity.username}`} className="shrink-0 self-start mt-0.5">
          <div className={cn(
            'rounded-full ring-2 ring-offset-2 transition-transform duration-200 group-hover:scale-105',
            'ring-offset-white dark:ring-offset-[#13131a]',
            cfg.avatarRing
          )}>
            <Avatar
              src={activity.avatar_url || undefined}
              alt={activity.display_name || activity.username}
              fallback={(activity.display_name || activity.username || '?').charAt(0).toUpperCase()}
              size="md"
            />
          </div>
        </Link>

        {/* Text content */}
        <div className="flex-1 min-w-0">

          {/* Top row: name + badge + time */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              href={`/profile/${activity.username}`}
              className="font-bold text-gray-900 dark:text-white text-sm hover:opacity-75 transition-opacity"
            >
              {activity.display_name || activity.username}
            </Link>

            <span className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
              cfg.badgeBg, cfg.badgeText
            )}>
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </span>

            <span className="text-gray-400 dark:text-white/30 text-xs ml-auto shrink-0">{timeAgo}</span>
          </div>

          {/* Verb */}
          <p className={cn('text-xs mb-2 font-medium', cfg.verbColor)}>
            {cfg.verb(activity)}
          </p>

          {/* Media title */}
          <Link
            href={`/media/${activity.media_item_id}`}
            className="block font-extrabold text-base sm:text-lg text-gray-900 dark:text-white leading-tight line-clamp-1 mb-2 hover:opacity-75 transition-opacity"
          >
            {activity.media_title}
          </Link>

          {/* Rating */}
          {activity.rating != null && (
            <div className="mb-3">
              <StarRating rating={activity.rating} />
            </div>
          )}

          {/* Review quote */}
          {activity.hook_text && (
            <div className={cn(
              'rounded-xl px-4 py-3 border',
              // Light mode
              'bg-gray-50 border-gray-100 text-gray-500',
              // Dark mode
              'dark:bg-white/[0.04] dark:border-white/[0.06] dark:text-white/60',
              'text-sm leading-relaxed italic'
            )}>
              <MessageSquare className="w-3.5 h-3.5 inline-block mr-1.5 opacity-40 -mt-0.5" />
              "{activity.hook_text}"
            </div>
          )}
        </div>
      </div>

      {/* Cover thumbnail */}
      {hasCover && (
        <Link
          href={`/media/${activity.media_item_id}`}
          className="shrink-0 hidden sm:block self-stretch relative w-20 overflow-hidden"
        >
          <img
            src={activity.media_cover_url!}
            alt={activity.media_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Gradient fade blending into card */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent dark:from-[#13131a]/60 dark:via-transparent dark:to-transparent" />
        </Link>
      )}
    </div>
  )
}
