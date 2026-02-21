import { useState, useEffect } from 'react'
import { useGateway } from '../hooks/useGateway'
import { fetchAgents } from '../services/gateway'
import { Loader2 } from 'lucide-react'

export default function Agents() {
  const { isConnected } = useGateway()
  const [agents, setAgents] = useState(null)
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
        const data = await fetchAgents()
        if (!cancelled) setAgents(data)
      } catch {
        // handled by state
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [isConnected])

  const agentList = Array.isArray(agents) ? agents : agents?.agents || []

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Agents</h1>
      <p className="text-stone-500 dark:text-stone-400 mt-1 mb-6">Agent roster with identity cards.</p>

      {!isConnected ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-8 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">Gateway not connected</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12 text-stone-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading agents...</span>
        </div>
      ) : agentList.length === 0 ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-8 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">No agents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="agent-list">
          {agentList.map((agent) => (
            <div
              key={agent.id}
              className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-xl">
                  {agent.identity?.emoji || '🤖'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
                    {agent.identity?.name || agent.name || agent.id}
                  </h3>
                  <p className="text-xs text-stone-400 truncate">{agent.id}</p>
                </div>
              </div>
              {agent.identity?.theme && (
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">{agent.identity.theme}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
