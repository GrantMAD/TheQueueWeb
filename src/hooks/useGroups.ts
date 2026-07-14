import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useUserGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => []
  })
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: async () => null,
    enabled: !!id,
  })
}

export function useGroupMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: async (data: any) => {},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['groups'] }),
  })

  return { createGroup: createMutation }
}
