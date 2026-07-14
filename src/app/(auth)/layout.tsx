import * as React from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-purple-600/20 to-pink-600/10 blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-2xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
            <span className="font-black text-white text-lg">Q</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">The Queue</span>
        </Link>

        {/* Hero Text */}
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 leading-tight mb-6">
            Your media,<br />your people.
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-md">
            Track every movie, show, book, and anime. Share what you love with the people you trust. No algorithm, no noise.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-4">
            {[
              'Unified library across all media types',
              'Activity feed from friends, not strangers',
              'Group watch-lists and voting rounds',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-gray-400">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span className="text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-600 relative z-10">
          © {new Date().getFullYear()} The Queue. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 relative">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/30">
            <span className="font-black text-white text-sm">Q</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">The Queue</span>
        </Link>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
