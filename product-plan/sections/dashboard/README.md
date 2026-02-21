# Dashboard

## Overview
The Dashboard is Agent HQ's single-screen entry point providing at-a-glance visibility into the entire agent fleet. It displays a 2x3 widget grid covering agent status, recent activity, today's cost summary, upcoming schedule, task pipeline status, and quick actions.

## User Flows
- View all agents in a status grid showing name, model, and online/offline/busy indicator; click to navigate to detail
- Scan recent activity feed (last 5-8 items) with agent name, timestamp, and response snippet
- Check today's spend in cost summary with comparison to yesterday
- Preview upcoming scheduled jobs with job name, agent, and next run time
- View task pipeline counts across Scheduled, Queue, In Progress, and Done
- Use quick action buttons to dispatch task, start council, or create job

## Design Decisions
- 2x3 responsive grid layout collapses to 2-column on tablet, single-column on mobile
- Each widget is a card with title header and "View all →" link
- Cost summary uses large number with delta badge (green for lower, red for higher)
- Agent status grid uses compact identity cards with colored status dots

## Data Shapes
**Entities:** DashboardAgent, ActivityItem, CostSummary, ScheduledJobPreview, PipelineStatus, QuickAction

## Visual Reference
See `screenshot.png` for the target UI design.

## Components Provided
- `Dashboard` — Main container orchestrating the 2x3 widget grid
- `AgentStatusGrid` — 2-column grid showing agent status cards
- `ActivityFeed` — Scrollable list of recent agent activities
- `CostSummaryCard` — Cost card with delta trend and top spender
- `SchedulePreview` — Upcoming jobs timeline
- `PipelineOverview` — Stacked bar chart and status column counts
- `QuickActionsPanel` — Quick access buttons for common actions

## Callback Props
| Callback | Triggered When |
|----------|---------------|
| `onAgentClick` | User clicks an agent card |
| `onActivityClick` | User clicks an activity item |
| `onCostClick` | User clicks cost summary |
| `onJobClick` | User clicks a scheduled job |
| `onPipelineColumnClick` | User clicks a pipeline column |
| `onQuickAction` | User clicks a quick action button |
