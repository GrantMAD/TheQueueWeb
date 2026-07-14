'use client'
import * as React from 'react'
import { Search, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { MediaItem, MediaType } from '@/types'

interface MediaSearchProps {
  onSearch: (query: string, type?: MediaType) => void
  results?: MediaItem[]
  isLoading?: boolean
  onResultClick?: (item: MediaItem) => void
}

export function MediaSearch({ onSearch, results = [], isLoading, onResultClick }: MediaSearchProps) {
  const [query, setQuery] = React.useState('')
  const [activeType, setActiveType] = React.useState<MediaType | undefined>(undefined)
  const [isOpen, setIsOpen] = React.useState(false)

  const containerRef = React.useRef<HTMLDivElement>(null)

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query, activeType)
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, activeType, onSearch])

  // Click outside to close
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const types: { label: string, value: MediaType }[] = [
    { label: 'Movies', value: 'movie' },
    { label: 'TV', value: 'tv' },
    { label: 'Books', value: 'book' },
    { label: 'Anime', value: 'anime' },
    { label: 'Podcasts', value: 'podcast' },
  ]

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={containerRef}>
      <div className="relative">
        <Input 
          placeholder="Search for anything..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin text-indigo-400" /> : <Search className="h-4 w-4" />}
          className="h-14 text-base rounded-full pl-12 pr-12 bg-black/40 backdrop-blur-xl border-white/20 shadow-lg"
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <button onClick={() => setActiveType(undefined)}>
          <Badge variant={!activeType ? 'want' : 'default'} className="cursor-pointer px-4 py-1.5 text-sm">All</Badge>
        </button>
        {types.map(t => (
          <button key={t.value} onClick={() => setActiveType(t.value)}>
            <Badge variant={activeType === t.value ? 'want' : 'default'} className="cursor-pointer px-4 py-1.5 text-sm">{t.label}</Badge>
          </button>
        ))}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-4 w-full rounded-2xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {isLoading ? (
             <div className="p-8 flex items-center justify-center gap-3 text-sm text-indigo-300 font-medium">
               <Loader2 className="h-5 w-5 animate-spin" />
               Searching the universe...
             </div>
          ) : results.length > 0 ? (
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.map((item, idx) => (
                <button
                  key={`${item.external_id}-${idx}`}
                  onClick={() => {
                    setIsOpen(false)
                    onResultClick?.(item)
                  }}
                  className="flex w-full items-center gap-4 rounded-xl p-3 hover:bg-white/10 transition-colors text-left"
                >
                  <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md bg-white/5 border border-white/10 shadow-sm">
                    {item.cover_url ? (
                      <img src={item.cover_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                       <div className="h-full w-full flex items-center justify-center text-gray-500"><Search className="h-4 w-4" /></div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium text-white text-base">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-indigo-300 capitalize px-2 py-0.5 rounded bg-indigo-500/20">{item.type}</span>
                      {item.release_year && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-gray-600" />
                          <span className="text-xs text-gray-400">{item.release_year}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-gray-400">No results found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  )
}
