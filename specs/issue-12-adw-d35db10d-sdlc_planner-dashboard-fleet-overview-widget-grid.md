# Feature: Dashboard - Fleet Overview with 2x3 Widget Grid

## Metadata
issue_number: `12`
adw_id: `d35db10d`
issue_json: `{"number":12,"title":"Dashboard - Fleet Overview with 2x3 Widget Grid","body":"/feature adw_sdlc_iso\nmodel_set base\n\nDashboard - Fleet Overview with 2x3 Widget Grid\n\nImplement the Dashboard section — the single-screen entry point providing at-a-glance visibility into the entire agent fleet through a 2x3 widget grid layout."}`

## Feature Description
Replace the existing basic dashboard with a polished 2×3 widget grid that gives operators immediate at-a-glance visibility into fleet health. The dashboard displays six purpose-built widgets: an agent status grid with online/offline/busy indicators, a scrollable recent-activity feed, a cost summary card with a delta badge comparing today vs yesterday, a scheduled-jobs preview with countdown timers, a task pipeline overview with a stacked bar chart, and a quick-actions panel for common workflow shortcuts. All widgets are backed by real data from the FastAPI backend. Pre-built, fully-styled React components from `product-plan/sections/dashboard/components/` are ported from TypeScript to JSX and integrated into the existing app.

## User Story
As an Agent HQ operator
I want a dashboard with a 2×3 widget grid showing agent status, activity, costs, jobs, tasks, and quick actions
So that I can assess fleet health and take action from a single screen

## Problem Statement
The current dashboard (`app/client/src/pages/Dashboard.jsx`) is a bare-bones 2-column grid with unstyled section cards. It lacks the polished widget design specified in the product plan and doesn't surface costs, pipeline task counts, or quick-action shortcuts. Operators must navigate away to obtain even basic fleet status.

## Solution Statement
Port the seven pre-built React components from `product-plan/sections/dashboard/components/` to JSX, placing them in `app/client/src/components/dashboard/`. Add a FastAPI dashboard router (`app/server/dashboard_routes.py`) that aggregates and transforms gateway data into shapes the widgets expect. Rewrite `app/client/src/pages/Dashboard.jsx` to fetch from `/api/dashboard`, map the response to component props, wire navigation callbacks via `useNavigate`, and handle loading, error, and empty states. The existing `HealthMonitoringWidget` is preserved as a full-width header row above the 2×3 grid.

## Relevant Files

- `app/client/src/pages/Dashboard.jsx` — Main dashboard page to be rewritten; replaces the existing basic grid with the 2×3 widget layout
- `app/client/src/App.jsx` — Root component; already imports and routes Dashboard; no routing changes needed, but callback wiring (`onAgentClick` → `/agents`) is implemented inside Dashboard.jsx using `useNavigate`
- `app/client/src/services/gateway.js` — Axios API service layer; already has `fetchAgents`, `fetchSessions`, `fetchSessionsUsage`, `fetchJobs`; a new `fetchDashboard` function will be added
- `app/client/src/components/HealthMonitoringWidget.jsx` — Existing widget to preserve in full-width header row
- `app/client/src/context/GatewayContext.jsx` — Provides `isConnected`; dashboard reads it to decide whether to show real data or disconnected state
- `app/client/src/hooks/useGateway.js` — `useGateway()` hook consumed inside Dashboard.jsx for connection state
- `app/server/server.py` — FastAPI app; needs `include_router(dashboard_router)` added
- `app/server/gateway_routes.py` — Existing gateway routes; reference for router pattern and gateway client usage
- `app/server/gateway_client.py` — Reference for how to call the gateway from route handlers
- `product-plan/sections/dashboard/components/Dashboard.tsx` — Source component to port
- `product-plan/sections/dashboard/components/AgentStatusGrid.tsx` — Source widget to port
- `product-plan/sections/dashboard/components/ActivityFeed.tsx` — Source widget to port
- `product-plan/sections/dashboard/components/CostSummaryCard.tsx` — Source widget to port
- `product-plan/sections/dashboard/components/SchedulePreview.tsx` — Source widget to port
- `product-plan/sections/dashboard/components/PipelineOverview.tsx` — Source widget to port
- `product-plan/sections/dashboard/components/QuickActionsPanel.tsx` — Source widget to port
- `product-plan/sections/dashboard/types.ts` — TypeScript interface definitions; used as reference for prop shapes in JSX components
- `product-plan/sections/dashboard/sample-data.json` — Canonical data shape and fallback for disconnected state
- `product-plan/sections/dashboard/tests.md` — Behavioral test specs
- `.claude/commands/test_e2e.md` — Read to understand how to execute E2E tests
- `.claude/commands/e2e/test_application_shell.md` — Reference format for E2E test files

