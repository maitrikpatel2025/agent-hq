# Agent HQ — Complete Implementation Instructions

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

## Testing

Each section includes a `tests.md` file with UI behavior test specs. These are **framework-agnostic** — adapt them to your testing setup.

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

---

# Agent HQ — Product Overview

## Summary

Agent HQ is a personal mission control dashboard for managing, monitoring, and coordinating a multi-agent AI team running on OpenClaw. It gives solo operators complete visibility into what each agent is doing, tools to coordinate their work through tasks and scheduled jobs, and clear insight into per-agent usage costs — all synced in real-time from the OpenClaw Gateway via WebSocket.

## Planned Sections

1. **Dashboard** — At-a-glance system overview showing a 2x3 agent status grid, recent activity feed, usage cost summary, schedule preview, and pipeline status — the single-screen entry point for the entire agent fleet.
2. **Agents** — Agent roster auto-synced from the gateway with identity cards showing emoji, name, role, model, and channel binding, plus detail views with personality profile, configuration, session history, and per-agent activity.
3. **Activity** — Chronological feed of all agent responses aggregated across the fleet with filtering by agent, model, date, and keyword search — providing a unified audit trail of everything the agents have done.
4. **Usage** — Token and cost analytics with time-period selection (today, week, month, year), trend charts over time, and breakdowns by agent and by model — giving full visibility into API spend.
5. **Jobs** — Scheduled and recurring job management 2-way synced with the gateway's cron system — view, create, edit, enable/disable jobs with cron configuration, timezone support, and run history tracking.
6. **Tasks** — Kanban-style task board with Scheduled, Queue, In Progress, and Done columns for one-off assignments — agent assignment, priority levels, due dates, and dispatch to agents via the gateway API.
7. **Skills** — Skills panel 2-way synced with the gateway's skill registry — view all available skills, enable/disable per agent, check requirement status (env vars, binaries), and push changes back to OpenClaw.
8. **AI Council** — Multi-agent strategic debate system where all agents weigh in on a topic with their unique perspectives — session creation, real-time debate feed, synthesis of recommendations, and session history.

## Product Entities

- **Agent** — An AI assistant with a distinct identity (emoji, name, role) and configuration. Discovered dynamically from the OpenClaw Gateway.
- **Activity** — A record of an agent's response, including message content, tokens used, cost, and timestamp.
- **Job** — A scheduled or recurring task assigned to an agent with cron schedule, timezone, and instructions. Synced 2-way with the gateway.
- **JobRun** — A single execution of a job, capturing output, status (success/failed), duration, and cost.
- **Task** — A one-off assignment with status (scheduled, queue, in-progress, done), priority level, and optional due date.
- **Skill** — A capability available to agents (e.g., weather lookup, Slack integration). Has enable/disable state and per-agent assignment.
- **CouncilSession** — A strategic debate session with topic, participating agents, messages, and synthesized recommendation.

## Design System

**Colors:**
- Primary: `violet` — Buttons, links, active nav items, key accents
- Secondary: `emerald` — Online status, success states, status indicators
- Neutral: `stone` — Backgrounds, text, borders, cards

**Typography:**
- Heading: DM Sans
- Body: DM Sans
- Mono: IBM Plex Mono

## Implementation Sequence

Build this product in milestones:

1. **Shell** — Set up design tokens and application shell (collapsible sidebar + header)
2. **Dashboard** — At-a-glance fleet overview with 2x3 widget grid
3. **Agents** — Agent roster with card grid/table views and CRUD operations
4. **Activity** — Sortable, filterable data table of all agent responses
5. **Usage** — Token and cost analytics with charts and breakdown tables
6. **Jobs** — Scheduled job table with inline run history expansion
7. **Tasks** — Kanban task board with drag-and-drop
8. **Skills** — Skills card grid with per-agent assignment modal
9. **AI Council** — Multi-agent debate with session thread and synthesis

Each milestone has a dedicated instruction document in `product-plan/instructions/`.

---

# Milestone 1: Shell

> **Prerequisites:** None

## Goal

Set up the design tokens and application shell — the persistent chrome that wraps all sections.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Colors:**
- **Primary:** `violet` — Buttons, links, active nav items, key accents
- **Secondary:** `emerald` — Online status, success states, status indicators
- **Neutral:** `stone` — Backgrounds, text, borders, cards

