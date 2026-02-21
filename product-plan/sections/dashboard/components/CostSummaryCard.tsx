import type { CostSummary } from '../types'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface CostSummaryCardProps {
  costSummary: CostSummary
  onClick?: () => void
  onViewAll?: () => void
}

export function CostSummaryCard({ costSummary, onClick, onViewAll }: CostSummaryCardProps) {
  const { todayTotal, yesterdayTotal, currency, topAgent } = costSummary
  const delta = todayTotal - yesterdayTotal
  const deltaPercent = yesterdayTotal > 0 ? Math.abs((delta / yesterdayTotal) * 100) : 0
  const isDown = delta < 0

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm shadow-stone-200/50 dark:shadow-none p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Cost Today
        </h3>
        <button
          onClick={onViewAll}
          className="text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
        >
          View all &rarr;
        </button>
      </div>

      <button
        onClick={onClick}
        className="flex-1 flex flex-col items-start hover:opacity-90 transition-opacity text-left"
      >
        {/* Big number + delta */}
        <div className="flex items-baseline gap-3">
          <span
            className="text-4xl font-bold tracking-tighter text-stone-900 dark:text-stone-50"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            ${todayTotal.toFixed(2)}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg ${
              isDown
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
            }`}
          >
            {isDown ? (
              <TrendingDown className="w-3.5 h-3.5" strokeWidth={2.5} />
            ) : (
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.5} />
            )}
            {deltaPercent.toFixed(1)}%
          </span>
        </div>

        <span className="text-[11px] text-stone-400 dark:text-stone-500 mt-1.5">
          vs ${yesterdayTotal.toFixed(2)} yesterday
        </span>

        {/* Top spender */}
        <div className="mt-auto pt-5 w-full">
          <div className="border-t border-stone-100 dark:border-stone-800 pt-3">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-semibold">
              Top spender
            </span>
            <p className="text-[13px] text-stone-700 dark:text-stone-300 mt-1 font-medium">
              {topAgent.name}
              <span
                className="ml-2 text-stone-400 dark:text-stone-500"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
              >
                ${topAgent.amount.toFixed(2)} {currency}
              </span>
            </p>
          </div>
        </div>
      </button>
    </div>
  )
}
