'use client'
import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          "relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-gray-900/90 backdrop-blur-xl shadow-2xl p-6 m-4 animate-in zoom-in-95 fade-in duration-200",
          className
        )}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        {title && (
          <h2 className="text-xl font-semibold text-white mb-6 pr-8">{title}</h2>
        )}
        
        <div className="text-gray-300">
          {children}
        </div>
      </div>
    </div>
  )
}
