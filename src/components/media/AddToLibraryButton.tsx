'use client'
import * as React from 'react'
import { Plus, Check, ChevronDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { MediaStatus } from '@/types'

interface AddToLibraryButtonProps {
  currentStatus?: MediaStatus
  onUpdate: (status: MediaStatus) => void
  isLoading?: boolean
}

export function AddToLibraryButton({ currentStatus, onUpdate, isLoading }: AddToLibraryButtonProps) {
  const statuses: { label: string, value: MediaStatus }[] = [
    { label: 'Want to Experience', value: 'want' },
    { label: 'Currently Experiencing', value: 'current' },
    { label: 'Completed', value: 'completed' },
    { label: 'Paused', value: 'paused' },
    { label: 'Dropped', value: 'dropped' },
  ]

  const currentLabel = statuses.find(s => s.value === currentStatus)?.label

  return (
    <Dropdown 
      align="left"
      trigger={
        <Button variant={currentStatus ? "secondary" : "primary"} className="w-full sm:w-auto flex justify-between gap-3 shadow-xl">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : currentStatus ? (
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> {currentLabel}</span>
          ) : (
            <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Add to Library</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      }
    >
      <div className="p-1 space-y-1">
        {statuses.map(status => (
          <DropdownItem 
            key={status.value} 
            onClick={() => onUpdate(status.value)}
            className={currentStatus === status.value ? "bg-indigo-500/20 text-indigo-300 font-medium" : ""}
          >
            {status.label}
          </DropdownItem>
        ))}
      </div>
    </Dropdown>
  )
}
