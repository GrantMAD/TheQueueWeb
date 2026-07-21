import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
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

export function useProfileByUsername(username: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['profile', 'by-username', username],
    queryFn: async () => {
      if (!username) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()
      if (error) throw error
      return data as any
    },
    enabled: !!username
  })
}

export function useUserSearch(query: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: async () => {
      if (!query || query.trim() === '') return []
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(20)
        
      if (error) throw error
      return data as any[]
    },
    enabled: !!query && query.trim() !== ''
  })
}
