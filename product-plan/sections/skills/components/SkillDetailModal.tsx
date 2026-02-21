import type { Skill, AgentRef } from '../types'
import { X } from 'lucide-react'

interface SkillDetailModalProps {
  skill: Skill
  agents: AgentRef[]
  onClose?: () => void
  onToggleSkill?: (enabled: boolean) => void
  onToggleAgentSkill?: (agentId: string, enabled: boolean) => void
}

export function SkillDetailModal({
  skill,
  agents,
  onClose,
  onToggleSkill,
  onToggleAgentSkill,
}: SkillDetailModalProps) {
  const assignedCount = skill.agentIds.length

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6 pb-4 shrink-0">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
                  {skill.name}
                </h2>
                <span
                  className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    skill.enabled
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-500 ring-1 ring-stone-200 dark:ring-stone-700'
                  }`}
                >
                  {skill.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                {skill.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-2 -mr-2 -mt-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Global toggle */}
          <div className="px-6 pb-4 shrink-0">
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-900">
              <div>
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Global access
                </p>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                  {skill.enabled ? 'Available for agent assignment' : 'Disabled for all agents'}
                </p>
              </div>
              <button
                onClick={() => onToggleSkill?.(!skill.enabled)}
                className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-stone-950 ${
                  skill.enabled
                    ? 'bg-violet-600'
                    : 'bg-stone-300 dark:bg-stone-700'
                }`}
                role="switch"
                aria-checked={skill.enabled}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    skill.enabled ? 'translate-x-[22px]' : 'translate-x-[3px]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Divider + agent section header */}
          <div className="px-6 pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Agent Assignment
              </h3>
              <span className="text-xs text-stone-400 dark:text-stone-500">
                {assignedCount} of {agents.length}
              </span>
            </div>
          </div>

          {/* Agent list */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-1">
              {agents.map((agent) => {
                const isAssigned = skill.agentIds.includes(agent.id)
                return (
                  <div
                    key={agent.id}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      skill.enabled
                        ? 'hover:bg-stone-50 dark:hover:bg-stone-900'
                        : 'opacity-50 pointer-events-none'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg shrink-0">{agent.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                          {agent.name}
                        </p>
                        <p className="text-xs text-stone-400 dark:text-stone-500 truncate">
                          {agent.role}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleAgentSkill?.(agent.id, !isAssigned)}
                      disabled={!skill.enabled}
                      className={`relative shrink-0 inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-stone-950 ${
                        isAssigned
                          ? 'bg-violet-600'
                          : 'bg-stone-300 dark:bg-stone-700'
                      } ${!skill.enabled ? 'cursor-not-allowed' : ''}`}
                      role="switch"
                      aria-checked={isAssigned}
                      aria-label={`${isAssigned ? 'Remove' : 'Assign'} ${skill.name} for ${agent.name}`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          isAssigned ? 'translate-x-[18px]' : 'translate-x-[3px]'
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
