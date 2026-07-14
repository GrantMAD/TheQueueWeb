import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isClickable?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, isClickable, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-300',
          isClickable && 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer hover:bg-white/5 hover:border-white/20',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pb-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-xl font-semibold tracking-tight text-white', className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0 text-gray-300', className)} {...props} />
}
