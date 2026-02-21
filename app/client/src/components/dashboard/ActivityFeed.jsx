function formatRelativeTime(timestamp) {
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diffMin = Math.round((now - then) / 60000)
  if (diffMin < 1) return 'now'
  if (diffMin < 60) return `${diffMin}m`
  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return `${diffHrs}h`
  const diffDays = Math.floor(diffHrs / 24)
  return `${diffDays}d`
}

const avatarPalettes = [
  { bg: 'bg-violet-100 dark:bg-violet-900/50', text: 'text-violet-700 dark:text-violet-300' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300' },
  { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-700 dark:text-amber-300' },
  { bg: 'bg-sky-100 dark:bg-sky-900/50', text: 'text-sky-700 dark:text-sky-300' },
  { bg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-700 dark:text-rose-300' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-700 dark:text-indigo-300' },
]

function getAvatarPalette(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarPalettes[Math.abs(hash) % avatarPalettes.length]
}

export function ActivityFeed({ items, onItemClick, onViewAll }) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm shadow-stone-200/50 dark:shadow-none p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Recent Activity
        </h3>
        <button
          onClick={onViewAll}
          className="text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
        >
          View all &rarr;
        </button>
      </div>

      <div className="flex-1 space-y-0.5 overflow-y-auto max-h-[340px] -mx-1.5 pr-1">
        {items.length === 0 ? (
          <p className="text-[12px] text-stone-400 dark:text-stone-500 text-center py-6">
            No recent activity
          </p>
        ) : (
          items.map((item) => {
            const palette = getAvatarPalette(item.agentName)
            return (
              <button
                key={item.id}
                onClick={() => onItemClick?.(item.id)}
                className="group w-full flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${palette.bg}`}
                >
                  <span className={`text-[11px] font-bold leading-none ${palette.text}`}>
                    {item.agentName[0]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold text-stone-800 dark:text-stone-200 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                      {item.agentName}
                    </span>
                    <span
                      className="text-[10px] text-stone-400 dark:text-stone-500 shrink-0 tabular-nums"
                      style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                    >
                      {formatRelativeTime(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
