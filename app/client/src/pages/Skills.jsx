import { useState, useEffect } from 'react'
import { useGateway } from '../hooks/useGateway'
import { fetchSkills } from '../services/gateway'
import { Loader2 } from 'lucide-react'

export default function Skills() {
  const { isConnected } = useGateway()
  const [skills, setSkills] = useState(null)
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
        const data = await fetchSkills()
        if (!cancelled) setSkills(data)
      } catch {
        // handled by state
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [isConnected])

  // Handle various response shapes
  const skillEntries = skills?.skills || skills?.entries || []
  const skillList = Array.isArray(skillEntries)
    ? skillEntries
    : Object.entries(skillEntries || {}).map(([key, val]) => ({
        key,
        name: val.name || key,
        enabled: val.enabled ?? true,
        ...val,
      }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Skills</h1>
      <p className="text-stone-500 dark:text-stone-400 mt-1 mb-6">Skills panel.</p>

      {!isConnected ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-8 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">Gateway not connected</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12 text-stone-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading skills...</span>
        </div>
      ) : skillList.length === 0 ? (
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-8 text-center">
          <p className="text-sm text-stone-400 dark:text-stone-500">No skills installed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="skills-panel">
          {skillList.map((skill, i) => (
            <div
              key={skill.key || skill.name || i}
              className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  {skill.name || skill.key || `Skill ${i + 1}`}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    skill.enabled
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-stone-100 text-stone-500 dark:bg-stone-700 dark:text-stone-400'
                  }`}
                >
                  {skill.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {skill.description && (
                <p className="text-xs text-stone-400 dark:text-stone-500 line-clamp-2">{skill.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
