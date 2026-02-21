import type { ScheduledJobPreview } from '../types'
import { Clock, Pause } from 'lucide-react'

interface SchedulePreviewProps {
  jobs: ScheduledJobPreview[]
  onJobClick?: (jobId: string) => void
  onViewAll?: () => void
}

function formatCountdown(nextRunAt: string): string {
  const now = Date.now()
  const then = new Date(nextRunAt).getTime()
  const diffMs = then - now
  if (diffMs <= 0) return 'overdue'
  const totalMin = Math.floor(diffMs / 60000)
  const hours = Math.floor(totalMin / 60)
  const minutes = totalMin % 60
  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    const remainHrs = hours % 24
    return `${days}d ${remainHrs}h`
  }
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function SchedulePreview({ jobs, onJobClick, onViewAll }: SchedulePreviewProps) {
  const enabledJobs = jobs.filter((j) => j.enabled)
  const disabledJobs = jobs.filter((j) => !j.enabled)
  const sortedJobs = [
    ...enabledJobs.sort((a, b) => new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime()),
    ...disabledJobs,
  ]

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm shadow-stone-200/50 dark:shadow-none p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Schedule
        </h3>
        <button
          onClick={onViewAll}
          className="text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
        >
          View all &rarr;
        </button>
      </div>

      <div className="flex-1 space-y-1 -mx-1.5">
        {sortedJobs.map((job) => (
          <button
            key={job.id}
            onClick={() => onJobClick?.(job.id)}
            className={`group w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left ${
              !job.enabled ? 'opacity-45' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              job.enabled
                ? 'bg-violet-50 dark:bg-violet-950/40'
                : 'bg-stone-100 dark:bg-stone-800'
            }`}>
              {job.enabled ? (
                <Clock className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" strokeWidth={2} />
              ) : (
                <Pause className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" strokeWidth={2} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[12px] font-medium text-stone-800 dark:text-stone-200 truncate block group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                {job.name}
              </span>
              <span className="text-[11px] text-stone-400 dark:text-stone-500">
                {job.agentName}
              </span>
            </div>
            <span
              className={`text-[10px] shrink-0 tabular-nums px-2 py-0.5 rounded-md ${
                job.enabled
                  ? 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                  : 'text-stone-400 dark:text-stone-500'
              }`}
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              {job.enabled ? formatCountdown(job.nextRunAt) : 'paused'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
