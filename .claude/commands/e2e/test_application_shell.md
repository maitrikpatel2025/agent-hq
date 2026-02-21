# E2E Test: Application Shell & Navigation

## User Story
As an Agent HQ operator, I want a persistent navigation shell with sidebar, header, and routing so that I can navigate between all 10 sections of the application with a consistent, responsive layout.

## Preconditions
- Application is running at `http://localhost:3000`

## Test Steps

### Step 1: Verify Shell Renders
- Navigate to `http://localhost:3000`
- **Verify**: The page loads with a sidebar navigation on the left and a header bar at the top
- **Verify**: The sidebar contains the "Agent HQ" logo text and an "AH" logo icon
- **Screenshot**: `01_shell_initial_load.png`

### Step 2: Verify All Navigation Items Visible
- **Verify**: The sidebar contains all 10 navigation items:
  - Dashboard, Agents, Activity, Usage, Jobs, Tasks, Skills, AI Council, Settings, Help
- **Verify**: Each navigation item has an icon and label text
- **Screenshot**: `02_all_nav_items_visible.png`

### Step 3: Verify Navigation Routing
- Click on "Agents" in the sidebar
- **Verify**: The URL changes to `/agents`
- **Verify**: The "Agents" nav item is highlighted with a violet/purple accent background
- **Verify**: The content area shows "Agents" heading text
- Click on "Activity" in the sidebar
- **Verify**: The URL changes to `/activity`
- **Verify**: The "Activity" nav item is now highlighted and "Agents" is not
- **Screenshot**: `03_navigation_routing.png`

### Step 4: Verify All Routes Work
- Click through each nav item and verify the URL matches:
  - Dashboard → `/`
  - Agents → `/agents`
  - Activity → `/activity`
  - Usage → `/usage`
  - Jobs → `/jobs`
  - Tasks → `/tasks`
  - Skills → `/skills`
  - AI Council → `/ai-council`
  - Settings → `/settings`
  - Help → `/help`
- **Verify**: Each page renders with the correct heading text
- **Screenshot**: `04_all_routes_verified.png`

### Step 5: Verify Sidebar Collapse Toggle
- Click the collapse toggle button (chevron icon) at the bottom of the sidebar
- **Verify**: The sidebar collapses to a narrow width showing only icons (no labels)
- **Verify**: The "AH" logo icon is still visible and centered
- **Screenshot**: `05_sidebar_collapsed.png`

### Step 6: Verify Collapsed Sidebar Expand
- Click the expand toggle button (chevron icon) at the bottom of the collapsed sidebar
- **Verify**: The sidebar expands back to full width showing icons and labels
- **Screenshot**: `06_sidebar_expanded.png`

### Step 7: Verify User Menu
- Look at the header bar on the right side
- **Verify**: A user avatar with initials "O" (for Operator) is displayed
- **Verify**: The user name "Operator" is shown next to the avatar
- Click on the user menu button
- **Verify**: A dropdown menu appears with the user name and "Sign out" button
- **Screenshot**: `07_user_menu_dropdown.png`

### Step 8: Verify User Menu Closes on Outside Click
- Click outside the user menu dropdown
- **Verify**: The dropdown menu closes
- **Screenshot**: `08_user_menu_closed.png`

### Step 9: Verify Mobile Responsive Behavior
- Resize the browser to mobile width (375px)
- **Verify**: The sidebar is hidden
- **Verify**: A hamburger menu icon appears in the header
- **Verify**: The "Agent HQ" text appears in the mobile header
- **Screenshot**: `09_mobile_layout.png`

### Step 10: Verify Mobile Sidebar Overlay
- Click the hamburger menu icon
- **Verify**: The sidebar appears as an overlay with a dark backdrop
- **Verify**: All navigation items are visible in the overlay
- **Screenshot**: `10_mobile_sidebar_overlay.png`

### Step 11: Verify Mobile Sidebar Closes
- Click the dark backdrop overlay
- **Verify**: The sidebar overlay closes
- **Screenshot**: `11_mobile_sidebar_closed.png`

### Step 12: Verify Dark Mode Toggle
- Resize back to desktop width (1280px)
- Click the dark mode toggle button (sun/moon icon) in the header
- **Verify**: The page switches to dark mode with dark backgrounds
- **Verify**: The sidebar has a dark background
- **Verify**: Text is light-colored on dark backgrounds
- **Screenshot**: `12_dark_mode.png`

### Step 13: Verify Sidebar Collapse Persists After Reload
- Collapse the sidebar
- Reload the page
- **Verify**: The sidebar is still collapsed after reload
- **Screenshot**: `13_collapse_persists.png`

## Success Criteria
- All 10 navigation items are visible and functional
- Navigation highlights the active item with violet accent
- Sidebar collapse/expand toggle works
- User menu shows avatar initials and dropdown
- Mobile responsive layout works with hamburger menu and overlay
- Dark mode toggle switches the theme
- Sidebar collapse state persists after page reload
