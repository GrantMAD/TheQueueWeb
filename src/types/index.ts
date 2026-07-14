export * from './database'
export * from './media'

export interface UserProfile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  is_public: boolean
  followers_count: number
  following_count: number
}
