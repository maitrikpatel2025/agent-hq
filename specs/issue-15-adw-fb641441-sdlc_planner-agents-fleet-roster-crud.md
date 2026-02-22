# Feature: Agents - Fleet Roster with CRUD Management

## Metadata
issue_number: `fb641441`
adw_id: `15`
issue_json: `{"number":15,"title":"Agents - Fleet Roster with CRUD Management","body":"/feature adw_sdlc_iso\nmodel_set base\n\nAgents - Fleet Roster with CRUD Management\n\nImplement the Agents section — the roster and management hub for the entire AI agent fleet with card/table views, search, and full CRUD operations."}`

## Feature Description
Transform the existing minimal Agents page into a fully-featured fleet roster and management hub. The feature adds a rich agent browsing experience with card grid and table views, real-time search, and complete CRUD operations (create, view, edit, delete) backed by the OpenClaw Gateway via existing WebSocket RPC infrastructure. New backend routes expose agents.create, agents.update, agents.delete, agents.files.list, and agents.files.get. New frontend components (AgentRoster, AgentCard, AgentDetail, AgentFormModal) compose into a polished, responsive management UI with real-time presence status via SSE events.

## User Story
As an Agent HQ operator
I want to view, create, edit, and delete agents in a browsable roster
So that I can manage my agent fleet and configure each agent's identity and behavior

## Problem Statement
The current Agents page is a minimal placeholder that lists agents in basic cards with no CRUD capability, no search, no detail view, no view toggle, and no real-time status updates. Operators cannot create or manage agents from the UI.

## Solution Statement
Extend `gateway_routes.py` with POST/PATCH/DELETE endpoints for agent CRUD and file browsing, then rebuild the Agents page using a set of composable React components: a roster view with grid/table toggle and search, clickable agent cards with real-time online/offline indicators, a detail side panel, and create/edit/delete modals. Presence events from the existing SSE stream update agent status live. All gateway calls go through the existing `GatewayClient` pattern.

## Relevant Files

### Existing Files (read and modify)
- `app/server/gateway_routes.py` — Add new FastAPI routes for agents.create, agents.update, agents.delete, agents.files.list, agents.files.get RPC proxies; existing agents.list and agent.identity.get routes are already present
- `app/server/gateway_models.py` — Add Pydantic request body models for agent CRUD operations (AgentCreateRequest, AgentUpdateRequest, AgentDeleteRequest, AgentFilesListRequest)
- `app/server/server.py` — No changes needed; gateway_client already initialized and gateway_routes included
- `app/client/src/services/gateway.js` — Add createAgent, updateAgent, deleteAgent, fetchAgentFiles, fetchAgentFileContent API functions
- `app/client/src/pages/Agents.jsx` — Rebuild to use new AgentRoster component with full state management (agents list, selected agent, view mode, search, modals)
- `app/client/src/context/GatewayContext.jsx` — No changes needed; presence events already flow through SSE into `events` state

### New Files (to be created)
- `app/client/src/components/agents/AgentCard.jsx` — Card component showing emoji, name, ID, theme, and real-time online/offline dot; edit and delete icon buttons
- `app/client/src/components/agents/AgentDetail.jsx` — Right side panel showing full agent identity, workspace path, and file browser
- `app/client/src/components/agents/AgentFormModal.jsx` — Create/edit modal with fields: id, name, workspace, emoji, avatar; validates required fields
- `app/client/src/components/agents/AgentDeleteModal.jsx` — Confirmation dialog with optional deleteFiles checkbox
- `app/client/src/components/agents/AgentRoster.jsx` — Main roster view: search bar, grid/table toggle, "+ New Agent" button, card grid or table layout, empty states
- `app/client/src/components/agents/index.js` — Barrel export for agent components
- `app/server/tests/test_agent_crud_routes.py` — Pytest tests for new agent CRUD routes (create, update, delete, files)
- `.claude/commands/e2e/test_agents_fleet_roster_crud.md` — E2E test file validating the full agents CRUD flow

### Reference Files (read for context/format)
- Read `.claude/commands/test_e2e.md` to understand how to structure the E2E test file
- Read `.claude/commands/e2e/test_application_shell.md` to understand E2E test file format and step conventions
- `product-plan/instructions/incremental/03-agents.md` — Feature specification with props reference and user flows
- `app/client/src/components/dashboard/AgentStatusGrid.jsx` — Reference for agent card styling patterns (violet hover, status dots, Tailwind conventions)
- `app/client/src/pages/Jobs.jsx` — Reference for page loading/empty-state/gateway-disconnected patterns

