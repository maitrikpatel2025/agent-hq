# Milestone 7: Tasks

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Implement the Tasks section — a Kanban-style task board for managing one-off assignments.

## Overview

The Tasks board provides a visual way to manage agent assignments across 4 status columns. Users can create tasks, assign them to agents, set priorities and due dates, and drag cards between columns to track progress.

**Key Functionality:**
- View all tasks in a 4-column Kanban board (Scheduled, Queue, In Progress, Done)
- Create new tasks with title, description, agent, priority, and due date
- Edit existing tasks by clicking their cards
- Delete tasks with confirmation
- Drag and drop cards between columns to change status
- Assign or reassign tasks to agents

## Components Provided

Copy from `product-plan/sections/tasks/components/`:

- `TaskBoard` — Kanban layout with drag-drop support and modal management
- `TaskColumn` — Individual column with header, count badge, and task list
- `TaskCard` — Card with priority badge, title, description, agent, due date
- `TaskFormModal` — Modal for creating and editing tasks

## Props Reference

**Data props:**

- `tasks: Task[]` — Task objects with id, title, description, status, priority, assignedAgentId, dueDate
- `agents: AgentRef[]` — Minimal agent references (id, emoji, name) for assignment dropdowns

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onCreateTask` | User submits the create task modal |
| `onUpdateTask` | User saves changes to an existing task |
| `onDeleteTask` | User confirms task deletion |
| `onStatusChange` | Task card dragged to a different column |
| `onAssignAgent` | Task assigned or reassigned to an agent |

## Expected User Flows

### Flow 1: Create a New Task
1. User clicks "+ New Task" button
2. Modal opens with empty form
3. User fills in title, description, selects agent, sets priority and due date
4. User clicks "Create Task"
5. **Outcome:** New task card appears in the Scheduled column

### Flow 2: Move Task to In Progress
1. User drags a task card from "Queue" column
2. User drops it on "In Progress" column
3. **Outcome:** Card moves, column counts update, `onStatusChange` called

### Flow 3: Edit a Task
1. User clicks menu icon on a task card, then "Edit"
2. Modal opens pre-filled with task data
3. User changes priority and clicks "Save Changes"
4. **Outcome:** Card updates with new priority badge

### Flow 4: Delete a Task
1. User clicks menu icon on a task card, then "Delete"
2. Confirmation appears
3. User confirms
4. **Outcome:** Card removed, column count decrements

## Empty States

- **No tasks at all:** All columns show empty state, "+ New Task" button prominent
- **Empty column:** Column shows "0" count with visible drop target area

## Testing

See `product-plan/sections/tasks/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/tasks/README.md` — Feature overview
- `product-plan/sections/tasks/tests.md` — UI behavior test specs
- `product-plan/sections/tasks/components/` — React components
- `product-plan/sections/tasks/types.ts` — TypeScript interfaces
- `product-plan/sections/tasks/sample-data.json` — Test data
- `product-plan/sections/tasks/screenshot.png` — Visual reference

## Done When

- [ ] 4-column Kanban board renders (Scheduled, Queue, In Progress, Done)
- [ ] Each column shows task count
- [ ] Task cards display title, priority badge, agent, due date, description snippet
- [ ] Drag-and-drop moves cards between columns
- [ ] Create modal opens, validates, and submits
- [ ] Edit modal pre-fills with task data
- [ ] Delete shows confirmation dialog
- [ ] Priority badges colored: low=neutral, medium=amber, high=red
- [ ] Due dates shown as relative time, overdue in red
- [ ] Empty states display properly
- [ ] Responsive on mobile
- [ ] Matches the visual design (see screenshot)
