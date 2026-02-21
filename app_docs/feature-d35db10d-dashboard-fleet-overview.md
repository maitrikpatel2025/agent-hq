# Dashboard Fleet Overview Widget Grid

**ADW ID:** d35db10d
**Date:** 2026-02-21
**Specification:** specs/issue-12-adw-d35db10d-sdlc_planner-dashboard-fleet-overview-widget-grid.md

## Overview

Replaces the basic 2-column dashboard with a polished 2×3 widget grid that gives operators at-a-glance visibility into the entire agent fleet. Six purpose-built widgets display agent status, recent activity, cost, scheduled jobs, task pipeline, and quick actions — all backed by a new FastAPI `/api/dashboard` aggregation endpoint.

## What Was Built

- **AgentStatusGrid** — Displays agents with online/offline/busy status dot indicators and model labels
- **ActivityFeed** — Scrollable list of recent sessions with agent name, relative timestamp, and message snippet
- **CostSummaryCard** — Today's total spend as a large formatted number with a delta badge vs. yesterday
- **SchedulePreview** — Upcoming scheduled jobs sorted by next run time with countdown timers
- **PipelineOverview** — Scheduled / Queue / Active / Done task counts with a stacked bar chart
- **QuickActionsPanel** — One-click shortcuts: Dispatch Task → `/tasks`, Start Council → `/ai-council`, Create Job → `/jobs`
- **Backend `/api/dashboard`** — FastAPI router that concurrently aggregates agents, sessions, usage, and jobs from the gateway into widget-ready shapes
- **Sample-data fallback** — When the gateway is disconnected the dashboard renders with `dashboard-sample.json` and shows an amber banner
- **Responsive layout** — 3-column on ≥1280 px, 2-column on ≥768 px, 1-column on mobile

## Technical Implementation

### Files Modified

- `app/client/src/pages/Dashboard.jsx`: Rewritten to use `fetchDashboard()`, render 6 widgets in a 2×3 grid, and handle loading/error/disconnected states
- `app/client/src/services/gateway.js`: Added `fetchDashboard()` function calling `GET /api/dashboard`
- `app/server/server.py`: Added `include_router(dashboard_router)` to register the new dashboard API
- `app/server/gateway_client.py`: Minor reference updates
- `app/server/gateway_models.py`: Minor model cleanup
- `app/server/tests/test_gateway_client.py`: Updated tests

### New Files

- `app/client/src/components/dashboard/AgentStatusGrid.jsx`: Ported from TypeScript product-plan widget
- `app/client/src/components/dashboard/ActivityFeed.jsx`: Ported from TypeScript product-plan widget
- `app/client/src/components/dashboard/CostSummaryCard.jsx`: Ported from TypeScript product-plan widget
- `app/client/src/components/dashboard/SchedulePreview.jsx`: Ported from TypeScript product-plan widget
- `app/client/src/components/dashboard/PipelineOverview.jsx`: Ported from TypeScript product-plan widget
- `app/client/src/components/dashboard/QuickActionsPanel.jsx`: Ported from TypeScript product-plan widget
- `app/client/src/components/dashboard/index.js`: Barrel export for all six dashboard widgets
- `app/client/src/data/dashboard-sample.json`: Canonical sample data used as disconnected-state fallback
- `app/server/dashboard_routes.py`: FastAPI router with `GET /api/dashboard` aggregation endpoint
- `.claude/commands/e2e/test_dashboard_fleet_overview.md`: E2E test spec for the widget grid

### Key Changes

- The backend endpoint (`GET /api/dashboard`) fires four concurrent gateway RPC calls via `asyncio.gather` and maps raw results to widget-ready shapes; individual call failures are handled gracefully, returning partial data with HTTP 200
- `yesterdayTotal` is hardcoded to `0` (historical day-bucketed usage not yet available in the gateway); the delta badge will show a 100% increase until a future milestone adds date-bucketed storage
- `pipeline` (Scheduled/Queue/Active/Done) is hardcoded to all zeros because a tasks endpoint is not yet available; only `dashboard_routes.py` needs updating when one is added
- All six widgets were ported from TypeScript to JSX by removing `import type`, interface declarations, and explicit type annotations while preserving all className, logic, and helper functions
- `HealthMonitoringWidget` is preserved as a full-width row above the 2×3 grid

## How to Use

1. Navigate to the root path (`/`) in the Agent HQ application
2. The Dashboard page loads and fetches `/api/dashboard` on mount
3. While data is loading, 6 animated skeleton cards are shown
4. Once loaded, the 6 widgets render in a responsive grid:
   - Click any **agent card** → navigates to `/agents`
   - Click the **Activity Feed** or its "View all" link → navigates to `/activity`
   - Click the **Cost Summary card** → navigates to `/usage`
   - Click any **job row** → navigates to `/jobs`
   - Click a **pipeline column** → navigates to `/tasks`
   - Click **Dispatch Task** → navigates to `/tasks`
   - Click **Start Council** → navigates to `/ai-council`
   - Click **Create Job** → navigates to `/jobs`
5. If the gateway is disconnected, sample data is shown with an amber "Gateway not connected" banner

## Configuration

No environment variables or configuration options are required beyond the existing gateway connection settings. The dashboard endpoint reads from the same `GATEWAY_URL` used by other routes.

## Testing

Run the E2E test suite for this feature:

```bash
# From project root — see .claude/commands/test_e2e.md for full instructions
# Execute: .claude/commands/e2e/test_dashboard_fleet_overview.md
```

Run backend tests:

```bash
cd app/server && uv run pytest
```

Run frontend lint and build:

```bash
cd app/client && npx eslint src/ --max-warnings=0 --quiet
cd app/client && npm run build
```

## Notes

- `lucide-react` is already installed and used by the ported widgets — no new npm packages required
- No new Python packages are required
- When a tasks API becomes available, only `app/server/dashboard_routes.py` needs updating to populate real pipeline counts
- When historical usage storage is added, `dashboard_routes.py` can populate `yesterdayTotal` for a meaningful cost delta
- The `onQuickAction` callback uses the `targetSection` string directly as the route path (`/tasks`, `/ai-council`, `/jobs`)
