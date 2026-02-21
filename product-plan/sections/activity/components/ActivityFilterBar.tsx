import type {
  ActiveFilters,
  ActivityFilters,
} from '../types'
import { Search, X } from 'lucide-react'

interface ActivityFilterBarProps {
  filters: ActivityFilters
  activeFilters: ActiveFilters
  onFilterChange: (filters: Partial<ActiveFilters>) => void
  onClearFilters: () => void
}

function formatModel(model: string): string {
  if (model.includes('opus')) return 'Opus 4.6'
  if (model.includes('sonnet')) return 'Sonnet 4.5'
  if (model.includes('haiku')) return 'Haiku 4.5'
  return model
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 text-xs font-medium ring-1 ring-violet-200 dark:ring-violet-800">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 p-0.5 rounded-full hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

const selectClasses =
  'px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors cursor-pointer'

export function ActivityFilterBar({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
}: ActivityFilterBarProps) {
  const hasActiveFilters =
    activeFilters.agentId ||
    activeFilters.model ||
    activeFilters.channel ||
    activeFilters.skill ||
    activeFilters.dateRange ||
    activeFilters.search

  return (
    <div className="space-y-3">
      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            value={activeFilters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search messages..."
            className="pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors w-48"
          />
        </div>

        {/* Agent filter */}
        <select
          value={activeFilters.agentId ?? ''}
          onChange={(e) =>
            onFilterChange({ agentId: e.target.value || null })
          }
          className={selectClasses}
        >
          <option value="">All agents</option>
          {filters.agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.emoji} {a.name}
            </option>
          ))}
        </select>

        {/* Model filter */}
        <select
          value={activeFilters.model ?? ''}
          onChange={(e) =>
            onFilterChange({ model: e.target.value || null })
          }
          className={selectClasses}
        >
          <option value="">All models</option>
          {filters.models.map((m) => (
            <option key={m} value={m}>
              {formatModel(m)}
            </option>
          ))}
        </select>

        {/* Channel filter */}
        <select
          value={activeFilters.channel ?? ''}
          onChange={(e) =>
            onFilterChange({ channel: e.target.value || null })
          }
          className={selectClasses}
        >
          <option value="">All channels</option>
          {filters.channels.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Skill filter */}
        <select
          value={activeFilters.skill ?? ''}
          onChange={(e) =>
            onFilterChange({ skill: e.target.value || null })
          }
          className={selectClasses}
        >
          <option value="">All skills</option>
          {filters.skills.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Date range */}
        <input
          type="date"
          value={activeFilters.dateRange?.start ?? ''}
          onChange={(e) => {
            const start = e.target.value
            if (start) {
              onFilterChange({
                dateRange: {
                  start,
                  end: activeFilters.dateRange?.end ?? start,
                },
              })
            } else {
              onFilterChange({ dateRange: null })
            }
          }}
          className={`${selectClasses} w-32`}
          title="Start date"
        />
        <input
          type="date"
          value={activeFilters.dateRange?.end ?? ''}
          onChange={(e) => {
            const end = e.target.value
            if (end && activeFilters.dateRange?.start) {
              onFilterChange({
                dateRange: { ...activeFilters.dateRange, end },
              })
            }
          }}
          className={`${selectClasses} w-32`}
          title="End date"
        />
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.search && (
            <FilterChip
              label={`"${activeFilters.search}"`}
              onRemove={() => onFilterChange({ search: '' })}
            />
          )}
          {activeFilters.agentId && (
            <FilterChip
              label={`Agent: ${filters.agents.find((a) => a.id === activeFilters.agentId)?.name ?? activeFilters.agentId}`}
              onRemove={() => onFilterChange({ agentId: null })}
            />
          )}
          {activeFilters.model && (
            <FilterChip
              label={`Model: ${formatModel(activeFilters.model)}`}
              onRemove={() => onFilterChange({ model: null })}
            />
          )}
          {activeFilters.channel && (
            <FilterChip
              label={`Channel: ${activeFilters.channel}`}
              onRemove={() => onFilterChange({ channel: null })}
            />
          )}
          {activeFilters.skill && (
            <FilterChip
              label={`Skill: ${activeFilters.skill}`}
              onRemove={() => onFilterChange({ skill: null })}
            />
          )}
          {activeFilters.dateRange && (
            <FilterChip
              label={`${activeFilters.dateRange.start} \u2014 ${activeFilters.dateRange.end}`}
              onRemove={() => onFilterChange({ dateRange: null })}
            />
          )}
          <button
            onClick={onClearFilters}
            className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
