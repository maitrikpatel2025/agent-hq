import { useState, useMemo } from 'react'
import type { Skill, SkillsProps } from '../types'
import { Puzzle } from 'lucide-react'
import { SkillCard } from './SkillCard'
import { SkillDetailModal } from './SkillDetailModal'

export function SkillsPanel({
  skills,
  agents,
  onToggleSkill,
  onSelectSkill,
  onToggleAgentSkill,
}: SkillsProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const agentCountBySkill = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const skill of skills) {
      counts[skill.id] = skill.agentIds.length
    }
    return counts
  }, [skills])

  const enabledCount = skills.filter((s) => s.enabled).length

  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(skill)
    onSelectSkill?.(skill.id)
  }

  return (
    <div
      className="min-h-screen bg-stone-50 dark:bg-stone-950"
      style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Skills
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {skills.length} skill{skills.length !== 1 ? 's' : ''} &middot;{' '}
            {enabledCount} enabled
          </p>
        </div>

        {/* Content */}
        {skills.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
              <Puzzle className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-1">
              No skills available
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm">
              Skills are synced from the OpenClaw Gateway. Make sure your gateway is running and has skills registered.
            </p>
          </div>
        ) : (
          /* Card grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                agentCount={agentCountBySkill[skill.id] ?? 0}
                onSelect={() => handleSelectSkill(skill)}
                onToggle={(enabled) => onToggleSkill?.(skill.id, enabled)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          agents={agents}
          onClose={() => setSelectedSkill(null)}
          onToggleSkill={(enabled) => onToggleSkill?.(selectedSkill.id, enabled)}
          onToggleAgentSkill={(agentId, enabled) =>
            onToggleAgentSkill?.(selectedSkill.id, agentId, enabled)
          }
        />
      )}
    </div>
  )
}
