'use client'
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { useUiStore } from '@/store/uiStore'
import { Home, Library, Compass, Users, User, X, ChevronLeft, ChevronRight } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Feed', icon: Home },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, setSidebarOpen, isSidebarCollapsed, toggleSidebarCollapsed } = useUiStore()

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 border-r border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/80 backdrop-blur-xl transition-all duration-300 ease-in-out md:static md:bg-transparent dark:md:bg-transparent flex flex-col relative",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isSidebarCollapsed ? "md:w-16" : "md:w-64",
          "w-64"
        )}
      >
        {/* Collapse toggle — desktop only, floats on the right edge near the top */}
        <button
          onClick={toggleSidebarCollapsed}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex absolute -right-3.5 top-6 z-10 h-7 w-7 items-center justify-center rounded-full border border-black/10 dark:border-white/20 bg-white dark:bg-[#111] shadow-md text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-400/50 transition-all duration-200"
        >
          {isSidebarCollapsed
            ? <ChevronRight className="h-3.5 w-3.5" />
            : <ChevronLeft className="h-3.5 w-3.5" />
          }
        </button>

        {/* Mobile header */}
        <div className="flex h-16 items-center justify-between px-6 md:hidden">
          <span className="font-bold text-gray-900 dark:text-white">Menu</span>
          <button aria-label="Close menu" onClick={() => setSidebarOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-3 mt-4 md:mt-8 flex-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) || (pathname === '/' && item.href === '/dashboard')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 relative group",
                  isSidebarCollapsed ? "md:justify-center md:px-0" : "",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-8 after:w-1 after:rounded-r-full after:bg-indigo-500"
                    : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500")} />
                <span className={cn("transition-all duration-200 overflow-hidden whitespace-nowrap", isSidebarCollapsed ? "md:hidden" : "")}>
                  {item.label}
                </span>

                {/* Tooltip when collapsed */}
                {isSidebarCollapsed && (
                  <span className="hidden md:block absolute left-full ml-4 px-2.5 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-lg z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
