import { useState, useEffect } from 'react'
import { useGateway } from '../hooks/useGateway'
import { fetchAgents, fetchSessions, fetchSessionsUsage, fetchJobs } from '../services/gateway'
import { Loader2, Users, Activity, BarChart3, Clock } from 'lucide-react'

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-stone-500 dark:text-stone-400" strokeWidth={1.5} />
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center py-8 text-stone-400">
      <Loader2 className="w-5 h-5 animate-spin mr-2" />
      <span className="text-sm">Loading...</span>
    </div>
  )
}

function DisconnectedMessage() {
  return (
    <div className="text-center py-8">
      <p className="text-sm text-stone-400 dark:text-stone-500">Gateway not connected</p>
    </div>
  )
}

export default function Dashboard() {
  const { isConnected } = useGateway()
  const [agents, setAgents] = useState(null)
  const [sessions, setSessions] = useState(null)
  const [usage, setUsage] = useState(null)
  const [jobs, setJobs] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConnected) {
      setLoading(false)
      return
    }

    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [agentsData, sessionsData, usageData, jobsData] = await Promise.allSettled([
          fetchAgents(),
          fetchSessions({ limit: 5, includeLastMessage: true }),
          fetchSessionsUsage(),
          fetchJobs(),
        ])
        if (cancelled) return
        setAgents(agentsData.status === 'fulfilled' ? agentsData.value : null)
        setSessions(sessionsData.status === 'fulfilled' ? sessionsData.value : null)
        setUsage(usageData.status === 'fulfilled' ? usageData.value : null)
        setJobs(jobsData.status === 'fulfilled' ? jobsData.value : null)
      } catch {
        // handled by individual states
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [isConnected])

  const agentList = Array.isArray(agents) ? agents : agents?.agents || []
  const sessionList = Array.isArray(sessions) ? sessions : sessions?.sessions || []
  const jobList = Array.isArray(jobs) ? jobs : jobs?.jobs || []

  const totalTokens = usage?.totalTokens ?? usage?.total?.totalTokens ?? 0
  const totalCost = usage?.cost ?? usage?.total?.cost ?? 0
  const totalTurns = usage?.turns ?? usage?.total?.turns ?? 0

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Dashboard</h1>
      <p className="text-stone-500 dark:text-stone-400 mt-1 mb-6">At-a-glance system overview.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Agent Status */}
        <SectionCard title="Agents" icon={Users}>
          {!isConnected ? (
            <DisconnectedMessage />
          ) : loading ? (
            <LoadingSkeleton />
          ) : agentList.length === 0 ? (
            <p className="text-sm text-stone-400 py-4 text-center">No agents configured</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {agentList.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-2 p-2 rounded-md bg-stone-50 dark:bg-stone-900"
                >
                  <span className="text-lg">{agent.identity?.emoji || '🤖'}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">
                      {agent.identity?.name || agent.name || agent.id}
                    </p>
                    <p className="text-xs text-stone-400 truncate">{agent.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Usage Summary */}
        <SectionCard title="Usage Summary" icon={BarChart3}>
          {!isConnected ? (
            <DisconnectedMessage />
          ) : loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-stone-400 dark:text-stone-500">Total Tokens</p>
                <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">
                  {totalTokens.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 dark:text-stone-500">Cost</p>
                <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">
                  ${totalCost.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 dark:text-stone-500">Turns</p>
                <p className="text-lg font-semibold text-stone-800 dark:text-stone-200">
                  {totalTurns.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard title="Recent Activity" icon={Activity}>
          {!isConnected ? (
            <DisconnectedMessage />
          ) : loading ? (
            <LoadingSkeleton />
          ) : sessionList.length === 0 ? (
            <p className="text-sm text-stone-400 py-4 text-center">No recent activity</p>
          ) : (
            <ul className="space-y-2">
              {sessionList.slice(0, 5).map((session, i) => (
                <li
                  key={session.key || i}
                  className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-700 last:border-0"
                >
                  <span className="text-sm text-stone-600 dark:text-stone-300 truncate mr-2">
                    {session.label || session.key || `Session ${i + 1}`}
                  </span>
                  <span className="text-xs text-stone-400 shrink-0">
                    {session.agentId || ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* Upcoming Jobs */}
        <SectionCard title="Upcoming Jobs" icon={Clock}>
          {!isConnected ? (
            <DisconnectedMessage />
          ) : loading ? (
            <LoadingSkeleton />
          ) : jobList.length === 0 ? (
            <p className="text-sm text-stone-400 py-4 text-center">No scheduled jobs</p>
          ) : (
            <ul className="space-y-2">
              {jobList.slice(0, 3).map((job) => (
                <li
                  key={job.id}
                  className="flex items-center justify-between py-1.5 border-b border-stone-100 dark:border-stone-700 last:border-0"
                >
                  <span className="text-sm text-stone-600 dark:text-stone-300 truncate mr-2">
                    {job.name}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      job.enabled
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-stone-100 text-stone-400 dark:bg-stone-700 dark:text-stone-500'
                    }`}
                  >
                    {job.enabled ? 'Active' : 'Paused'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  )
}
