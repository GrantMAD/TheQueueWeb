'use client'
import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Home, Library, Users, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Feed', icon: Home },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl md:hidden pb-safe">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href) || (pathname === '/' && item.href === '/dashboard')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200",
              isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
