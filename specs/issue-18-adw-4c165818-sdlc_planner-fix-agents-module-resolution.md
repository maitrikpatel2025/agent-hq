# Bug: Module not found: Can't resolve '../components/agents' in Agents.jsx

## Metadata
issue_number: `18`
adw_id: `4c165818`
issue_json: `{"number":18,"title":"Module not found: Can't resolve '../components/agents' in Agents.jsx","body":"/bug adw_plan_build_review_iso\nmodel_set base\n\nModule not found: Can't resolve '../components/agents' in Agents.jsx\n\nReact build fails with module resolution error when trying to import agent components that don't exist yet."}`

## Bug Description
The React application fails to build because `src/pages/Agents.jsx` imports four components (`AgentRoster`, `AgentDetail`, `AgentFormModal`, `AgentDeleteModal`) from `../components/agents`, but the `app/client/src/components/agents/` directory does not exist in the repository. The webpack module bundler cannot resolve the import path, causing an immediate build failure that blocks the entire application from starting.

**Expected behavior:** The React application compiles and the dev server starts without errors.

**Actual behavior:** Build fails with:
```
ERROR in ./src/pages/Agents.jsx 9:0-98
Module not found: Error: Can't resolve '../components/agents' in '/home/friday/agent-hq/app/client/src/pages'
```

## Problem Statement
`app/client/src/pages/Agents.jsx` was already rebuilt as part of issue #15 (Agents Fleet Roster CRUD) with full state management and component imports, but the corresponding `app/client/src/components/agents/` directory and its five component files were never created. The page references components that do not exist on disk, breaking the build.

## Solution Statement
Create the missing `app/client/src/components/agents/` directory with the five component files that `Agents.jsx` expects to import: `AgentRoster`, `AgentCard`, `AgentDetail`, `AgentFormModal`, `AgentDeleteModal`, and a barrel `index.js`. Each component must implement the props and `data-testid` attributes described in the original feature specification (`specs/issue-15-adw-fb641441-sdlc_planner-agents-fleet-roster-crud.md`) and the existing E2E test spec (`.claude/commands/e2e/test_agents_fleet_roster_crud.md`). No changes to `Agents.jsx`, `gateway.js`, or any backend file are needed — those are already correct.

## Steps to Reproduce
1. Clone the repo
2. `cd app/client && npm install`
3. `npm start` (or `npm run build`)
4. Build fails with "Module not found" error

## Root Cause Analysis
Issue #15 partially landed: the backend routes, `gateway.js` service functions, and the rebuilt `Agents.jsx` page were all committed, but the five new frontend component files under `app/client/src/components/agents/` were not committed. The import at lines 13–18 of `Agents.jsx` references a path that has never existed on disk:

```js
import {
  AgentRoster,
  AgentDetail,
  AgentFormModal,
  AgentDeleteModal,
} from '../components/agents'
```

The barrel `index.js` that would re-export these components is also missing, so even if individual files existed, the module would still fail to resolve without it.

## Relevant Files

- `app/client/src/pages/Agents.jsx` — Already-complete page component that imports from the missing directory; **do not modify**, just ensure its imports resolve
- `app/client/src/components/agents/index.js` — **Missing barrel export** that re-exports all four components; must be created
- `app/client/src/components/agents/AgentRoster.jsx` — **Missing component**; main roster container with search, grid/table toggle, and "+ New Agent" button
- `app/client/src/components/agents/AgentCard.jsx` — **Missing component**; compact card used by AgentRoster in grid view
- `app/client/src/components/agents/AgentDetail.jsx` — **Missing component**; right-side detail panel opened when an agent card is clicked
- `app/client/src/components/agents/AgentFormModal.jsx` — **Missing component**; create/edit modal with field validation
- `app/client/src/components/agents/AgentDeleteModal.jsx` — **Missing component**; delete confirmation dialog with deleteFiles checkbox
- `app/client/src/components/dashboard/AgentStatusGrid.jsx` — Reference for status dot patterns and Tailwind violet hover styling used consistently across agent UI
- `app/client/src/components/dashboard/index.js` — Reference for barrel export format
- `specs/issue-15-adw-fb641441-sdlc_planner-agents-fleet-roster-crud.md` — Authoritative props reference, layout spec, and data-testid requirements for all five components
- `.claude/commands/e2e/test_agents_fleet_roster_crud.md` — E2E test spec that validates what the components must render; read this to understand required `data-testid` attributes and visible content
- `app_docs/feature-fb641441-agents-fleet-roster-crud.md` — Feature documentation describing exactly what each component should render

