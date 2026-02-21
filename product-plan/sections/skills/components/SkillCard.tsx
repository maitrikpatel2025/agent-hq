import type { Skill } from '../types'

interface SkillCardProps {
  skill: Skill
  agentCount: number
  onSelect?: () => void
  onToggle?: (enabled: boolean) => void
}

export function SkillCard({ skill, agentCount, onSelect, onToggle }: SkillCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border p-5 cursor-pointer transition-all duration-200 ${
        skill.enabled
          ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:shadow-lg hover:shadow-violet-500/5 hover:border-violet-300 dark:hover:border-violet-700'
          : 'bg-stone-50 dark:bg-stone-900/50 border-stone-200/60 dark:border-stone-800/60 opacity-60 hover:opacity-80'
      }`}
    >
      {/* Top row: name + toggle */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3
          className={`text-sm font-semibold leading-snug ${
            skill.enabled
              ? 'text-stone-900 dark:text-stone-100'
              : 'text-stone-500 dark:text-stone-500'
          }`}
        >
          {skill.name}
        </h3>

        {/* Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggle?.(!skill.enabled)
          }}
          className={`relative shrink-0 inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 ${
            skill.enabled
              ? 'bg-violet-600'
              : 'bg-stone-300 dark:bg-stone-700'
          }`}
          role="switch"
          aria-checked={skill.enabled}
          aria-label={`${skill.enabled ? 'Disable' : 'Enable'} ${skill.name}`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              skill.enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
            }`}
          />
        </button>
      </div>

      {/* Description */}
      <p
        className={`text-xs leading-relaxed mb-3 line-clamp-2 ${
          skill.enabled
            ? 'text-stone-500 dark:text-stone-400'
            : 'text-stone-400 dark:text-stone-600'
        }`}
      >
        {skill.description}
      </p>

      {/* Agent count badge */}
      <div
        className={`inline-flex items-center gap-1.5 text-[11px] ${
          skill.enabled
            ? 'text-stone-400 dark:text-stone-500'
            : 'text-stone-400/60 dark:text-stone-600'
        }`}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        {agentCount} agent{agentCount !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
