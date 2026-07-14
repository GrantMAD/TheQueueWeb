'use client'
import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
  tabs: { label: string; value: string }[]
}

export function Tabs({ className, value, onValueChange, tabs, ...props }: TabsProps) {
  return (
    <div 
      className={cn("flex space-x-1 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-1", className)} 
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = value === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              "relative flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 outline-none",
              isActive 
                ? "bg-white/15 text-white shadow-sm" 
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
