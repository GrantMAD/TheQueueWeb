import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'

export function useRealtime(groupId?: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    if (!groupId) return

    const channel = supabase.channel(`group:${groupId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes', filter: `group_id=eq.${groupId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['voting', groupId] })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId, queryClient, supabase])
}
