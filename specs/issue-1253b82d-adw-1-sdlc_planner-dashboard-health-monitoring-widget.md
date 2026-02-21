# Feature: Dashboard Health Monitoring Widget

## Metadata
issue_number: `1253b82d`
adw_id: `1`
issue_json: `{"number":1,"title":"Dashboard Health Monitoring Widget","body":"/feature\nadw_plan_build_review_iso\nmodel_set heavy\n\nDashboard Health Monitoring Widget\n\nI want to see real-time system health status on the Dashboard\nSo that I can monitor the OpenClaw Gateway connection and server status at a glance\n\nAcceptance Criteria:\n- Widget displays gateway connection state (connected/disconnected/reconnecting) with color indicators\n- Shows server version, uptime, and connection ID\n- Displays count of available RPC methods and events\n- Auto-refreshes status every 30 seconds\n- Uses existing `useGateway` hook and `/api/gateway/status` endpoint\n- Shows last heartbeat timestamp\n- Responsive layout that fits within the existing Dashboard grid"}`

## Feature Description
A health monitoring widget added to the Dashboard page that provides at-a-glance visibility into the OpenClaw Gateway connection state and server vitals. The widget renders a structured card using the existing `SectionCard` pattern, pulling all data from the `useGateway` hook (backed by the existing `/api/gateway/status` endpoint and SSE stream). It displays connection state with colour-coded indicators, server version/uptime/connection ID, counts of available RPC methods and events, and a last-heartbeat timestamp. The context polling interval is updated to 30 seconds to match the widget's refresh cadence.

## User Story
As an Agent HQ operator
I want to see real-time gateway health status on the Dashboard
So that I can monitor the OpenClaw Gateway connection and server vitals at a glance without navigating away from the main overview

## Problem Statement
The Dashboard currently shows agent data, usage summaries, activity, and jobs, but provides no direct visibility into the health of the underlying OpenClaw Gateway connection. Operators must infer connection state from the small header pill, and have no way to see server version, uptime, connection ID, available capabilities, or heartbeat timestamps from the dashboard.

## Solution Statement
Add a `GatewayHealthWidget` component to the Dashboard grid. It reads all required state from the existing `useGateway` hook (which already exposes `status.state`, `status.server`, `status.availableMethods`, `status.availableEvents`, and `status.uptimeMs`). To support the last-heartbeat requirement, add a `lastHeartbeat` timestamp to `GatewayContext` that is updated on every received SSE event (including pings) and on every successful status poll. Update the `GatewayContext` polling interval from 10 s to 30 s to match the spec's auto-refresh cadence.

## Relevant Files

- `app/client/src/context/GatewayContext.jsx` — Add `lastHeartbeat` state tracking; update polling interval from 10 s to 30 s
- `app/client/src/hooks/useGateway.js` — Already exports `useGateway` and `useGatewayStatus`; no changes needed unless we expose `lastHeartbeat` through the context value
- `app/client/src/pages/Dashboard.jsx` — Import and render `GatewayHealthWidget` inside the grid
- `app/client/src/components/GatewayStatus.jsx` — Reference only; the existing header pill; no changes
- `app/client/src/services/gateway.js` — Reference only; `fetchGatewayStatus` already calls `/api/gateway/status`
- `app/server/gateway_routes.py` — Reference only; `/api/gateway/status` already implemented
- `app/server/gateway_client.py` — Reference only; `get_status()` already returns `ConnectionStatus` with all needed fields
- `app/server/gateway_models.py` — Reference only; `ConnectionStatus`, `ServerInfo` models already defined
- `app/server/tests/test_gateway_routes.py` — Add a test for the status response shape if not already complete
- `.claude/commands/test_e2e.md` — Read to understand how to create and run E2E tests
- `.claude/commands/e2e/test_application_shell.md` — Read as a reference for E2E test structure

### New Files
- `app/client/src/components/GatewayHealthWidget.jsx` — The new health monitoring widget component
- `.claude/commands/e2e/test_health_monitoring_widget.md` — E2E test for the health monitoring widget

## Implementation Plan

### Phase 1: Foundation
Update `GatewayContext` to track `lastHeartbeat` and adjust polling to 30 s. This ensures the widget has the heartbeat data it needs from day one without requiring prop-drilling or new API calls.

