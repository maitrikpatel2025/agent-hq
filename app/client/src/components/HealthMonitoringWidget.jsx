import { useEffect } from 'react'
import { Activity } from 'lucide-react'
import { useGateway } from '../hooks/useGateway'

const STATE_CONFIG = {
  connected: {
    dot: 'bg-emerald-500',
    label: 'Connected',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  },
  connecting: {
    dot: 'bg-amber-500 animate-pulse',
    label: 'Connecting',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  },
  reconnecting: {
    dot: 'bg-amber-500 animate-pulse',
    label: 'Reconnecting',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  },
  disconnected: {
    dot: 'bg-red-500',
    label: 'Disconnected',
    badge: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
  },
}

function formatUptime(ms) {
  if (ms == null) return '—'
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function formatHeartbeat(date) {
  if (!date) return 'Never'
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function MetaItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-stone-400 dark:text-stone-500">{label}</p>
      <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mt-0.5 truncate">
        {value ?? '—'}
      </p>
    </div>
  )
}

export default function HealthMonitoringWidget() {
  const { status, refreshStatus, lastHeartbeat } = useGateway()

  useEffect(() => {
    const interval = setInterval(refreshStatus, 30_000)
    return () => clearInterval(interval)
  }, [refreshStatus])

  const config = STATE_CONFIG[status.state] || STATE_CONFIG.disconnected
  const methodCount = Array.isArray(status.availableMethods) ? status.availableMethods.length : null
  const eventCount = Array.isArray(status.availableEvents) ? status.availableEvents.length : null

  return (
    <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-stone-500 dark:text-stone-400" strokeWidth={1.5} />
          <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300">Gateway Health</h2>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badge}`}
          data-testid="health-state-badge"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetaItem label="Version" value={status.server?.version ?? '—'} />
        <MetaItem label="Connection ID" value={status.server?.connId ?? '—'} />
        <MetaItem label="Uptime" value={formatUptime(status.uptimeMs)} />
        <MetaItem
          label="RPC Methods"
          value={methodCount != null ? String(methodCount) : '—'}
        />
        <MetaItem
          label="Events"
          value={eventCount != null ? String(eventCount) : '—'}
        />
        <MetaItem label="Last Heartbeat" value={formatHeartbeat(lastHeartbeat)} />
      </div>
    </div>
  )
}