**Typography:**
- **Heading:** DM Sans (semibold/bold weights)
- **Body:** DM Sans (regular/medium weights)
- **Mono:** IBM Plex Mono (monospaced values, token counts, costs)

### 2. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with collapsible sidebar and header
- `MainNav.tsx` — Sidebar navigation with icon mapping
- `UserMenu.tsx` — Header user menu with avatar and dropdown

**Wire Up Navigation:**

Connect navigation to your routing:

| Navigation Item | Route | Description |
|----------------|-------|-------------|
| Dashboard | `/` or `/dashboard` | At-a-glance system overview |
| Agents | `/agents` | Agent roster with identity cards |
| Activity | `/activity` | Chronological feed of agent responses |
| Usage | `/usage` | Token and cost analytics |
| Jobs | `/jobs` | Scheduled job management |
| Tasks | `/tasks` | Kanban task board |
| Skills | `/skills` | Skills panel |
| AI Council | `/ai-council` | Multi-agent debate system |
| Settings | `/settings` | Application configuration (utility) |
| Help | `/help` | Documentation and support (utility) |

**User Menu:**

The user menu expects:
- User name (string)
- Avatar initials fallback (auto-generated from name)
- Logout callback

**Layout:**
- Sidebar width: 240px expanded, 64px collapsed
- Header height: 56px
- Content area fills remaining space with overflow scrolling
- Sidebar collapse state persisted to localStorage

**Responsive Behavior:**
- **Desktop:** Full sidebar (expandable/collapsible via toggle)
- **Tablet:** Sidebar defaults to collapsed (icon-only)
- **Mobile:** Sidebar hidden, accessible via hamburger menu as overlay

## Files to Reference

- `product-plan/design-system/` — Design tokens (colors, fonts, CSS)
- `product-plan/shell/README.md` — Shell design intent and layout specs
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (violet/emerald/stone palette, DM Sans + IBM Plex Mono fonts)
- [ ] Shell renders with collapsible sidebar navigation
- [ ] All 10 navigation items link to correct routes
- [ ] Active navigation item is highlighted with violet accent
- [ ] User menu shows user info with avatar initials
- [ ] Sidebar collapse toggle works and persists to localStorage
- [ ] Responsive: sidebar collapses on tablet, becomes overlay on mobile
- [ ] Light and dark mode both work

---

# Milestone 2: Dashboard

> **Prerequisites:** Milestone 1 (Shell) complete

## Goal

Implement the Dashboard — the single-screen entry point providing at-a-glance visibility into the entire agent fleet.

## Overview

The Dashboard gives operators immediate insight into fleet health through a 2x3 widget grid. Users can assess agent status, scan recent activity, check today's costs, preview upcoming jobs, monitor the task pipeline, and take quick actions — all without navigating away.

**Key Functionality:**
- View all agents in a compact status grid with online/offline indicators
- Scan a scrollable feed of recent agent activity
- Check today's API spend with comparison to yesterday
- Preview upcoming scheduled jobs with countdown timers
- View task pipeline counts across 4 kanban columns
- Execute quick actions (dispatch task, start council, create job)

## Components Provided

Copy the section components from `product-plan/sections/dashboard/components/`:

- `Dashboard` — Main container orchestrating the 2x3 widget grid layout
- `AgentStatusGrid` — 2-column grid of compact agent status cards
- `ActivityFeed` — Scrollable list of recent agent activities with timestamps
- `CostSummaryCard` — Cost display with delta badge and top spender info
- `SchedulePreview` — Upcoming jobs timeline sorted by next run
- `PipelineOverview` — Stacked bar chart and column counts for task statuses
- `QuickActionsPanel` — Prominent buttons for common workflow actions

## Props Reference

**Data props:**

