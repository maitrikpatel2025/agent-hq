/** Agent status in the fleet */
export type AgentStatus = 'online' | 'offline' | 'busy'

/** Compact agent summary for the dashboard status grid */
export interface DashboardAgent {
  id: string
  name: string
  role: string
  model: string
  status: AgentStatus
}

/** A recent agent response shown in the activity feed */
export interface ActivityItem {
  id: string
  agentName: string
  timestamp: string
  snippet: string
}

/** Today's cost summary with comparison to yesterday */
export interface CostSummary {
  todayTotal: number
  yesterdayTotal: number
  currency: string
  topAgent: {
    name: string
    amount: number
  }
}

/** An upcoming scheduled job preview */
export interface ScheduledJobPreview {
  id: string
  name: string
  agentName: string
  nextRunAt: string
  enabled: boolean
}

/** Task counts by kanban column */
export interface PipelineStatus {
  scheduled: number
  queue: number
  inProgress: number
  done: number
}

/** A quick action shortcut on the dashboard */
export interface QuickAction {
  id: string
  label: string
  description: string
  targetSection: string
}

/** Props for the Dashboard screen design */
export interface DashboardProps {
  agents: DashboardAgent[]
  recentActivity: ActivityItem[]
  costSummary: CostSummary
  upcomingJobs: ScheduledJobPreview[]
  pipeline: PipelineStatus
  quickActions: QuickAction[]

  /** Navigate to an agent's detail page */
  onAgentClick?: (agentId: string) => void
  /** Navigate to a specific activity item */
  onActivityClick?: (activityId: string) => void
  /** Navigate to the Usage analytics section */
  onCostClick?: () => void
  /** Navigate to a specific job's detail */
  onJobClick?: (jobId: string) => void
  /** Navigate to the Tasks board filtered by status */
  onPipelineColumnClick?: (status: 'scheduled' | 'queue' | 'inProgress' | 'done') => void
  /** Trigger a quick action (navigate to target section with creation flow) */
  onQuickAction?: (targetSection: string) => void
}
