import type { CouncilSession, Agent } from '../types'

interface SessionListItemProps {
  session: CouncilSession
  agents: Agent[]
  onSelect?: () => void
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function SessionListItem({ session, agents, onSelect }: SessionListItemProps) {
  const participants = agents.filter((a) => session.participantIds.includes(a.id))
  const isActive = session.status === 'in-progress'

  return (
    <button
      onClick={onSelect}
      className="w-full text-left group"
    >
      <div className="px-5 py-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all duration-150">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors line-clamp-2">
            {session.topic}
          </h3>
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
            }`}
          >
            {isActive && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
            )}
            {isActive ? 'In Progress' : 'Completed'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Participant avatars */}
            <div className="flex -space-x-1.5">
              {participants.slice(0, 5).map((agent) => (
                <div
                  key={agent.id}
                  className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-white dark:border-stone-900 flex items-center justify-center"
                  title={`${agent.emoji} ${agent.name}`}
                >
                  <span className="text-xs leading-none">{agent.emoji}</span>
                </div>
              ))}
            </div>
            <span className="text-xs text-stone-400 dark:text-stone-500">
              {participants.length} agent{participants.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-500" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
            <span>{formatDate(session.createdAt)}</span>
            <span className="text-stone-300 dark:text-stone-700">&middot;</span>
            <span>{formatTime(session.createdAt)}</span>
          </div>
        </div>
      </div>
    </button>
  )
}
