import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'want' | 'current' | 'completed' | 'dropped' | 'paused'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white border-white/20',
    want: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    current: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    dropped: 'bg-red-500/20 text-red-400 border-red-500/30',
    paused: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
