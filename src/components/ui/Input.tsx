import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors pointer-events-none">
            {icon}
          </div>
        )}
        <input

          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/80 dark:focus:bg-white/10',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
