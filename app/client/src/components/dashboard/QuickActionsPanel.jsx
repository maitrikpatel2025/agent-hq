import { Send, MessageSquare, Clock } from 'lucide-react'

const actionIcons = {
  tasks: Send,
  'ai-council': MessageSquare,
  jobs: Clock,
}

const actionStyles = {
  tasks: {
    icon: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
    hover: 'hover:border-violet-200 dark:hover:border-violet-800/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/20',
    iconBg: 'group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40',
  },
  'ai-council': {
    icon: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    hover: 'hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20',
    iconBg: 'group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40',
  },
  jobs: {
    icon: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    hover: 'hover:border-amber-200 dark:hover:border-amber-800/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20',
    iconBg: 'group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40',
  },
}

const defaultStyle = {
  icon: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
  hover: 'hover:border-violet-200 dark:hover:border-violet-800/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/20',
  iconBg: 'group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40',
}

export function QuickActionsPanel({ actions, onAction }) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm shadow-stone-200/50 dark:shadow-none p-5 flex flex-col">
      <div className="mb-4">
        <h3 className="text-[13px] font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Quick Actions
        </h3>
      </div>

      <div className="flex-1 space-y-2">
        {actions.map((action) => {
          const Icon = actionIcons[action.targetSection] || Send
          const styles = actionStyles[action.targetSection] || defaultStyle

          return (
            <button
              key={action.id}
              onClick={() => onAction?.(action.targetSection)}
              className={`group w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-stone-150 dark:border-stone-800 transition-all text-left ${styles.hover}`}
            >
              <div className={`w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 transition-colors ${styles.iconBg}`}>
                <Icon
                  className={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-colors ${styles.icon}`}
                  strokeWidth={2}
                />
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-semibold text-stone-800 dark:text-stone-200 block">
                  {action.label}
                </span>
                <span className="text-[11px] text-stone-400 dark:text-stone-500">
                  {action.description}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
