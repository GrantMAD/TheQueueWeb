import { Database } from './database'

export type MediaType = Database['public']['Enums']['media_type']
export type MediaStatus = Database['public']['Enums']['media_status']

export interface MediaItem {
  id?: string
  external_id: string
  api_source: 'tmdb' | 'openlibrary' | 'anilist' | 'spotify'
  type: MediaType
  title: string
  cover_url?: string | null
  release_year?: number | null
  description?: string | null
  genres?: string[]
  metadata?: any
}
