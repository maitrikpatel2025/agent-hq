/** Available time periods for filtering usage data */
export type UsagePeriod = 'today' | 'week' | 'month' | 'year'

/** Aggregate metrics for the selected time period */
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

/** A single data point on the usage trend chart */
export interface TimeSeriesPoint {
  date: string
  cost: number
  tokens: number
}

/** Per-agent breakdown of cost and token consumption */
export interface AgentUsage {
  agentId: string
  agentName: string
  role: string
  totalCost: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

/** Per-model breakdown of cost and token consumption */
export interface ModelUsage {
  model: string
  displayName: string
  totalCost: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

/** Props for the Usage screen design */
export interface UsageProps {
  selectedPeriod: UsagePeriod
  summary: UsageSummary
  timeSeries: TimeSeriesPoint[]
  byAgent: AgentUsage[]
  byModel: ModelUsage[]

  /** Change the selected time period */
  onPeriodChange?: (period: UsagePeriod) => void
  /** Navigate to an agent's detail (if applicable) */
  onAgentClick?: (agentId: string) => void
}
