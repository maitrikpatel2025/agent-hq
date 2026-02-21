import { useState } from 'react'
import type { Task, TaskStatus, AgentRef } from '../types'
import { TaskCard } from './TaskCard'
import { Plus } from 'lucide-react'

interface TaskColumnProps {
  status: TaskStatus
  label: string
  tasks: Task[]
  agents: AgentRef[]
  accentColor: string
  onEditTask?: (taskId: string) => void
  onDeleteTask?: (taskId: string) => void
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void
  onCreateInColumn?: () => void
}

function getAgent(agents: AgentRef[], agentId: string | null): AgentRef | undefined {
  if (!agentId) return undefined
  return agents.find((a) => a.id === agentId)
}

export function TaskColumn({
  status,
  label,
  tasks,
  agents,
  accentColor,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onCreateInColumn,
}: TaskColumnProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      onStatusChange?.(taskId, status)
    }
  }

  return (
    <div
      className={`flex flex-col min-w-[280px] w-[280px] lg:min-w-0 lg:w-auto lg:flex-1 shrink-0 rounded-2xl transition-colors duration-150 ${
        dragOver
          ? 'bg-violet-50/60 dark:bg-violet-950/20 ring-2 ring-violet-300 dark:ring-violet-700 ring-dashed'
          : 'bg-stone-50/60 dark:bg-stone-900/40'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${accentColor}`} />
          <h3 className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            {label}
          </h3>
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-200/80 dark:bg-stone-700/80 text-[10px] font-bold text-stone-600 dark:text-stone-400"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onCreateInColumn}
          className="p-1 rounded-md text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-white dark:hover:bg-stone-800 transition-colors"
          title={`Add task to ${label}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-2.5 pb-2.5 space-y-2">
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <div className="w-10 h-10 rounded-xl bg-stone-200/50 dark:bg-stone-800/50 flex items-center justify-center mb-2">
              <Plus className="w-4 h-4 text-stone-400 dark:text-stone-500" />
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 text-center">
              No tasks here yet.
              <br />
              Drag a card or add one.
            </p>
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            agent={getAgent(agents, task.assignedAgentId)}
            onEdit={() => onEditTask?.(task.id)}
            onDelete={() => onDeleteTask?.(task.id)}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', task.id)
              e.dataTransfer.effectAllowed = 'move'
            }}
            onDragEnd={() => setDragOver(false)}
          />
        ))}
      </div>
    </div>
  )
}
