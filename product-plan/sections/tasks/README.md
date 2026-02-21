# Tasks

## Overview
Kanban-style task board for managing one-off assignments across the agent fleet. Users can create, view, edit, delete, and assign tasks to agents, then drag cards between columns.

## User Flows
- View all tasks in 4-column Kanban board (Scheduled, Queue, In Progress, Done)
- Create a new task via modal with title, description, agent, priority, due date
- Edit a task by clicking its card
- Delete a task from edit modal or context menu
- Drag and drop cards between columns
- Assign/reassign tasks to agents

## Design Decisions
- 4-column Kanban with drag-and-drop
- Priority badges: low = neutral, medium = amber, high = red
- Due dates as relative time ("Tomorrow", "In 3 days", "Overdue")
- Empty column state with placeholder message

## Data Shapes
**Entities:** Task, AgentRef

## Visual Reference
See `screenshot.png` for the target UI design.

## Components Provided
- `TaskBoard` — Kanban layout with drag-drop and modal management
- `TaskColumn` — Individual column with header and task count
- `TaskCard` — Card with priority badge, title, description, agent, due date
- `TaskFormModal` — Modal for creating/editing tasks

## Callback Props
| Callback | Triggered When |
|----------|---------------|
| `onCreateTask` | User creates a new task |
| `onUpdateTask` | User updates a task |
| `onDeleteTask` | User deletes a task |
| `onStatusChange` | Task dragged to different column |
| `onAssignAgent` | Task assigned to agent |
