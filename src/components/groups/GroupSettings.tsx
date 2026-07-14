'use client'
import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Settings, Users, Trash2, Crown, UserMinus, Vote, Clock } from 'lucide-react'

interface Member {
  id: string
  user: { display_name: string; avatar_url?: string; username: string }
  role: 'owner' | 'member'
}

interface GroupSettingsProps {
  group: {
    id: string
    name: string
    description?: string
    type: 'public' | 'private'
    voting_enabled: boolean
    voting_duration_hours: number
    votes_per_member: number
  }
  members: Member[]
  onSave: (data: any) => void
  onKick: (memberId: string) => void
  onDelete: () => void
  isSaving?: boolean
}

export function GroupSettings({ group, members, onSave, onKick, onDelete, isSaving }: GroupSettingsProps) {
  const [name, setName] = React.useState(group.name)
  const [description, setDescription] = React.useState(group.description || '')
  const [type, setType] = React.useState(group.type)
  const [votingEnabled, setVotingEnabled] = React.useState(group.voting_enabled)
  const [votingDuration, setVotingDuration] = React.useState(group.voting_duration_hours)
  const [votesPerMember, setVotesPerMember] = React.useState(group.votes_per_member)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  const handleSave = () => {
    onSave({ name, description, type, voting_enabled: votingEnabled, voting_duration_hours: votingDuration, votes_per_member: votesPerMember })
  }

  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      {/* General */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-400" /> General
        </h2>
        <div className="space-y-4 p-5 rounded-2xl border border-white/10 bg-black/40">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Group Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
            <div className="flex gap-3">
              {(['public', 'private'] as const).map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium capitalize transition-all ${type === t ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voting Settings */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Vote className="h-5 w-5 text-indigo-400" /> Voting Settings
        </h2>
        <div className="space-y-4 p-5 rounded-2xl border border-white/10 bg-black/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Enable Voting</p>
              <p className="text-xs text-gray-400">Allow members to vote on media from the pool</p>
            </div>
            <button onClick={() => setVotingEnabled(!votingEnabled)}
              className={`relative h-6 w-11 rounded-full transition-colors ${votingEnabled ? 'bg-indigo-500' : 'bg-white/20'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${votingEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {votingEnabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Voting Duration (hours)
                </label>
                <Input type="number" value={votingDuration} onChange={e => setVotingDuration(Number(e.target.value))} min={1} max={168} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Votes Per Member</label>
                <Input type="number" value={votesPerMember} onChange={e => setVotesPerMember(Number(e.target.value))} min={1} max={10} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Members */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-400" /> Members ({members.length})
        </h2>
        <div className="rounded-2xl border border-white/10 bg-black/40 divide-y divide-white/5">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar src={member.user.avatar_url} fallback={member.user.display_name} size="sm" />
                <div>
                  <p className="font-medium text-white text-sm">{member.user.display_name}</p>
                  <p className="text-xs text-gray-500">@{member.user.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {member.role === 'owner' ? (
                  <Badge variant="want" className="gap-1"><Crown className="h-3 w-3" /> Owner</Badge>
                ) : (
                  <button onClick={() => onKick(member.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <UserMinus className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
          <Trash2 className="h-4 w-4" /> Delete Group
        </button>
        <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
      </div>

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Group?">
        <p className="text-gray-300 mb-6">This action is permanent and cannot be undone. All members, pool items, votes, and history will be deleted.</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onDelete}>Yes, Delete Group</Button>
        </div>
      </Modal>
    </div>
  )
}
