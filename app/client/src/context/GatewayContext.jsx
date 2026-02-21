import { createContext, useState, useEffect, useCallback, useRef } from 'react'
import { fetchGatewayStatus, subscribeToEvents } from '../services/gateway'

export const GatewayContext = createContext(null)

export function GatewayProvider({ children }) {
  const [status, setStatus] = useState({
    state: 'disconnected',
    server: null,
    availableMethods: [],
    availableEvents: [],
    uptimeMs: null,
    gatewayUrl: null,
  })
  const [events, setEvents] = useState([])
  const cleanupRef = useRef(null)

  const refreshStatus = useCallback(async () => {
    try {
      const data = await fetchGatewayStatus()
      setStatus(data)
    } catch {
      setStatus((prev) => ({ ...prev, state: 'disconnected' }))
    }
  }, [])

  // Poll status every 10 seconds
  useEffect(() => {
    refreshStatus()
    const interval = setInterval(refreshStatus, 10000)
    return () => clearInterval(interval)
  }, [refreshStatus])

  // Subscribe to SSE events
  useEffect(() => {
    const cleanup = subscribeToEvents(({ event, data }) => {
      if (event === 'status') {
        setStatus(data)
      } else if (event !== 'ping') {
        setEvents((prev) => [...prev.slice(-99), { event, data, ts: Date.now() }])
      }
    })
    cleanupRef.current = cleanup
    return () => cleanup()
  }, [])

  const value = {
    status,
    events,
    isConnected: status.state === 'connected',
    isConnecting: status.state === 'connecting' || status.state === 'reconnecting',
    refreshStatus,
  }

  return (
    <GatewayContext.Provider value={value}>
      {children}
    </GatewayContext.Provider>
  )
}