### New Files
- `app/client/src/components/dashboard/AgentStatusGrid.jsx` — Ported widget
- `app/client/src/components/dashboard/ActivityFeed.jsx` — Ported widget
- `app/client/src/components/dashboard/CostSummaryCard.jsx` — Ported widget
- `app/client/src/components/dashboard/SchedulePreview.jsx` — Ported widget
- `app/client/src/components/dashboard/PipelineOverview.jsx` — Ported widget
- `app/client/src/components/dashboard/QuickActionsPanel.jsx` — Ported widget
- `app/client/src/components/dashboard/index.js` — Barrel export for all dashboard widgets
- `app/server/dashboard_routes.py` — FastAPI router exposing `/api/dashboard` that aggregates agents, activity, cost, jobs, and pipeline data
- `.claude/commands/e2e/test_dashboard_fleet_overview.md` — E2E test validating the 2×3 widget grid renders correctly

## Implementation Plan

### Phase 1: Foundation
Create the E2E test file and port the six pre-built widget components from TypeScript to JSX. Remove all TypeScript-specific syntax (`import type`, interface declarations, explicit type annotations) and ensure the components work as plain JSX with the same visual output. Export from a barrel file.

### Phase 2: Core Implementation
Add the FastAPI dashboard router (`dashboard_routes.py`) with a single `GET /api/dashboard` endpoint. The endpoint aggregates data from the gateway:
- **Agents**: map gateway agents to `{ id, name, role, model, status }` — map `identity.name`, `model_id` and infer `status` from agent presence
- **Activity**: map the 7 most-recent sessions (with `includeLastMessage: true`) to `{ id, agentName, timestamp, snippet }`
- **Cost**: derive from `fetchSessionsUsage` (today's total vs a 0-baseline or stored yesterday value); expose `{ todayTotal, yesterdayTotal, currency, topAgent }`
- **Jobs**: map gateway jobs to `{ id, name, agentName, nextRunAt, enabled }`
- **Pipeline**: derive from gateway tasks if available, else return zeros; expose `{ scheduled, queue, inProgress, done }`
- **QuickActions**: return static hardcoded list (Dispatch Task → tasks, Start Council → ai-council, Create Job → jobs)
All data is returned in a single JSON object from `GET /api/dashboard`.

Add `fetchDashboard()` to `app/client/src/services/gateway.js`.

### Phase 3: Integration
Rewrite `app/client/src/pages/Dashboard.jsx` to:
1. Call `fetchDashboard()` on mount (and when `isConnected` changes)
2. Show per-widget loading skeletons while fetching
3. Show per-widget empty states when arrays are empty
4. Pass navigation callbacks (`onAgentClick` → `/agents`, `onActivityClick` → `/activity`, `onCostClick` → `/usage`, `onJobClick` → `/jobs`, `onPipelineColumnClick` → `/tasks`, `onQuickAction` → route by section name)
5. Preserve the existing `HealthMonitoringWidget` as a full-width row above the 2×3 grid

## Step by Step Tasks

### Step 1: Create the E2E test file
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_application_shell.md` to understand the format
- Create `.claude/commands/e2e/test_dashboard_fleet_overview.md` with these steps:
  - Step 1: Navigate to Dashboard at `/`, take screenshot `01_dashboard_initial_load.png`; **Verify**: page title "Dashboard" and subtitle "Fleet overview and quick actions" are visible; **Verify**: 6 widget cards are rendered in a grid
  - Step 2: Verify Agent Status widget; **Verify**: heading "Agents" is visible; **Verify**: at least one agent card is rendered (or an empty-state message); **Screenshot**: `02_agent_status_widget.png`
  - Step 3: Verify Activity Feed widget; **Verify**: heading "Recent Activity" is visible; **Verify**: at least one activity row or empty-state; **Screenshot**: `03_activity_feed_widget.png`
  - Step 4: Verify Cost Summary widget; **Verify**: heading "Cost Today" is visible; **Verify**: a dollar-amount number is displayed; **Screenshot**: `04_cost_summary_widget.png`
  - Step 5: Verify Schedule Preview widget; **Verify**: heading "Schedule" is visible; **Verify**: at least one job row or empty-state; **Screenshot**: `05_schedule_preview_widget.png`
  - Step 6: Verify Pipeline Overview widget; **Verify**: heading "Pipeline" is visible; **Verify**: column labels Scheduled, Queue, Active, Done are visible; **Screenshot**: `06_pipeline_overview_widget.png`
  - Step 7: Verify Quick Actions panel; **Verify**: heading "Quick Actions" is visible; **Verify**: "Dispatch Task", "Start Council", "Create Job" buttons are visible; **Screenshot**: `07_quick_actions_panel.png`
  - Step 8: Click "Dispatch Task" quick-action button; **Verify**: URL changes to `/tasks`; **Screenshot**: `08_quick_action_navigation.png`
  - Step 9: Navigate back to `/`; resize to 768px wide; **Verify**: widgets collapse to 2-column layout; **Screenshot**: `09_tablet_layout.png`
  - Step 10: Resize to 375px wide; **Verify**: widgets collapse to single-column layout; **Screenshot**: `10_mobile_layout.png`
  - Success criteria: all 6 widget headings visible, quick-action navigation works, responsive layout collapses correctly

### Step 2: Port AgentStatusGrid component
- Read `product-plan/sections/dashboard/components/AgentStatusGrid.tsx`
- Create `app/client/src/components/dashboard/AgentStatusGrid.jsx`
- Remove `import type`, TypeScript interfaces, and explicit type annotations
- Preserve all className, logic, and structure exactly as-is
- Keep `formatModel` helper and `statusStyles` map

### Step 3: Port ActivityFeed component
- Read `product-plan/sections/dashboard/components/ActivityFeed.tsx`
- Create `app/client/src/components/dashboard/ActivityFeed.jsx`
- Remove TypeScript syntax; preserve `formatRelativeTime`, `avatarPalettes`, `getAvatarPalette` helpers

### Step 4: Port CostSummaryCard component
- Read `product-plan/sections/dashboard/components/CostSummaryCard.tsx`
- Create `app/client/src/components/dashboard/CostSummaryCard.jsx`
- Remove TypeScript syntax; preserve delta calculation and TrendingUp/TrendingDown icons

### Step 5: Port SchedulePreview component
- Read `product-plan/sections/dashboard/components/SchedulePreview.tsx`
- Create `app/client/src/components/dashboard/SchedulePreview.jsx`
- Remove TypeScript syntax; preserve `formatCountdown` helper, sorting by `nextRunAt`, and paused-job opacity

### Step 6: Port PipelineOverview component
- Read `product-plan/sections/dashboard/components/PipelineOverview.tsx`
- Create `app/client/src/components/dashboard/PipelineOverview.jsx`
- Remove TypeScript syntax; preserve `columns` config array, stacked-bar calculation, and click handlers

### Step 7: Port QuickActionsPanel component
- Read `product-plan/sections/dashboard/components/QuickActionsPanel.tsx`
- Create `app/client/src/components/dashboard/QuickActionsPanel.jsx`
- Remove TypeScript syntax; preserve `actionIcons` and `actionStyles` maps with Lucide icons

### Step 8: Create barrel export
- Create `app/client/src/components/dashboard/index.js` that re-exports all six widgets:
  ```js
  export { AgentStatusGrid } from './AgentStatusGrid'
  export { ActivityFeed } from './ActivityFeed'
  export { CostSummaryCard } from './CostSummaryCard'
  export { SchedulePreview } from './SchedulePreview'
  export { PipelineOverview } from './PipelineOverview'
  export { QuickActionsPanel } from './QuickActionsPanel'
  ```

### Step 9: Create backend dashboard router
- Read `app/server/gateway_routes.py` and `app/server/gateway_client.py` to understand the pattern
- Create `app/server/dashboard_routes.py` with a FastAPI `APIRouter` and `GET /api/dashboard` endpoint:
  - Call `gateway_client` for agents, sessions (with `limit=7, includeLastMessage=true`), session usage, and jobs
  - Map agents: `id`, `identity.name` → `name`, `model_id` → `model`, infer `status` as `"online"` if present (gateway agents don't expose real-time status, so default to `"online"`), `role` from `identity.role` or model label
  - Map activity: take first 7 sessions → `{ id: session.key, agentName: session.agentId, timestamp: session.updatedAt, snippet: session.lastMessage?.content[:120] or "" }`
  - Map cost: use `usage.total.cost` for `todayTotal`, `0` for `yesterdayTotal` (no historical data yet), topAgent derived from per-agent usage if available; currency `"USD"`
  - Map jobs: `{ id, name, agentName: job.agentId, nextRunAt: job.nextRunAt or job.schedule, enabled }`
  - Pipeline: default `{ scheduled: 0, queue: 0, inProgress: 0, done: 0 }` (tasks endpoint not yet available)
  - QuickActions: hardcoded static list matching sample-data.json
  - Handle gateway disconnected: return empty arrays and zeroed cost gracefully with HTTP 200 (don't error out)
  - Wrap all gateway calls in try/except and return partial data on failure

### Step 10: Register dashboard router in server
- Read `app/server/server.py`
- Import `dashboard_router` from `dashboard_routes`
- Add `app.include_router(dashboard_router)` after the gateway router include

### Step 11: Add fetchDashboard to frontend service layer
- Read `app/client/src/services/gateway.js`
- Add `export async function fetchDashboard()` that calls `GET /api/dashboard` and returns the full response object

### Step 12: Rewrite Dashboard page
- Read `app/client/src/pages/Dashboard.jsx` (current state)
- Rewrite it to:
  - Import `useNavigate` from `react-router-dom`, `useGateway` from hooks, `fetchDashboard` from services
  - Import all six widgets from `../components/dashboard`
  - Import `HealthMonitoringWidget` from `../components/HealthMonitoringWidget`
  - State: `dashboardData`, `loading`, `error`
  - `useEffect` on mount: call `fetchDashboard()`, set state; show loading state while pending
  - If `!isConnected`: show a banner "Gateway not connected — showing sample data" and render widgets with `sample-data.json` fallback (import the JSON file directly)
  - Navigation callbacks using `useNavigate`:
    - `onAgentClick` → `navigate('/agents')`
    - `onActivityClick` → `navigate('/activity')`
    - `onCostClick` → `navigate('/usage')`
    - `onJobClick` → `navigate('/jobs')`
    - `onPipelineColumnClick` → `navigate('/tasks')`
    - `onQuickAction(section)` → `navigate('/' + (section === 'ai-council' ? 'ai-council' : section))`
  - Layout: `min-h-full bg-stone-50 dark:bg-stone-950 p-4 sm:p-6 lg:p-8` outer div; header row with "Dashboard" h1; full-width `HealthMonitoringWidget`; then the 2×3 widget `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6`
  - Loading skeleton: show 6 `rounded-2xl bg-white dark:bg-stone-900 animate-pulse h-64` placeholder cards while fetching
  - Error state: show a simple error message card if fetch fails but gateway is connected

### Step 13: Run validation commands
- Execute all commands listed in the **Validation Commands** section

## Testing Strategy

### Unit Tests
- No new backend unit tests are strictly required; the `/api/dashboard` endpoint is a thin aggregation layer over already-tested gateway calls
- If the project adds tests later, test that the endpoint returns 200 with the correct shape when gateway is connected and when disconnected

### Edge Cases
- **Gateway disconnected**: frontend shows sample-data fallback; backend endpoint returns zeroed/empty data gracefully
- **No agents**: `AgentStatusGrid` receives an empty array; should render a placeholder (add a guard inside the component if not already present in the source TSX)
- **No recent sessions**: `ActivityFeed` receives empty array; renders "No recent activity" empty state
- **No scheduled jobs**: `SchedulePreview` receives empty array; renders empty state
- **All pipeline columns at zero**: `PipelineOverview` renders all zeros; stacked bar shows empty gray bar; no divide-by-zero crash
- **Long agent/job names**: components use `truncate` utility class — preserved from source
- **Cost delta of 0**: delta percentage calculation must not crash when `yesterdayTotal === 0`; guard with `yesterdayTotal > 0 ? ... : 0`

## Acceptance Criteria
- Dashboard renders with a 2×3 widget grid (3 columns on xl, 2 on md, 1 on mobile)
- Agent status grid shows agents with online/offline/busy dot indicators
- Activity feed shows recent items with agent name, relative timestamp, and message snippet
- Cost summary displays today's total as a large formatted number with delta badge
- Schedule preview lists upcoming jobs sorted by next run time with countdown timers
- Pipeline overview shows Scheduled / Queue / Active / Done counts with stacked bar
- Quick actions panel shows "Dispatch Task", "Start Council", "Create Job" buttons
- Clicking "Dispatch Task" navigates to `/tasks`; "Start Council" → `/ai-council`; "Create Job" → `/jobs`
- Clicking an agent card navigates to `/agents`
- Clicking the cost widget navigates to `/usage`
- Clicking a pipeline column navigates to `/tasks`
- Empty states render properly when data arrays are empty
- Responsive: 3-column on ≥1280px, 2-column on ≥768px, 1-column on mobile
- Loading skeleton shows while API call is pending
- Error state shows if API call fails (gateway connected but error returned)
- Sample-data fallback shows when gateway is disconnected
- ESLint passes with zero warnings
- Frontend build succeeds with no errors
- Backend pytest passes with zero regressions

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_dashboard_fleet_overview.md` to validate the 2×3 widget grid renders correctly with screenshots
- `cd app/server && uv run pytest` - Run server tests to validate the feature works with zero regressions
- `cd app/client && npx eslint src/ --max-warnings=0 --quiet` - Run frontend lint check to validate the feature works with zero regressions
- `cd app/client && npm run build` - Run frontend build to validate the feature works with zero regressions

## Notes
- All six widget components are ported from TypeScript to JSX — no TypeScript compiler or `@types/*` packages are needed; the project uses plain JSX throughout (`App.jsx`, all page files)
- The `HealthMonitoringWidget` already exists and is currently rendered inside Dashboard.jsx — it must be preserved as a full-width row above the new 2×3 grid
- The `product-plan/sections/dashboard/sample-data.json` can be imported directly into Dashboard.jsx as a JSON module (Create React App supports JSON imports out of the box) to serve as the disconnected-state fallback
- For `CostSummary.yesterdayTotal`: the gateway does not currently expose per-day historical usage, so `yesterdayTotal` defaults to `0`. The delta badge will show the full `todayTotal` as a 100% increase. A future milestone can add date-bucketed usage storage to the backend to make this meaningful
- For `PipelineStatus`: a tasks endpoint is not yet available in the gateway router; the backend returns `{ scheduled: 0, queue: 0, inProgress: 0, done: 0 }` as a safe default. When a tasks API is implemented in a future milestone, only `dashboard_routes.py` needs updating
- No new npm packages are required; `lucide-react` is already installed (confirmed by existing usage in CostSummaryCard and SchedulePreview source)
- No new Python packages are required
- The `onQuickAction` callback uses the `targetSection` string directly as the route path — for the "ai-council" section the path is `/ai-council` which matches the App.jsx route definition
