import { useState } from 'react'
import type { Agent, DebateFormat } from '../types'
import { X, Swords, Check } from 'lucide-react'

interface NewSessionModalProps {
  agents: Agent[]
  debateFormats: DebateFormat[]
  onSubmit?: (topic: string, participantIds: string[], formatId: string) => void
  onClose?: () => void
}

export function NewSessionModal({ agents, debateFormats, onSubmit, onClose }: NewSessionModalProps) {
  const [topic, setTopic] = useState('')
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [selectedFormat, setSelectedFormat] = useState(debateFormats[0]?.id ?? '')

  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
  }

  const selectAll = () => {
    if (selectedAgents.length === agents.length) {
      setSelectedAgents([])
    } else {
      setSelectedAgents(agents.map((a) => a.id))
    }
  }

  const canSubmit = topic.trim().length > 0 && selectedAgents.length >= 2

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit?.(topic.trim(), selectedAgents, selectedFormat)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 dark:bg-black/60 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] overflow-y-auto">
        <div
          className="bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl w-full max-w-lg"
          style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                <Swords className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                New Council Session
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Topic or Question
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What strategic question should the council debate?"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            {/* Agent Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Participants
                  <span className="ml-1.5 text-xs font-normal text-stone-400">
                    (select at least 2)
                  </span>
                </label>
                <button
                  onClick={selectAll}
                  className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                >
                  {selectedAgents.length === agents.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {agents.map((agent) => {
                  const isSelected = selectedAgents.includes(agent.id)
                  return (
                    <button
                      key={agent.id}
                      onClick={() => toggleAgent(agent.id)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 ${
                        isSelected
                          ? 'border-violet-400 dark:border-violet-600 bg-violet-50 dark:bg-violet-950/40 ring-1 ring-violet-200 dark:ring-violet-800'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                        <span className="text-sm">{agent.emoji}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                          {agent.name}
                        </div>
                        <div className="text-xs text-stone-400 dark:text-stone-500 truncate">
                          {agent.role}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Debate Format */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Debate Format
              </label>
              <div className="space-y-2">
                {debateFormats.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all duration-150 ${
                      selectedFormat === fmt.id
                        ? 'border-violet-400 dark:border-violet-600 bg-violet-50 dark:bg-violet-950/40 ring-1 ring-violet-200 dark:ring-violet-800'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                      {fmt.label}
                    </div>
                    <div className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                      {fmt.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 dark:border-stone-800">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white text-sm font-medium transition-colors disabled:cursor-not-allowed"
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
