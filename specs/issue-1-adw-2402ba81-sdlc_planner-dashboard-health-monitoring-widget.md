# Feature: Dashboard Health Monitoring Widget

## Metadata
issue_number: `1`
adw_id: `2402ba81`
issue_json: `{"number":1,"title":"Dashboard Health Monitoring Widget","body":"/feature\nadw_plan_build_review_iso\nmodel_set heavy\n\nDashboard Health Monitoring Widget\n\nI want to see real-time system health status on the Dashboard\nSo that I can monitor the OpenClaw Gateway connection and server status at a glance\n\nAcceptance Criteria:\n- Widget displays gateway connection state (connected/disconnected/reconnecting) with color indicators\n- Shows server version, uptime, and connection ID\n- Displays count of available RPC methods and events\n- Auto-refreshes status every 30 seconds\n- Uses existing `useGateway` hook and `/api/gateway/status` endpoint\n- Shows last heartbeat timestamp\n- Responsive layout that fits within the existing Dashboard grid"}`

## Feature Description
A health monitoring widget added to the Dashboard page that surfaces real-time OpenClaw Gateway connection status at a glance. The widget displays the gateway connection state with color-coded visual indicators (green/amber/red), server version, connection ID, uptime, counts of available RPC methods and events, and the timestamp of the last heartbeat. It auto-refreshes every 30 seconds using the existing `useGateway` hook and `/api/gateway/status` endpoint, fitting seamlessly into the existing 2-column Dashboard grid.

## User Story
As an Agent HQ operator
I want to see real-time system health status on the Dashboard
So that I can monitor the OpenClaw Gateway connection and server status at a glance

## Problem Statement
The Dashboard currently shows agents, usage, activity, and jobs—but provides no at-a-glance visibility into the health of the underlying OpenClaw Gateway connection. Operators must infer gateway health from the small header status pill or navigate away from the Dashboard. There is no single widget that surfaces connection state, server metadata (version, connId, uptime), capability counts (RPC methods / events), and the freshness of the last status check.

## Solution Statement
Add a `HealthMonitoringWidget` React component to the Dashboard grid that reads all required data from the existing `useGateway` hook (which already polls `/api/gateway/status` via `GatewayContext`). Extend `GatewayContext` to track `lastHeartbeat` (the timestamp of the last successful status fetch) and expose it through the `useGateway` hook. The widget renders a full-width card (spanning both columns on large screens) with a color-coded state badge, server metadata fields, capability counts, and the last heartbeat time. A dedicated 30-second `setInterval` inside the widget calls `refreshStatus` to fulfill the explicit auto-refresh requirement.

## Relevant Files

- `app/client/src/pages/Dashboard.jsx` — Main dashboard page; needs import and render of `HealthMonitoringWidget` inside the grid.
- `app/client/src/context/GatewayContext.jsx` — Central gateway state; add `lastHeartbeat` state updated on each successful status fetch; expose it through context value.
- `app/client/src/hooks/useGateway.js` — Custom hooks; update `useGateway()` and `useGatewayStatus()` returns to include `lastHeartbeat`.
- `app/client/src/components/GatewayStatus.jsx` — Existing header status indicator; reference for color-coding patterns to reuse in the new widget.
- `app/client/src/services/gateway.js` — API service layer; `fetchGatewayStatus` already calls `GET /api/gateway/status`—no changes needed.
- `app/server/gateway_routes.py` — Existing `/api/gateway/status` endpoint already returns all required data (`state`, `server`, `availableMethods`, `availableEvents`, `uptimeMs`)—no changes needed.
- `app/server/gateway_models.py` — `ConnectionStatus` Pydantic model; confirms available fields—no changes needed.
- `app/client/src/index.css` — Tailwind base; no changes needed, all styling via Tailwind utility classes.
- `.claude/commands/test_e2e.md` — Read to understand how to execute E2E tests.
- `.claude/commands/e2e/test_application_shell.md` — Reference for E2E test file structure/format.

### New Files
- `app/client/src/components/HealthMonitoringWidget.jsx` — New widget component rendering the health monitoring card.
- `.claude/commands/e2e/test_dashboard_health_monitoring_widget.md` — E2E test file validating the widget renders and displays correct data.

## Implementation Plan

### Phase 1: Foundation
Extend `GatewayContext` to track `lastHeartbeat` and expose it through the `useGateway` hook so the widget has a reliable timestamp for the last successful status check.

### Phase 2: Core Implementation
Create `HealthMonitoringWidget.jsx` as a self-contained React component that:
- Reads `status`, `isConnected`, `isConnecting`, `refreshStatus`, and `lastHeartbeat` from `useGateway`
- Renders a full-width `SectionCard`-style card with color-coded state badge, metadata fields, and counts
- Sets up a 30-second `setInterval` calling `refreshStatus` (cleared on unmount)
- Provides meaningful fallbacks (`—`) when fields are unavailable (e.g., disconnected state)

### Phase 3: Integration
Add `HealthMonitoringWidget` to `Dashboard.jsx` as a full-width row above the existing 2-column cards, and create the E2E test file to validate the end-to-end behavior.

## Step by Step Tasks

