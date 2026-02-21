/** Task status matching the Kanban board columns */
export type TaskStatus = "scheduled" | "queue" | "in-progress" | "done";

/** Priority levels for task urgency */
export type TaskPriority = "low" | "medium" | "high";

/** Minimal agent reference for display on task cards */
export interface AgentRef {
  id: string;
  emoji: string;
  name: string;
}

/** A one-off assignment managed on the Kanban board */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedAgentId: string | null;
  dueDate: string | null;
  createdAt: string;
}

/** Props for the Tasks section screen design */
export interface TasksProps {
  tasks: Task[];
  agents: AgentRef[];

  /** Called when the user creates a new task */
  onCreateTask?: (task: Omit<Task, "id" | "createdAt">) => void;

  /** Called when the user updates an existing task */
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;

  /** Called when the user deletes a task */
  onDeleteTask?: (taskId: string) => void;

  /** Called when a task is dragged to a different column (status change) */
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;

  /** Called when a task is assigned or reassigned to an agent */
  onAssignAgent?: (taskId: string, agentId: string | null) => void;
}
