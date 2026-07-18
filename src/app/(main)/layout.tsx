'use client'
import * as React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { useUiStore } from '@/store/uiStore'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useUiStore()

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop / Tablet Sidebar */}
        <div className={`hidden md:flex shrink-0 border-r border-black/10 dark:border-white/10 transition-all duration-300 ${isSidebarCollapsed ? 'md:w-16' : 'md:w-64'}`}>
          <Sidebar />
        </div>

        {/* Mobile Sidebar (overlay) */}
        <div className="md:hidden">
          <Sidebar />
        </div>

        {/* Main content */}
        <main id="main-content" className="relative flex-1 overflow-y-auto pb-20 md:pb-0">
          {/* Ambient background blobs */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden>
            <div
              className="animate-blob absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-40 blur-3xl"
              style={{ background: 'var(--blob-1)' }}
            />
            <div
              className="animate-blob animation-delay-2000 absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
              style={{ background: 'var(--blob-2)' }}
            />
            <div
              className="animate-blob animation-delay-4000 absolute -bottom-32 left-1/3 w-[400px] h-[400px] rounded-full opacity-30 blur-3xl"
              style={{ background: 'var(--blob-3)' }}
            />
          </div>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
