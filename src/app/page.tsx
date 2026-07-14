import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Library, Users, Star, Tv, Book, Headphones } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Queue — Your media, your people',
}

const features = [
  { icon: Library, title: 'One Library, All Formats', description: 'Movies, TV, books, anime — tracked uniformly in one beautiful library.' },
  { icon: Users, title: 'Activity from People You Trust', description: 'A chronological feed of your friends\' updates. No algorithm, no strangers.' },
  { icon: Star, title: 'Reviews That Actually Say Something', description: 'Rate out of 10 and write a punchy 280-character hook. Keep it honest.' },
  { icon: Tv, title: 'Group Watch-Lists & Voting', description: 'Can\'t agree on what to watch next? Put it to a vote. The Queue decides.' },
]

const mediaTypes = [
  { icon: Tv, label: 'Movies & TV' },
  { icon: Book, label: 'Books' },
  { icon: Star, label: 'Anime' },
  { icon: Headphones, label: 'Podcasts' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/30">
              <span className="font-black text-white text-sm">Q</span>
            </div>
            <span className="text-xl font-bold tracking-tight">The Queue</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 md:py-40 text-center">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-purple-600/15 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400">
            ✨ Track everything. Share it with who matters.
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Your media.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Your people.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-400 leading-relaxed mb-10">
            The Queue is the only place to track every movie, show, book, and anime in one library — and share it with the people you actually trust.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-500/25 gap-2">
                Start for free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign in
              </Button>
            </Link>
          </div>

          {/* Media type pills */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {mediaTypes.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400">
                <Icon className="h-4 w-4 text-indigo-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Everything you need, nothing you don't.</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Built for people who care deeply about what they watch and read — and who they share it with.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-8 transition-all duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/5 hover:-translate-y-1 shadow-lg">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 group-hover:shadow-lg group-hover:shadow-indigo-500/10 transition-shadow">
                  <Icon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
            Ready to build your Queue?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">Join today. It's free.</p>
          <Link href="/register">
            <Button size="lg" className="shadow-xl shadow-indigo-500/25 gap-2">
              Create your account <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} The Queue. Built with ♥</p>
      </footer>
    </div>
  )
}
