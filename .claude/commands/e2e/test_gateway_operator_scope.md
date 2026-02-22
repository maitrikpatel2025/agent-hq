# E2E Test: Gateway Operator Scope Validation

## User Story
As an Agent HQ operator, I can navigate to the Agents page and it loads agent data (or shows a "Gateway not connected" state) **without** a scope authorization error — confirming that the connect handshake correctly includes `operator.read`, `operator.write`, and `operator.admin` scopes.

## Test Steps

### Step 1: Navigate to the application and then to the Agents page
- Navigate to the `Application URL`
- **Verify**: The application shell (sidebar + header) loads without JavaScript errors
- Click on "Agents" in the sidebar, or navigate directly to `/agents`
- **Verify**: The URL contains `/agents`
- **Screenshot**: `01_agents_page_loaded.png`

### Step 2: Verify no scope authorization error is shown
- Inspect the visible page content
- **Verify**: The page does NOT display any red error message containing the text `"missing scope"` or `"operator.read"`
- **Verify**: The page does NOT display any error referencing a scope authorization failure
- **Screenshot**: `02_no_scope_error.png`

### Step 3: Verify the page shows a valid state (roster or disconnected)
- **Verify**: The Agents page shows one of the following valid states:
  - (a) An agent roster with one or more agent cards, OR
  - (b) An empty state message such as "No agents found", "Gateway not connected", or similar — but NOT a scope error
- **Screenshot**: `03_valid_agents_state.png`

### Step 4: Check browser console for gateway scope errors
- Review the browser console logs
- **Verify**: No console errors contain the text `"missing scope"` or `"operator.read"` or scope-related authorization failures
- **Screenshot**: `04_console_no_scope_errors.png`

## Success Criteria
- The Agents page loads without displaying a "missing scope: operator.read" error
- The page renders either the agent roster or a graceful empty/disconnected state
- No scope authorization errors appear in the browser console
- The connect handshake is confirmed to work correctly by the absence of any scope error
