import { useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUser'

export function useFeed(filters?: { mediaType?: string, activityType?: string }) {
  const { user } = useUser()

  return useInfiniteQuery({
    queryKey: ['feed', user?.id, filters],
    queryFn: async ({ pageParam = 0 }) => {
      if (!user?.id) return { data: [], nextCursor: null }

      const supabase = createClient()
      const { data, error } = await supabase.rpc('get_friend_feed', {
        p_user_id: user.id,
        p_limit: 10,
        p_offset: pageParam as number
      })

      if (error) throw error

      // Filter locally if needed, since the RPC doesn't currently take filters
      let filteredData = data || []
      if (filters?.mediaType && filters.mediaType !== 'all') {
        filteredData = filteredData.filter((item: any) => item.media_type === filters.mediaType)
      }
      if (filters?.activityType && filters.activityType !== 'all') {
        filteredData = filteredData.filter((item: any) => item.activity_type === filters.activityType)
      }

      return {
        data: filteredData,
        nextCursor: data && data.length === 10 ? (pageParam as number) + 10 : null
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  })
}
