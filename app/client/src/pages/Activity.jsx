import { useState, useEffect } from 'react'
import { useGateway } from '../hooks/useGateway'
import { fetchSessions } from '../services/gateway'
import { Loader2 } from 'lucide-react'

export default function Activity() {
  const { isConnected, events } = useGateway()
  const [sessions, setSessions] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConnected) {
      setLoading(false)
      return
    }

    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const data = await fetchSessions({ limit: 20, includeLastMessage: true })
        if (!cancelled) setSessions(data)
      } catch {
        // handled by state
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [isConnected])

  const sessionList = Array.isArray(sessions) ? sessions : sessions?.sessions || []

  // Real-time events (agent + chat)
  const realtimeEvents = events.filter((e) => e.event === 'agent' || e.event === 'chat')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Activity</h1>
      <p className="text-stone-500 dark:text-stone-400 mt-1 mb-6">Chronological feed of agent responses.</p>

      {!isConnected ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-8 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">Gateway not connected</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12 text-stone-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading activity...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Real-time events */}
          {realtimeEvents.length > 0 && (
            <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-5">
              <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">Live Events</h2>
              <ul className="space-y-1.5">
                {realtimeEvents.slice(-10).reverse().map((evt, i) => (
                  <li key={i} className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="truncate">{evt.event}: {JSON.stringify(evt.data).slice(0, 80)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Session history */}
          <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-5" data-testid="session-feed">
            <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">Session History</h2>
            {sessionList.length === 0 ? (
              <p className="text-sm text-stone-400 py-4 text-center">No sessions found</p>
            ) : (
              <ul className="space-y-2">
                {sessionList.map((session, i) => (
                  <li
                    key={session.key || i}
                    className="py-2 border-b border-stone-100 dark:border-stone-700 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate mr-2">
                        {session.label || session.key || `Session ${i + 1}`}
                      </span>
                      <span className="text-xs text-stone-400 shrink-0">{session.agentId || ''}</span>
                    </div>
                    {session.lastMessage && (
                      <p className="text-xs text-stone-400 mt-1 truncate">
                        {typeof session.lastMessage === 'string'
                          ? session.lastMessage
                          : session.lastMessage.content || JSON.stringify(session.lastMessage).slice(0, 100)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