- `agents: DashboardAgent[]` — Agent ID, name, role, model, status (online/offline/busy)
- `recentActivity: ActivityItem[]` — Activity ID, agent name, timestamp, message snippet
- `costSummary: CostSummary` — Today's total, yesterday's total, currency, top agent spender
- `upcomingJobs: ScheduledJobPreview[]` — Job ID, name, agent, next run time, enabled state
- `pipeline: PipelineStatus` — Counts for scheduled, queue, inProgress, done
- `quickActions: QuickAction[]` — Action ID, label, description, target section

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onAgentClick` | User clicks an agent card in the status grid |
| `onActivityClick` | User clicks an activity item in the feed |
| `onCostClick` | User clicks the cost summary widget |
| `onJobClick` | User clicks a scheduled job preview |
| `onPipelineColumnClick` | User clicks a pipeline status column |
| `onQuickAction` | User clicks a quick action button |

## Expected User Flows

### Flow 1: Check Fleet Health
1. User opens Dashboard (default landing page)
2. User scans the agent status grid for any offline/busy agents
3. User checks the cost widget for today's spend vs yesterday
4. **Outcome:** User has immediate visibility into fleet health

### Flow 2: Navigate to Agent Detail
1. User sees an agent card in the status grid
2. User clicks the agent card
3. **Outcome:** Navigation to the Agents section with that agent selected

### Flow 3: Execute Quick Action
1. User clicks "Dispatch Task" in the Quick Actions widget
2. **Outcome:** Navigation to Tasks section with creation flow pre-started

## Empty States

- **No agents:** Agent grid shows placeholder message
- **No activity:** Activity feed shows "No recent activity" message
- **No scheduled jobs:** Schedule widget shows empty state
- **All pipeline columns at 0:** Pipeline shows zero counts

## Testing

See `product-plan/sections/dashboard/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/dashboard/README.md` — Feature overview
- `product-plan/sections/dashboard/tests.md` — UI behavior test specs
- `product-plan/sections/dashboard/components/` — React components
- `product-plan/sections/dashboard/types.ts` — TypeScript interfaces
- `product-plan/sections/dashboard/sample-data.json` — Test data
- `product-plan/sections/dashboard/screenshot.png` — Visual reference

## Done When

- [ ] Dashboard renders with 2x3 widget grid layout
- [ ] Agent status grid shows agents with online/offline indicators
- [ ] Activity feed shows recent items with agent name and timestamp
- [ ] Cost summary displays today's total with delta badge
- [ ] Schedule preview lists upcoming jobs with countdown
- [ ] Pipeline overview shows column counts with visual bar
- [ ] Quick actions navigate to correct sections
- [ ] All callback props wired to working navigation
- [ ] Empty states display properly when no data
- [ ] Responsive: collapses to 2-column on tablet, single on mobile
- [ ] Matches the visual design (see screenshot)

---

# Milestone 3: Agents

> **Prerequisites:** Milestone 1 (Shell) complete

## Goal

Implement the Agents section — the roster and management hub for the entire AI agent fleet.

## Overview

The Agents section lets users browse all agents in a toggleable card grid or table view, search by name or role, and perform full CRUD operations — creating new agents, viewing identity profiles, editing configuration via modal dialogs, and removing agents.

**Key Functionality:**
- Browse agents in card grid view (default) or table view
- Search agents by name or role
- View full agent identity and personality profile
- Create new agents via modal dialog
- Edit existing agent configuration
- Delete agents with confirmation

## Components Provided

Copy from `product-plan/sections/agents/components/`:

- `AgentRoster` — Main view with search bar, grid/table toggle, create button
- `AgentCard` — Card showing agent emoji, name, role, model, status
- `AgentDetail` — Side panel with full agent identity and personality profile
- `AgentFormModal` — Modal dialog for creating and editing agents

## Props Reference

**Data props:**

- `agents: Agent[]` — Full agent objects with id, emoji, name, role, model, channelBinding, status, personality, createdAt

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onCreateAgent` | User submits the create agent modal |
| `onEditAgent` | User submits the edit agent modal |
| `onDeleteAgent` | User confirms agent deletion |
| `onSelectAgent` | User clicks an agent card to view details |

## Expected User Flows

### Flow 1: Create a New Agent
1. User clicks "+ New Agent" button
2. Modal opens with empty form (emoji, name, role, model, channel binding, personality)
3. User fills in fields and clicks "Create"
4. **Outcome:** New agent appears in the roster

