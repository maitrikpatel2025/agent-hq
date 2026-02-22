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

export async function createAgent(payload) {
  const { data } = await api.post('/gateway/agents', payload)
  return data
}

export async function updateAgent(agentId, payload) {
  const { data } = await api.patch(`/gateway/agents/${agentId}`, payload)
  return data
}

export async function deleteAgent(agentId, deleteFiles = false) {
  const { data } = await api.delete(`/gateway/agents/${agentId}`, {
    params: deleteFiles ? { deleteFiles: true } : {},
  })
  return data
}

export async function fetchAgentFiles(agentId) {
  const { data } = await api.get(`/gateway/agents/${agentId}/files`)
  return data
}

export async function fetchAgentFileContent(agentId, path) {
  const { data } = await api.get(`/gateway/agents/${agentId}/files/content`, {
    params: { path },
  })
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

  eventSource.onerror = (err) => {
    console.warn('[SSE] EventSource error – readyState:', eventSource.readyState, err)
    // EventSource auto-reconnects when readyState is CONNECTING (0)
    if (eventSource.readyState === EventSource.CLOSED) {
      console.error('[SSE] Connection closed permanently')
    }
  }

  return () => {
    eventSource.close()
  }
}
