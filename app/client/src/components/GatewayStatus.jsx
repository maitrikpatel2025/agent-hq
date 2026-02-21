import { useState } from 'react'
import { useGatewayStatus } from '../hooks/useGateway'

const STATE_CONFIG = {
  connected: {
    dot: 'bg-emerald-500',
    label: 'Connected',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  },
  connecting: {
    dot: 'bg-amber-500 animate-pulse',
    label: 'Connecting',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  },
  reconnecting: {
    dot: 'bg-amber-500 animate-pulse',
    label: 'Reconnecting',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  },
  disconnected: {
    dot: 'bg-red-500',
    label: 'Disconnected',
    pill: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
  },
}

export default function GatewayStatus() {
  const { status, isConnected } = useGatewayStatus()
  const [showTooltip, setShowTooltip] = useState(false)

  const config = STATE_CONFIG[status.state] || STATE_CONFIG.disconnected

  const uptimeStr = status.uptimeMs
    ? `${Math.floor(status.uptimeMs / 3600000)}h ${Math.floor((status.uptimeMs % 3600000) / 60000)}m`
    : null

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.pill}`}
        data-testid="gateway-status"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className="hidden sm:inline">{config.label}</span>
      </div>

      {showTooltip && isConnected && status.server && (
        <div className="absolute right-0 top-full mt-1 z-50 w-48 p-2 rounded-md bg-stone-800 text-stone-200 text-xs shadow-lg">
          <div>Gateway {config.label}</div>
          {status.server.version && (
            <div className="mt-1 text-stone-400">v{status.server.version}</div>
          )}
          {uptimeStr && (
            <div className="text-stone-400">Uptime: {uptimeStr}</div>
          )}
        </div>
      )}
    </div>
  )
}
