// =============================================================================
// UI Data Shapes — Combined Reference
//
// These types define the data that UI components expect to receive as props.
// They are a frontend contract, not a database schema. How you model, store,
// and fetch this data is an implementation decision.
// =============================================================================

// -----------------------------------------------------------------------------
// From: sections/dashboard
// -----------------------------------------------------------------------------

export type AgentStatus = 'online' | 'offline' | 'busy'

export interface DashboardAgent {
  id: string
  name: string
  role: string
  model: string
  status: AgentStatus
}

export interface ActivityItem {
  id: string
  agentName: string
  timestamp: string
  snippet: string
}

export interface CostSummary {
  todayTotal: number
  yesterdayTotal: number
  currency: string
  topAgent: {
    name: string
    amount: number
  }
}

export interface ScheduledJobPreview {
  id: string
  name: string
  agentName: string
  nextRunAt: string
  enabled: boolean
}

export interface PipelineStatus {
  scheduled: number
  queue: number
  inProgress: number
  done: number
}

export interface QuickAction {
  id: string
  label: string
  description: string
  targetSection: string
}

// -----------------------------------------------------------------------------
// From: sections/agents
// -----------------------------------------------------------------------------

export interface Agent {
  id: string
  emoji: string
  name: string
  role: string
  model: string
  channelBinding: string | null
  status: 'online' | 'offline'
  personality: string
  createdAt: string
}

export interface AgentFormData {
  emoji: string
  name: string
  role: string
  model: string
  channelBinding: string | null
  personality: string
}

// -----------------------------------------------------------------------------
// From: sections/activity
// -----------------------------------------------------------------------------

export interface ActivityEntry {
  id: string
  agentId: string
  agentName: string
  agentEmoji: string
  timestamp: string
  message: string
  model: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  cost: number
  channel: string
  skill: string | null
  sessionId: string
  responseTimeMs: number
}

// -----------------------------------------------------------------------------
// From: sections/usage
// -----------------------------------------------------------------------------

export type UsagePeriod = 'today' | 'week' | 'month' | 'year'

export interface UsageSummary {
  totalCost: number
  previousCost: number
  totalTokens: number
  previousTokens: number
  inputTokens: number
  outputTokens: number
  avgCostPerAgent: number
  previousAvgCost: number
  activeAgents: number
  costSparkline: number[]
  tokenSparkline: number[]
}

export interface TimeSeriesPoint {
  date: string
  cost: number
  tokens: number
}

export interface AgentUsage {
  agentId: string
  agentName: string
  role: string
  totalCost: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

export interface ModelUsage {
  model: string
  displayName: string
  totalCost: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

// -----------------------------------------------------------------------------
// From: sections/jobs
// -----------------------------------------------------------------------------

export type JobRunStatus = 'success' | 'failed' | 'running'

export interface Job {
  id: string
  name: string
  agentId: string
  agentEmoji: string
  agentName: string
  schedule: string
  scheduleHuman: string
  timezone: string
  enabled: boolean
  lastRunAt: string | null
  lastRunStatus: JobRunStatus | null
  nextRunAt: string | null
  instructions: string
}

export interface JobRun {
  id: string
  jobId: string
  startedAt: string
  status: JobRunStatus
  durationMs: number | null
}

// -----------------------------------------------------------------------------
// From: sections/tasks
// -----------------------------------------------------------------------------

export type TaskStatus = 'scheduled' | 'queue' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface AgentRef {
  id: string
  emoji: string
  name: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignedAgentId: string | null
  dueDate: string | null
  createdAt: string
}

// -----------------------------------------------------------------------------
// From: sections/skills
// -----------------------------------------------------------------------------

export interface Skill {
  id: string
  name: string
  description: string
  enabled: boolean
  agentIds: string[]
}

// -----------------------------------------------------------------------------
// From: sections/ai-council
// -----------------------------------------------------------------------------

export interface CouncilMessage {
  id: string
  agentId: string
  content: string
  timestamp: string
}

export interface CouncilSynthesis {
  summary: string
  agreements: string[]
  disagreements: string[]
  recommendation: string
}

export type SessionStatus = 'in-progress' | 'completed'

export interface CouncilSession {
  id: string
  topic: string
  format: string
  status: SessionStatus
  createdAt: string
  completedAt: string | null
  participantIds: string[]
  messages: CouncilMessage[]
  synthesis: CouncilSynthesis | null
}

export interface DebateFormat {
  id: string
  label: string
  description: string
}
