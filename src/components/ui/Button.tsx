import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:pointer-events-none active:scale-95'
    
    const variants = {
      primary: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-white/10',
      secondary: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30',
      ghost: 'hover:bg-white/10 text-gray-300 hover:text-white',
      destructive: 'bg-red-500/80 text-white hover:bg-red-600 backdrop-blur-md border border-red-500/50'
    }

    const sizes = {
      sm: 'h-8 px-4 text-xs',
      md: 'h-10 px-6 text-sm',
      lg: 'h-12 px-8 text-base'
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
