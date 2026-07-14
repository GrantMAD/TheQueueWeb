import { MediaItem, MediaType } from '@/types'
import { searchTMDB } from './tmdb'
import { searchOpenLibrary } from './openLibrary'
import { searchAniList } from './anilist'
import { searchSpotify } from './spotify'

export async function searchMedia(query: string, typeFilter?: MediaType): Promise<MediaItem[]> {
  if (!query) return []

  let results: MediaItem[] = []

  if (!typeFilter || typeFilter === 'movie' || typeFilter === 'tv') {
    const typeToSearch = typeFilter === 'movie' || typeFilter === 'tv' ? typeFilter : 'movie'
    const tmdbResults = await searchTMDB(query, typeToSearch)
    results = [...results, ...tmdbResults]
  }

  if (!typeFilter || typeFilter === 'book') {
    const bookResults = await searchOpenLibrary(query)
    results = [...results, ...bookResults]
  }

  if (!typeFilter || typeFilter === 'anime') {
    const animeResults = await searchAniList(query)
    results = [...results, ...animeResults]
  }

  if (typeFilter === 'podcast' || typeFilter === 'album') {
    const spotifyResults = await searchSpotify(query, typeFilter)
    results = [...results, ...spotifyResults]
  }

  return results
}
