import { useState } from 'react'
import type { AICouncilProps, CouncilSession } from '../types'
import { Plus, Swords } from 'lucide-react'
import { SessionListItem } from './SessionListItem'
import { SessionThread } from './SessionThread'
import { NewSessionModal } from './NewSessionModal'

export function AICouncil({
  agents,
  sessions,
  debateFormats,
  onCreateSession,
  onSelectSession,
}: AICouncilProps) {
  const [selectedSession, setSelectedSession] = useState<CouncilSession | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleSelectSession = (session: CouncilSession) => {
    setSelectedSession(session)
    onSelectSession?.(session.id)
  }

  // Sort sessions: in-progress first, then by date descending
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.status === 'in-progress' && b.status !== 'in-progress') return -1
    if (b.status === 'in-progress' && a.status !== 'in-progress') return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const activeSessions = sessions.filter((s) => s.status === 'in-progress')
  const completedSessions = sessions.filter((s) => s.status === 'completed')

  // Detail view
  if (selectedSession) {
    return (
      <SessionThread
        session={selectedSession}
        agents={agents}
        onBack={() => setSelectedSession(null)}
      />
    )
  }

  // List view
  return (
    <div
      className="min-h-screen bg-stone-50 dark:bg-stone-950"
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              AI Council
            </h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''}
              {activeSessions.length > 0 && (
                <>
                  {' '}&middot;{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {activeSessions.length} in progress
                  </span>
                </>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Session</span>
          </button>
        </div>

        {/* Content */}
        {sessions.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
              <Swords className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-1">
              No council sessions yet
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-6 max-w-sm">
              Start a council session to have your agents debate a strategic question and synthesize their perspectives.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start First Session
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSessions.map((session) => (
              <SessionListItem
                key={session.id}
                session={session}
                agents={agents}
                onSelect={() => handleSelectSession(session)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create session modal */}
      {showCreateModal && (
        <NewSessionModal
          agents={agents}
          debateFormats={debateFormats}
          onSubmit={(topic, participantIds, formatId) => {
            onCreateSession?.(topic, participantIds, formatId)
            setShowCreateModal(false)
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}
