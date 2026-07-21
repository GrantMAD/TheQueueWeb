'use client'
import * as React from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from 'next-themes'
import type { UserProfile } from '@/types'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading } = useAuthStore()
  const { setTheme } = useTheme()
  const supabase = createClient()

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    const profileData = data as unknown as UserProfile | null

    setProfile(profileData)
    if (profileData?.theme_preference) {
      setTheme(profileData.theme_preference)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return <>{children}</>
}
