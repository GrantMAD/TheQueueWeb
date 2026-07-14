import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useLibrary(userId?: string) {
  return useQuery({
    queryKey: ['library', userId],
    queryFn: async () => {
      return []
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
