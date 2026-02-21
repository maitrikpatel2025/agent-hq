import type {
  ActivityEntry,
  ActivityProps,
  SortField,
} from '../types'
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { ActivityFilterBar } from './ActivityFilterBar'

function formatModel(model: string): string {
  if (model.includes('opus')) return 'Opus 4.6'
  if (model.includes('sonnet')) return 'Sonnet 4.5'
  if (model.includes('haiku')) return 'Haiku 4.5'
  return model
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatCost(cost: number): string {
  return `$${cost.toFixed(4)}`
}

function formatTokens(tokens: number): string {
  return tokens.toLocaleString()
}

function formatResponseTime(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}

function generatePageNumbers(
  current: number,
  total: number,
): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) pages.push('...')

  pages.push(total)

  return pages
}

export function ActivityFeed({
  activities,
  filters,
  activeFilters,
  pagination,
  sortField,
  sortDirection,
  expandedRowId,
  isLive,
  onFilterChange,
  onClearFilters,
  onSort,
  onToggleRow,
  onPageChange,
}: ActivityProps) {
  const SortHeader = ({
    field,
    label,
    className,
  }: {
    field: SortField
    label: string
    className?: string
  }) => (
    <th
      onClick={() => onSort(field)}
      className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 cursor-pointer select-none hover:text-stone-600 dark:hover:text-stone-400 transition-colors ${className ?? ''}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortField === field &&
          (sortDirection === 'asc' ? (
            <ChevronUp className="w-3 h-3 text-violet-500" />
          ) : (
            <ChevronDown className="w-3 h-3 text-violet-500" />
          ))}
      </span>
    </th>
  )

  return (
    <div
      className="min-h-screen bg-stone-50 dark:bg-stone-950"
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              Activity
            </h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {pagination.total.toLocaleString()} total entries
            </p>
          </div>
          {/* Live indicator */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              isLive
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 ring-1 ring-stone-200 dark:ring-stone-700'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {isLive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLive ? 'bg-emerald-500' : 'bg-stone-400'
                }`}
              />
            </span>
            {isLive ? 'Live' : 'Paused'}
          </div>
        </div>

        {/* Filter bar */}
        <div className="mb-6">
          <ActivityFilterBar
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800">
                  <SortHeader field="timestamp" label="Time" />
                  <SortHeader field="agentName" label="Agent" />
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Message
                  </th>
                  <SortHeader
                    field="model"
                    label="Model"
                    className="hidden md:table-cell"
                  />
                  <SortHeader
                    field="totalTokens"
                    label="Tokens"
                    className="hidden lg:table-cell"
                  />
                  <SortHeader
                    field="cost"
                    label="Cost"
                    className="hidden lg:table-cell"
                  />
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 hidden xl:table-cell">
                    Channel
                  </th>
                  <SortHeader
                    field="responseTimeMs"
                    label="Latency"
                    className="hidden xl:table-cell"
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {activities.map((entry) => (
                  <ActivityRowGroup
                    key={entry.id}
                    entry={entry}
                    isExpanded={expandedRowId === entry.id}
                    onToggle={() => onToggleRow(entry.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {activities.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                No activity entries match your filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {generatePageNumbers(pagination.page, pagination.totalPages).map(
                (p, i) =>
                  p === '...' ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-2 text-xs text-stone-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => onPageChange(p as number)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        p === pagination.page
                          ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300'
                          : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {p}
                    </button>
                  ),
              )}
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityRowGroup({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: ActivityEntry
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`cursor-pointer transition-colors ${
          isExpanded
            ? 'bg-violet-50/50 dark:bg-violet-950/20'
            : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
        }`}
      >
        <td className="py-3 px-4 whitespace-nowrap">
          <span
            className="text-xs text-stone-500 dark:text-stone-400"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            {formatTimestamp(entry.timestamp)}
          </span>
        </td>
        <td className="py-3 px-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-base">{entry.agentEmoji}</span>
            <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
              {entry.agentName}
            </span>
          </div>
        </td>
        <td className="py-3 px-4 max-w-xs xl:max-w-md">
          <p className="text-sm text-stone-600 dark:text-stone-400 truncate">
            {entry.message}
          </p>
        </td>
        <td className="py-3 px-4 hidden md:table-cell">
          <span
            className="text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            {formatModel(entry.model)}
          </span>
        </td>
        <td className="py-3 px-4 hidden lg:table-cell">
          <span
            className="text-xs text-stone-500 dark:text-stone-400"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            {formatTokens(entry.totalTokens)}
          </span>
        </td>
        <td className="py-3 px-4 hidden lg:table-cell">
          <span
            className="text-xs text-stone-500 dark:text-stone-400"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            {formatCost(entry.cost)}
          </span>
        </td>
        <td className="py-3 px-4 hidden xl:table-cell">
          <span className="text-xs text-stone-500 dark:text-stone-400 capitalize">
            {entry.channel}
          </span>
        </td>
        <td className="py-3 px-4 hidden xl:table-cell">
          <span
            className="text-xs text-stone-500 dark:text-stone-400"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            {formatResponseTime(entry.responseTimeMs)}
          </span>
        </td>
      </tr>

      {/* Expanded detail */}
      {isExpanded && (
        <tr>
          <td colSpan={8} className="px-4 py-0">
            <div className="py-4 pl-8 border-l-2 border-violet-300 dark:border-violet-700 ml-4 my-2 space-y-4">
              {/* Full message */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                  Full Message
                </p>
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                  {entry.message}
                </p>
              </div>

              {/* Token breakdown */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                    Input Tokens
                  </p>
                  <p
                    className="text-sm font-medium text-stone-700 dark:text-stone-300"
                    style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    {formatTokens(entry.inputTokens)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                    Output Tokens
                  </p>
                  <p
                    className="text-sm font-medium text-stone-700 dark:text-stone-300"
                    style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    {formatTokens(entry.outputTokens)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                    Total Cost
                  </p>
                  <p
                    className="text-sm font-medium text-stone-700 dark:text-stone-300"
                    style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    {formatCost(entry.cost)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                    Response Time
                  </p>
                  <p
                    className="text-sm font-medium text-stone-700 dark:text-stone-300"
                    style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    {formatResponseTime(entry.responseTimeMs)}
                  </p>
                </div>
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                    Session
                  </p>
                  <p
                    className="text-xs text-stone-500 dark:text-stone-400"
                    style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    {entry.sessionId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                    Channel
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 capitalize">
                    {entry.channel}
                  </p>
                </div>
                {entry.skill && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                      Skill
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 capitalize">
                      {entry.skill}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                    Model
                  </p>
                  <p
                    className="text-xs text-stone-500 dark:text-stone-400"
                    style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    {formatModel(entry.model)}
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
