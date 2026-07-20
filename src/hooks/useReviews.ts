'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  media_item_id: string
  user_id: string
  rating: number | null
  hook_text: string
  body_text: string | null
  is_spoiler: boolean
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  user?: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
  }
  user_has_liked?: boolean
}

export interface ReviewComment {
  id: string
  review_id: string
  user_id: string
  content: string
  created_at: string
  user?: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
  }
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetch all reviews for a given media_item DB id.
 */
export function useReviews(mediaItemId: string | undefined) {
  const { user } = useAuthStore()

  return useQuery<Review[]>({
    queryKey: ['reviews', mediaItemId, user?.id],
    queryFn: async () => {
      if (!mediaItemId) return []
      const supabase = createClient()

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:profiles(id, username, display_name, avatar_url)
        `)
        .eq('media_item_id', mediaItemId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // If logged in, fetch which reviews the current user has liked
      if (user && data && data.length > 0) {
        const reviewIds = data.map((r: any) => r.id)
        const { data: likes } = await supabase
          .from('review_likes')
          .select('review_id')
          .eq('user_id', user.id)
          .in('review_id', reviewIds)

        const likedSet = new Set((likes || []).map((l: any) => l.review_id))

        return (data as any[]).map(r => ({
          ...r,
          user_has_liked: likedSet.has(r.id),
        })) as Review[]
      }

      return (data as any[]) as Review[]
    },
    enabled: !!mediaItemId,
  })
}

/**
 * Fetch the current user's own review for a media item (used to know if they can edit/delete).
 */
export function useMyReview(mediaItemId: string | undefined) {
  const { user } = useAuthStore()

  return useQuery<Review | null>({
    queryKey: ['reviews', mediaItemId, 'mine', user?.id],
    queryFn: async () => {
      if (!mediaItemId || !user) return null
      const supabase = createClient()

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('media_item_id', mediaItemId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      return (data as any) as Review | null
    },
    enabled: !!mediaItemId && !!user,
  })
}

/**
 * Fetch comments for a given review.
 */
export function useReviewComments(reviewId: string | undefined) {
  return useQuery<ReviewComment[]>({
    queryKey: ['reviews', reviewId, 'comments'],
    queryFn: async () => {
      if (!reviewId) return []
      const supabase = createClient()

      const { data, error } = await supabase
        .from('review_comments')
        .select('*, user:profiles(id, username, display_name, avatar_url)')
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return (data as any[]) as ReviewComment[]
    },
    enabled: !!reviewId,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useReviewMutations() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const supabase = createClient()

  const createReview = useMutation({
    mutationFn: async ({
      mediaItemId,
      rating,
      hook_text,
      body_text,
      is_spoiler,
    }: {
      mediaItemId: string
      rating: number | null
      hook_text: string
      body_text?: string
      is_spoiler?: boolean
    }) => {
      if (!user) throw new Error('Not logged in')
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          media_item_id: mediaItemId,
          user_id: user.id,
          rating,
          hook_text,
          body_text: body_text || null,
          is_spoiler: is_spoiler || false,
        })
        .select()
        .single()
      if (error) throw error
      return data as any
    },
    onSuccess: (_, { mediaItemId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', mediaItemId] })
    },
  })

  const updateReview = useMutation({
    mutationFn: async ({
      reviewId,
      mediaItemId,
      rating,
      hook_text,
      body_text,
      is_spoiler,
    }: {
      reviewId: string
      mediaItemId: string
      rating: number | null
      hook_text: string
      body_text?: string
      is_spoiler?: boolean
    }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating,
          hook_text,
          body_text: body_text || null,
          is_spoiler: is_spoiler || false,
        })
        .eq('id', reviewId)
        .select()
        .single()
      if (error) throw error
      return data as any
    },
    onSuccess: (_, { mediaItemId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', mediaItemId] })
    },
  })

  const deleteReview = useMutation({
    mutationFn: async ({
      reviewId,
      mediaItemId,
    }: {
      reviewId: string
      mediaItemId: string
    }) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
      if (error) throw error
    },
    onSuccess: (_, { mediaItemId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', mediaItemId] })
    },
  })

  const likeReview = useMutation({
    mutationFn: async ({
      reviewId,
      mediaItemId,
      liked,
    }: {
      reviewId: string
      mediaItemId: string
      liked: boolean
    }) => {
      if (!user) throw new Error('Not logged in')
      if (liked) {
        // Unlike
        const { error } = await supabase
          .from('review_likes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', user.id)
        if (error) throw error
      } else {
        // Like
        const { error } = await supabase
          .from('review_likes')
          .insert({ review_id: reviewId, user_id: user.id })
        if (error) throw error
      }
    },
    onSuccess: (_, { mediaItemId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', mediaItemId] })
    },
  })

  const addComment = useMutation({
    mutationFn: async ({
      reviewId,
      content,
    }: {
      reviewId: string
      content: string
    }) => {
      if (!user) throw new Error('Not logged in')
      const { data, error } = await supabase
        .from('review_comments')
        .insert({ review_id: reviewId, user_id: user.id, content })
        .select()
        .single()
      if (error) throw error
      return data as any
    },
    onSuccess: (_, { reviewId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', reviewId, 'comments'] })
    },
  })

  const deleteComment = useMutation({
    mutationFn: async ({
      commentId,
      reviewId,
    }: {
      commentId: string
      reviewId: string
    }) => {
      const { error } = await supabase
        .from('review_comments')
        .delete()
        .eq('id', commentId)
      if (error) throw error
    },
    onSuccess: (_, { reviewId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', reviewId, 'comments'] })
    },
  })

  return {
    createReview,
    updateReview,
    deleteReview,
    likeReview,
    addComment,
    deleteComment,
  }
}
