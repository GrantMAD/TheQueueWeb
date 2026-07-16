import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <p className="text-[8rem] md:text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-indigo-400/80 to-transparent select-none">
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 -mt-4">This page doesn't exist</h1>
        <p className="text-gray-400 mb-10 max-w-sm">
          Looks like you wandered off the beaten path. Let's get you back to your Queue.
        </p>
        <Link href="/">
          <Button variant="secondary" className="gap-2">
            <Home className="h-4 w-4" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}
