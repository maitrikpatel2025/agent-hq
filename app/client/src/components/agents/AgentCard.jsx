import { Pencil, Trash2 } from 'lucide-react'

export function AgentCard({ agent, isOnline, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <div
      data-testid="agent-card"
      onClick={() => onSelect(agent)}
      className={`group relative flex flex-col gap-3 p-4 rounded-xl border cursor-pointer transition-all
        bg-white dark:bg-stone-900
        ${isSelected
          ? 'border-violet-400 dark:border-violet-600 ring-2 ring-violet-500/30'
          : 'border-stone-200 dark:border-stone-700 hover:border-violet-200 dark:hover:border-violet-800/50 hover:shadow-sm'
        }`}
    >
      {/* Action icons — visible on hover */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(agent) }}
          className="p-1 rounded-md hover:bg-violet-100 dark:hover:bg-violet-900/40 text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          aria-label="Edit agent"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(agent) }}
          className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          aria-label="Delete agent"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Emoji avatar */}
      <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-xl select-none">
        {agent.emoji || '🤖'}
      </div>

      {/* Agent info */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`block w-2 h-2 rounded-full shrink-0 ${isOnline ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-600'}`}
          />
          <span className="text-sm font-semibold text-stone-800 dark:text-stone-100 truncate">
            {agent.name}
          </span>
        </div>
        <p
          className="mt-0.5 text-[11px] text-stone-400 dark:text-stone-500 truncate"
          style={{ fontFamily: '"IBM Plex Mono", monospace' }}
        >
          {agent.id}
        </p>
      </div>
    </div>
  )
}
