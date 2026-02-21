import { useState } from 'react'
import type { Task, AgentRef, TaskPriority } from '../types'
import { GripVertical, Calendar, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

interface TaskCardProps {
  task: Task
  agent?: AgentRef
  onEdit?: () => void
  onDelete?: () => void
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
}

const priorityConfig: Record<TaskPriority, { label: string; dot: string; text: string; bg: string }> = {
  high: {
    label: 'High',
    dot: 'bg-red-500',
    text: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/40',
  },
  medium: {
    label: 'Med',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
  },
  low: {
    label: 'Low',
    dot: 'bg-stone-400 dark:bg-stone-500',
    text: 'text-stone-500 dark:text-stone-400',
    bg: 'bg-stone-100 dark:bg-stone-800',
  },
}

function formatRelativeDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`
  if (diffDays === -1) return 'Yesterday'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays <= 7) return `In ${diffDays} days`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export function TaskCard({ task, agent, onEdit, onDelete, onDragStart, onDragEnd }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const priority = priorityConfig[task.priority]
  const relativeDate = formatRelativeDate(task.dueDate)
  const overdue = isOverdue(task.dueDate)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onEdit}
      className="group relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-md hover:shadow-violet-500/5 hover:border-violet-300 dark:hover:border-violet-700 active:shadow-lg active:scale-[1.02]"
    >
      {/* Drag handle + context menu */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(!menuOpen)
            }}
            className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false) }} />
              <div className="absolute right-0 top-full mt-1 z-20 w-36 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(false)
                    onEdit?.()
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(false)
                    onDelete?.()
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Drag indicator */}
      <div className="absolute top-1/2 -left-0.5 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none">
        <GripVertical className="w-3.5 h-3.5 text-stone-400" />
      </div>

      {/* Priority badge */}
      <div className="mb-2.5">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase ${priority.text} ${priority.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-[13px] font-semibold text-stone-900 dark:text-stone-100 leading-snug mb-1.5 pr-6">
        {task.title}
      </h4>

      {/* Description snippet */}
      {task.description && (
        <p className="text-[11px] leading-relaxed text-stone-500 dark:text-stone-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer: agent + due date */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        {/* Agent */}
        {agent ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-5 h-5 rounded-full bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-xs shrink-0 ring-1 ring-violet-100 dark:ring-violet-900/50">
              {agent.emoji}
            </span>
            <span className="text-[11px] text-stone-600 dark:text-stone-400 truncate">
              {agent.name}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-stone-400 dark:text-stone-500 italic">Unassigned</span>
        )}

        {/* Due date */}
        {relativeDate && (
          <div className={`flex items-center gap-1 shrink-0 ${overdue ? 'text-red-600 dark:text-red-400' : 'text-stone-400 dark:text-stone-500'}`}>
            <Calendar className="w-3 h-3" />
            <span className="text-[10px] font-medium" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
              {relativeDate}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
