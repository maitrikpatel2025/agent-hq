# Milestone 3: Agents

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Goal

Implement the Agents section — the roster and management hub for the entire AI agent fleet.

## Overview

The Agents section lets users browse all agents in a toggleable card grid or table view, search by name or role, and perform full CRUD operations — creating new agents, viewing identity profiles, editing configuration via modal dialogs, and removing agents.

**Key Functionality:**
- Browse agents in card grid view (default) or table view
- Search agents by name or role
- View full agent identity and personality profile
- Create new agents via modal dialog
- Edit existing agent configuration
- Delete agents with confirmation

## Components Provided

Copy from `product-plan/sections/agents/components/`:

- `AgentRoster` — Main view with search bar, grid/table toggle, create button
- `AgentCard` — Card showing agent emoji, name, role, model, status
- `AgentDetail` — Side panel with full agent identity and personality profile
- `AgentFormModal` — Modal dialog for creating and editing agents

## Props Reference

**Data props:**

- `agents: Agent[]` — Full agent objects with id, emoji, name, role, model, channelBinding, status, personality, createdAt

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onCreateAgent` | User submits the create agent modal |
| `onEditAgent` | User submits the edit agent modal |
| `onDeleteAgent` | User confirms agent deletion |
| `onSelectAgent` | User clicks an agent card to view details |

## Expected User Flows

### Flow 1: Create a New Agent
1. User clicks "+ New Agent" button
2. Modal opens with empty form (emoji, name, role, model, channel binding, personality)
3. User fills in fields and clicks "Create"
4. **Outcome:** New agent appears in the roster

### Flow 2: Edit an Agent
1. User clicks edit icon on an agent card
2. Modal opens pre-filled with agent data
3. User modifies fields and clicks "Save"
4. **Outcome:** Agent card updates with new information

### Flow 3: Delete an Agent
1. User clicks delete icon on an agent card
2. Confirmation dialog appears
3. User clicks "Delete" to confirm
4. **Outcome:** Agent removed from roster

### Flow 4: Search and Filter
1. User types "DevOps" in the search bar
2. **Outcome:** Only agents with matching name or role are shown

## Empty States

- **No agents:** Show message with prompt to create first agent, "+ New Agent" button visible
- **No search results:** Show "No agents match your search" message

## Testing

See `product-plan/sections/agents/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/agents/README.md` — Feature overview
- `product-plan/sections/agents/tests.md` — UI behavior test specs
- `product-plan/sections/agents/components/` — React components
- `product-plan/sections/agents/types.ts` — TypeScript interfaces
- `product-plan/sections/agents/sample-data.json` — Test data
- `product-plan/sections/agents/screenshot.png` — Visual reference

## Done When

- [ ] Agent roster renders in card grid view by default
- [ ] Grid/table toggle switches between views
- [ ] Search filters agents by name or role in real-time
- [ ] Clicking an agent card shows detail panel
- [ ] Create modal opens, validates, and submits correctly
- [ ] Edit modal pre-fills with agent data
- [ ] Delete shows confirmation before removing
- [ ] Empty state displays when no agents exist
- [ ] All callback props wired to working functionality
- [ ] Responsive on mobile
- [ ] Matches the visual design (see screenshot)
