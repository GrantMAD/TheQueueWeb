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
      // Votes table → invalidate voting state (Note: votes table doesn't have group_id, so we listen to all and invalidate, or we could filter if we joined, but Realtime doesn't support joins in filter. In a real app we'd filter by voting_round_id, but here we just invalidate when any vote happens in this group context)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'progress_updates', filter: `group_id=eq.${groupId}` }, () => {
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

