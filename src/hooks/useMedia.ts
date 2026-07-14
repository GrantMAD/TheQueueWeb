import { useQuery } from '@tanstack/react-query'

export function useMediaSearch(query: string, type: string = 'all') {
  return useQuery({
    queryKey: ['media', 'search', query, type],
    queryFn: async () => {
      if (!query) return []
      // Mock search results until API integration
      return []
    },
    enabled: query.length > 2,
    staleTime: 60 * 1000,
  })
}

export function useMediaItem(id: string) {
  return useQuery({
    queryKey: ['media', id],
    queryFn: async () => {
      // Mock single item until API integration
      return null
    },
    enabled: !!id,
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}
