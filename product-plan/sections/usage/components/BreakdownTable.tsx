interface BreakdownRow {
  id: string
  name: string
  subtitle?: string
  totalCost: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

interface BreakdownTableProps {
  title: string
  rows: BreakdownRow[]
  onRowClick?: (id: string) => void
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

export function BreakdownTable({ title, rows, onRowClick }: BreakdownTableProps) {
  const maxCost = Math.max(...rows.map((r) => r.totalCost), 1)

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm shadow-stone-200/50 dark:shadow-none p-5">
      <h3 className="text-[13px] font-semibold text-stone-900 dark:text-stone-100 tracking-tight mb-4">
        {title}
      </h3>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_80px_80px_80px_80px] gap-2 px-3 pb-2 border-b border-stone-100 dark:border-stone-800">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
          Name
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 text-right">
          Cost
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 text-right">
          Input
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 text-right">
          Output
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 text-right">
          Total
        </span>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-stone-50 dark:divide-stone-800/50">
        {rows.map((row) => {
          const barWidth = (row.totalCost / maxCost) * 100

          return (
            <button
              key={row.id}
              onClick={() => onRowClick?.(row.id)}
              className="group w-full grid grid-cols-[1fr_80px_80px_80px_80px] gap-2 items-center px-3 py-3 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors text-left"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-stone-800 dark:text-stone-200 truncate group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                    {row.name}
                  </span>
                </div>
                {row.subtitle && (
                  <span className="text-[11px] text-stone-400 dark:text-stone-500 truncate block">
                    {row.subtitle}
                  </span>
                )}
                {/* Mini bar */}
                <div className="mt-1.5 h-1 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-400 dark:bg-violet-500 transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              <span
                className="text-[12px] font-semibold text-stone-700 dark:text-stone-300 text-right tabular-nums"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
              >
                ${row.totalCost.toFixed(2)}
              </span>
              <span
                className="text-[11px] text-stone-500 dark:text-stone-400 text-right tabular-nums"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
              >
                {formatTokens(row.inputTokens)}
              </span>
              <span
                className="text-[11px] text-stone-500 dark:text-stone-400 text-right tabular-nums"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
              >
                {formatTokens(row.outputTokens)}
              </span>
              <span
                className="text-[11px] font-medium text-stone-600 dark:text-stone-300 text-right tabular-nums"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
              >
                {formatTokens(row.totalTokens)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