### Flow 2: Edit an Agent
1. User clicks edit icon on an agent card
2. Modal opens pre-filled with agent data
3. User modifies fields and clicks "Save"
4. **Outcome:** Agent card updates with new information

### Flow 3: Delete an Agent
1. User clicks delete icon on an agent card
2. Confirmation dialog appears
3. User clicks "Delete" to confirm
4. **Outcome:** Agent removed from roster

### Flow 4: Search and Filter
1. User types "DevOps" in the search bar
2. **Outcome:** Only agents with matching name or role are shown

## Empty States

- **No agents:** Show message with prompt to create first agent, "+ New Agent" button visible
- **No search results:** Show "No agents match your search" message

## Testing

See `product-plan/sections/agents/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/agents/README.md` — Feature overview
- `product-plan/sections/agents/tests.md` — UI behavior test specs
- `product-plan/sections/agents/components/` — React components
- `product-plan/sections/agents/types.ts` — TypeScript interfaces
- `product-plan/sections/agents/sample-data.json` — Test data
- `product-plan/sections/agents/screenshot.png` — Visual reference

## Done When

- [ ] Agent roster renders in card grid view by default
- [ ] Grid/table toggle switches between views
- [ ] Search filters agents by name or role in real-time
- [ ] Clicking an agent card shows detail panel
- [ ] Create modal opens, validates, and submits correctly
- [ ] Edit modal pre-fills with agent data
- [ ] Delete shows confirmation before removing
- [ ] Empty state displays when no agents exist
- [ ] All callback props wired to working functionality
- [ ] Responsive on mobile
- [ ] Matches the visual design (see screenshot)

---

# Milestone 4: Activity

> **Prerequisites:** Milestone 1 (Shell) complete

## Goal

Implement the Activity section — a full audit trail of every agent response across the fleet.

## Overview

The Activity section presents all agent interactions as a sortable, filterable data table. Each entry captures the complete record — agent identity, message content, model, token breakdown, cost, channel, and response time — with expandable rows for full detail inspection and real-time updates.

**Key Functionality:**
- View chronological table of all agent activity
- Filter by agent, model, date range, channel, and skill
- Search activity entries by keyword
- Expand rows to see full message and token breakdown
- See new entries appear in real-time
- Clear all active filters

## Components Provided

Copy from `product-plan/sections/activity/components/`:

- `ActivityFeed` — Full-page data table with sorting, pagination, expandable rows
- `ActivityFilterBar` — Filter UI with search input, dropdowns, date range picker, filter chips

## Props Reference

**Data props:**

