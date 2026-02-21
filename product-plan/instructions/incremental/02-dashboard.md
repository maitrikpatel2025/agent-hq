# Milestone 2: Dashboard

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
