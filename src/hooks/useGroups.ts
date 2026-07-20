import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { MediaItem } from '@/types'

export function useUserGroups() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['groups', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('group_members')
        .select('role, joined_at, groups(*)')
        .eq('user_id', user.id)

      if (error) throw error
      
      return data.map((row: any) => ({
        ...row.groups,
        my_role: row.role,
        joined_at: row.joined_at
      }))
    },
    enabled: !!user?.id
  })
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single()
        
      if (error) throw error
      return data as any
    },
    enabled: !!id,
  })
}

export function useGroupMembers(groupId: string) {
  return useQuery({
    queryKey: ['groups', groupId, 'members'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('group_members')
        .select('role, joined_at, user:profiles(id, username, display_name, avatar_url)')
        .eq('group_id', groupId)
        
      if (error) throw error
      return data.map((row: any) => ({
        id: row.user.id,
        user: row.user,
        role: row.role,
        joined_at: row.joined_at
      }))
    },
    enabled: !!groupId,
  })
}

export function useGroupPool(groupId: string) {
  return useQuery({
    queryKey: ['groups', groupId, 'pool'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('group_media_pool')
        .select('id, added_by, media_item:media_items(*)')
        .eq('group_id', groupId)
        
      if (error) throw error
      return data as any
    },
    enabled: !!groupId,
  })
}

export function useGroupInvites(groupId: string) {
  return useQuery({
    queryKey: ['groups', groupId, 'invites'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('group_invites')
        .select('id, status, user:profiles!invited_user_id(id, username, display_name, avatar_url)')
        .eq('group_id', groupId)
        .neq('status', 'accepted')
        
      if (error) throw error
      return data.map((row: any) => ({
        id: row.id,
        status: row.status,
        user: row.user
      }))
    },
    enabled: !!groupId,
  })
}

export function useGroupHistory(groupId: string) {
  return useQuery({
    queryKey: ['groups', groupId, 'history'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('voting_rounds')
        .select('id, ended_at, winning_pool_item_id, pool_item:group_media_pool(media_item:media_items(*))')
        .eq('group_id', groupId)
        .eq('status', 'completed')
        .not('winning_pool_item_id', 'is', null)
        .order('ended_at', { ascending: false })
        
      if (error) throw error
      return data.map((row: any) => ({
        id: row.id,
        decided_at: row.ended_at,
        media_item: row.pool_item?.media_item,
        vote_count: 0 // Could fetch this from votes table if needed
      }))
    },
    enabled: !!groupId,
  })
}

export function useProgressFeed(groupId: string) {
  return useQuery({
    queryKey: ['groups', groupId, 'progress'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('progress_updates')
        .select(`
          id,
          created_at,
          current_season,
          current_episode,
          current_page,
          note,
          user:profiles(id, username, display_name, avatar_url),
          media_item:media_items(id, title, type, cover_url)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return (data as any[]) || []
    },
    enabled: !!groupId,
  })
}

export function usePublicGroups() {
  return useQuery({
    queryKey: ['groups', 'public'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('type', 'public')
        .order('created_at', { ascending: false })
        .limit(20)
        
      if (error) throw error
      return data as any
    }
  })
}

export function useGroupMutations() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const supabase = createClient()

  const createGroup = useMutation({
    mutationFn: async (groupData: any) => {
      if (!user) throw new Error("Not logged in")
      const { data, error } = await supabase
        .from('groups')
        .insert({
          ...groupData,
          owner_id: user.id
        })
        .select('id')
        .single()
      if (error) throw error
      return data as any
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })

  const updateGroup = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { data: updated, error } = await supabase
        .from('groups')
        .update(data)
        .eq('id', id)
      if (error) throw error
      return updated
    },
    onSuccess: (_, { id }) => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })

  const deleteGroup = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('groups').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })

  const joinGroup = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error("Not logged in")
      const { error } = await supabase
        .from('group_members')
        .insert({ group_id: groupId, user_id: user.id, role: 'member' })
      if (error) throw error
    },
    onSuccess: (_, groupId) => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })

  const leaveGroup = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error("Not logged in")
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id)
      if (error) throw error
    },
    onSuccess: (_, groupId) => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })

  const kickMember = useMutation({
    mutationFn: async ({ groupId, memberId }: { groupId: string, memberId: string }) => {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', memberId)
      if (error) throw error
    },
    onSuccess: (_, { groupId }) => queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'members'] }),
  })

  const sendInvite = useMutation({
    mutationFn: async ({ groupId, username }: { groupId: string, username: string }) => {
      if (!user) throw new Error("Not logged in")
      // Lookup user
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()
      if (profileErr) throw new Error("User not found")
      
      const profileAny = profile as any
      const { error } = await supabase
        .from('group_invites')
        .insert({ group_id: groupId, invited_by: user.id, invited_user_id: profileAny.id })
      if (error) throw error
    },
    onSuccess: (_, { groupId }) => queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'invites'] }),
  })

  const cancelInvite = useMutation({
    mutationFn: async ({ inviteId }: { inviteId: string }) => {
      const { error } = await supabase.from('group_invites').delete().eq('id', inviteId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })

  const acceptInvite = useMutation({
    mutationFn: async ({ inviteId }: { inviteId: string }) => {
      const { error } = await supabase.from('group_invites').update({ status: 'accepted' }).eq('id', inviteId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })

  const declineInvite = useMutation({
    mutationFn: async ({ inviteId }: { inviteId: string }) => {
      const { error } = await supabase.from('group_invites').update({ status: 'declined' }).eq('id', inviteId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })

  const addToPool = useMutation({
    mutationFn: async ({ groupId, mediaItem }: { groupId: string, mediaItem: MediaItem }) => {
      if (!user) throw new Error("Not logged in")
      // Upsert media
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_items')
        .upsert({
          external_id: mediaItem.external_id,
          api_source: mediaItem.api_source,
          type: mediaItem.type,
          title: mediaItem.title,
          cover_url: mediaItem.cover_url,
          release_year: mediaItem.release_year,
          description: mediaItem.description,
          genres: mediaItem.genres,
          metadata: mediaItem.metadata || {}
        }, { onConflict: 'external_id, api_source' })
        .select('id')
        .single()
      if (mediaError) throw mediaError

      const mediaDataAny = mediaData as any
      // Insert pool
      const { error } = await supabase
        .from('group_media_pool')
        .insert({ group_id: groupId, media_item_id: mediaDataAny.id, added_by: user.id })
      if (error) throw error
    },
    onSuccess: (_, { groupId }) => queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'pool'] }),
  })

  const removeFromPool = useMutation({
    mutationFn: async ({ poolItemId }: { poolItemId: string }) => {
      const { error } = await supabase.from('group_media_pool').delete().eq('id', poolItemId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })

  return { 
    createGroup, updateGroup, deleteGroup, joinGroup, leaveGroup, 
    kickMember, sendInvite, cancelInvite, acceptInvite, declineInvite,
    addToPool, removeFromPool
  }
}
