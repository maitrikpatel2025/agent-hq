import type { JobRun } from '../types'

interface RunHistoryTableProps {
  runs: JobRun[]
}

function formatDuration(ms: number | null): string {
  if (ms === null) return '—'
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const min = Math.floor(ms / 60000)
  const sec = Math.round((ms % 60000) / 1000)
  return `${min}m ${sec}s`
}

function formatRunTimestamp(ts: string): string {
  const date = new Date(ts)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusConfig = {
  success: {
    label: 'Success',
    dot: 'bg-emerald-500',
    badge:
      'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-800',
  },
  failed: {
    label: 'Failed',
    dot: 'bg-red-500',
    badge:
      'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 ring-red-200 dark:ring-red-800',
  },
  running: {
    label: 'Running',
    dot: 'bg-amber-500',
    badge:
      'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 ring-amber-200 dark:ring-amber-800',
  },
} as const

export function RunHistoryTable({ runs }: RunHistoryTableProps) {
  if (runs.length === 0) {
    return (
      <p className="text-xs text-stone-400 dark:text-stone-500 italic py-2">
        No run history available.
      </p>
    )
  }

  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-stone-200 dark:border-stone-700">
          <th className="text-left py-2 pr-6 font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            Timestamp
          </th>
          <th className="text-left py-2 pr-6 font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            Status
          </th>
          <th className="text-right py-2 font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
            Duration
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
        {runs.map((run) => {
          const cfg = statusConfig[run.status]
          return (
            <tr key={run.id}>
              <td
                className="py-2 pr-6 text-stone-600 dark:text-stone-400 whitespace-nowrap"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
              >
                {formatRunTimestamp(run.startedAt)}
              </td>
              <td className="py-2 pr-6">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ring-1 text-[11px] font-medium ${cfg.badge}`}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    {run.status === 'running' && (
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75`}
                      />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-1.5 w-1.5 ${cfg.dot}`}
                    />
                  </span>
                  {cfg.label}
                </span>
              </td>
              <td
                className="py-2 text-right text-stone-500 dark:text-stone-400 whitespace-nowrap"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
              >
                {formatDuration(run.durationMs)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