### Phase 2: Core Implementation
Create `GatewayHealthWidget.jsx` following the existing `SectionCard` pattern used throughout the Dashboard. The component should:
- Use colour-coded state indicators matching the existing `STATE_CONFIG` palette (`emerald` / `amber` / `red`)
- Format uptime from milliseconds into a human-readable `Xh Ym` string
- Display last heartbeat as a relative time (e.g. "12 s ago") updated each second with a `setInterval`
- Gracefully render placeholder rows when disconnected

### Phase 3: Integration
Import and add `GatewayHealthWidget` to `Dashboard.jsx` inside the existing two-column grid, spanning full width on small screens and one column on large screens (consistent with other cards). No new routes or API endpoints are needed.

## Step by Step Tasks

### Step 1: Create E2E test file
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_application_shell.md` to understand the test format
- Create `.claude/commands/e2e/test_health_monitoring_widget.md` with the following test steps:
  - **Step 1**: Navigate to Dashboard (`/`), verify a "Gateway Health" card is visible in the grid; screenshot `01_health_widget_visible.png`
  - **Step 2**: Verify the widget contains a connection state indicator with a coloured dot (green/amber/red); screenshot `02_connection_state.png`
  - **Step 3**: Verify the widget shows server info rows (version, uptime, connection ID) or appropriate placeholder text when disconnected; screenshot `03_server_info.png`
  - **Step 4**: Verify the widget shows RPC methods count and events count (or placeholder when disconnected); screenshot `04_rpc_counts.png`
  - **Step 5**: Verify the widget shows a "Last heartbeat" row with a timestamp or "—" placeholder; screenshot `05_last_heartbeat.png`
  - **Step 6**: Wait 5 seconds and verify the last-heartbeat relative time updates (ticks); screenshot `06_heartbeat_ticks.png`
  - **Step 7**: Verify the widget fits within the dashboard grid without overflow on desktop viewport (1280×800); screenshot `07_responsive_desktop.png`
  - **Step 8**: Resize viewport to 375×812 (mobile) and verify the widget stacks correctly; screenshot `08_responsive_mobile.png`
  - Success criteria: widget renders, all data rows are present (or show placeholders), heartbeat ticks, and no console errors

### Step 2: Update GatewayContext to track lastHeartbeat and adjust poll interval
- Open `app/client/src/context/GatewayContext.jsx`
- Add `const [lastHeartbeat, setLastHeartbeat] = useState(null)` state variable
- In the `refreshStatus` callback, after successfully calling `setStatus(data)`, add `setLastHeartbeat(Date.now())`
- In the SSE `subscribeToEvents` callback, for all incoming events (including ping), add `setLastHeartbeat(Date.now())`
  - Specifically: move the `setLastHeartbeat(Date.now())` call to execute before the `if (event === 'status')` branch so it fires for every event type
- Change the polling interval from `10000` to `30000` in the `setInterval` call
- Add `lastHeartbeat` to the `value` object returned by `GatewayProvider`

### Step 3: Create GatewayHealthWidget component
- Create `app/client/src/components/GatewayHealthWidget.jsx`
- Import `useGateway` from `../hooks/useGateway`
- Import `Activity` icon from `lucide-react` for the card header icon
- Define colour config matching existing `STATE_CONFIG` palette in `GatewayStatus.jsx`:
  ```js
  const STATE_CONFIG = {
    connected:     { dot: 'bg-emerald-500', label: 'Connected',     text: 'text-emerald-600 dark:text-emerald-400' },
    connecting:    { dot: 'bg-amber-500 animate-pulse', label: 'Connecting',    text: 'text-amber-600 dark:text-amber-400' },
    reconnecting:  { dot: 'bg-amber-500 animate-pulse', label: 'Reconnecting',  text: 'text-amber-600 dark:text-amber-400' },
    disconnected:  { dot: 'bg-red-500',    label: 'Disconnected',   text: 'text-red-600 dark:text-red-400' },
  }
  ```
- Add a `useEffect` with `setInterval(1000)` to force a re-render every second so the relative heartbeat time ticks in real-time; store the `now` timestamp in local state
- Implement a `formatUptime(ms)` helper that converts milliseconds to `Xh Ym` (or `Ym` for short uptimes)
- Implement a `formatRelative(ts)` helper that shows seconds/minutes ago (e.g. `"3 s ago"`, `"2 m ago"`)
- Render a card `div` with the same styling as `SectionCard` in `Dashboard.jsx`:
  - Header: `Activity` icon + "Gateway Health" title
  - Connection state row: coloured dot + state label
  - Server version row: `status.server?.version` or `"—"`
  - Connection ID row: `status.server?.connId` or `"—"`
  - Uptime row: `formatUptime(status.uptimeMs)` or `"—"`
  - RPC methods row: `status.availableMethods.length` count or `"—"`
  - Events row: `status.availableEvents.length` count or `"—"`
  - Last heartbeat row: `formatRelative(lastHeartbeat)` or `"—"`
- Export the component as default

### Step 4: Add GatewayHealthWidget to Dashboard
- Open `app/client/src/pages/Dashboard.jsx`
- Import `GatewayHealthWidget` from `../components/GatewayHealthWidget`
- Update the `useGateway` destructure to also pull `lastHeartbeat` from the hook result
- Add `<GatewayHealthWidget lastHeartbeat={lastHeartbeat} />` as a new card inside the existing `grid grid-cols-1 lg:grid-cols-2 gap-5` div
  - Place it as the first item in the grid (before the Agents card) so it is immediately visible
  - The widget spans one grid column (same as all other cards); on large screens it sits in the first column of the first row

### Step 5: Run Validation Commands
- Execute all validation commands listed in the `Validation Commands` section below to confirm zero regressions

## Testing Strategy

### Unit Tests
- `app/server/tests/test_gateway_routes.py`: verify that `GET /api/gateway/status` returns a JSON body with keys `state`, `server`, `availableMethods`, `availableEvents`, `uptimeMs`, `gatewayUrl` (shape test)
- Frontend component is pure presentational (driven by context); manual/E2E testing covers it adequately without adding a Jest unit test for this iteration

### Edge Cases
- Disconnected state: all server info fields are `null` → widget must render `"—"` placeholders without crashing
- `lastHeartbeat` is `null` on first render before any event arrives → display `"—"`
- `uptimeMs` is 0 or very small → `formatUptime` returns `"0m"` without NaN
- `availableMethods` or `availableEvents` are empty arrays → show `0` not blank
- Very large uptime (days) → `formatUptime` should show `Xh Ym` capped sensibly (days not required by spec)
- Rapid reconnection cycles → animated dot should not flicker excessively (handled by CSS `animate-pulse`)

## Acceptance Criteria
- [ ] Widget is rendered on the Dashboard page inside the existing grid, visible without scrolling on a 1280×800 viewport
- [ ] Widget displays connection state (`connected` / `disconnected` / `reconnecting` / `connecting`) with a colour-coded dot indicator
- [ ] Widget shows server version, uptime, and connection ID (or `"—"` when disconnected)
- [ ] Widget shows count of available RPC methods and events
- [ ] Widget shows last heartbeat timestamp as a relative time that ticks every second
- [ ] Widget uses only the `useGateway` hook and does not make its own API calls
- [ ] `GatewayContext` polling interval is 30 seconds
- [ ] `lastHeartbeat` is updated on every SSE event (including pings) and on every successful status poll
- [ ] Widget is responsive: single-column on mobile, two-column grid on ≥ lg breakpoint
- [ ] `uv run pytest` passes with zero failures
- [ ] `npx eslint src/ --max-warnings=0 --quiet` passes with zero warnings
- [ ] `npm run build` completes successfully

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

1. Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_health_monitoring_widget.md` to validate this functionality works end-to-end with screenshots.

2. Run server tests:
```bash
cd app/server && uv run pytest
```

3. Run frontend lint:
```bash
cd app/client && npx eslint src/ --max-warnings=0 --quiet
```

4. Run frontend build:
```bash
cd app/client && npm run build
```

## Notes
- The existing `GatewayStatus.jsx` header pill already defines a `STATE_CONFIG` object with identical state keys. To avoid duplication, consider extracting this config to a shared constant file (e.g. `src/constants/gatewayStates.js`) in a future refactor; for this feature, define it inline in `GatewayHealthWidget.jsx` to keep changes minimal and self-contained.
- The polling interval change from 10 s → 30 s reduces backend load at the cost of slightly slower status updates when SSE is unavailable. The SSE stream still provides near-real-time updates, so this trade-off is acceptable.
- `lastHeartbeat` is tracked in the existing `GatewayContext` rather than inside `GatewayHealthWidget` because it is conceptually part of the connection state, is cheap to maintain globally, and may be useful to other widgets in the future.
- No new npm or Python packages are required for this feature.
