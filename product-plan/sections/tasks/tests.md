# Test Specs: Tasks

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview
Kanban task board with 4 columns, drag-and-drop, task creation/editing, and agent assignment.

---

## User Flow Tests

### Flow 1: Create a New Task
**Steps:**
1. User clicks "+ New Task" button
2. Modal opens with empty form
3. User fills in title, description, selects agent, sets priority to "High", sets due date
4. User clicks "Create Task"

**Expected Results:**
- [ ] `onCreateTask` is called with task data
- [ ] Modal closes
- [ ] New task appears in the default column (Scheduled)

#### Failure Path: Missing Title
**Steps:**
1. User opens create modal
2. User leaves title empty
3. User clicks "Create Task"

**Expected Results:**
- [ ] Validation error shown for title field
- [ ] Modal stays open

### Flow 2: Edit a Task
**Steps:**
1. User clicks menu icon on a task card
2. User clicks "Edit"
3. Modal opens pre-filled with task data
4. User changes priority to "Low"
5. User clicks "Save Changes"

**Expected Results:**
- [ ] `onUpdateTask` is called with task ID and updates
- [ ] Card updates with new priority badge

### Flow 3: Drag Task Between Columns
**Steps:**
1. User drags a task card from "Queue" to "In Progress"

**Expected Results:**
- [ ] `onStatusChange` is called with task ID and "in-progress"
- [ ] Card moves to the In Progress column
- [ ] Column counts update

### Flow 4: Delete a Task
**Steps:**
1. User clicks menu icon on a task card
2. User clicks "Delete"
3. Confirmation dialog appears
4. User confirms deletion

**Expected Results:**
- [ ] `onDeleteTask` is called with task ID
- [ ] Card is removed from board
- [ ] Column count decrements

---

## Empty State Tests

### No Tasks
**Setup:** `tasks` array is empty

**Expected Results:**
- [ ] All columns show empty state
- [ ] "+ New Task" button is visible

### Empty Column
**Setup:** One column has no tasks

**Expected Results:**
- [ ] Column shows "0" count
- [ ] Drop target area is visible for drag-and-drop

---

## Component Interaction Tests

### Task Card
- [ ] Shows priority badge with color (low=neutral, medium=amber, high=red)
- [ ] Shows title and truncated description
- [ ] Shows assigned agent emoji and name (or "Unassigned")
- [ ] Shows due date as relative time
- [ ] Overdue dates shown in red

### Task Column
- [ ] Shows column title and task count badge
- [ ] Has "+" button to add task directly to that column

---

## Edge Cases
- [ ] Task with no assigned agent shows "Unassigned" label
- [ ] Task with no due date omits due date display
- [ ] Very long task titles truncate on card
- [ ] Overdue tasks show red "X days overdue" badge
