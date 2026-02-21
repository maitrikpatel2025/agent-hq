# Test Specs: Dashboard

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview
The Dashboard displays a 2x3 widget grid: agent status, recent activity, cost summary, schedule preview, pipeline status, and quick actions.

---

## User Flow Tests

### Flow 1: Navigate to Agent Detail
**Setup:** Dashboard loaded with 6 agents in the status grid

**Steps:**
1. User sees the "Agents" widget with agent cards
2. User clicks an agent card (e.g., "Atlas")

**Expected Results:**
- [ ] `onAgentClick` is called with the agent's ID
- [ ] Agent card shows hover state on mouse over

### Flow 2: View Activity Detail
**Setup:** Dashboard loaded with 7 recent activity items

**Steps:**
1. User sees the "Recent Activity" widget
2. User clicks an activity item

**Expected Results:**
- [ ] `onActivityClick` is called with the activity ID
- [ ] Activity items show agent name, relative timestamp, and message snippet

### Flow 3: Navigate to Usage from Cost Summary
**Steps:**
1. User sees "Cost Today" widget with dollar amount
2. User clicks the cost widget

**Expected Results:**
- [ ] `onCostClick` is called
- [ ] Cost shows today's total as large number
- [ ] Delta badge shows comparison to yesterday (green if lower, red if higher)

### Flow 4: Execute Quick Action
**Steps:**
1. User sees "Quick Actions" widget
2. User clicks "Dispatch Task" button

**Expected Results:**
- [ ] `onQuickAction` is called with "tasks" as target section

---

## Empty State Tests

### No Agents
**Setup:** `agents` array is empty

**Expected Results:**
- [ ] Agent status grid shows empty state or placeholder

### No Recent Activity
**Setup:** `recentActivity` array is empty

**Expected Results:**
- [ ] Activity feed shows empty state message

---

## Component Interaction Tests

### Cost Summary Card
- [ ] Displays today's total formatted as currency (e.g., "$14.87")
- [ ] Shows delta percentage with trend arrow
- [ ] Shows "Top spender" with agent name and amount

### Pipeline Overview
- [ ] Shows counts for Scheduled, Queue, Active, Done columns
- [ ] Stacked bar visualizes proportions
- [ ] Clicking a column calls `onPipelineColumnClick`

### Schedule Preview
- [ ] Lists upcoming jobs sorted by next run time
- [ ] Shows relative time (e.g., "8h 35m")
- [ ] Paused jobs show "paused" instead of time

---

## Edge Cases
- [ ] Handles 0 agents gracefully
- [ ] Handles very long agent names with truncation
- [ ] Cost delta of 0% shows neutral state
- [ ] Pipeline with all zeros renders correctly
