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
        <main id="main-content" className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
