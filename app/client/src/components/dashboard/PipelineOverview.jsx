const columns = [
  {
    key: 'scheduled',
    label: 'Scheduled',
    accent: 'text-stone-600 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100',
    barColor: 'bg-stone-300 dark:bg-stone-600',
  },
  {
    key: 'queue',
    label: 'Queue',
    accent: 'text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300',
    barColor: 'bg-violet-500 dark:bg-violet-500',
  },
  {
    key: 'inProgress',
    label: 'Active',
    accent: 'text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300',
    barColor: 'bg-amber-500 dark:bg-amber-500',
  },
  {
    key: 'done',
    label: 'Done',
    accent: 'text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
    barColor: 'bg-emerald-500 dark:bg-emerald-500',
  },
]

export function PipelineOverview({ pipeline, onColumnClick, onViewAll }) {
  const total = pipeline.scheduled + pipeline.queue + pipeline.inProgress + pipeline.done

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm shadow-stone-200/50 dark:shadow-none p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Pipeline
        </h3>
        <button
          onClick={onViewAll}
          className="text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
        >
          View all &rarr;
        </button>
      </div>

      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-6 bg-stone-100 dark:bg-stone-800">
        {columns.map((col) => {
          const count = pipeline[col.key]
          if (count === 0) return null
          const pct = (count / total) * 100
          return (
            <div
              key={col.key}
              className={`${col.barColor} first:rounded-l-full last:rounded-r-full`}
              style={{ width: `${pct}%` }}
              title={`${col.label}: ${count}`}
            />
          )
        })}
      </div>

      {/* Column counts */}
      <div className="grid grid-cols-4 gap-1.5 flex-1">
        {columns.map((col) => (
          <button
            key={col.key}
            onClick={() => onColumnClick?.(col.key)}
            className="group flex flex-col items-center gap-1.5 py-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
          >
            <span
              className={`text-2xl font-bold tabular-nums transition-colors ${col.accent}`}
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              {pipeline[col.key]}
            </span>
            <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
              {col.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
