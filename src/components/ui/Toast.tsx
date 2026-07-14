'use client'
import * as React from 'react'
import { useUiStore } from '@/store/uiStore'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function ToastContainer() {
  const { toasts, removeToast } = useUiStore()

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ id, type, message, onClose }: { id: string; type: string; message: string; onClose: () => void }) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400" />
  }

  return (
    <div className="pointer-events-auto relative mt-4 flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border border-white/10 bg-gray-900/90 backdrop-blur-xl p-4 shadow-2xl transition-all animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-3">
        {icons[type as keyof typeof icons]}
        <p className="text-sm font-medium text-white">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="rounded-md p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
