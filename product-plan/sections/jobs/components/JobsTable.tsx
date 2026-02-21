import { useState, useMemo } from 'react'
import type { Job, JobRun, JobsProps } from '../types'
import { Search, ChevronDown, Clock, CalendarClock } from 'lucide-react'
import { RunHistoryTable } from './RunHistoryTable'

const statusConfig = {
  success: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  failed: {
    dot: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
  },
  running: {
    dot: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
  },
} as const

function formatRelativeTime(ts: string | null): string {
  if (!ts) return '—'
  const date = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const absDiff = Math.abs(diffMs)
  const isFuture = diffMs < 0

  const diffMin = Math.floor(absDiff / 60000)
  const diffHr = Math.floor(absDiff / 3600000)
  const diffDays = Math.floor(absDiff / 86400000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return isFuture ? `in ${diffMin}m` : `${diffMin}m ago`
  if (diffHr < 24) return isFuture ? `in ${diffHr}h` : `${diffHr}h ago`
  if (diffDays < 30) return isFuture ? `in ${diffDays}d` : `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function JobsTable({ jobs, jobRuns, onToggleEnabled }: JobsProps) {
  const [search, setSearch] = useState('')
  const [agentFilter, setAgentFilter] = useState<string>('')
  const [enabledFilter, setEnabledFilter] = useState<string>('')
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null)

  const agents = useMemo(() => {
    const map = new Map<string, { id: string; emoji: string; name: string }>()
    for (const job of jobs) {
      if (!map.has(job.agentId)) {
        map.set(job.agentId, {
          id: job.agentId,
          emoji: job.agentEmoji,
          name: job.agentName,
        })
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
  }, [jobs])

  const filtered = useMemo(() => {
    let result = [...jobs]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((j) => j.name.toLowerCase().includes(q))
    }
    if (agentFilter) {
      result = result.filter((j) => j.agentId === agentFilter)
    }
    if (enabledFilter === 'enabled') {
      result = result.filter((j) => j.enabled)
    } else if (enabledFilter === 'disabled') {
      result = result.filter((j) => !j.enabled)
    }
    return result
  }, [jobs, search, agentFilter, enabledFilter])

  const selectClasses =
    'px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors cursor-pointer'

  return (
    <div
      className="min-h-screen bg-stone-50 dark:bg-stone-950"
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Jobs
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {jobs.length} scheduled job{jobs.length !== 1 ? 's' : ''} synced
            from the gateway
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="pl-8 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors w-52"
            />
          </div>
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className={selectClasses}
          >
            <option value="">All agents</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.emoji} {a.name}
              </option>
            ))}
          </select>
          <select
            value={enabledFilter}
            onChange={(e) => setEnabledFilter(e.target.value)}
            className={selectClasses}
          >
            <option value="">All statuses</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
          {(search || agentFilter || enabledFilter) && (
            <button
              onClick={() => {
                setSearch('')
                setAgentFilter('')
                setEnabledFilter('')
              }}
              className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Job
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Agent
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 hidden sm:table-cell">
                    Schedule
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Enabled
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 hidden md:table-cell">
                    Last Run
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 hidden lg:table-cell">
                    Next Run
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filtered.map((job) => (
                  <JobRowGroup
                    key={job.id}
                    job={job}
                    runs={jobRuns[job.id] ?? []}
                    isExpanded={expandedJobId === job.id}
                    onToggleExpand={() =>
                      setExpandedJobId((prev) =>
                        prev === job.id ? null : job.id,
                      )
                    }
                    onToggleEnabled={onToggleEnabled}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <CalendarClock className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                {jobs.length === 0
                  ? 'No jobs synced yet'
                  : 'No jobs match your filters'}
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                {jobs.length === 0
                  ? 'Jobs will appear here once synced from the gateway.'
                  : 'Try adjusting your search or filters.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function JobRowGroup({
  job,
  runs,
  isExpanded,
  onToggleExpand,
  onToggleEnabled,
}: {
  job: Job
  runs: JobRun[]
  isExpanded: boolean
  onToggleExpand: () => void
  onToggleEnabled?: (jobId: string, enabled: boolean) => void
}) {
  const lastRunCfg = job.lastRunStatus
    ? statusConfig[job.lastRunStatus]
    : null

  return (
    <>
      <tr
        onClick={onToggleExpand}
        className={`cursor-pointer transition-colors ${
          isExpanded
            ? 'bg-violet-50/50 dark:bg-violet-950/20'
            : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
        } ${!job.enabled ? 'opacity-60' : ''}`}
      >
        {/* Job name */}
        <td className="py-3 px-4">
          <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
            {job.name}
          </span>
        </td>

        {/* Agent */}
        <td className="py-3 px-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-base">{job.agentEmoji}</span>
            <span className="text-sm text-stone-700 dark:text-stone-300">
              {job.agentName}
            </span>
          </div>
        </td>

        {/* Schedule */}
        <td className="py-3 px-4 hidden sm:table-cell">
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs">{job.scheduleHuman}</span>
          </div>
        </td>

        {/* Enabled toggle */}
        <td className="py-3 px-4 text-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleEnabled?.(job.id, !job.enabled)
            }}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900 ${
              job.enabled
                ? 'bg-violet-600'
                : 'bg-stone-300 dark:bg-stone-600'
            }`}
            role="switch"
            aria-checked={job.enabled}
            aria-label={`${job.enabled ? 'Disable' : 'Enable'} ${job.name}`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                job.enabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </td>

        {/* Last run */}
        <td className="py-3 px-4 hidden md:table-cell">
          {job.lastRunAt ? (
            <div className="flex items-center gap-2">
              {lastRunCfg && (
                <span className="relative flex h-2 w-2">
                  {job.lastRunStatus === 'running' && (
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${lastRunCfg.dot} opacity-75`}
                    />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${lastRunCfg.dot}`}
                  />
                </span>
              )}
              <span
                className="text-xs text-stone-500 dark:text-stone-400"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
              >
                {formatRelativeTime(job.lastRunAt)}
              </span>
            </div>
          ) : (
            <span className="text-xs text-stone-400 dark:text-stone-500">
              Never
            </span>
          )}
        </td>

        {/* Next run */}
        <td className="py-3 px-4 hidden lg:table-cell">
          <span
            className="text-xs text-stone-500 dark:text-stone-400"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            {formatRelativeTime(job.nextRunAt)}
          </span>
        </td>

        {/* Expand chevron */}
        <td className="py-3 px-4">
          <ChevronDown
            className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </td>
      </tr>

      {/* Expanded detail */}
      {isExpanded && (
        <tr>
          <td colSpan={7} className="px-4 py-0">
            <div className="py-4 pl-8 border-l-2 border-violet-300 dark:border-violet-700 ml-4 my-2 space-y-4">
              {/* Job info */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                    Instructions
                  </p>
                  <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-lg">
                    {job.instructions}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                    Cron Expression
                  </p>
                  <p
                    className="text-xs text-stone-600 dark:text-stone-400"
                    style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    {job.schedule}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                    Timezone
                  </p>
                  <p
                    className="text-xs text-stone-600 dark:text-stone-400"
                    style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    {job.timezone}
                  </p>
                </div>
              </div>

              {/* Run history */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
                  Run History
                </p>
                <div className="max-w-md">
                  <RunHistoryTable runs={runs} />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
