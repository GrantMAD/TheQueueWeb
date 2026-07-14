import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Avatar({ className, src, alt, fallback, size = 'md', ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-24 w-24 text-2xl'
  }

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 ring-2 ring-black/20',
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/80 font-medium tracking-wide">
          {fallback?.substring(0, 2).toUpperCase() || '?'}
        </div>
      )}
    </div>
  )
}
