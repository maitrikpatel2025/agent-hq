import { useState, useEffect } from 'react'
import { useGateway } from '../hooks/useGateway'
import { fetchSessionsUsage } from '../services/gateway'
import { Loader2 } from 'lucide-react'

export default function Usage() {
  const { isConnected } = useGateway()
  const [usage, setUsage] = useState(null)
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
        const data = await fetchSessionsUsage()
        if (!cancelled) setUsage(data)
      } catch {
        // handled by state
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [isConnected])

  // Handle various possible response shapes
  const stats = usage?.total || usage || {}
  const inputTokens = stats.inputTokens ?? 0
  const outputTokens = stats.outputTokens ?? 0
  const totalTokens = stats.totalTokens ?? inputTokens + outputTokens
  const cost = stats.cost ?? 0
  const turns = stats.turns ?? 0

  // Per-session breakdown
  const sessions = Array.isArray(usage?.sessions) ? usage.sessions : []

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Usage</h1>
      <p className="text-stone-500 dark:text-stone-400 mt-1 mb-6">Token and cost analytics.</p>

      {!isConnected ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-8 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">Gateway not connected</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12 text-stone-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading usage data...</span>
        </div>
      ) : (
        <div className="space-y-5" data-testid="usage-metrics">
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4">
              <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Input Tokens</p>
              <p className="text-xl font-semibold text-stone-800 dark:text-stone-200">{inputTokens.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4">
              <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Output Tokens</p>
              <p className="text-xl font-semibold text-stone-800 dark:text-stone-200">{outputTokens.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4">
              <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Total Cost</p>
              <p className="text-xl font-semibold text-stone-800 dark:text-stone-200">${cost.toFixed(4)}</p>
            </div>
            <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4">
              <p className="text-xs text-stone-400 dark:text-stone-500 mb-1">Turns</p>
              <p className="text-xl font-semibold text-stone-800 dark:text-stone-200">{turns.toLocaleString()}</p>
            </div>
          </div>

          {/* Total tokens bar */}
          <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-5">
            <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">Token Breakdown</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Total Tokens</span>
                <span>{totalTokens.toLocaleString()}</span>
              </div>
              {totalTokens > 0 && (
                <div className="flex h-2 rounded-full overflow-hidden bg-stone-100 dark:bg-stone-700">
                  <div
                    className="bg-violet-500"
                    style={{ width: `${(inputTokens / totalTokens) * 100}%` }}
                  />
                  <div
                    className="bg-emerald-500"
                    style={{ width: `${(outputTokens / totalTokens) * 100}%` }}
                  />
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-violet-500" /> Input
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Output
                </span>
              </div>
            </div>
          </div>

          {/* Per-session breakdown */}
          {sessions.length > 0 && (
            <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-5">
              <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">By Session</h2>
              <ul className="space-y-2">
                {sessions.slice(0, 10).map((s, i) => (
                  <li key={s.key || i} className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-700 last:border-0">
                    <span className="text-sm text-stone-600 dark:text-stone-300 truncate mr-2">{s.key}</span>
                    <span className="text-xs text-stone-400">{(s.totalTokens || 0).toLocaleString()} tokens</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
