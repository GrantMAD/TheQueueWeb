'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ImageIcon, Users, Lock, Globe, Vote, Clock } from 'lucide-react'
import { useGroupMutations } from '@/hooks/useGroups'

export default function CreateGroupPage() {
  const router = useRouter()
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [type, setType] = React.useState<'public' | 'private'>('public')
  const [votingEnabled, setVotingEnabled] = React.useState(true)
  const [votingDuration, setVotingDuration] = React.useState(48)
  const [votesPerMember, setVotesPerMember] = React.useState(3)
  const { createGroup } = useGroupMutations()

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createGroup.mutate({
      name,
      description,
      type,
      voting_enabled: votingEnabled,
      voting_duration_hours: votingDuration,
      votes_per_member: votesPerMember
    }, {
      onSuccess: (data) => {
        router.push(`/groups/${data.id}`)
      }
    })
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Create a Group</h1>
      <p className="text-gray-400 mb-10">Set up your shared watchlist and start collaborating.</p>

      <form onSubmit={handleCreate} className="space-y-8">
        {/* Cover image placeholder */}
        <div className="h-40 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors group">
          <ImageIcon className="h-8 w-8 text-gray-500 group-hover:text-indigo-400 transition-colors" />
          <p className="text-sm text-gray-500 group-hover:text-gray-300">Click to upload cover image</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Group Name <span className="text-red-400">*</span></label>
            <Input placeholder="Movie Night Crew" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What's this group about?"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Group Type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'public', icon: Globe, label: 'Public', desc: 'Anyone can discover and join' },
              { value: 'private', icon: Lock, label: 'Private', desc: 'Join by invite only' },
            ].map(opt => (
              <button key={opt.value} type="button" onClick={() => setType(opt.value as any)}
                className={`p-4 rounded-2xl border text-left transition-all ${type === opt.value ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                <opt.icon className={`h-5 w-5 mb-2 ${type === opt.value ? 'text-indigo-400' : 'text-gray-500'}`} />
                <p className={`font-medium text-sm ${type === opt.value ? 'text-white' : 'text-gray-300'}`}>{opt.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Voting Settings */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-indigo-400" />
              <p className="font-medium text-white">Enable Voting</p>
            </div>
            <button type="button" onClick={() => setVotingEnabled(!votingEnabled)}
              className={`relative h-6 w-11 rounded-full transition-colors ${votingEnabled ? 'bg-indigo-500' : 'bg-white/20'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${votingEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {votingEnabled && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1"><Clock className="h-3 w-3" /> Duration (hours)</label>
                <Input type="number" value={votingDuration} onChange={e => setVotingDuration(Number(e.target.value))} min={1} max={168} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Votes Per Member</label>
                <Input type="number" value={votesPerMember} onChange={e => setVotesPerMember(Number(e.target.value))} min={1} max={10} />
              </div>
            </div>
          )}
        </div>

        <Button type="submit" size="lg" isLoading={createGroup.isPending} disabled={!name.trim()} className="w-full shadow-xl shadow-indigo-500/20">
          Create Group
        </Button>
      </form>
    </div>
  )
}
