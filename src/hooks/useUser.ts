import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import { useEffect } from 'react'
import type { UserProfile } from '@/types'

export function useUser() {
  const supabase = createClient()
  const { session, user, setAuth } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, setAuth])

  // Fetch full profile data
  const { data: profile, isLoading } = useQuery<UserProfile | null>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (error) {
        // Profile may not exist yet or RLS policy missing — don't crash
        console.warn('Could not fetch profile:', error.message)
        return null
      }
      return data as unknown as UserProfile
    },
    enabled: !!user,
    retry: false, // Don't spam Supabase with retries on 403
  })

  return { session, user, profile, isLoading }
}
