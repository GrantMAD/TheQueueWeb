import { MediaItem } from '@/types'

export async function searchOpenLibrary(query: string): Promise<MediaItem[]> {
  try {
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`)
    if (!res.ok) throw new Error('Failed to fetch from OpenLibrary')
    const data = await res.json()
    
    return data.docs.map((item: any) => ({
      external_id: item.key,
      api_source: 'openlibrary',
      type: 'book',
      title: item.title,
      cover_url: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : null,
      release_year: item.first_publish_year || null,
      description: item.author_name ? `Author: ${item.author_name.join(', ')}` : null,
      metadata: {
        author: item.author_name || [],
        page_count: item.number_of_pages_median
      }
    }))
  } catch (err) {
    console.error(err)
    return []
  }
}
