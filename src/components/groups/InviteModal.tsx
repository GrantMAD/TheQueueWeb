'use client'
import * as React from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Search, UserPlus, Clock, Check, X } from 'lucide-react'

interface PendingInvite {
  id: string
  user: { display_name: string; avatar_url?: string; username: string }
  status: 'pending' | 'accepted' | 'declined'
}

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  groupId: string
  pendingInvites: PendingInvite[]
  onInvite: (username: string) => void
  onCancel: (inviteId: string) => void
}

export function InviteModal({ isOpen, onClose, pendingInvites, onInvite, onCancel }: InviteModalProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isInviting, setIsInviting] = React.useState(false)

  const handleInvite = async () => {
    if (!searchQuery.trim()) return
    setIsInviting(true)
    await onInvite(searchQuery.trim())
    setSearchQuery('')
    setIsInviting(false)
  }

  const statusStyles: Record<string, string> = {
    pending: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    accepted: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    declined: 'text-red-400 bg-red-500/10 border-red-500/30',
  }

  const statusIcons = { pending: Clock, accepted: Check, declined: X }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Members">
      <div className="space-y-6">
        {/* Search + Invite */}
        <div className="flex gap-2">
          <Input
            placeholder="Search by username..."
            icon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleInvite()}
            className="flex-1"
          />
          <Button onClick={handleInvite} isLoading={isInviting} className="shrink-0 gap-2">
            <UserPlus className="h-4 w-4" /> Invite
          </Button>
        </div>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Pending Invites</h3>
            <div className="space-y-3">
              {pendingInvites.map(invite => {
                const StatusIcon = statusIcons[invite.status]
                return (
                  <div key={invite.id} className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                      <Avatar src={invite.user.avatar_url} fallback={invite.user.display_name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-white">{invite.user.display_name}</p>
                        <p className="text-xs text-gray-500">@{invite.user.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5 border ${statusStyles[invite.status]}`}>
                        <StatusIcon className="h-3 w-3" /> {invite.status}
                      </span>
                      {invite.status === 'pending' && (
                        <button onClick={() => onCancel(invite.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