### New Files
- `app/client/src/components/agents/AgentRoster.jsx`
- `app/client/src/components/agents/AgentCard.jsx`
- `app/client/src/components/agents/AgentDetail.jsx`
- `app/client/src/components/agents/AgentFormModal.jsx`
- `app/client/src/components/agents/AgentDeleteModal.jsx`
- `app/client/src/components/agents/index.js`

## Step by Step Tasks

### Step 1: Read reference files to understand component specs and styling
- Read `specs/issue-15-adw-fb641441-sdlc_planner-agents-fleet-roster-crud.md` — Steps 6–11 contain exact props, layout, and data-testid specs for each component
- Read `app_docs/feature-fb641441-agents-fleet-roster-crud.md` — Confirms what was built and the expected rendered output
- Read `.claude/commands/e2e/test_agents_fleet_roster_crud.md` — Lists every `data-testid` the E2E test expects
- Read `app/client/src/components/dashboard/AgentStatusGrid.jsx` — Reference for status dot patterns and violet hover Tailwind classes
- Read `app/client/src/pages/Agents.jsx` — Confirm exact prop names passed to each component so the component signatures match

### Step 2: Create AgentCard component
- Create `app/client/src/components/agents/AgentCard.jsx`
- Props: `agent` (object with `id`, `name`, `emoji`, `theme`/`role`), `isOnline` (bool), `isSelected` (bool), `onSelect`, `onEdit`, `onDelete`
- Render:
  - Root element: `data-testid="agent-card"`
  - Emoji avatar displayed in a violet circle
  - Agent `name` and `id` (mono font, small text)
  - Online status dot: `bg-emerald-500` when `isOnline`, `bg-stone-300 dark:bg-stone-600` when offline
  - Pencil icon (`lucide-react` `Pencil`) and trash icon (`Trash2`) visible on hover; clicking these calls `onEdit(agent)` and `onDelete(agent)` respectively without bubbling to `onSelect`
  - Violet ring/border highlight on hover (matching `AgentStatusGrid` patterns)
  - Clicking the card body (not the icons) calls `onSelect(agent)`

### Step 3: Create AgentRoster component
- Create `app/client/src/components/agents/AgentRoster.jsx`
- Props: `agents` (array), `onlineAgentIds` (Set), `selectedAgent` (object|null), `onSelect`, `onEdit`, `onDelete`, `onCreateNew`
- Local state: `search` (string, default `''`), `viewMode` (`'grid'` | `'table'`, default `'grid'`)
- Render:
  - Root element: `data-testid="agent-roster"`
  - Header row: search `<input>` with `Search` icon (filters by `agent.name`), view toggle buttons (`Grid`/`List` icons from lucide-react), `"+ New Agent"` button that calls `onCreateNew()`
  - Derived `filtered` list: `agents.filter(a => a.name?.toLowerCase().includes(search.toLowerCase()))`
  - **Grid view** (when `viewMode === 'grid'`): `data-testid="agent-grid"`, `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`, renders `<AgentCard>` for each filtered agent
  - **Table view** (when `viewMode === 'table'`): `data-testid="agent-table"`, `<table>` with columns Emoji, Name, ID, Status, Actions (edit + delete icons)
  - **Empty state — no agents**: `data-testid="empty-state"`, shown when `agents.length === 0`, text "No agents yet", includes a secondary "+ New Agent" button
  - **Empty state — search miss**: `data-testid="empty-search"`, shown when `agents.length > 0` but `filtered.length === 0`, text "No agents match your search"

### Step 4: Create AgentDetail component
- Create `app/client/src/components/agents/AgentDetail.jsx`
- Props: `agent` (full identity object), `files` (array), `onClose`, `onEdit`, `onFetchFiles`, `onFetchFileContent`
- Local state: `loadingFiles` (bool), `selectedFile` (string|null), `fileContent` (string|null), `loadingContent` (bool)
- Render:
  - Root element: `data-testid="agent-detail"`, fixed right-side panel
  - Close button (`X` icon) that calls `onClose()`
  - Large emoji avatar, agent `name`, agent `id` in mono text, theme/role if present, avatar URL if present
  - "Edit" button that calls `onEdit(agent)`
  - "Workspace Files" section: button to load files (calls `onFetchFiles(agent.id)`); lists file names; clicking a file calls `onFetchFileContent(agent.id, path)` and shows content in a `<pre>` code block
  - Loading spinner (`Loader2`) while files or content are fetching