## Implementation Plan

### Phase 1: Foundation — Backend CRUD Routes
Add the missing agent CRUD and file routes to `gateway_routes.py`, with matching Pydantic request body models in `gateway_models.py`. All routes proxy to the Gateway via `_proxy_rpc()` using the existing `GatewayClient`. Add backend tests.

### Phase 2: Core Implementation — Frontend Components
Build five new React components under `app/client/src/components/agents/`:
1. `AgentCard` — compact card with emoji avatar, status indicator, edit/delete icons
2. `AgentRoster` — stateless container: search input, grid/table toggle, card grid or table, empty states
3. `AgentDetail` — side panel with full identity fields and collapsible file browser
4. `AgentFormModal` — controlled form for create and edit; field validation
5. `AgentDeleteModal` — confirmation dialog with deleteFiles checkbox

### Phase 3: Integration — Wire Page & Real-Time Status
Rebuild `Agents.jsx` as the stateful orchestrator: fetch agents on mount, subscribe to `presence` events from `GatewayContext.events` to update online/offline status, wire all modal callbacks to API service functions, and refresh the roster after each mutation. Add new service functions to `gateway.js`. Create the E2E test file.

## Step by Step Tasks

### Step 1: Create E2E test file
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_application_shell.md` to understand format
- Create `.claude/commands/e2e/test_agents_fleet_roster_crud.md` covering:
  - Navigate to `/agents` and verify roster renders (heading, search bar, "+ New Agent" button, view toggle)
  - Verify grid/table toggle switches layout
  - Verify search filters agents in real-time (type text, verify only matching cards shown)
  - Verify clicking an agent card opens the detail side panel
  - Verify "+ New Agent" button opens create modal with id, name, workspace, emoji fields
  - Verify create modal closes on cancel without creating an agent
  - Verify edit icon on a card opens pre-filled edit modal
  - Verify delete icon opens confirmation dialog with deleteFiles checkbox
  - Verify empty state renders "No agents yet" when no agents exist
  - Verify "No agents match your search" when search returns nothing
  - Take screenshots at each step

### Step 2: Add Pydantic request body models to gateway_models.py
- Add `AgentCreateRequest(id, name, workspace, emoji?, avatar?)` Pydantic model
- Add `AgentUpdateRequest(id, name?, workspace?, emoji?, avatar?)` Pydantic model
- Add `AgentDeleteRequest(id, deleteFiles?)` Pydantic model

### Step 3: Add agent CRUD and file routes to gateway_routes.py
- `POST /api/gateway/agents` → proxies `agents.create` with body from `AgentCreateRequest`
- `PATCH /api/gateway/agents/{agent_id}` → proxies `agents.update` with merged params
- `DELETE /api/gateway/agents/{agent_id}` → proxies `agents.delete`; accept optional `deleteFiles` query param
- `GET /api/gateway/agents/{agent_id}/files` → proxies `agents.files.list`
- `GET /api/gateway/agents/{agent_id}/files/content` → proxies `agents.files.get` with `path` query param

### Step 4: Write backend tests for new routes
- Create `app/server/tests/test_agent_crud_routes.py`
- Mock `GatewayClient.send_request` to return fixture payloads
- Test success responses (200/201) for create, update, delete, files list, files get routes
- Test 503 response when gateway not connected
- Test 422 validation for missing required fields on create

### Step 5: Add API service functions to gateway.js
- `createAgent(payload)` — POST `/api/gateway/agents`
- `updateAgent(agentId, payload)` — PATCH `/api/gateway/agents/{agentId}`
- `deleteAgent(agentId, deleteFiles)` — DELETE `/api/gateway/agents/{agentId}?deleteFiles={bool}`
- `fetchAgentFiles(agentId)` — GET `/api/gateway/agents/{agentId}/files`
- `fetchAgentFileContent(agentId, path)` — GET `/api/gateway/agents/{agentId}/files/content?path={path}`

### Step 6: Build AgentCard component
- Create `app/client/src/components/agents/AgentCard.jsx`
- Props: `agent` (object), `isOnline` (bool), `isSelected` (bool), `onSelect`, `onEdit`, `onDelete`
- Show emoji avatar in violet circle, agent name, agent ID in small mono text, theme snippet
- Online status dot: emerald when online, stone-gray when offline
- Edit icon (Pencil from lucide-react) and Delete icon (Trash2) — visible on hover
- Violet hover ring matching AgentStatusGrid patterns from `dashboard/AgentStatusGrid.jsx`
- `data-testid="agent-card"` on root element

### Step 7: Build AgentRoster component
- Create `app/client/src/components/agents/AgentRoster.jsx`
- Props: `agents`, `onlineAgentIds` (Set), `onSelect`, `onEdit`, `onDelete`, `onCreateNew`
- Local state: `search` (string), `viewMode` ('grid' | 'table')
- Header row: search `<input>` (with Search icon), view toggle buttons (Grid/List icons), "+ New Agent" button
- Filtered agent list derived from `agents` filtered by `search` (name, identity.name, identity.theme)
- Grid view: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` of `<AgentCard>` components
- Table view: `<table>` with columns: Emoji, Name, ID, Status, Actions
- Empty state (no agents): "No agents yet" message with "+ New Agent" prompt button, `data-testid="empty-state"`
- Empty state (search miss): "No agents match your search" message, `data-testid="empty-search"`
- `data-testid="agent-roster"` on root element, `data-testid="agent-grid"` on grid container, `data-testid="agent-table"` on table

