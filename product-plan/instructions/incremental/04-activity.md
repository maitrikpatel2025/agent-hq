# Milestone 4: Activity

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

Implement the Activity section — a full audit trail of every agent response across the fleet.

## Overview

The Activity section presents all agent interactions as a sortable, filterable data table. Each entry captures the complete record — agent identity, message content, model, token breakdown, cost, channel, and response time — with expandable rows for full detail inspection and real-time updates.

**Key Functionality:**
- View chronological table of all agent activity
- Filter by agent, model, date range, channel, and skill
- Search activity entries by keyword
- Expand rows to see full message and token breakdown
- See new entries appear in real-time
- Clear all active filters

## Components Provided

Copy from `product-plan/sections/activity/components/`:

- `ActivityFeed` — Full-page data table with sorting, pagination, expandable rows
- `ActivityFilterBar` — Filter UI with search input, dropdowns, date range picker, filter chips

## Props Reference

**Data props:**

- `activities: ActivityEntry[]` — Full interaction records
- `filters: ActivityFilters` — Available filter options (agents, models, channels, skills)
- `activeFilters: ActiveFilters` — Currently applied filters
- `pagination: Pagination` — Page info (total, page, pageSize, totalPages)
- `sortField: SortField` — Current sort column
- `sortDirection: SortDirection` — asc or desc
- `expandedRowId: string | null` — Currently expanded row
- `isLive: boolean` — Whether real-time updates are active

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onFilterChange` | User changes any filter value |
| `onClearFilters` | User clicks "Clear all" |
| `onSort` | User clicks a column header |
| `onToggleRow` | User clicks a row to expand/collapse |
| `onPageChange` | User changes page |

## Expected User Flows

### Flow 1: Browse and Expand
1. User sees chronological table of activity entries
2. User clicks a row to see full details
3. **Outcome:** Row expands inline showing full message, token breakdown, session ID

### Flow 2: Filter by Agent
1. User selects an agent from the dropdown
2. Table filters to show only that agent's activity
3. Active filter chip appears
4. **Outcome:** Focused view of a single agent's history

### Flow 3: Search Messages
1. User types a keyword in search input
2. Table filters to entries containing that keyword
3. **Outcome:** Quick lookup of specific interactions

## Empty States

- **No activity entries:** Table shows "No activity recorded yet" message
- **No filter results:** Table shows "No results match your filters" with clear option

## Testing

See `product-plan/sections/activity/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/activity/README.md` — Feature overview
- `product-plan/sections/activity/tests.md` — UI behavior test specs
- `product-plan/sections/activity/components/` — React components
- `product-plan/sections/activity/types.ts` — TypeScript interfaces
- `product-plan/sections/activity/sample-data.json` — Test data
- `product-plan/sections/activity/screenshot.png` — Visual reference

## Done When

- [ ] Activity table renders with all columns
- [ ] Sorting works on clickable column headers
- [ ] Filters work for agent, model, channel, skill, date range, and search
- [ ] Active filter chips appear and are dismissible
- [ ] Rows expand inline to show full details
- [ ] Live indicator shows connection status
- [ ] Pagination or scroll works for large datasets
- [ ] Empty states display properly
- [ ] Responsive: table scrolls horizontally on mobile
- [ ] Matches the visual design (see screenshot)
