import type { DashboardProps } from '../types'
import { AgentStatusGrid } from './AgentStatusGrid'
import { ActivityFeed } from './ActivityFeed'
import { CostSummaryCard } from './CostSummaryCard'
import { SchedulePreview } from './SchedulePreview'
import { PipelineOverview } from './PipelineOverview'
import { QuickActionsPanel } from './QuickActionsPanel'

export function Dashboard({
  agents,
  recentActivity,
  costSummary,
  upcomingJobs,
  pipeline,
  quickActions,
  onAgentClick,
  onActivityClick,
  onCostClick,
  onJobClick,
  onPipelineColumnClick,
  onQuickAction,
}: DashboardProps) {
  return (
    <div
      className="min-h-full bg-stone-50 dark:bg-stone-950 p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Fleet overview and quick actions
          </p>
        </div>

        {/* 2x3 widget grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {/* Row 1 */}
          <AgentStatusGrid
            agents={agents}
            onAgentClick={onAgentClick}
            onViewAll={() => onQuickAction?.('agents')}
          />

          <ActivityFeed
            items={recentActivity}
            onItemClick={onActivityClick}
            onViewAll={() => onQuickAction?.('activity')}
          />

          <CostSummaryCard
            costSummary={costSummary}
            onClick={onCostClick}
            onViewAll={onCostClick}
          />

          {/* Row 2 */}
          <SchedulePreview
            jobs={upcomingJobs}
            onJobClick={onJobClick}
            onViewAll={() => onQuickAction?.('jobs')}
          />

          <PipelineOverview
            pipeline={pipeline}
            onColumnClick={onPipelineColumnClick}
            onViewAll={() => onQuickAction?.('tasks')}
          />

          <QuickActionsPanel
            actions={quickActions}
            onAction={onQuickAction}
          />
        </div>
      </div>
    </div>
  )
}
