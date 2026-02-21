/**
 * Frontend service layer for OpenClaw Gateway REST API calls and SSE subscription.
 */
import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

export async function fetchGatewayStatus() {
  const { data } = await api.get('/gateway/status')
  return data
}

export async function fetchAgents() {
  const { data } = await api.get('/gateway/agents')
  return data
}

export async function fetchAgentIdentity(agentId) {
  const { data } = await api.get(`/gateway/agents/${agentId}/identity`)
  return data
}

export async function fetchSessions(params = {}) {
  const { data } = await api.get('/gateway/sessions', { params })
  return data
}

export async function fetchSessionsUsage(params = {}) {
  const { data } = await api.get('/gateway/sessions/usage', { params })
  return data
}

export async function fetchJobs() {
  const { data } = await api.get('/gateway/jobs')
  return data
}

export async function runJob(jobId) {
  const { data } = await api.post(`/gateway/jobs/${jobId}/run`)
  return data
}

export async function fetchSkills(params = {}) {
  const { data } = await api.get('/gateway/skills', { params })
  return data
}

export async function fetchModels() {
  const { data } = await api.get('/gateway/models')
  return data
}

export async function fetchConfig() {
  const { data } = await api.get('/gateway/config')
  return data
}

export async function patchConfig(patch) {
  const { data } = await api.patch('/gateway/config', patch)
  return data
}

export async function fetchDashboard() {
  const { data } = await api.get('/dashboard')
  return data
}

/**
 * Subscribe to the SSE event stream from the gateway.
 * @param {function} onEvent - Callback receiving { event, data } objects.
 * @returns {function} cleanup - Call to close the EventSource connection.
 */
export function subscribeToEvents(onEvent) {
  const url = `${API_BASE}/gateway/events`
  const eventSource = new EventSource(url)

  eventSource.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data)
      onEvent({ event: 'message', data })
    } catch {
      // ignore parse errors
    }
  }

  // Listen for named events
  const eventTypes = [
    'status', 'agent', 'chat', 'presence', 'tick',
    'health', 'cron', 'shutdown', 'ping',
  ]

  eventTypes.forEach((type) => {
    eventSource.addEventListener(type, (e) => {
      try {
        const data = JSON.parse(e.data)
        onEvent({ event: type, data })
      } catch {
        // ignore parse errors
      }
    })
  })

  eventSource.onerror = () => {
    // EventSource auto-reconnects
  }

  return () => {
    eventSource.close()
  }
}
