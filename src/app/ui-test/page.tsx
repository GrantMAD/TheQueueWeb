'use client'
import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { ToastContainer } from '@/components/ui/Toast'
import { useUiStore } from '@/store/uiStore'
import { Search } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { MediaCard } from '@/components/media/MediaCard'
import { MediaGrid } from '@/components/media/MediaGrid'
import { MediaSearch } from '@/components/media/MediaSearch'
import { MediaDetail } from '@/components/media/MediaDetail'
import { AddToLibraryButton } from '@/components/media/AddToLibraryButton'
import { ProgressTracker } from '@/components/media/ProgressTracker'
import { MediaItem } from '@/types'

const mockMovie: MediaItem = {
  id: 'm1',
  external_id: '123',
  api_source: 'tmdb',
  type: 'movie',
  title: 'Dune: Part Two',
  description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
  cover_url: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1pdfLvkbY9ohJlCjQH2JGqqUT1e.jpg',
  release_year: 2024,
  genres: ['Science Fiction', 'Adventure'],
  metadata: { runtime: 166 }
}

const mockBook: MediaItem = {
  id: 'b1',
  external_id: '456',
  api_source: 'openlibrary',
  type: 'book',
  title: 'The Way of Kings',
  description: 'An epic fantasy novel by Brandon Sanderson.',
  release_year: 2010,
  genres: ['Fantasy'],
  metadata: { page_count: 1007 }
}

export default function UITestPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [tabValue, setTabValue] = React.useState('1')
  const { addToast } = useUiStore()
  
  const [libraryStatus, setLibraryStatus] = React.useState<any>('want')
  const [progress, setProgress] = React.useState(250)

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 pb-24 md:pb-8">
          <div className="mx-auto max-w-5xl space-y-12">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-8">UI Primitive Kitchen Sink</h1>
              
              <section className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Buttons</h2>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="primary">Primary Gradiant</Button>
                  <Button variant="secondary">Secondary Glass</Button>
                  <Button variant="ghost">Ghost Hover</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="primary" isLoading>Loading State</Button>
                </div>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Inputs</h2>
                <div className="max-w-md space-y-4">
                  <Input placeholder="Standard input..." />
                  <Input placeholder="Search with icon..." icon={<Search className="h-4 w-4" />} />
                  <Input placeholder="Error state..." error="This field is required." />
                </div>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Badges & Avatars</h2>
                <div className="flex flex-wrap gap-4 items-center mb-4">
                  <Badge variant="want">Want</Badge>
                  <Badge variant="current">Watching</Badge>
                  <Badge variant="completed">Completed</Badge>
                  <Badge variant="dropped">Dropped</Badge>
                  <Badge variant="paused">Paused</Badge>
                  <Badge variant="default">Default</Badge>
                </div>
                <div className="flex gap-4 items-end">
                  <Avatar size="sm" fallback="SM" />
                  <Avatar size="md" fallback="MD" />
                  <Avatar size="lg" fallback="LG" />
                  <Avatar size="xl" fallback="XL" src="https://i.pravatar.cc/150" />
                </div>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Interactive (Modals & Toasts & Tabs)</h2>
                <div className="flex gap-4 mb-6">
                  <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                  <Button variant="secondary" onClick={() => addToast({ type: 'success', message: 'Action completed successfully!' })}>Trigger Success Toast</Button>
                  <Button variant="destructive" onClick={() => addToast({ type: 'error', message: 'Something went terribly wrong!' })}>Trigger Error Toast</Button>
                </div>
                
                <div className="max-w-md">
                  <Tabs 
                    value={tabValue} 
                    onValueChange={setTabValue}
                    tabs={[
                      { label: 'Overview', value: '1' },
                      { label: 'Reviews', value: '2' },
                      { label: 'Cast', value: '3' },
                    ]} 
                  />
                  <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400">
                    Active tab content: {tabValue}
                  </div>
                </div>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Cards & Skeletons</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card isClickable>
                    <CardHeader>
                      <CardTitle>Interactive Glass Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                      This card uses backdrop-blur, subtle borders, and micro-animations on hover to feel premium and engaging.
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Loading Skeleton</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex gap-3 pt-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
              <section className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold border-b border-white/10 pb-2 pt-8 text-indigo-400">Media Components</h2>
                
                <h3 className="text-lg font-medium mb-4 mt-8">Media Search (Debounced + Inline Results)</h3>
                <MediaSearch onSearch={(q) => console.log('Searching', q)} />

                <h3 className="text-lg font-medium mb-4 mt-12">Media Detail View</h3>
                <div className="bg-black/20 p-6 rounded-3xl border border-white/5">
                  <MediaDetail 
                    item={mockMovie} 
                    userStatus={libraryStatus} 
                  />
                </div>

                <h3 className="text-lg font-medium mb-4 mt-12">Add To Library & Progress</h3>
                <div className="flex flex-wrap gap-6 items-start">
                  <AddToLibraryButton currentStatus={libraryStatus} onUpdate={setLibraryStatus} />
                  <ProgressTracker label="Page" current={progress} total={1007} onUpdate={setProgress} />
                </div>

                <h3 className="text-lg font-medium mb-4 mt-12">Media Grid & Cards</h3>
                <MediaGrid 
                  items={[mockMovie, mockBook, { ...mockMovie, id: 'm2', title: 'Loading...', cover_url: undefined }]} 
                />
              </section>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
      <ToastContainer />
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Premium Modal Experience">
        <p className="mb-6">Notice the smooth zoom-in fade animation and the blurred glass backdrop. Fully accessible and focus trapped.</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setIsModalOpen(false)}>Confirm Action</Button>
        </div>
      </Modal>
    </div>
  )
}
