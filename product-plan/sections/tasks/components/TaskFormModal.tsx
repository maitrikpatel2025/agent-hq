import { useState } from 'react'
import type { Task, TaskStatus, TaskPriority, AgentRef } from '../types'
import { X, Trash2 } from 'lucide-react'

interface TaskFormModalProps {
  task?: Task
  agents: AgentRef[]
  defaultStatus?: TaskStatus
  onSubmit?: (data: Omit<Task, 'id' | 'createdAt'>) => void
  onDelete?: () => void
  onClose?: () => void
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'queue', label: 'Queue' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; dot: string }[] = [
  { value: 'low', label: 'Low', dot: 'bg-stone-400' },
  { value: 'medium', label: 'Medium', dot: 'bg-amber-500' },
  { value: 'high', label: 'High', dot: 'bg-red-500' },
]

const inputClasses =
  'w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors'
const labelClasses =
  'block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1.5'

function toDateInputValue(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}

export function TaskFormModal({
  task,
  agents,
  defaultStatus = 'scheduled',
  onSubmit,
  onDelete,
  onClose,
}: TaskFormModalProps) {
  const isEditing = !!task

  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? defaultStatus,
    priority: task?.priority ?? ('medium' as TaskPriority),
    assignedAgentId: task?.assignedAgentId ?? (null as string | null),
    dueDate: task?.dueDate ?? (null as string | null),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(form)
  }

  const canSubmit = form.title.trim().length > 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 shrink-0">
            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
              {isEditing ? 'Edit Task' : 'New Task'}
            </h2>
            <div className="flex items-center gap-1">
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.()
                  }}
                  className="p-2 rounded-lg text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
          >
            {/* Title */}
            <div>
              <label className={labelClasses}>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClasses}
                placeholder="What needs to be done?"
                autoFocus
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClasses}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputClasses} resize-none`}
                rows={3}
                placeholder="Add details or instructions for the agent..."
              />
            </div>

            {/* Status + Priority row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClasses}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
                  className={inputClasses}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Priority</label>
                <div className="flex gap-1.5">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, priority: opt.value })}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border text-xs font-medium transition-all ${
                        form.priority === opt.value
                          ? 'border-violet-400 dark:border-violet-600 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 ring-1 ring-violet-400/30'
                          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Agent + Due date row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClasses}>Assign Agent</label>
                <select
                  value={form.assignedAgentId ?? ''}
                  onChange={(e) => setForm({ ...form, assignedAgentId: e.target.value || null })}
                  className={inputClasses}
                >
                  <option value="">Unassigned</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.emoji} {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Due Date</label>
                <input
                  type="date"
                  value={toDateInputValue(form.dueDate)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                  className={inputClasses}
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
