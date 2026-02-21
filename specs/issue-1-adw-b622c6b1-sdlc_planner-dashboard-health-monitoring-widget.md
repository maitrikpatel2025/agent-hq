# Feature: Dashboard Health Monitoring Widget

## Metadata
issue_number: `1`
adw_id: `b622c6b1`
issue_json: `Dashboard Health Monitoring Widget`

## Feature Description
Add a dedicated Health Monitoring Widget to the Dashboard page that displays real-time system health status for the OpenClaw Gateway connection. The widget will surface connection state with color-coded indicators, server metadata (version, uptime, connection ID), available RPC methods and events counts, and the last heartbeat timestamp. It auto-refreshes every 30 seconds and fits within the existing Dashboard grid layout, giving operators instant visibility into system health without navigating away from the main dashboard.

## User Story
As an Agent HQ operator
I want to see real-time system health status on the Dashboard
So that I can monitor the OpenClaw Gateway connection and server status at a glance

## Problem Statement
Operators currently have no at-a-glance visibility into the OpenClaw Gateway's connection health, server version, uptime, or available capabilities directly from the Dashboard. The existing `GatewayStatus` component in the header is a small pill badge with minimal information (just the connection state label). Operators need a richer, dashboard-level widget that provides comprehensive health details without requiring navigation to other pages or hovering over a small indicator.

