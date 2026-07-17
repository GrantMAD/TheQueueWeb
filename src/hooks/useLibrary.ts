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

export function useLibraryMutations() {
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: async (data: any) => {},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  })

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  })

  return { add: addMutation, updateStatus: updateStatusMutation, remove: removeMutation }
}
