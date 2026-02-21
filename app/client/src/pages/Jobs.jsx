import { useState, useEffect } from 'react'
import { useGateway } from '../hooks/useGateway'
import { fetchJobs } from '../services/gateway'
import { Loader2 } from 'lucide-react'

export default function Jobs() {
  const { isConnected } = useGateway()
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
        const data = await fetchJobs()
        if (!cancelled) setJobs(data)
      } catch {
        // handled by state
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [isConnected])

  const jobList = Array.isArray(jobs) ? jobs : jobs?.jobs || []

  function formatSchedule(schedule) {
    if (!schedule) return ''
    if (schedule.kind === 'cron') return schedule.expr || 'cron'
    if (schedule.kind === 'every') return `Every ${Math.round((schedule.everyMs || 0) / 60000)}m`
    if (schedule.kind === 'at') return `At ${schedule.at || ''}`
    return schedule.kind
  }

  function formatTime(ms) {
    if (!ms) return '-'
    return new Date(ms).toLocaleString()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Jobs</h1>
      <p className="text-stone-500 dark:text-stone-400 mt-1 mb-6">Scheduled job management.</p>

      {!isConnected ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-8 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">Gateway not connected</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12 text-stone-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading jobs...</span>
        </div>
      ) : jobList.length === 0 ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-8 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">No scheduled jobs</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden" data-testid="jobs-list">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700">
                <th className="text-left py-3 px-4 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Schedule</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Last Run</th>
              </tr>
            </thead>
            <tbody>
              {jobList.map((job) => (
                <tr key={job.id} className="border-b border-stone-100 dark:border-stone-700 last:border-0">
                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-700 dark:text-stone-300">{job.name}</div>
                    {job.description && (
                      <div className="text-xs text-stone-400 mt-0.5 truncate max-w-xs">{job.description}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-stone-500 dark:text-stone-400 text-xs">
                    {formatSchedule(job.schedule)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        job.enabled
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-stone-100 text-stone-500 dark:bg-stone-700 dark:text-stone-400'
                      }`}
                    >
                      {job.enabled ? 'Active' : 'Paused'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-stone-400">
                    {formatTime(job.state?.lastRunAtMs)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
