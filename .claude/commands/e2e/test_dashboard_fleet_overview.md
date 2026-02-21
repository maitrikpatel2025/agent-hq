# E2E Test: Dashboard Fleet Overview Widget Grid

## User Story
As an Agent HQ operator, I want a dashboard with a 2×3 widget grid showing agent status, activity, costs, jobs, tasks, and quick actions so that I can assess fleet health and take action from a single screen.

## Test Steps

### Step 1: Navigate to Dashboard and verify initial load
- Navigate to the `Application URL` at `/`
- **Verify**: Page title "Dashboard" is visible
- **Verify**: Subtitle "Fleet overview and quick actions" is visible
- **Verify**: 6 widget cards are rendered in a grid layout
- **Screenshot**: `01_dashboard_initial_load.png`

### Step 2: Verify Agent Status widget
- Look for the Agents widget in the grid
- **Verify**: Heading "Agents" is visible
- **Verify**: At least one agent card is rendered, or an empty-state message is displayed
- **Screenshot**: `02_agent_status_widget.png`

### Step 3: Verify Activity Feed widget
- Look for the Recent Activity widget in the grid
- **Verify**: Heading "Recent Activity" is visible
- **Verify**: At least one activity row is displayed, or an empty-state message is shown
- **Screenshot**: `03_activity_feed_widget.png`

### Step 4: Verify Cost Summary widget
- Look for the Cost Today widget in the grid
- **Verify**: Heading "Cost Today" is visible
- **Verify**: A dollar-amount number (e.g. "$0.00" or "$14.87") is displayed
- **Screenshot**: `04_cost_summary_widget.png`

### Step 5: Verify Schedule Preview widget
- Look for the Schedule widget in the grid
- **Verify**: Heading "Schedule" is visible
- **Verify**: At least one job row is displayed, or an empty-state message is shown
- **Screenshot**: `05_schedule_preview_widget.png`

### Step 6: Verify Pipeline Overview widget
- Look for the Pipeline widget in the grid
- **Verify**: Heading "Pipeline" is visible
- **Verify**: Column labels "Scheduled", "Queue", "Active", "Done" are visible
- **Screenshot**: `06_pipeline_overview_widget.png`

### Step 7: Verify Quick Actions panel
- Look for the Quick Actions widget in the grid
- **Verify**: Heading "Quick Actions" is visible
- **Verify**: "Dispatch Task" button is visible
- **Verify**: "Start Council" button is visible
- **Verify**: "Create Job" button is visible
- **Screenshot**: `07_quick_actions_panel.png`

### Step 8: Click "Dispatch Task" quick-action and verify navigation
- Click the "Dispatch Task" button in the Quick Actions panel
- **Verify**: URL changes to `/tasks`
- **Screenshot**: `08_quick_action_navigation.png`

### Step 9: Navigate back and verify tablet layout
- Navigate back to `/`
- Resize browser to 768px wide
- **Verify**: Widgets collapse to a 2-column layout (widgets are arranged in 2 columns)
- **Screenshot**: `09_tablet_layout.png`

### Step 10: Verify mobile layout
- Resize browser to 375px wide
- **Verify**: Widgets collapse to a single-column layout (each widget takes full width)
- **Screenshot**: `10_mobile_layout.png`

## Success Criteria
- All 6 widget headings are visible: Agents, Recent Activity, Cost Today, Schedule, Pipeline, Quick Actions
- Quick action "Dispatch Task" navigates to `/tasks`
- Responsive layout: 3 columns on ≥1280px, 2 columns on ≥768px, 1 column on mobile (375px)
- Loading skeleton or data displays correctly for all widgets