### Step 5: Create AgentFormModal component
- Create `app/client/src/components/agents/AgentFormModal.jsx`
- Props: `mode` (`'create'` | `'edit'`), `initialData` (object|null), `onSubmit`, `onClose`, `isLoading` (bool)
- Local state: `form` (object with `id`, `name`, `workspace`, `emoji`, `avatar`), `errors` (object)
- Render:
  - Root element: `data-testid="agent-form-modal"`, modal overlay with backdrop
  - Keyboard `Escape` closes modal (calls `onClose()`)
  - Fields: `id` (required, **disabled when `mode === 'edit'`**), `name` (required), `workspace` (required), `emoji` (single char, optional), `avatar` (URL, optional)
  - Validation on submit: if `id`, `name`, or `workspace` are empty, set inline errors and do NOT call `onSubmit`
  - Submit button: shows `Loader2` spinner when `isLoading`; label "Create Agent" for create mode, "Save Changes" for edit mode
  - Cancel button calls `onClose()`

### Step 6: Create AgentDeleteModal component
- Create `app/client/src/components/agents/AgentDeleteModal.jsx`
- Props: `agent` (object), `onConfirm` (called with `deleteFiles` bool), `onClose`, `isLoading` (bool)
- Local state: `deleteFiles` (bool, default `false`)
- Render:
  - Root element: `data-testid="agent-delete-modal"`, modal overlay with backdrop
  - Message: `Delete "{agent.name}"? This action cannot be undone.`
  - Checkbox: "Also delete workspace files" — controls `deleteFiles` state
  - Red "Delete" button: calls `onConfirm(deleteFiles)`; shows `Loader2` spinner when `isLoading`
  - "Cancel" button: calls `onClose()`

### Step 7: Create barrel export index.js
- Create `app/client/src/components/agents/index.js`
- Export all five components:
  ```js
  export { AgentRoster } from './AgentRoster'
  export { AgentCard } from './AgentCard'
  export { AgentDetail } from './AgentDetail'
  export { AgentFormModal } from './AgentFormModal'
  export { AgentDeleteModal } from './AgentDeleteModal'
  ```
- Note: Each component file must use **named exports** (not default exports) to match the barrel pattern and the named imports in `Agents.jsx`

### Step 8: Run validation commands
- Execute all validation commands listed below to confirm the bug is fixed with zero regressions

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

```bash
# Verify the components directory now exists with all required files
ls app/client/src/components/agents/
```

```bash
# Frontend lint — must pass with zero warnings
cd app/client && npx eslint src/ --max-warnings=0 --quiet
```

```bash
# Frontend build — must complete without module resolution errors
cd app/client && npm run build
```

```bash
# Backend tests — must still pass with zero regressions
cd app/server && uv run pytest
```

Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_agents_fleet_roster_crud.md` to validate the Agents page renders correctly end-to-end with all required `data-testid` elements and UI interactions working.

## Notes
- `Agents.jsx` uses **named imports** (`{ AgentRoster, AgentDetail, AgentFormModal, AgentDeleteModal }`), so all components must use named exports (`export function AgentRoster...` or `export { AgentRoster }`), not default exports
- `AgentCard` is imported by `AgentRoster` internally, not by `Agents.jsx` directly — it does not need to be in the barrel export, but including it is fine for future use
- Use only `lucide-react` icons already present in the project: `Search`, `Grid`, `List`, `Plus`, `Pencil`, `Trash2`, `X`, `Loader2`, `ChevronRight`, `File`
- Tailwind CSS classes are the only styling mechanism — no inline styles except where absolutely necessary
- No new npm packages are needed; all dependencies are already installed
- The `data-testid` attributes are required by the existing E2E test spec — do not omit them
- The `isSelected` prop on `AgentCard` can be used to apply a selected highlight ring (e.g. `ring-2 ring-violet-500`) when an agent's detail panel is open