## Solution Statement
Create a new `HealthMonitorWidget` React component that leverages the existing `useGateway` hook and the data already available from the `GatewayContext` (which polls `/api/gateway/status` every 10 seconds). The widget will render as a card within the Dashboard's existing 2-column grid, displaying:
1. Connection state with color-coded indicator (green/amber/red)
2. Server version, connection ID, and uptime
3. Count of available RPC methods and events
4. Last heartbeat/refresh timestamp
5. Auto-refresh every 30 seconds (supplementing the context's 10-second poll)

No backend changes are needed since all required data is already available via the `GatewayContext` status object (`state`, `server.version`, `server.connId`, `uptimeMs`, `availableMethods`, `availableEvents`).

## Relevant Files
Use these files to implement the feature:

- `app/client/src/pages/Dashboard.jsx` - The main Dashboard page where the widget will be added to the existing grid. Contains `SectionCard`, `LoadingSkeleton`, and `DisconnectedMessage` helper components that should be reused.
- `app/client/src/hooks/useGateway.js` - The hook that exposes gateway status data (`status`, `isConnected`, `isConnecting`, `refreshStatus`). The widget will consume this hook.
- `app/client/src/context/GatewayContext.jsx` - The context provider that polls `/api/gateway/status` every 10 seconds and provides the status object with `state`, `server`, `availableMethods`, `availableEvents`, `uptimeMs`, `gatewayUrl`.
- `app/client/src/components/GatewayStatus.jsx` - Existing header status indicator with `STATE_CONFIG` color/label mapping. Use as reference for consistent color-coding conventions.
- `app/client/src/services/gateway.js` - Service layer with `fetchGatewayStatus()` API call. Already used by the context; no changes needed.
- `app/server/gateway_routes.py` - Backend `/api/gateway/status` endpoint. Already returns all needed data; no changes needed.
- `app/server/gateway_models.py` - Pydantic models including `ConnectionStatus`, `ServerInfo`. Documents the data shape returned by the status endpoint.
- `app/server/gateway_client.py` - Gateway client with `get_status()` method. Documents available status fields.
- `app/server/tests/test_gateway_routes.py` - Existing backend tests. No new backend tests needed since no backend changes are required.
- `app/client/src/index.css` - Global styles with Tailwind directives. No changes expected.
- Read `.claude/commands/test_e2e.md`, and `.claude/commands/e2e/test_application_shell.md` to understand how to create an E2E test file.

### New Files
- `app/client/src/components/HealthMonitorWidget.jsx` - The new health monitoring widget component
- `.claude/commands/e2e/test_dashboard_health_widget.md` - E2E test file for validating the health monitoring widget

## Implementation Plan
### Phase 1: Foundation
Build the `HealthMonitorWidget` component with the core display logic:
- Create the component file with connection state color indicators
- Implement uptime formatting utility (convert milliseconds to human-readable)
- Implement last-refreshed timestamp tracking with 30-second auto-refresh
- Reuse the `SectionCard` pattern from `Dashboard.jsx` for visual consistency

### Phase 2: Core Implementation
Wire the widget to live data and implement all display sections:
- Consume `useGateway` hook for status data and `refreshStatus` callback
- Display connection state with color-coded dot and label (matching `GatewayStatus.jsx` color conventions)
- Show server version, connection ID, and formatted uptime
- Show counts of available RPC methods and events
- Display last heartbeat timestamp
- Handle disconnected and connecting states gracefully

### Phase 3: Integration
Add the widget to the Dashboard page and create E2E tests:
- Import and render `HealthMonitorWidget` in the Dashboard grid
- Position it prominently (first row) since health status is a high-priority signal
- Create E2E test to validate the widget renders correctly with all expected data fields
- Verify responsive layout behavior

## Step by Step Tasks

### Task 1: Create the HealthMonitorWidget component
- Create `app/client/src/components/HealthMonitorWidget.jsx`
- Import `useGateway` from `../hooks/useGateway`
- Import `HeartPulse` (or `Activity`) icon from `lucide-react` for the widget header
- Define a `STATE_CONFIG` object matching the color conventions from `GatewayStatus.jsx`:
  - `connected`: emerald/green dot and text
  - `connecting`: amber/yellow dot with `animate-pulse` and text
  - `reconnecting`: amber/yellow dot with `animate-pulse` and text
  - `disconnected`: red dot and text
- Implement a `formatUptime(ms)` helper that converts milliseconds to a human-readable string (e.g., "2h 15m" or "3d 5h 12m")
- Use `useState` to track a `lastRefreshed` timestamp
- Use `useEffect` with a 30-second `setInterval` to call `refreshStatus()` from the gateway context, updating `lastRefreshed` each time
- Render the widget using a card layout consistent with `SectionCard` in `Dashboard.jsx` (white bg, rounded-lg, border, padding)
- Display sections:
  - **Connection Status**: Color-coded dot + state label (e.g., "Connected", "Disconnected") as a prominent badge
  - **Server Info** (only when connected): Version (`status.server.version`), Connection ID (`status.server.connId`), Uptime (formatted from `status.uptimeMs`)
  - **Capabilities** (only when connected): Count of available RPC methods (`status.availableMethods.length`), Count of available events (`status.availableEvents.length`)
  - **Last Heartbeat**: Display `lastRefreshed` as a formatted time string (e.g., "2:34:05 PM")
- When disconnected, show a muted message indicating the gateway is not connected in place of server info and capabilities
- Add `data-testid="health-monitor-widget"` to the root element for E2E testing

### Task 2: Integrate the widget into the Dashboard page
- Edit `app/client/src/pages/Dashboard.jsx`
- Import `HealthMonitorWidget` from `../components/HealthMonitorWidget`
- Add `HealthMonitorWidget` as the first item in the Dashboard grid (before the Agents card)
- The widget should span the full width of a single grid column and fit naturally in the existing `grid grid-cols-1 lg:grid-cols-2 gap-5` layout

### Task 3: Create E2E test file for the health monitoring widget
- Create `.claude/commands/e2e/test_dashboard_health_widget.md`
- Define the user story: "As an Agent HQ operator, I can see a health monitoring widget on the Dashboard that displays the gateway connection state, server details, capability counts, and last heartbeat timestamp."
- Define test steps:
  - Step 1: Navigate to the Dashboard and verify the health monitor widget is visible
  - Step 2: Verify the connection status indicator is present with a colored dot and state label
  - Step 3: Verify server info section shows version, connection ID, and uptime (or disconnected message)
  - Step 4: Verify capabilities section shows RPC method and event counts (or disconnected message)
  - Step 5: Verify last heartbeat timestamp is displayed and updates
  - Step 6: Verify the widget is responsive and fits within the Dashboard grid
- Define success criteria matching the acceptance criteria

### Task 4: Run validation commands
- Run `cd app/server && uv run pytest` to ensure no backend regressions
- Run `cd app/client && npx eslint src/ --max-warnings=0 --quiet` to ensure no lint errors
- Run `cd app/client && npm run build` to ensure the frontend builds successfully
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_dashboard_health_widget.md` to validate the widget works

## Testing Strategy
### Unit Tests
- No new backend tests needed since no backend changes are made. The existing `test_gateway_routes.py` tests cover the `/api/gateway/status` endpoint.
- The widget is a presentational component consuming the existing `useGateway` hook, so E2E testing is the most effective validation approach.

### Edge Cases
- Gateway is disconnected: Widget should show "Disconnected" with red indicator and hide server info/capabilities sections
- Gateway is connecting/reconnecting: Widget should show amber pulsing indicator with appropriate label
- Server info fields are null: Handle gracefully (e.g., show "N/A" or omit the field)
- Uptime is null or 0: Display "N/A" or "0m" rather than crashing
- Available methods/events arrays are empty: Display "0" counts
- Component unmounts while interval is running: Clean up interval in useEffect return

## Acceptance Criteria
- Widget displays gateway connection state (connected/disconnected/reconnecting) with color indicators (green/amber/red)
- Shows server version, uptime, and connection ID when connected
- Displays count of available RPC methods and events when connected
- Auto-refreshes status every 30 seconds via the `refreshStatus` callback
- Uses existing `useGateway` hook and the data from `/api/gateway/status` endpoint (no new API calls)
- Shows last heartbeat timestamp
- Responsive layout that fits within the existing Dashboard 2-column grid
- No lint errors, build passes, and existing tests continue to pass
- E2E test validates the widget renders with expected content

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `cd app/server && uv run pytest` - Run server tests to validate the feature works with zero regressions
- `cd app/client && npx eslint src/ --max-warnings=0 --quiet` - Run frontend lint check to validate the feature works with zero regressions
- `cd app/client && npm run build` - Run frontend build to validate the feature works with zero regressions
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_dashboard_health_widget.md` E2E test file to validate this functionality works

## Notes
- The `GatewayContext` already polls status every 10 seconds. The widget's 30-second refresh via `refreshStatus()` is supplementary and ensures the "last heartbeat" timestamp stays current even if context polling is paused.
- The `ConnectionStatus` model from `gateway_models.py` defines the exact shape: `state`, `server` (with `version`, `commit`, `connId`), `availableMethods`, `availableEvents`, `uptimeMs`, `gatewayUrl`.
- Color conventions are established in `GatewayStatus.jsx` via `STATE_CONFIG` - reuse the same emerald/amber/red palette for consistency.
- No new npm packages are required.
- No new Python packages are required.
