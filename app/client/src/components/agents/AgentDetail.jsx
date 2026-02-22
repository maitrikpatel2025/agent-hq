import { useState } from 'react'
import { X, Pencil, Loader2, File, ChevronRight } from 'lucide-react'

export function AgentDetail({ agent, files, onClose, onEdit, onFetchFiles, onFetchFileContent }) {
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileContent, setFileContent] = useState(null)
  const [loadingContent, setLoadingContent] = useState(false)

  async function handleLoadFiles() {
    setLoadingFiles(true)
    try {
      await onFetchFiles(agent.id)
    } finally {
      setLoadingFiles(false)
    }
  }

  async function handleSelectFile(path) {
    setSelectedFile(path)
    setFileContent(null)
    setLoadingContent(true)
    try {
      const content = await onFetchFileContent(agent.id, path)
      setFileContent(typeof content === 'string' ? content : JSON.stringify(content, null, 2))
    } finally {
      setLoadingContent(false)
    }
  }

  return (
    <div
      data-testid="agent-detail"
      className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-700 shadow-xl flex flex-col z-40"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-stone-800">
        <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">Agent Detail</span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          aria-label="Close detail panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        {/* Avatar + identity */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-3xl select-none">
            {agent.emoji || '🤖'}
          </div>
          <div>
            <p className="text-base font-semibold text-stone-800 dark:text-stone-100">{agent.name}</p>
            <p
              className="text-xs text-stone-400 dark:text-stone-500 mt-0.5"
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              {agent.id}
            </p>
            {agent.theme && (
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{agent.theme}</p>
            )}
            {agent.role && !agent.theme && (
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{agent.role}</p>
            )}
            {agent.avatar && (
              <img
                src={agent.avatar}
                alt={agent.name}
                className="mt-2 w-10 h-10 rounded-full mx-auto object-cover"
              />
            )}
          </div>
          <button
            onClick={() => onEdit(agent)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:border-violet-200 dark:hover:border-violet-700 text-stone-600 dark:text-stone-300 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        </div>

        {/* Workspace files */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">Workspace Files</span>
            <button
              onClick={handleLoadFiles}
              disabled={loadingFiles}
              className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium disabled:opacity-50 transition-colors"
            >
              {loadingFiles ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                'Load files'
              )}
            </button>
          </div>

          {files.length > 0 && (
            <ul className="flex flex-col gap-1">
              {files.map((f) => {
                const path = typeof f === 'string' ? f : f.path || f.name || String(f)
                return (
                  <li key={path}>
                    <button
                      onClick={() => handleSelectFile(path)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-left transition-colors ${selectedFile === path ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' : 'hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'}`}
                    >
                      <File className="w-3 h-3 shrink-0" />
                      <span className="truncate flex-1 font-mono">{path}</span>
                      <ChevronRight className="w-3 h-3 shrink-0 text-stone-300 dark:text-stone-600" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {selectedFile && (
            <div className="mt-3">
              <p className="text-xs text-stone-400 mb-1 font-mono truncate">{selectedFile}</p>
              {loadingContent ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
                </div>
              ) : (
                <pre className="text-[10px] bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap text-stone-600 dark:text-stone-400">
                  {fileContent}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
