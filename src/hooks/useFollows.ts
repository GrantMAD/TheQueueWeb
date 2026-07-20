import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'

export function useFollowStatus(targetUserId: string) {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['follows', user?.id, targetUserId],
    queryFn: async () => {
      if (!user) return false
      const supabase = createClient()
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single()
        
      if (error && error.code !== 'PGRST116') throw error // PGRST116 is not found
      return !!data
    },
    enabled: !!user && !!targetUserId,
  })
}

export function useFollowMutations() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const supabase = createClient()

  const follow = useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('Not logged in')
      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: targetUserId })
      if (error) throw error
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: ['follows', user?.id, targetUserId] })
      queryClient.invalidateQueries({ queryKey: ['followers', targetUserId] })
      queryClient.invalidateQueries({ queryKey: ['following', user?.id] })
    },
  })

  const unfollow = useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('Not logged in')
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
      if (error) throw error
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: ['follows', user?.id, targetUserId] })
      queryClient.invalidateQueries({ queryKey: ['followers', targetUserId] })
      queryClient.invalidateQueries({ queryKey: ['following', user?.id] })
    },
  })

  return { follow, unfollow }
}

export function useFollowCounts(userId: string) {
  return useQuery({
    queryKey: ['follow-counts', userId],
    queryFn: async () => {
      const supabase = createClient()
      
      const [{ count: followers }, { count: following }] = await Promise.all([
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', userId),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', userId)
      ])
      
      return { followers: followers || 0, following: following || 0 }
    },
    enabled: !!userId,
  })
}
