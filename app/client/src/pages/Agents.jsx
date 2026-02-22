import { useState, useEffect, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { useGateway } from '../hooks/useGateway'
import {
  fetchAgents,
  fetchAgentIdentity,
  createAgent,
  updateAgent,
  deleteAgent,
  fetchAgentFiles,
  fetchAgentFileContent,
} from '../services/gateway'
import {
  AgentRoster,
  AgentDetail,
  AgentFormModal,
  AgentDeleteModal,
} from '../components/agents'

export default function Agents() {
  const { isConnected, events } = useGateway()

  const [agents, setAgents] = useState([])
  const [onlineAgentIds, setOnlineAgentIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedAgent, setSelectedAgent] = useState(null)
  const [agentDetail, setAgentDetail] = useState(null)
  const [detailFiles, setDetailFiles] = useState([])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [deletingAgent, setDeletingAgent] = useState(null)
  const [mutating, setMutating] = useState(false)

  const [toast, setToast] = useState(null)

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadAgents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAgents()
      const list = Array.isArray(data) ? data : data?.agents || []
      setAgents(list)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load agents')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load agents on mount / reconnect
  useEffect(() => {
    if (!isConnected) {
      setLoading(false)
      return
    }
    loadAgents()
  }, [isConnected, loadAgents])

  // Subscribe to presence events to update online/offline status
  useEffect(() => {
    const presenceEvents = events.filter((e) => e.event === 'presence')
    if (presenceEvents.length === 0) return
    const latest = presenceEvents[presenceEvents.length - 1]
    const { agentId, online } = latest.data || {}
    if (!agentId) return
    setOnlineAgentIds((prev) => {
      const next = new Set(prev)
      if (online) {
        next.add(agentId)
      } else {
        next.delete(agentId)
      }
      return next
    })
  }, [events])

  async function handleSelectAgent(agent) {
    setSelectedAgent(agent)
    setDetailFiles([])
    try {
      const identity = await fetchAgentIdentity(agent.id)
      setAgentDetail({ ...agent, ...identity })
    } catch {
      setAgentDetail(agent)
    }
  }

  function handleCloseDetail() {
    setSelectedAgent(null)
    setAgentDetail(null)
    setDetailFiles([])
  }

  async function handleFetchFiles(agentId) {
    const result = await fetchAgentFiles(agentId)
    setDetailFiles(result)
  }

  async function handleFetchFileContent(agentId, path) {
    return await fetchAgentFileContent(agentId, path)
  }

  async function handleCreateAgent(payload) {
    setMutating(true)
    try {
      await createAgent(payload)
      await loadAgents()
      setShowCreateModal(false)
      showToast(`Agent "${payload.name}" created`)
    } catch (err) {
      showToast(err?.response?.data?.detail || 'Failed to create agent', 'error')
    } finally {
      setMutating(false)
    }
  }

  async function handleEditAgent(payload) {
    setMutating(true)
    try {
      await updateAgent(payload.id, {
        name: payload.name,
        workspace: payload.workspace,
        emoji: payload.emoji,
        avatar: payload.avatar,
      })
      await loadAgents()
      setEditingAgent(null)
      showToast(`Agent "${payload.name}" updated`)
    } catch (err) {
      showToast(err?.response?.data?.detail || 'Failed to update agent', 'error')
    } finally {
      setMutating(false)
    }
  }

  async function handleDeleteAgent(doDeleteFiles) {
    if (!deletingAgent) return
    setMutating(true)
    try {
      await deleteAgent(deletingAgent.id, doDeleteFiles)
      await loadAgents()
      if (selectedAgent?.id === deletingAgent.id) {
        handleCloseDetail()
      }
      showToast('Agent deleted')
      setDeletingAgent(null)
    } catch (err) {
      showToast(err?.response?.data?.detail || 'Failed to delete agent', 'error')
    } finally {
      setMutating(false)
    }
  }

  return (
    <div data-testid="agents-page" className="p-6 relative">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium text-white transition-all ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Agents</h1>
      <p className="text-stone-500 dark:text-stone-400 mt-1 mb-6">
        Fleet roster and management hub.
      </p>

      {!isConnected ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-8 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">Gateway not connected</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12 text-stone-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading agents...</span>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-red-200 dark:border-red-800 p-8 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : (
        <AgentRoster
          agents={agents}
          onlineAgentIds={onlineAgentIds}
          selectedAgent={selectedAgent}
          onSelect={handleSelectAgent}
          onEdit={(agent) => setEditingAgent(agent)}
          onDelete={(agent) => setDeletingAgent(agent)}
          onCreateNew={() => setShowCreateModal(true)}
        />
      )}

      {/* Detail side panel */}
      {agentDetail && (
        <AgentDetail
          agent={agentDetail}
          files={detailFiles}
          onClose={handleCloseDetail}
          onEdit={(agent) => setEditingAgent(agent)}
          onFetchFiles={handleFetchFiles}
          onFetchFileContent={handleFetchFileContent}
        />
      )}

      {/* Create modal */}
      {showCreateModal && (
        <AgentFormModal
          mode="create"
          initialData={null}
          onSubmit={handleCreateAgent}
          onClose={() => setShowCreateModal(false)}
          isLoading={mutating}
        />
      )}

      {/* Edit modal */}
      {editingAgent && (
        <AgentFormModal
          mode="edit"
          initialData={editingAgent}
          onSubmit={handleEditAgent}
          onClose={() => setEditingAgent(null)}
          isLoading={mutating}
        />
      )}

      {/* Delete confirmation */}
      {deletingAgent && (
        <AgentDeleteModal
          agent={deletingAgent}
          onConfirm={handleDeleteAgent}
          onClose={() => setDeletingAgent(null)}
          isLoading={mutating}
        />
      )}
    </div>
  )
}
