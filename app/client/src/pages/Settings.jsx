import { useState, useEffect } from 'react'
import { useGateway } from '../hooks/useGateway'
import { fetchConfig } from '../services/gateway'
import { Loader2 } from 'lucide-react'

export default function Settings() {
  const { isConnected } = useGateway()
  const [config, setConfig] = useState(null)
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
        const data = await fetchConfig()
        if (!cancelled) setConfig(data)
      } catch {
        // handled by state
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [isConnected])

  // Extract the raw config data
  const configData = config?.config || config?.raw || config

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Settings</h1>
      <p className="text-stone-500 dark:text-stone-400 mt-1 mb-6">Application configuration.</p>

      {!isConnected ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-8 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">Gateway not connected</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12 text-stone-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading configuration...</span>
        </div>
      ) : !configData ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-8 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">No configuration data available</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-5" data-testid="config-section">
          <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">Gateway Configuration</h2>
          <pre className="text-xs text-stone-600 dark:text-stone-400 overflow-auto max-h-[600px] p-4 bg-stone-50 dark:bg-stone-900 rounded-md">
            {typeof configData === 'string' ? configData : JSON.stringify(configData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
