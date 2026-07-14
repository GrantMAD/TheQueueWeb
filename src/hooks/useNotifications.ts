import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useNotifications() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => [],
  })

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  return { notifications: query, markRead: markReadMutation }
}
