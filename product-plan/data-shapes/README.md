# UI Data Shapes

These types define the shape of data that the UI components expect to receive as props. They represent the **frontend contract** — what the components need to render correctly.

How you model, store, and fetch this data on the backend is an implementation decision. You may combine, split, or extend these types to fit your architecture.

## Entities

- **DashboardAgent** — Compact agent summary for the dashboard status grid (used in: dashboard)
- **ActivityItem** — Recent agent response for dashboard feed (used in: dashboard)
- **CostSummary** — Today's cost with comparison to yesterday (used in: dashboard)
- **ScheduledJobPreview** — Upcoming scheduled job preview (used in: dashboard)
- **PipelineStatus** — Task counts by kanban column (used in: dashboard)
- **QuickAction** — Quick action shortcut (used in: dashboard)
- **Agent** — Full AI agent with identity, personality, and configuration (used in: agents, ai-council)
- **AgentFormData** — Fields for creating/updating an agent (used in: agents)
- **ActivityEntry** — Complete interaction record with tokens, cost, channel (used in: activity)
- **UsageSummary** — Aggregate metrics for a time period (used in: usage)
- **TimeSeriesPoint** — Single data point on the usage trend chart (used in: usage)
- **AgentUsage** — Per-agent cost and token breakdown (used in: usage)
- **ModelUsage** — Per-model cost and token breakdown (used in: usage)
- **Job** — Scheduled/recurring job synced with gateway (used in: jobs)
- **JobRun** — Single execution of a job (used in: jobs)
- **Task** — One-off assignment on the kanban board (used in: tasks)
- **AgentRef** — Minimal agent reference for display (used in: tasks, skills)
- **Skill** — Agent capability with enable/disable state (used in: skills)
- **CouncilSession** — Strategic debate session (used in: ai-council)
- **CouncilMessage** — Single message in a debate thread (used in: ai-council)
- **CouncilSynthesis** — Auto-generated synthesis of a debate (used in: ai-council)

## Per-Section Types

Each section includes its own `types.ts` with the full interface definitions:

- `sections/dashboard/types.ts`
- `sections/agents/types.ts`
- `sections/activity/types.ts`
- `sections/usage/types.ts`
- `sections/jobs/types.ts`
- `sections/tasks/types.ts`
- `sections/skills/types.ts`
- `sections/ai-council/types.ts`

## Combined Reference

See `overview.ts` for all entity types aggregated in one file.
