# E2E Test: Agents Fleet Roster CRUD

## User Story
As an Agent HQ operator, I want to view, create, edit, and delete agents in a browsable roster so that I can manage my agent fleet and configure each agent's identity and behavior.

## Test Steps

### Step 1: Navigate to Agents Page
- Navigate to the `Application URL` + `/agents`
- **Verify**: The page loads and shows the "Agents" heading
- **Verify**: A search input is visible
- **Verify**: A "+ New Agent" button is visible
- **Verify**: View toggle buttons (grid/table) are visible
- **Screenshot**: `01_agents_page_loaded.png`

### Step 2: Verify Grid View Default
- **Verify**: The roster renders in grid view by default
- **Verify**: `data-testid="agent-roster"` element is present
- **Verify**: Either `data-testid="agent-grid"` is visible (with agents) or `data-testid="empty-state"` is visible (no agents)
- **Screenshot**: `02_grid_view_default.png`

### Step 3: Verify Grid/Table Toggle
- Click the table/list view toggle button (List icon)
- **Verify**: The layout switches to a table view with `data-testid="agent-table"` present
- Click the grid view toggle button (Grid icon)
- **Verify**: The layout switches back to grid view with `data-testid="agent-grid"` present
- **Screenshot**: `03_view_toggle.png`

### Step 4: Verify Search Filtering
- Type text into the search input that does not match any agent names
- **Verify**: The empty search state appears with `data-testid="empty-search"` and text "No agents match your search"
- Clear the search input
- **Verify**: Agents (or the empty state) return to normal display
- **Screenshot**: `04_search_filter.png`

### Step 5: Verify "+ New Agent" Button Opens Create Modal
- Click the "+ New Agent" button
- **Verify**: A modal opens with `data-testid="agent-form-modal"`
- **Verify**: The modal contains input fields for: id, name, workspace, emoji
- **Verify**: There is a "Create Agent" or "Save" submit button
- **Verify**: There is a "Cancel" button
- **Screenshot**: `05_create_modal_open.png`

### Step 6: Verify Create Modal Cancel
- Click the "Cancel" button in the create modal
- **Verify**: The modal closes without creating an agent
- **Verify**: The roster is still visible
- **Screenshot**: `06_create_modal_closed.png`

### Step 7: Verify Create Modal Validation
- Click the "+ New Agent" button again
- Leave the required fields (id, name, workspace) empty
- Click the submit button
- **Verify**: Inline validation errors appear for required fields
- **Screenshot**: `07_create_modal_validation.png`

### Step 8: Verify Modal Closes on Escape Key
- Press the Escape key
- **Verify**: The create modal closes
- **Screenshot**: `08_modal_escape_closed.png`

### Step 9: Verify Empty State
- If no agents exist, verify the empty state is displayed
- **Verify**: `data-testid="empty-state"` is present with text "No agents yet"
- **Verify**: A button or link to create a new agent is shown in the empty state
- **Screenshot**: `09_empty_state.png`

### Step 10: Verify Agent Cards (if agents exist)
- If agents are present in the roster:
  - **Verify**: Each agent card has `data-testid="agent-card"`
  - **Verify**: Each card shows the agent emoji avatar, name, and ID
  - **Verify**: Online/offline status indicator is visible on each card
- **Screenshot**: `10_agent_cards.png`

### Step 11: Verify Agent Card Edit Icon (if agents exist)
- If agents are present, hover over an agent card
- **Verify**: Edit (pencil) icon button becomes visible
- **Verify**: Delete (trash) icon button becomes visible
- Click the edit icon on an agent card
- **Verify**: The edit modal opens with `data-testid="agent-form-modal"`
- **Verify**: The modal is pre-filled with the agent's existing data
- **Verify**: The ID field is disabled (cannot be changed)
- Click "Cancel" to close the modal
- **Screenshot**: `11_edit_modal_prefilled.png`

### Step 12: Verify Agent Card Delete Icon (if agents exist)
- If agents are present, hover over an agent card
- Click the delete (trash) icon on an agent card
- **Verify**: The delete confirmation dialog opens with `data-testid="agent-delete-modal"`
- **Verify**: The dialog shows the agent name and a warning message
- **Verify**: A "Also delete workspace files" checkbox is present
- **Verify**: A red "Delete" button and a "Cancel" button are present
- Click "Cancel" to close the dialog
- **Screenshot**: `12_delete_modal_open.png`

### Step 13: Verify Agent Detail Panel (if agents exist)
- If agents are present, click on an agent card (not the edit/delete icons)
- **Verify**: The agent detail panel opens with `data-testid="agent-detail"`
- **Verify**: The panel shows the agent's emoji, name, and ID
- **Verify**: A close button (X) is present
- Click the close button
- **Verify**: The detail panel closes
- **Screenshot**: `13_agent_detail_panel.png`

## Success Criteria
- Agents page renders with search bar, view toggle, and "+ New Agent" button
- Grid/table view toggle switches the layout correctly
- Search input filters agents and shows "No agents match your search" when no matches
- "+ New Agent" opens a create modal with id, name, workspace, emoji fields
- Create modal cancel closes without creating an agent
- Create modal validates required fields and shows inline errors
- Escape key closes modal
- Empty state renders "No agents yet" when no agents exist
- Agent cards (when present) show emoji, name, ID, status dot, edit/delete icons on hover
- Edit modal opens pre-filled with existing agent data and disabled ID field
- Delete confirmation dialog has agent name, deleteFiles checkbox, Delete and Cancel buttons
- Agent detail panel opens on card click and closes with X button
