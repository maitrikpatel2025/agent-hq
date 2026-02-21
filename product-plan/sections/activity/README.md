# Activity

## Overview
Full audit trail of every agent response across the fleet, presented as a sortable, filterable data table with expandable rows for detail inspection.

## User Flows
- View chronological table of all agent activity with columns for agent, timestamp, message, model, tokens, cost, channel, latency
- Filter by agent, model, date range, channel, and skill
- Search activity entries by keyword
- Click a row to expand inline with full message, token breakdown, session ID
- See new entries appear in real-time
- Clear all active filters

## Design Decisions
- Full-width data table with sortable column headers
- Filter bar with dropdowns, date range picker, and search
- Expandable rows for detail inspection
- Real-time indicator with live dot
- Message truncated to single line, full content in expanded row

## Data Shapes
**Entities:** ActivityEntry, ActivityFilters, ActiveFilters

## Visual Reference
See `screenshot.png` for the target UI design.

## Components Provided
- `ActivityFeed` — Full-page table with sorting, pagination, expandable rows
- `ActivityFilterBar` — Filter UI with search, dropdowns, date range

## Callback Props
| Callback | Triggered When |
|----------|---------------|
| `onFilterChange` | User changes a filter value |
| `onClearFilters` | User clicks "Clear all" |
| `onSort` | User clicks a column header |
| `onToggleRow` | User clicks a row to expand/collapse |
| `onPageChange` | User changes page |
