import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'

export function AgentDeleteModal({ agent, onConfirm, onClose, isLoading }) {
  const [deleteFiles, setDeleteFiles] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        data-testid="agent-delete-modal"
        className="relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-xl w-full max-w-sm mx-4 p-6"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>

        <h2 className="text-base font-semibold text-stone-800 dark:text-stone-100 mb-1">
          Delete &ldquo;{agent.name}&rdquo;?
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">
          This action cannot be undone.
        </p>

        {/* Checkbox */}
        <label className="flex items-center gap-2.5 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={deleteFiles}
            onChange={(e) => setDeleteFiles(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300 dark:border-stone-600 text-red-600 focus:ring-red-500/40"
          />
          <span className="text-sm text-stone-600 dark:text-stone-300">
            Also delete workspace files
          </span>
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(deleteFiles)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
