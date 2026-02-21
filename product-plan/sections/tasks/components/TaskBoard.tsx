import { useState, useMemo } from 'react'
import type { TasksProps, Task, TaskStatus } from '../types'
import { TaskColumn } from './TaskColumn'
import { TaskFormModal } from './TaskFormModal'
import { Plus, ListChecks } from 'lucide-react'

const COLUMNS: { status: TaskStatus; label: string; accent: string }[] = [
  { status: 'scheduled', label: 'Scheduled', accent: 'bg-violet-500' },
  { status: 'queue', label: 'Queue', accent: 'bg-amber-500' },
  { status: 'in-progress', label: 'In Progress', accent: 'bg-emerald-500' },
  { status: 'done', label: 'Done', accent: 'bg-stone-400 dark:bg-stone-500' },
]

export function TaskBoard({
  tasks: initialTasks,
  agents,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onStatusChange,
}: TasksProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('scheduled')

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      scheduled: [],
      queue: [],
      'in-progress': [],
      done: [],
    }
    tasks.forEach((t) => grouped[t.status]?.push(t))
    return grouped
  }, [tasks])

  const totalTasks = tasks.length

  const handleOpenCreate = (status: TaskStatus = 'scheduled') => {
    setEditingTask(undefined)
    setDefaultStatus(status)
    setModalOpen(true)
  }

  const handleOpenEdit = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setEditingTask(task)
      setModalOpen(true)
    }
  }

  const handleSubmit = (data: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      onUpdateTask?.(editingTask.id, data)
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...data } : t))
      )
    } else {
      onCreateTask?.(data)
      const newTask: Task = {
        ...data,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setTasks((prev) => [...prev, newTask])
    }
    setModalOpen(false)
    setEditingTask(undefined)
  }

  const handleDelete = (taskId: string) => {
    onDeleteTask?.(taskId)
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    setModalOpen(false)
    setEditingTask(undefined)
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    onStatusChange?.(taskId, newStatus)
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    )
  }

  return (
    <div className="h-full flex flex-col" style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      {/* Header bar */}
      <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
              <ListChecks className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100 leading-tight">
                Tasks
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                <span style={{ fontFamily: '"IBM Plex Mono", monospace' }}>{totalTasks}</span>{' '}
                {totalTasks === 1 ? 'task' : 'tasks'} across all columns
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenCreate('scheduled')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors shadow-sm shadow-violet-600/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-3 p-4 sm:p-6 h-full min-w-min lg:min-w-0">
          {COLUMNS.map((col) => (
            <TaskColumn
              key={col.status}
              status={col.status}
              label={col.label}
              tasks={tasksByStatus[col.status]}
              agents={agents}
              accentColor={col.accent}
              onEditTask={handleOpenEdit}
              onDeleteTask={handleDelete}
              onStatusChange={handleStatusChange}
              onCreateInColumn={() => handleOpenCreate(col.status)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <TaskFormModal
          task={editingTask}
          agents={agents}
          defaultStatus={defaultStatus}
          onSubmit={handleSubmit}
          onDelete={editingTask ? () => handleDelete(editingTask.id) : undefined}
          onClose={() => {
            setModalOpen(false)
            setEditingTask(undefined)
          }}
        />
      )}
    </div>
  )
}
