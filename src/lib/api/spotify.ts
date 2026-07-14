import { MediaItem } from '@/types'

export async function searchSpotify(query: string, type: 'podcast' | 'album'): Promise<MediaItem[]> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    console.warn('Spotify API keys are not set. Returning empty results.')
    return []
  }
  
  try {
    // Return empty until API key logic is active
    return []
  } catch (err) {
    console.error(err)
    return []
  }
}
