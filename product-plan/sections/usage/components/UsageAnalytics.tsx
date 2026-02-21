import type { UsageProps, UsagePeriod } from '../types'
import { MetricCard } from './MetricCard'
import { UsageChart } from './UsageChart'
import { BreakdownTable } from './BreakdownTable'

const periods: { value: UsagePeriod; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

export function UsageAnalytics({
  selectedPeriod,
  summary,
  timeSeries,
  byAgent,
  byModel,
  onPeriodChange,
  onAgentClick,
}: UsageProps) {
  return (
    <div
      className="min-h-full bg-stone-50 dark:bg-stone-950 p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header + Period Selector */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
              Usage
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Token consumption and cost analytics
            </p>
          </div>

          {/* Segmented control */}
          <div className="flex bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 p-1 shadow-sm shadow-stone-200/50 dark:shadow-none">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => onPeriodChange?.(p.value)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  selectedPeriod === p.value
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <MetricCard
            label="Total Cost"
            value={`$${summary.totalCost.toFixed(2)}`}
            currentValue={summary.totalCost}
            previousValue={summary.previousCost}
            sparkline={summary.costSparkline}
            accentColor="violet"
          />
          <MetricCard
            label="Total Tokens"
            value={formatTokens(summary.totalTokens)}
            currentValue={summary.totalTokens}
            previousValue={summary.previousTokens}
            sparkline={summary.tokenSparkline}
            accentColor="emerald"
          />
          <MetricCard
            label="Input Tokens"
            value={formatTokens(summary.inputTokens)}
            accentColor="sky"
          />
          <MetricCard
            label="Output Tokens"
            value={formatTokens(summary.outputTokens)}
            accentColor="amber"
          />
          <MetricCard
            label="Avg / Agent"
            value={`$${summary.avgCostPerAgent.toFixed(2)}`}
            currentValue={summary.avgCostPerAgent}
            previousValue={summary.previousAvgCost}
            accentColor="violet"
          />
        </div>

        {/* Time Series Chart */}
        <div className="mb-6">
          <UsageChart data={timeSeries} />
        </div>

        {/* Breakdown Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BreakdownTable
            title="By Agent"
            rows={byAgent.map((a) => ({
              id: a.agentId,
              name: a.agentName,
              subtitle: a.role,
              totalCost: a.totalCost,
              inputTokens: a.inputTokens,
              outputTokens: a.outputTokens,
              totalTokens: a.totalTokens,
            }))}
            onRowClick={onAgentClick}
          />
          <BreakdownTable
            title="By Model"
            rows={byModel.map((m) => ({
              id: m.model,
              name: m.displayName,
              totalCost: m.totalCost,
              inputTokens: m.inputTokens,
              outputTokens: m.outputTokens,
              totalTokens: m.totalTokens,
            }))}
          />
        </div>
      </div>
    </div>
  )
}
