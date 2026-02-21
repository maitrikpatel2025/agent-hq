# E2E Test: OpenClaw Gateway Integration

## User Story
As an Agent HQ operator, I can see the gateway connection status and navigate to all pages which display structured data sections ready for gateway data.

## Test Steps

### Step 1: Verify Gateway Status Indicator in Header
- 1. Navigate to the `Application URL`
- **Verify**: The page loads with the app shell (sidebar + header)
- **Verify**: A gateway connection status indicator (pill/badge) is visible in the header bar
- **Verify**: The status indicator shows either "Connected" (green), "Connecting" (yellow), or "Disconnected" (red)
- **Screenshot**: `01_gateway_status_indicator.png`

### Step 2: Verify Dashboard Data Sections
- Click on "Dashboard" in the sidebar (or navigate to `/`)
- **Verify**: The page displays an "Agents" or "Agent Status" section area
- **Verify**: The page displays an "Activity" or "Recent Activity" section area
- **Verify**: The page displays a "Usage" or "Usage Summary" section area
- **Verify**: If gateway is disconnected, sections show appropriate empty/disconnected state messages
- **Screenshot**: `02_dashboard_data_sections.png`

### Step 3: Verify Agents Page Data Section
- Click on "Agents" in the sidebar
- **Verify**: The URL changes to `/agents`
- **Verify**: The page displays an agent list area (cards, grid, or list)
- **Verify**: If no agents are available, an empty state message is shown (e.g., "No agents found" or "Gateway not connected")
- **Screenshot**: `03_agents_page.png`

### Step 4: Verify Activity Page Data Section
- Click on "Activity" in the sidebar
- **Verify**: The URL changes to `/activity`
- **Verify**: The page displays a session or event feed area
- **Verify**: If no activity data, an empty state or disconnected message is shown
- **Screenshot**: `04_activity_page.png`

### Step 5: Verify Usage Page Data Section
- Click on "Usage" in the sidebar
- **Verify**: The URL changes to `/usage`
- **Verify**: The page displays a usage metrics area (tokens, cost, or similar stats)
- **Verify**: If no usage data, an empty state or disconnected message is shown
- **Screenshot**: `05_usage_page.png`

### Step 6: Verify Jobs Page Data Section
- Click on "Jobs" in the sidebar
- **Verify**: The URL changes to `/jobs`
- **Verify**: The page displays a jobs list area
- **Verify**: If no jobs data, an empty state or disconnected message is shown
- **Screenshot**: `06_jobs_page.png`

### Step 7: Verify Skills Page Data Section
- Click on "Skills" in the sidebar
- **Verify**: The URL changes to `/skills`
- **Verify**: The page displays a skills panel area
- **Verify**: If no skills data, an empty state or disconnected message is shown
- **Screenshot**: `07_skills_page.png`

### Step 8: Verify Settings Page Data Section
- Click on "Settings" in the sidebar
- **Verify**: The URL changes to `/settings`
- **Verify**: The page displays a configuration section area
- **Verify**: If no config data, an empty state or disconnected message is shown
- **Screenshot**: `08_settings_page.png`

### Step 9: Verify No Console Errors
- Open browser console
- **Verify**: No JavaScript errors related to gateway integration are present in the console
- **Screenshot**: `09_no_console_errors.png`

## Success Criteria
- Gateway connection status indicator is visible in the app shell header
- Dashboard page displays agent status, activity, and usage summary sections
- Agents page renders an agent list area (empty state or populated)
- Activity page renders a session/event feed area
- Usage page renders usage metrics area
- Jobs page renders a jobs list area
- Skills page renders a skills panel area
- Settings page renders a config section area
- All pages render their data sections without JavaScript errors
