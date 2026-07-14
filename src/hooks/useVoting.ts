import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useVoting(groupId: string) {
  const queryClient = useQueryClient()

  const activeRoundQuery = useQuery({
    queryKey: ['voting', groupId, 'active'],
    queryFn: async () => null,
    enabled: !!groupId,
  })

  const voteMutation = useMutation({
    mutationFn: async (poolItemId: string) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voting', groupId] })
    }
  })

  return { activeRound: activeRoundQuery, vote: voteMutation }
}
