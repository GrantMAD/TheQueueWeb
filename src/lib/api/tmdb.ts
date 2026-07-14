import { MediaItem } from '@/types'

export async function searchTMDB(query: string, type: 'movie' | 'tv'): Promise<MediaItem[]> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    console.warn('TMDB_API_KEY is not set. Returning empty results.')
    return []
  }
  
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('Failed to fetch from TMDB')
    const data = await res.json()
    
    return data.results.map((item: any) => ({
      external_id: item.id.toString(),
      api_source: 'tmdb',
      type: type,
      title: item.title || item.name,
      cover_url: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      release_year: item.release_date ? parseInt(item.release_date.split('-')[0]) : (item.first_air_date ? parseInt(item.first_air_date.split('-')[0]) : null),
      description: item.overview,
      metadata: {
        popularity: item.popularity
      }
    }))
  } catch (err) {
    console.error(err)
    return []
  }
}
