import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUser'

export function useUserGroups() {
  const { user } = useUser()

  return useQuery({
    queryKey: ['groups', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('group_members')
        .select('role, joined_at, groups(*)')
        .eq('user_id', user.id)

      if (error) throw error
      
      return data.map((row: any) => ({
        ...row.groups,
        my_role: row.role,
        joined_at: row.joined_at
      }))
    },
    enabled: !!user?.id
  })
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single()
        
      if (error) throw error
      return data
    },
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