- `activities: ActivityEntry[]` — Full interaction records
- `filters: ActivityFilters` — Available filter options (agents, models, channels, skills)
- `activeFilters: ActiveFilters` — Currently applied filters
- `pagination: Pagination` — Page info (total, page, pageSize, totalPages)
- `sortField: SortField` — Current sort column
- `sortDirection: SortDirection` — asc or desc
- `expandedRowId: string | null` — Currently expanded row
- `isLive: boolean` — Whether real-time updates are active

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onFilterChange` | User changes any filter value |
| `onClearFilters` | User clicks "Clear all" |
| `onSort` | User clicks a column header |
| `onToggleRow` | User clicks a row to expand/collapse |
| `onPageChange` | User changes page |

## Expected User Flows

### Flow 1: Browse and Expand
1. User sees chronological table of activity entries
2. User clicks a row to see full details
3. **Outcome:** Row expands inline showing full message, token breakdown, session ID

### Flow 2: Filter by Agent
1. User selects an agent from the dropdown
2. Table filters to show only that agent's activity
3. Active filter chip appears
4. **Outcome:** Focused view of a single agent's history

### Flow 3: Search Messages
1. User types a keyword in search input
2. Table filters to entries containing that keyword
3. **Outcome:** Quick lookup of specific interactions

## Empty States

- **No activity entries:** Table shows "No activity recorded yet" message
- **No filter results:** Table shows "No results match your filters" with clear option

## Testing

See `product-plan/sections/activity/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/activity/README.md` — Feature overview
- `product-plan/sections/activity/tests.md` — UI behavior test specs
- `product-plan/sections/activity/components/` — React components
- `product-plan/sections/activity/types.ts` — TypeScript interfaces
- `product-plan/sections/activity/sample-data.json` — Test data
- `product-plan/sections/activity/screenshot.png` — Visual reference

## Done When

- [ ] Activity table renders with all columns
- [ ] Sorting works on clickable column headers
- [ ] Filters work for agent, model, channel, skill, date range, and search
- [ ] Active filter chips appear and are dismissible
- [ ] Rows expand inline to show full details
- [ ] Live indicator shows connection status
- [ ] Pagination or scroll works for large datasets
- [ ] Empty states display properly
- [ ] Responsive: table scrolls horizontally on mobile
- [ ] Matches the visual design (see screenshot)

---

# Milestone 5: Usage

> **Prerequisites:** Milestone 1 (Shell) complete

## Goal

Implement the Usage section — token and cost analytics with full visibility into API spend.

## Overview

The Usage section opens with summary metric cards showing total cost, tokens, and averages with sparklines, followed by a time-series trend chart and tabular breakdowns by agent and model — all filterable by time period.

**Key Functionality:**
- Select time period (today, week, month, year)
- View summary metric cards with sparklines and delta badges
- View cost-over-time trend chart
- View breakdown tables by agent and by model
- Compare current period to previous period

## Components Provided

Copy from `product-plan/sections/usage/components/`:

- `UsageAnalytics` — Main container with period selector tabs
- `MetricCard` — Individual metric display with sparkline chart
- `UsageChart` — SVG line/area chart showing cost over time
- `BreakdownTable` — Grid-based table for agent or model breakdowns

## Props Reference

**Data props:**

- `selectedPeriod: UsagePeriod` — "today" | "week" | "month" | "year"
- `summary: UsageSummary` — Totals, deltas, sparkline data
- `timeSeries: TimeSeriesPoint[]` — Date/cost/token data points for chart
- `byAgent: AgentUsage[]` — Per-agent cost and token breakdown
- `byModel: ModelUsage[]` — Per-model cost and token breakdown

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onPeriodChange` | User selects a different time period tab |
| `onAgentClick` | User clicks an agent row in breakdown |

## Expected User Flows

### Flow 1: Compare Time Periods
1. User sees "Week" selected by default
2. User clicks "Month" tab
3. **Outcome:** All metrics, chart, and tables update to monthly view

### Flow 2: Identify Top Spender
1. User scrolls to "By Agent" breakdown table
2. Agents are sorted by cost descending
3. **Outcome:** User identifies which agent has highest spend

## Empty States

- **No usage data:** Metric cards show $0.00, chart shows empty state
- **Single agent:** Breakdown shows one row

## Testing

See `product-plan/sections/usage/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/usage/README.md` — Feature overview
- `product-plan/sections/usage/tests.md` — UI behavior test specs
- `product-plan/sections/usage/components/` — React components
- `product-plan/sections/usage/types.ts` — TypeScript interfaces
- `product-plan/sections/usage/sample-data.json` — Test data
- `product-plan/sections/usage/screenshot.png` — Visual reference

## Done When

- [ ] Period selector tabs work (Today, Week, Month, Year)
- [ ] Metric cards show formatted numbers with sparklines and deltas
- [ ] Cost chart renders with correct data points
- [ ] By Agent table shows sorted breakdown with cost and tokens
- [ ] By Model table shows sorted breakdown
- [ ] Token counts abbreviated (1.2M, 450K)
- [ ] Currency formatted with 2 decimal places
- [ ] Responsive: breakdown tables stack on mobile
- [ ] Matches the visual design (see screenshot)

---

# Milestone 6: Jobs

> **Prerequisites:** Milestone 1 (Shell) complete

## Goal

Implement the Jobs section — scheduled and recurring job management synced with the gateway.

## Overview

The Jobs section displays all scheduled jobs in a table with key details visible at a glance. Users can toggle jobs on/off, filter and search, and expand rows to view run history — providing complete visibility into the automated job system.

**Key Functionality:**
- View all jobs in a table with name, agent, schedule, enabled status, last/next run
- Toggle job enabled/disabled state directly from the table
- Filter by agent and enabled status, search by name
- Expand rows inline to view recent run history

## Components Provided

Copy from `product-plan/sections/jobs/components/`:

