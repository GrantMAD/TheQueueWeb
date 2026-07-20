import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useMediaSearch(query: string, type?: string) {
  return useQuery({
    queryKey: ['media', 'search', query, type],
    queryFn: async () => {
      if (!query || query.length < 3) return []
      
      const supabase = createClient()
      
      let q = supabase
        .from('media_items')
        .select('*')
        .ilike('title', `%${query}%`)
        
      if (type && type !== 'all') {
        q = q.eq('type', type)
      }
        
      const { data, error } = await q.limit(20)
      
      if (error) throw error
      return data as any || []
    },
    enabled: query.length > 2,
    staleTime: 60 * 1000,
  })
}

export function useMediaItem(id: string) {
  return useQuery({
    queryKey: ['media', id],
    queryFn: async () => {
      if (!id) return null
      const supabase = createClient()
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .eq('id', id)
        .single()
        
      if (error) throw error
      return data
    },
    enabled: !!id,
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}
