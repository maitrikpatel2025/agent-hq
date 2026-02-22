import { useState, useEffect, useCallback } from 'react'
import { Loader2, X } from 'lucide-react'

export function AgentFormModal({ mode, initialData, onSubmit, onClose, isLoading }) {
  const [form, setForm] = useState({
    id: '',
    name: '',
    workspace: '',
    emoji: '',
    avatar: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id || '',
        name: initialData.name || '',
        workspace: initialData.workspace || '',
        emoji: initialData.emoji || '',
        avatar: initialData.avatar || '',
      })
    }
  }, [initialData])

  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!form.id.trim()) newErrors.id = 'ID is required'
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.workspace.trim()) newErrors.workspace = 'Workspace is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit({ ...form })
  }

  const isCreate = mode === 'create'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        data-testid="agent-form-modal"
        className="relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xl w-full max-w-md mx-4 p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-stone-800 dark:text-stone-100">
            {isCreate ? 'Create Agent' : 'Edit Agent'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ID */}
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
              ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.id}
              onChange={(e) => handleChange('id', e.target.value)}
              disabled={!isCreate}
              placeholder="e.g. friday-agent"
              className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.id ? 'border-red-400 dark:border-red-600' : 'border-stone-200 dark:border-stone-700'} bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.id && <p className="mt-1 text-xs text-red-500">{errors.id}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Friday"
              className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.name ? 'border-red-400 dark:border-red-600' : 'border-stone-200 dark:border-stone-700'} bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Workspace */}
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
              Workspace <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.workspace}
              onChange={(e) => handleChange('workspace', e.target.value)}
              placeholder="e.g. /home/friday/workspace"
              className={`w-full px-3 py-2 text-sm rounded-lg border ${errors.workspace ? 'border-red-400 dark:border-red-600' : 'border-stone-200 dark:border-stone-700'} bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40`}
            />
            {errors.workspace && <p className="mt-1 text-xs text-red-500">{errors.workspace}</p>}
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
              Emoji
            </label>
            <input
              type="text"
              value={form.emoji}
              onChange={(e) => handleChange('emoji', e.target.value)}
              placeholder="e.g. 🤖"
              maxLength={2}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
              Avatar URL
            </label>
            <input
              type="text"
              value={form.avatar}
              onChange={(e) => handleChange('avatar', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm font-medium rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isCreate ? 'Create Agent' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
