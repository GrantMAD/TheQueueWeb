'use client'
import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface ProgressTrackerProps {
  label: string
  current: number
  total?: number
  onUpdate: (val: number) => void
}

export function ProgressTracker({ label, current, total, onUpdate }: ProgressTrackerProps) {
  const [val, setVal] = React.useState(current.toString())

  React.useEffect(() => {
    setVal(current.toString())
  }, [current])

  const handleBlur = () => {
    let num = parseInt(val)
    if (isNaN(num)) num = current
    if (num < 0) num = 0
    if (total && num > total) num = total
    setVal(num.toString())
    if (num !== current) onUpdate(num)
  }

  const handleIncrement = () => {
    const next = total ? Math.min(total, current + 1) : current + 1
    onUpdate(next)
  }

  const handleDecrement = () => {
    const next = Math.max(0, current - 1)
    onUpdate(next)
  }

  return (
    <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/10 p-2.5 rounded-xl shadow-lg w-fit">
      <div className="text-sm font-semibold text-indigo-300 pl-2 uppercase tracking-wider">{label}</div>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleDecrement}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="relative">
          <input 
            className="w-16 h-9 rounded-lg bg-black/50 border border-white/10 text-center text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={handleBlur}
          />
        </div>
        <span className="text-gray-500 font-mono text-sm px-1">/ {total || '?'}</span>
        <button 
          onClick={handleIncrement}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
