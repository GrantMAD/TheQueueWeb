'use client'
import * as React from 'react'
import Link from 'next/link'
import { Search, Menu } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { Avatar } from '@/components/ui/Avatar'
import { NotificationBell } from '@/components/layout/NotificationBell'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { toggleSidebar } = useUiStore()
  const { user, profile } = useAuthStore()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/50 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="md:hidden text-gray-300 hover:text-white">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white">Q</span>
            </div>
            <span className="hidden font-bold tracking-tight text-white sm:inline-block">The Queue</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden w-full max-w-sm relative md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search movies, books, anime..."
              className="block w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
          </div>

          {user ? (
            <Dropdown
              trigger={<Avatar src={profile?.avatar_url} fallback={profile?.display_name || user.email} />}
            >
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-sm font-medium text-white">{profile?.display_name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
              <DropdownItem onClick={() => router.push('/profile')}>Profile</DropdownItem>
              <DropdownItem onClick={() => router.push('/settings')}>Settings</DropdownItem>
              <DropdownItem onClick={handleSignOut} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">Sign out</DropdownItem>
            </Dropdown>
          ) : (
            <Link href="/login" className="text-sm font-medium text-white hover:text-indigo-400 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
