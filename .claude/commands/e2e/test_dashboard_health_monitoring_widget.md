# E2E Test: Dashboard Health Monitoring Widget

## User Story
As an Agent HQ operator, I want to see a Gateway Health monitoring widget on the Dashboard so that I can monitor the OpenClaw Gateway connection state, server metadata, and capability counts at a glance.

## Test Steps

### Step 1: Verify Widget Card is Present
- Navigate to the `Application URL` (root `/`)
- **Verify**: The page title "Dashboard" is visible
- **Verify**: A card with the heading "Gateway Health" is present on the page
- **Screenshot**: `01_dashboard_widget_present.png`

### Step 2: Verify Connection State Badge
- **Verify**: The widget contains a connection state badge element
- **Verify**: The badge displays one of the following labels: "Connected", "Connecting", "Reconnecting", or "Disconnected"
- **Verify**: The badge has a colored dot indicator (green for connected, amber for connecting/reconnecting, red for disconnected)
- **Screenshot**: `02_connection_state_badge.png`

### Step 3: Verify Server Metadata Fields
- **Verify**: The widget displays a "Version" label with a value (version string or "—")
- **Verify**: The widget displays a "Connection ID" label with a value (ID string or "—")
- **Verify**: The widget displays an "Uptime" label with a value (duration string or "—")
- **Screenshot**: `03_server_metadata_fields.png`

### Step 4: Verify Capability Count Fields
- **Verify**: The widget displays an "RPC Methods" label with a numeric value or "—"
- **Verify**: The widget displays an "Events" label with a numeric value or "—"
- **Screenshot**: `04_capability_counts.png`

### Step 5: Verify Last Heartbeat Field
- **Verify**: The widget displays a "Last Heartbeat" label
- **Verify**: The value is either a timestamp string or "Never"
- **Screenshot**: `05_last_heartbeat.png`

### Step 6: Full Widget Screenshot
- **Screenshot**: `06_full_widget.png` (full page screenshot of the Dashboard showing the complete widget)

## Success Criteria
- Widget card with "Gateway Health" heading is visible on the Dashboard
- Connection state badge is present and shows a valid state (Connected/Connecting/Reconnecting/Disconnected)
- State badge has a colored dot indicator matching the connection state
- Version, Connection ID, and Uptime fields are present with values or "—" fallbacks
- RPC Methods and Events fields are present with numeric values or "—" fallbacks
- Last Heartbeat field is present with a timestamp or "Never"
