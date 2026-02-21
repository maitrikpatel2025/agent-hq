import type { DashboardAgent, AgentStatus } from '../types'

interface AgentStatusGridProps {
  agents: DashboardAgent[]
  onAgentClick?: (agentId: string) => void
  onViewAll?: () => void
}

const statusStyles: Record<AgentStatus, { dot: string; ring: string; label: string }> = {
  online: {
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-500/20',
    label: 'Online',
  },
  busy: {
    dot: 'bg-amber-500',
    ring: 'ring-amber-500/20',
    label: 'Busy',
  },
  offline: {
    dot: 'bg-stone-300 dark:bg-stone-600',
    ring: 'ring-stone-300/20 dark:ring-stone-600/20',
    label: 'Offline',
  },
}

function formatModel(model: string): string {
  if (model.includes('sonnet')) return 'Sonnet'
  if (model.includes('haiku')) return 'Haiku'
  if (model.includes('opus')) return 'Opus'
  if (model === 'gpt-4o') return 'GPT-4o'
  if (model === 'gpt-4o-mini') return '4o Mini'
  if (model.includes('gpt-4')) return 'GPT-4'
  return model
}

export function AgentStatusGrid({ agents, onAgentClick, onViewAll }: AgentStatusGridProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm shadow-stone-200/50 dark:shadow-none p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Agents
        </h3>
        <button
          onClick={onViewAll}
          className="text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
        >
          View all &rarr;
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 flex-1">
        {agents.map((agent) => {
          const status = statusStyles[agent.status]
          return (
            <button
              key={agent.id}
              onClick={() => onAgentClick?.(agent.id)}
              className="group relative flex items-start gap-3 p-3 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-transparent hover:border-violet-200 dark:hover:border-violet-800/50 hover:bg-violet-50/60 dark:hover:bg-violet-950/20 hover:shadow-sm transition-all text-left"
            >
              <span className="relative mt-1.5 shrink-0">
                <span className={`block w-2.5 h-2.5 rounded-full ${status.dot} ring-4 ${status.ring}`} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[13px] font-semibold text-stone-800 dark:text-stone-100 truncate group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                    {agent.name}
                  </span>
                  <span
                    className="text-[10px] leading-none px-1.5 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-700/60 text-stone-500 dark:text-stone-400 shrink-0 tracking-wide"
                    style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    {formatModel(agent.model)}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate block mt-0.5">
                  {agent.role}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
