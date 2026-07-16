'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import { createClient } from '@/lib/supabase/client'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const { user } = useAuthStore()
  const { addToast } = useUiStore()
  const supabase = createClient()

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-9 rounded-full bg-white/10 dark:bg-black/10 animate-pulse" />
  }

  const handleToggle = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    if (user) {
      const { error } = await supabase.from('profiles').update({ theme_preference: newTheme }).eq('id', user.id)
      if (!error) {
        addToast({ type: 'success', message: `Theme changed to ${newTheme} mode` })
      } else {
        addToast({ type: 'error', message: 'Failed to save theme preference' })
      }
    } else {
      addToast({ type: 'success', message: `Theme changed to ${newTheme} mode` })
    }
  }

  return (
    <button
      onClick={handleToggle}
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 scale-100 dark:scale-0 transition-transform duration-200" />
      <Moon className="absolute h-5 w-5 scale-0 dark:scale-100 transition-transform duration-200" />
    </button>
  )
}
