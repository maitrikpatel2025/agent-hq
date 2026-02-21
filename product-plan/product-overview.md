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
