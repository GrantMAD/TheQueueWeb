import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { MediaItem, MediaStatus } from '@/types'

export type LibraryItem = MediaItem & { 
  user_media_id: string
  status: MediaStatus
  personal_rating: number | null
  current_episode: number | null
  current_season: number | null
  current_page: number | null
  added_at: string
  updated_at: string 
}

export function useLibrary(userId?: string) {
  return useQuery({
    queryKey: ['library', userId],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_media')
        .select('*, media_item:media_items(*)')
        .eq('user_id', userId!)
      
      if (error) throw error

      return data.map((row: any) => {
        const item = row.media_item
        return {
          ...item,
          user_media_id: row.id,
          status: row.status,
          personal_rating: row.personal_rating,
          current_episode: row.current_episode,
          current_season: row.current_season,
          current_page: row.current_page,
          added_at: row.created_at,
          updated_at: row.updated_at
        } as LibraryItem
      })
    },
    enabled: !!userId,
  })
}

export function useLibraryItem(mediaExternalId: string, apiSource: string) {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['library', user?.id, 'item', mediaExternalId, apiSource],
    queryFn: async () => {
      if (!user) return null
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_media')
        .select('*, media_item:media_items(*)')
        .eq('user_id', user.id)
        .eq('media_item.external_id', mediaExternalId)
        .eq('media_item.api_source', apiSource)
        .single()
      
      if (error || !data) return null
      
      const dataAny = data as any
      const item = dataAny.media_item
      return {
        ...item,
        user_media_id: dataAny.id,
        status: dataAny.status,
        personal_rating: dataAny.personal_rating,
        current_episode: dataAny.current_episode,
        current_season: dataAny.current_season,
        current_page: dataAny.current_page,
        added_at: dataAny.created_at,
        updated_at: dataAny.updated_at
      } as LibraryItem
    },
    enabled: !!user && !!mediaExternalId,
  })
}

import { useAuthStore } from '@/store/authStore'

export function useLibraryMutations() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const addMutation = useMutation({
    mutationFn: async ({ mediaItem, status }: { mediaItem: MediaItem, status: MediaStatus }) => {
      if (!user) throw new Error("Not logged in")
      const supabase = createClient()
      
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
      const { data, error } = await supabase
        .from('user_media')
        .upsert({
          user_id: user.id,
          media_item_id: mediaDataAny.id,
          status,
          started_at: status === 'current' ? new Date().toISOString() : null,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        }, { onConflict: 'user_id, media_item_id' })
        
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, rating }: { id: string, status: MediaStatus, rating?: number }) => {
      const supabase = createClient()
      const updates: any = { status }
      if (rating !== undefined) updates.personal_rating = rating
      if (status === 'current') updates.started_at = new Date().toISOString()
      if (status === 'completed') updates.completed_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('user_media')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  })

  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, episode, season, page }: { id: string, episode?: number, season?: number, page?: number }) => {
      const supabase = createClient()
      const updates: any = {}
      if (episode !== undefined) updates.current_episode = episode
      if (season !== undefined) updates.current_season = season
      if (page !== undefined) updates.current_page = page

      const { data, error } = await supabase
        .from('user_media')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  })

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_media')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  })

  return { add: addMutation, updateStatus: updateStatusMutation, updateProgress: updateProgressMutation, remove: removeMutation }
}

