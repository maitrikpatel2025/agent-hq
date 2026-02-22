import { useState } from 'react'
import { Search, Grid, List, Plus, Pencil, Trash2 } from 'lucide-react'
import { AgentCard } from './AgentCard'

export function AgentRoster({ agents, onlineAgentIds, selectedAgent, onSelect, onEdit, onDelete, onCreateNew }) {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  const filtered = agents.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div data-testid="agent-roster" className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-stone-700 shadow-sm text-violet-600 dark:text-violet-400' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'}`}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-stone-700 shadow-sm text-violet-600 dark:text-violet-400' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'}`}
            aria-label="Table view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* New agent button */}
        <button
          onClick={onCreateNew}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Agent
        </button>
      </div>

      {/* Empty state — no agents at all */}
      {agents.length === 0 && (
        <div data-testid="empty-state" className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-2xl">
            🤖
          </div>
          <div>
            <p className="text-sm font-medium text-stone-700 dark:text-stone-300">No agents yet</p>
            <p className="text-xs text-stone-400 mt-1">Create your first agent to get started</p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Agent
          </button>
        </div>
      )}

      {/* Empty search state */}
      {agents.length > 0 && filtered.length === 0 && (
        <div data-testid="empty-search" className="py-12 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">No agents match your search</p>
        </div>
      )}

      {/* Grid view */}
      {agents.length > 0 && filtered.length > 0 && viewMode === 'grid' && (
        <div data-testid="agent-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isOnline={onlineAgentIds.has(agent.id)}
              isSelected={selectedAgent?.id === agent.id}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Table view */}
      {agents.length > 0 && filtered.length > 0 && viewMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-700">
          <table data-testid="agent-table" className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">Emoji</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map((agent) => {
                const isOnline = onlineAgentIds.has(agent.id)
                return (
                  <tr
                    key={agent.id}
                    onClick={() => onSelect(agent)}
                    className="cursor-pointer hover:bg-violet-50/60 dark:hover:bg-violet-950/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-lg">{agent.emoji || '🤖'}</td>
                    <td className="px-4 py-3 font-medium text-stone-800 dark:text-stone-100">{agent.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-400 dark:text-stone-500">{agent.id}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`block w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-600'}`} />
                        <span className="text-xs text-stone-500 dark:text-stone-400">{isOnline ? 'Online' : 'Offline'}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(agent) }}
                          className="p-1.5 rounded-md hover:bg-violet-100 dark:hover:bg-violet-900/40 text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                          aria-label="Edit agent"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(agent) }}
                          className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          aria-label="Delete agent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