- `JobsTable` — Main table with search, agent filter, status filter, expandable rows
- `RunHistoryTable` — Mini table showing recent job runs with status badges

## Props Reference

**Data props:**

- `jobs: Job[]` — Job objects with id, name, agent info, schedule, enabled state, last/next run
- `jobRuns: Record<string, JobRun[]>` — Keyed by job ID, array of run history entries

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onToggleEnabled` | User toggles a job's enabled switch |

## Expected User Flows

### Flow 1: Toggle Job Enabled State
1. User sees "Nightly Data Cleanup" with toggle off
2. User clicks the toggle switch
3. **Outcome:** Job becomes enabled, `onToggleEnabled` called with job ID and `true`

### Flow 2: View Run History
1. User clicks a job row
2. Row expands showing recent runs
3. **Outcome:** Run history table shows timestamp, status badge, duration

### Flow 3: Search and Filter
1. User types "health" in search, or selects agent from dropdown
2. **Outcome:** Table filters to matching jobs

## Empty States

- **No jobs:** Table shows "No scheduled jobs" message
- **No run history:** Expanded row shows "No runs yet"
- **No filter results:** Table shows "No jobs match" message

## Testing

See `product-plan/sections/jobs/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/jobs/README.md` — Feature overview
- `product-plan/sections/jobs/tests.md` — UI behavior test specs
- `product-plan/sections/jobs/components/` — React components
- `product-plan/sections/jobs/types.ts` — TypeScript interfaces
- `product-plan/sections/jobs/sample-data.json` — Test data
- `product-plan/sections/jobs/screenshot.png` — Visual reference

## Done When

- [ ] Jobs table renders with all columns
- [ ] Enable/disable toggle works for each job
- [ ] Search filters by job name
- [ ] Agent and status filter dropdowns work
- [ ] Rows expand to show run history inline
- [ ] Run status badges: green (success), red (failed), amber (running)
- [ ] Last run shows relative time with status dot
- [ ] Empty states display properly
- [ ] Responsive on mobile
- [ ] Matches the visual design (see screenshot)

---

# Milestone 7: Tasks

> **Prerequisites:** Milestone 1 (Shell) complete

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

---

# Milestone 8: Skills

> **Prerequisites:** Milestone 1 (Shell) complete

## Goal

Implement the Skills section — a panel for managing agent capabilities synced with the gateway.

## Overview

The Skills section displays all available agent capabilities in a card grid. Users can browse skills, toggle them globally on or off, and open a detail modal to manage per-agent assignment — controlling which agents have access to which skills.

**Key Functionality:**
- Browse all skills in a responsive card grid
- Toggle a skill's global enabled/disabled state from the card
- Open detail modal to view full description and manage per-agent assignment
- Toggle skill access per agent in the detail modal

## Components Provided

Copy from `product-plan/sections/skills/components/`:

- `SkillsPanel` — Grid layout of skill cards
- `SkillCard` — Card showing name, description, toggle, and agent count
- `SkillDetailModal` — Modal with global toggle and per-agent assignment list

## Props Reference

**Data props:**

- `skills: Skill[]` — Skill objects with id, name, description, enabled state, and agentIds
- `agents: AgentRef[]` — Agent references (id, emoji, name, role) for assignment UI

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onToggleSkill` | User toggles a skill's global enabled state |
| `onSelectSkill` | User clicks a skill card to open detail modal |
| `onToggleAgentSkill` | User toggles a skill for a specific agent |

## Expected User Flows

### Flow 1: Enable a Skill Globally
1. User sees "GitHub Issues" skill card with toggle off (muted)
2. User clicks the toggle switch
3. **Outcome:** Skill becomes enabled, card changes from muted to full color

### Flow 2: Manage Per-Agent Assignment
1. User clicks the "Web Search" skill card (not the toggle)
2. Detail modal opens with full description
3. User sees list of all agents with individual toggles
4. User enables the skill for a specific agent
5. User closes modal
6. **Outcome:** Skill's agent count updates on the card

## Empty States

- **No skills:** Grid shows "No skills available" message

## Testing

