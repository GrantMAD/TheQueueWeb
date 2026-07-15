'use client'
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { useUiStore } from '@/store/uiStore'
import { Home, Library, Compass, Users, User, X } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Feed', icon: Home },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, setSidebarOpen } = useUiStore()

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
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/80 backdrop-blur-xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:bg-transparent dark:md:bg-transparent",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 md:hidden">
          <span className="font-bold text-gray-900 dark:text-white">Menu</span>
          <button aria-label="Close menu" onClick={() => setSidebarOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4 mt-4 md:mt-0">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) || (pathname === '/' && item.href === '/dashboard')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  "md:justify-center lg:justify-start",
                  isActive 
                    ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 relative after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-8 after:w-1 after:rounded-r-full after:bg-indigo-500" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
                )}
                title={item.label}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500")} />
                <span className="md:hidden lg:block">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
