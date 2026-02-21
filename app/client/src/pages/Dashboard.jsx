import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGateway } from '../hooks/useGateway'
import { fetchDashboard } from '../services/gateway'
import HealthMonitoringWidget from '../components/HealthMonitoringWidget'
import {
  AgentStatusGrid,
  ActivityFeed,
  CostSummaryCard,
  SchedulePreview,
  PipelineOverview,
  QuickActionsPanel,
} from '../components/dashboard'
import sampleData from '../data/dashboard-sample.json'

function WidgetSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-stone-900 animate-pulse h-64 border border-stone-200/80 dark:border-stone-800" />
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { isConnected } = useGateway()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchDashboard()
        if (!cancelled) setDashboardData(data)
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load dashboard data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [isConnected])

  const data = isConnected ? (dashboardData || sampleData) : sampleData

  const onAgentClick = () => navigate('/agents')
  const onActivityClick = () => navigate('/activity')
  const onCostClick = () => navigate('/usage')
  const onJobClick = () => navigate('/jobs')
  const onPipelineColumnClick = () => navigate('/tasks')
  const onQuickAction = (targetSection) => navigate(`/${targetSection}`)

  return (
    <div className="min-h-full bg-stone-50 dark:bg-stone-950 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Dashboard</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Fleet overview and quick actions</p>
      </div>

      {/* Gateway disconnected banner */}
      {!isConnected && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 text-[13px]">
          Gateway not connected — showing sample data
        </div>
      )}

      {/* Health Monitoring — full width */}
      <div className="mb-5">
        <HealthMonitoringWidget />
      </div>

      {/* 2×3 Widget Grid */}
      {loading && isConnected ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <WidgetSkeleton key={i} />
          ))}
        </div>
      ) : error && isConnected ? (
        <div className="rounded-2xl bg-white dark:bg-stone-900 border border-red-200 dark:border-red-900/50 p-6 text-center">
          <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          <AgentStatusGrid
            agents={data.agents || []}
            onAgentClick={onAgentClick}
            onViewAll={onAgentClick}
          />
          <ActivityFeed
            items={data.recentActivity || []}
            onItemClick={onActivityClick}
            onViewAll={onActivityClick}
          />
          <CostSummaryCard
            costSummary={data.costSummary || { todayTotal: 0, yesterdayTotal: 0, currency: 'USD', topAgent: { name: '—', amount: 0 } }}
            onClick={onCostClick}
            onViewAll={onCostClick}
          />
          <SchedulePreview
            jobs={data.upcomingJobs || []}
            onJobClick={onJobClick}
            onViewAll={onJobClick}
          />
          <PipelineOverview
            pipeline={data.pipeline || { scheduled: 0, queue: 0, inProgress: 0, done: 0 }}
            onColumnClick={onPipelineColumnClick}
            onViewAll={onPipelineColumnClick}
          />
          <QuickActionsPanel
            actions={data.quickActions || []}
            onAction={onQuickAction}
          />
        </div>
      )}
    </div>
  )
}
