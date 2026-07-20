import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'

export function useRealtime(groupId?: string) {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const supabase = createClient()

  // Group-scoped channels
  useEffect(() => {
    if (!groupId) return

    const channel = supabase
      .channel(`group:${groupId}:realtime`)
      // Votes table → invalidate voting state
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes', filter: `group_id=eq.${groupId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['voting', groupId] })
      })
      // Media pool → invalidate pool query
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_media_pool', filter: `group_id=eq.${groupId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'pool'] })
      })
      // Voting rounds → invalidate active round
      .on('postgres_changes', { event: '*', schema: 'public', table: 'voting_rounds', filter: `group_id=eq.${groupId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['voting', groupId] })
        queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'history'] })
      })
      // Progress updates → invalidate progress feed
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_media' }, () => {
        queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'progress'] })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [groupId, queryClient, supabase])

  // User-scoped notification channel
  useEffect(() => {
    if (!user?.id) return

    const notifChannel = supabase
      .channel(`user:${user.id}:notifications`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] })
      })
      .subscribe()

    return () => { supabase.removeChannel(notifChannel) }
  }, [user?.id, queryClient, supabase])
}