### Step 1: Create the E2E test file
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_application_shell.md` to understand the format
- Create `.claude/commands/e2e/test_dashboard_health_monitoring_widget.md` with:
  - User story matching the feature
  - Step 1: Navigate to Dashboard, verify a "Gateway Health" (or similar) widget card is present in the page
  - Step 2: Verify the widget shows a connection state badge with a color indicator (green dot for connected, amber for connecting/reconnecting, red for disconnected)
  - Step 3: Verify the widget displays server metadata fields: Version, Connection ID, Uptime
  - Step 4: Verify the widget displays RPC Methods count and Events count (numeric values or dashes if disconnected)
  - Step 5: Verify the widget displays a "Last Heartbeat" timestamp (a date/time string or "Never")
  - Step 6: Take a screenshot of the full widget
  - Success criteria: widget card is visible, state badge matches connection state, all fields are present

### Step 2: Extend GatewayContext with lastHeartbeat
- Read `app/client/src/context/GatewayContext.jsx`
- Add `const [lastHeartbeat, setLastHeartbeat] = useState(null)` to state
- After each successful `fetchGatewayStatus()` call in the polling `useEffect`, call `setLastHeartbeat(new Date())`
- Add `lastHeartbeat` to the context value object

### Step 3: Expose lastHeartbeat through useGateway hook
- Read `app/client/src/hooks/useGateway.js`
- Destructure `lastHeartbeat` from `useContext(GatewayContext)` in both `useGateway()` and `useGatewayStatus()`
- Include `lastHeartbeat` in both hooks' return values

### Step 4: Create HealthMonitoringWidget component
- Create `app/client/src/components/HealthMonitoringWidget.jsx` with:
  - Import `useEffect` from react, `useGateway` hook, and `Heart` or `Activity` icon from `lucide-react`
  - Helper `formatUptime(ms)` that converts milliseconds to human-readable string (e.g., "2d 4h 31m")
  - Helper `formatHeartbeat(date)` that shows relative/absolute timestamp or "Never"
  - State badge with color mapping:
    - `connected` → green dot + "Connected" label (`text-emerald-600`, `bg-emerald-50 dark:bg-emerald-950`)
    - `connecting` / `reconnecting` → amber pulsing dot + label (`text-amber-600`, `bg-amber-50 dark:bg-amber-950`)
    - `disconnected` → red dot + "Disconnected" label (`text-red-600`, `bg-red-50 dark:bg-red-950`)
  - Grid of metadata items (label + value pairs): Version, Connection ID, Uptime, RPC Methods, Events, Last Heartbeat
  - `useEffect` that sets up `setInterval(refreshStatus, 30_000)` and returns cleanup
  - Card container using same `bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-5` pattern as `SectionCard` in Dashboard

### Step 5: Integrate HealthMonitoringWidget into Dashboard
- Read `app/client/src/pages/Dashboard.jsx` (already read, confirms structure)
- Import `HealthMonitoringWidget` at top of Dashboard.jsx
- Add the widget as the first child inside the grid `div`, wrapped in a `col-span-1 lg:col-span-2` div so it spans the full width on large screens:
  ```jsx
  <div className="col-span-1 lg:col-span-2">
    <HealthMonitoringWidget />
  </div>
  ```
- Place it before the existing Agents/Usage/Activity/Jobs cards

### Step 6: Run validation commands
- Execute all commands listed in the **Validation Commands** section to confirm zero regressions

## Testing Strategy

### Unit Tests
- No new backend unit tests required (the `/api/gateway/status` endpoint is already tested in `app/server/tests/test_gateway_routes.py`; no server changes are made)
- The `HealthMonitoringWidget` is a pure React component reading from context; its correctness is validated via the E2E test and ESLint

### Edge Cases
- **Disconnected state**: All server-specific fields (`version`, `connId`, `uptimeMs`, `availableMethods`, `availableEvents`) will be `null`/`undefined`—widget must display `—` fallbacks without crashing
- **Connecting/Reconnecting state**: Partial data may be available; widget must handle gracefully
- **Zero methods/events**: Display `0` not a crash
- **`lastHeartbeat` never set** (on first render before first poll): Display "Never"
- **Very large uptime**: `formatUptime` must handle values in days correctly

## Acceptance Criteria
- Widget card is visible on the Dashboard page above the existing 4 cards
- Connection state badge shows green for connected, amber (pulsing) for connecting/reconnecting, red for disconnected
- Server Version field shows the version string or `—` when disconnected
- Connection ID field shows `connId` or `—` when disconnected
- Uptime field shows human-readable duration (e.g., "1d 2h 15m") or `—` when disconnected
- RPC Methods field shows numeric count of `availableMethods` or `—` when disconnected
- Events field shows numeric count of `availableEvents` or `—` when disconnected
- Last Heartbeat field shows a timestamp or "Never" on first load
- Widget calls `refreshStatus` every 30 seconds automatically
- Widget fits within the existing Dashboard grid and is responsive (full width on large screens, single column on mobile)
- ESLint passes with zero warnings
- Frontend builds without errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_dashboard_health_monitoring_widget.md` to validate the health monitoring widget renders and displays correct data with screenshots
- `cd app/server && uv run pytest` — Run server tests to validate the feature works with zero regressions
- `cd app/client && npx eslint src/ --max-warnings=0 --quiet` — Run frontend lint check to validate the feature works with zero regressions
- `cd app/client && npm run build` — Run frontend build to validate the feature works with zero regressions

## Notes
- The `GatewayContext` already polls `/api/gateway/status` every 10 seconds; the widget's 30-second `setInterval` is an additional explicit refresh that satisfies the AC and documents the intent, but in practice the context state may update more frequently from the existing polling—this is acceptable and beneficial.
- The `ConnectionStatus` model returned by `/api/gateway/status` already contains all required fields: `state`, `server.version`, `server.connId`, `uptimeMs`, `availableMethods`, `availableEvents`. No server changes are needed.
- `lastHeartbeat` is a `Date` object (not a server-provided timestamp); it tracks when the client last successfully received a status response, which is a good proxy for "last heartbeat".
- Follow the Tailwind/Lucide/stone color palette patterns from `Dashboard.jsx` and `GatewayStatus.jsx` for visual consistency.
- No new npm packages are required.
