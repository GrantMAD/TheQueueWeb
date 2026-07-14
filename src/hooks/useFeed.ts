import { useInfiniteQuery } from '@tanstack/react-query'

export function useFeed(filters: { mediaType: string, activityType: string }) {
  return useInfiniteQuery({
    queryKey: ['feed', filters],
    queryFn: async ({ pageParam = 0 }) => {
      return { data: [], nextCursor: null }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    staleTime: 30 * 1000,
  })
}
