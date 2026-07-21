'use client'
import * as React from 'react'
import { GroupHeader } from '@/components/groups/GroupHeader'
import { GroupMediaPool } from '@/components/groups/GroupMediaPool'
import { VotingRound } from '@/components/groups/VotingRound'
import { GroupHistory } from '@/components/groups/GroupHistory'
import { ProgressFeed } from '@/components/groups/ProgressFeed'
import { Button } from '@/components/ui/Button'
import { Vote } from 'lucide-react'
import { useParams } from 'next/navigation'
import { 
  useGroup, 
  useGroupMembers, 
  useGroupPool, 
  useGroupMutations,
  useGroupHistory,
  useProgressFeed
} from '@/hooks/useGroups'
import { useVoting } from '@/hooks/useVoting'
import { useRealtime } from '@/hooks/useRealtime'
import { useAuthStore } from '@/store/authStore'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils/cn'

type Tab = 'pool' | 'vote' | 'history' | 'progress'

export default function GroupPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = React.useState<Tab>('pool')
  
  useRealtime(id)
  
  const { data: group, isLoading } = useGroup(id)
  const { data: members, isLoading: membersLoading } = useGroupMembers(id)
  const { data: poolItems, isLoading: poolLoading } = useGroupPool(id)
  const { addToPool, removeFromPool } = useGroupMutations()

  const { activeRound, userVoteIds, createRound, vote, retract, endRound } = useVoting(id)
  const { data: historyEntries, isLoading: historyLoading } = useGroupHistory(id)
  const { data: progressEntries, isLoading: progressLoading } = useProgressFeed(id)

  if (isLoading || membersLoading) {
    return <div className="p-8 max-w-7xl mx-auto space-y-8"><Skeleton className="h-64 w-full rounded-3xl" /></div>
  }

  if (!group) return <div className="p-8 text-center text-gray-400">Group not found</div>

  const myMember = members?.find(m => m.id === user?.id)
  const isMember = !!myMember
  const isOwner = myMember?.role === 'owner'
  
  const groupProps = {
    id: group.id,
    name: group.name,
    description: group.description,
    coverUrl: undefined,
    memberCount: members?.length || 0,
    type: group.type,
    isOwner,
    votingEnabled: group.voting_enabled
  }

  const tabs: { id: Tab, label: string, hidden?: boolean }[] = [
    { id: 'pool', label: 'Pool' },
    { id: 'vote', label: 'Vote' },
    { id: 'history', label: 'History' },
    { id: 'progress', label: 'Progress', hidden: group.type !== 'private' },
  ]

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <GroupHeader {...groupProps} />

      {/* Group Nav */}
      <nav className="flex gap-2 border-b border-white/10 pb-0 overflow-x-auto">
        {tabs.filter(t => !t.hidden).map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap border-b-2",
              activeTab === tab.id 
                ? "text-indigo-400 border-indigo-500" 
                : "text-gray-400 hover:text-white border-transparent hover:border-indigo-500/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <section className="pt-2">
        {activeTab === 'pool' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Media Pool</h2>
              <p className="text-gray-400 text-sm">All the titles your group wants to experience.</p>
            </div>
            <GroupMediaPool 
              items={poolItems || []} 
              isLoading={poolLoading} 
              isMember={isMember} 
              isOwner={isOwner}
              currentUserId={user?.id}
              onAdd={(item) => addToPool.mutate({ groupId: id, mediaItem: item })}
              onRemove={(poolId) => removeFromPool.mutate({ poolItemId: poolId })}
            />
          </div>
        )}

        {activeTab === 'vote' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Voting Round</h2>
                <p className="text-gray-400 text-sm">Cast your votes for the next pick.</p>
              </div>
              {isOwner && !activeRound.data && (
                <Button onClick={() => createRound.mutate({ durationHours: 48 })} isLoading={createRound.isPending} size="sm" className="gap-2">
                  <Vote className="h-4 w-4" /> Start Vote
                </Button>
              )}
            </div>
            
            {activeRound.isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[2/3] rounded-2xl" />)}
                </div>
              </div>
            ) : !activeRound.data ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-black/20">
                <Vote className="h-10 w-10 text-gray-600 mb-3" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No active vote</h2>
                <p className="text-gray-400 text-sm max-w-xs">
                  {isOwner ? 'Click "Start Vote" above to kick off a new round.' : 'The group owner can start a voting round from this page.'}
                </p>
              </div>
            ) : (
              <VotingRound
                round={activeRound.data}
                poolItems={poolItems || []}
                userVoteIds={userVoteIds}
                isOwner={isOwner}
                isLoading={poolLoading}
                onVote={(poolItemId) => vote.mutate(poolItemId)}
                onRetract={(poolItemId) => retract.mutate(poolItemId)}
                onEnd={() => endRound.mutate()}
              />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Winner History</h2>
              <p className="text-gray-400 text-sm">Every pick your group has decided on, in order.</p>
            </div>
            <GroupHistory entries={historyEntries || []} isLoading={historyLoading} />
          </div>
        )}

        {activeTab === 'progress' && group.type === 'private' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Progress Updates</h2>
              <p className="text-gray-400 text-sm">See where everyone is up to.</p>
            </div>
            <ProgressFeed entries={progressEntries || []} isLoading={progressLoading} />
          </div>
        )}
      </section>
    </div>
  )
}
