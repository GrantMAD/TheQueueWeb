import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'

export function useVoting(groupId: string) {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const supabase = createClient()

  // Fetch the active voting round for this group
  const activeRoundQuery = useQuery({
    queryKey: ['voting', groupId, 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voting_rounds')
        .select('*')
        .eq('group_id', groupId)
        .eq('status', 'active')
        .maybeSingle()
      if (error) throw error
      return data as any
    },
    enabled: !!groupId,
  })

  // Fetch the current user's votes in the active round
  const userVotesQuery = useQuery({
    queryKey: ['voting', groupId, 'user-votes', activeRoundQuery.data?.id, user?.id],
    queryFn: async () => {
      if (!user || !activeRoundQuery.data?.id) return []
      const { data, error } = await supabase
        .from('votes')
        .select('group_media_pool_id')
        .eq('voting_round_id', activeRoundQuery.data.id)
        .eq('user_id', user.id)
      if (error) throw error
      return (data || []).map((v: any) => v.group_media_pool_id as string)
    },
    enabled: !!user && !!activeRoundQuery.data?.id,
  })

  // Start a new voting round (owner only)
  const createRoundMutation = useMutation({
    mutationFn: async ({ durationHours }: { durationHours: number }) => {
      if (!user) throw new Error('Not logged in')
      const ends_at = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString()
      const { data, error } = await supabase
        .from('voting_rounds')
        .insert({ group_id: groupId, created_by: user.id, status: 'active', ends_at })
        .select()
        .single()
      if (error) throw error
      return data as any
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['voting', groupId] }),
  })

  // Cast a vote on a pool item
  const voteMutation = useMutation({
    mutationFn: async (poolItemId: string) => {
      if (!user || !activeRoundQuery.data?.id) throw new Error('No active round')
      const { error } = await supabase
        .from('votes')
        .insert({ voting_round_id: activeRoundQuery.data.id, user_id: user.id, group_media_pool_id: poolItemId })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['voting', groupId] }),
  })

  // Retract a vote from a pool item
  const retractMutation = useMutation({
    mutationFn: async (poolItemId: string) => {
      if (!user || !activeRoundQuery.data?.id) throw new Error('No active round')
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('voting_round_id', activeRoundQuery.data.id)
        .eq('user_id', user.id)
        .eq('group_media_pool_id', poolItemId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['voting', groupId] }),
  })

  // End the round (owner only) — invokes deployed Edge Function
  const endRoundMutation = useMutation({
    mutationFn: async () => {
      if (!activeRoundQuery.data?.id) throw new Error('No active round')
      const { error } = await supabase.functions.invoke('complete-voting-round', {
        body: { roundId: activeRoundQuery.data.id },
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voting', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'history'] })
    },
  })

  return {
    activeRound: activeRoundQuery,
    userVoteIds: userVotesQuery.data ?? [],
    createRound: createRoundMutation,
    vote: voteMutation,
    retract: retractMutation,
    endRound: endRoundMutation,
  }
}

export function useAllActiveVotes(groupIds: string[]) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['voting', 'active-all', groupIds],
    queryFn: async () => {
      if (!groupIds || groupIds.length === 0) return []
      const { data, error } = await supabase
        .from('voting_rounds')
        .select(`
          *,
          groups (
            id,
            name
          )
        `)
        .in('group_id', groupIds)
        .eq('status', 'active')
        .order('ends_at', { ascending: true })

      if (error) throw error
      return data as any[]
    },
    enabled: groupIds.length > 0,
  })
}