See `product-plan/sections/skills/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/skills/README.md` — Feature overview
- `product-plan/sections/skills/tests.md` — UI behavior test specs
- `product-plan/sections/skills/components/` — React components
- `product-plan/sections/skills/types.ts` — TypeScript interfaces
- `product-plan/sections/skills/sample-data.json` — Test data
- `product-plan/sections/skills/screenshot.png` — Visual reference

## Done When

- [ ] Skills card grid renders with all skills
- [ ] Global toggle enables/disables skills from the card
- [ ] Disabled skills appear muted/dimmed
- [ ] Clicking a card (not toggle) opens detail modal
- [ ] Detail modal shows full description and per-agent toggle list
- [ ] Per-agent toggles work independently
- [ ] Agent count on cards updates correctly
- [ ] Empty state displays when no skills
- [ ] Responsive on mobile
- [ ] Matches the visual design (see screenshot)

---

# Milestone 9: AI Council

> **Prerequisites:** Milestone 1 (Shell) complete

## Goal

Implement the AI Council — a multi-agent strategic debate system.

## Overview

The AI Council lets users pose a topic and have selected agents weigh in with their unique perspectives. Users create sessions with a topic, select participating agents and debate format, then watch a chat-style thread unfold. Completed sessions include an auto-generated synthesis with key takeaways and a recommended action.

**Key Functionality:**
- Create new council sessions with topic, agents, and debate format
- View real-time chat-style debate thread with agent messages
- View auto-generated synthesis with agreements, disagreements, and recommendation
- Browse past sessions from a chronological list
- Review completed session threads and syntheses

## Components Provided

Copy from `product-plan/sections/ai-council/components/`:

- `AICouncil` — Main view switching between session list and thread detail
- `SessionListItem` — List item showing topic, status badge, participant avatars, date
- `SessionThread` — Detail view with message thread and participant info
- `SynthesisPanel` — Panel showing summary, agreements, disagreements, recommendation
- `NewSessionModal` — Modal for creating sessions with topic, agent select, format

## Props Reference

**Data props:**

- `agents: Agent[]` — Available agents for session creation (id, emoji, name, role, model)
- `sessions: CouncilSession[]` — Session objects with topic, status, participants, messages, synthesis
- `debateFormats: DebateFormat[]` — Available debate formats (id, label, description)

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onCreateSession` | User submits the new session modal |
| `onSelectSession` | User clicks a session to view its thread |

## Expected User Flows

### Flow 1: Create a Council Session
1. User clicks "+ New Session" button
2. Modal opens with topic input, agent multi-select, format selector
3. User enters topic, selects agents, picks format
4. User clicks "Start Session"
5. **Outcome:** New session appears with "In Progress" status

### Flow 2: Review Completed Session
1. User clicks a completed session from the list
2. Thread view shows all agent messages chronologically
3. Synthesis panel shows summary, agreements, disagreements, recommendation
4. **Outcome:** User reviews the full debate and AI-generated synthesis

### Flow 3: Browse Session History
1. User sees chronological list of all sessions
2. Each shows topic, participant avatars, date, status badge
3. **Outcome:** Quick overview of all past debates

## Empty States

- **No sessions:** Show message prompting to create first session, "+ New Session" visible
- **In-progress session with no messages:** Show "Waiting for responses" state
- **No synthesis yet:** Hide synthesis panel for in-progress sessions

## Testing

See `product-plan/sections/ai-council/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/ai-council/README.md` — Feature overview
- `product-plan/sections/ai-council/tests.md` — UI behavior test specs
- `product-plan/sections/ai-council/components/` — React components
- `product-plan/sections/ai-council/types.ts` — TypeScript interfaces
- `product-plan/sections/ai-council/sample-data.json` — Test data
- `product-plan/sections/ai-council/screenshot.png` — Visual reference

## Done When

- [ ] Session list renders with topics, status badges, participant avatars, dates
- [ ] "+ New Session" opens creation modal
- [ ] Modal validates topic (required) and requires at least 2 agents
- [ ] Clicking a session opens its thread view
- [ ] Thread shows agent messages with emoji, name, timestamp
- [ ] Completed sessions show synthesis panel
- [ ] Synthesis shows summary, agreements, disagreements, recommendation
- [ ] Empty state shows when no sessions exist
- [ ] Responsive on mobile
- [ ] Matches the visual design (see screenshot)