### Step 8: Build AgentDetail component
- Create `app/client/src/components/agents/AgentDetail.jsx`
- Props: `agent` (full identity object), `files` (array), `onClose`, `onEdit`, `onFetchFiles`, `onFetchFileContent`
- Side panel layout: fixed right panel with close button (X icon)
- Show: large emoji avatar, display name, agent ID, theme/role text, avatar URL if present
- "Workspace Files" section: button to load files, list of file names; click file to show content in code block
- Loading states for files fetch and file content fetch
- `data-testid="agent-detail"` on root element

### Step 9: Build AgentFormModal component
- Create `app/client/src/components/agents/AgentFormModal.jsx`
- Props: `mode` ('create' | 'edit'), `initialData`, `onSubmit`, `onClose`, `isLoading`
- Fields: `id` (text, required, disabled when editing), `name` (text, required), `workspace` (text, required), `emoji` (text, single char), `avatar` (text, URL)
- Validation: highlight missing required fields before submit; show inline error messages
- Modal overlay with keyboard Escape to close
- Submit button shows spinner when `isLoading`
- `data-testid="agent-form-modal"` on root

### Step 10: Build AgentDeleteModal component
- Create `app/client/src/components/agents/AgentDeleteModal.jsx`
- Props: `agent`, `onConfirm`, `onClose`, `isLoading`
- Confirmation message: "Delete {agent.name}? This action cannot be undone."
- Checkbox: "Also delete workspace files" (maps to `deleteFiles` param)
- Danger "Delete" button (red) and "Cancel" button
- `data-testid="agent-delete-modal"` on root

### Step 11: Create barrel export index
- Create `app/client/src/components/agents/index.js`
- Export: `AgentRoster`, `AgentCard`, `AgentDetail`, `AgentFormModal`, `AgentDeleteModal`

### Step 12: Rebuild Agents.jsx with full state management
- Replace the current minimal Agents.jsx with a fully stateful page component
- State: `agents` (array), `onlineAgentIds` (Set), `loading` (bool), `error` (string|null), `selectedAgent` (object|null), `agentDetail` (full identity|null), `detailFiles` (array), `showCreateModal` (bool), `editingAgent` (object|null), `deletingAgent` (object|null), `mutating` (bool), `toast` (object|null)
- On mount (and when `isConnected` changes to true): call `fetchAgents()`, map response to agent array
- Subscribe to `presence` events from `useGateway().events`: when a presence event arrives, update `onlineAgentIds` Set
- Handle `onSelect`: call `fetchAgentIdentity(id)` to get full identity, set `agentDetail`, show `AgentDetail` panel
- Handle `onCreateAgent(data)`: call `createAgent(data)`, refresh agent list, close modal, show success toast
- Handle `onEditAgent(data)`: call `updateAgent(id, data)`, refresh agent list, close modal, show success toast
- Handle `onDeleteAgent(deleteFiles)`: call `deleteAgent(id, deleteFiles)`, refresh agent list, close confirmation, show success toast
- Toast component: show success (emerald) or error (red) messages for 3 seconds then auto-dismiss
- Keep gateway-disconnected state, loading spinner, and error fallback from existing page
- `data-testid="agents-page"` on root

