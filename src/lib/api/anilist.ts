import { MediaItem } from '@/types'

export async function searchAniList(query: string): Promise<MediaItem[]> {
  const graphqlQuery = `
    query ($search: String) {
      Page (page: 1, perPage: 10) {
        media (search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          seasonYear
          description
          episodes
          genres
        }
      }
    }
  `

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { search: query }
      })
    })
    
    if (!res.ok) throw new Error('Failed to fetch from AniList')
    const data = await res.json()
    
    return data.data.Page.media.map((item: any) => ({
      external_id: item.id.toString(),
      api_source: 'anilist',
      type: 'anime',
      title: item.title.english || item.title.romaji,
      cover_url: item.coverImage?.large || null,
      release_year: item.seasonYear || null,
      description: item.description?.replace(/<[^>]*>?/gm, ''), // strip html tags
      genres: item.genres,
      metadata: {
        episodes: item.episodes
      }
    }))
  } catch (err) {
    console.error(err)
    return []
  }
}