### Step 13: Run validation commands
- Execute all validation commands listed below to confirm zero regressions

## Testing Strategy

### Unit Tests
- `test_agent_crud_routes.py`: mock `GatewayClient.send_request`, verify each new route sends the correct method + params to the gateway and returns the proxied payload; verify 503 when disconnected; verify 422 for bad request bodies

### Edge Cases
- Gateway disconnected: all CRUD operations should show "Gateway not connected" state gracefully
- Empty `agents.list` response: show "No agents yet" empty state
- Search with no matches: show "No agents match your search" empty state
- Presence event for unknown agent ID: no crash, just ignored
- Delete with `deleteFiles=true`: confirm the `agents.delete` RPC is called with `{"id": ..., "deleteFiles": true}`
- Create with duplicate ID: gateway returns error, toast displays error message from gateway
- Modal keyboard Escape closes without submitting

## Acceptance Criteria
- Agent roster renders in card grid view by default with search, view toggle, and "+ New Agent" button visible
- Grid/table toggle switches between card grid and data table layouts
- Search input filters displayed agents by name or role in real-time (client-side filtering)
- Clicking an agent card calls `agent.identity.get` and shows the detail side panel
- Detail panel shows emoji, name, ID, theme, avatar and a file browser section
- "+ New Agent" button opens the create modal with id, name, workspace, emoji, avatar fields
- Create modal validates required fields (id, name, workspace) and shows inline errors before submitting
- Submitting create modal calls `agents.create` RPC and refreshes the roster
- Edit icon on agent card opens pre-filled edit modal; submitting calls `agents.update` and refreshes
- Delete icon on agent card opens confirmation dialog with deleteFiles checkbox
- Confirming delete calls `agents.delete` and removes agent from roster
- Presence events from SSE update agent online/offline status indicators live
- Empty state "No agents yet" displays when roster is empty (with create button)
- Empty state "No agents match your search" displays when search returns nothing
- Success/error toast notifications appear after each CRUD operation
- Gateway disconnected state shown gracefully on all states
- Grid collapses to 2-column on tablet (`sm:grid-cols-2`), single column on mobile
- All backend tests pass: `uv run pytest`
- Frontend lint passes with zero warnings: `npx eslint src/ --max-warnings=0 --quiet`
- Frontend builds successfully: `npm run build`

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

```bash
# Backend tests
cd app/server && uv run pytest
```

```bash
# Frontend lint
cd app/client && npx eslint src/ --max-warnings=0 --quiet
```

```bash
# Frontend build
cd app/client && npm run build
```

Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_agents_fleet_roster_crud.md` to validate this functionality works end-to-end.

## Notes
- The `GatewayContext` already captures `presence` events in its `events` array (see `GatewayContext.jsx:42`). In `Agents.jsx`, watch `events` from `useGateway()` and filter for `event === 'presence'` to update `onlineAgentIds`. The presence event payload shape from the gateway API doc should include an `agentId` and `online` boolean.
- Existing routes `GET /api/gateway/agents` and `GET /api/gateway/agents/{id}/identity` are already implemented in `gateway_routes.py` — do not duplicate them.
- The `_proxy_rpc()` helper in `gateway_routes.py` handles all error cases (503, 504, 502) — use it for all new routes.
- For the agent table view, keep it lightweight: emoji, name, ID, online badge, and action buttons. No need for a full data table library.
- The `deleteFiles` gateway param is optional; default to `false` if the checkbox is unchecked.
- Agent ID is immutable after creation (cannot be changed via `agents.update`), so the id field should be disabled in the edit modal.
- Use `lucide-react` icons already present in the project: `Search`, `Grid`, `List`, `Plus`, `Pencil`, `Trash2`, `X`, `Loader2`, `ChevronRight`, `File`.
- Toast notifications should auto-dismiss after 3 seconds; implement as simple state-driven JSX, no additional library needed.
- No new Python packages need to be added; all dependencies are already present.
