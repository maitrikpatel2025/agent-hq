# Test Specs: Activity

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview
Sortable, filterable data table showing all agent responses with expandable rows.

---

## User Flow Tests

### Flow 1: Expand a Row for Details
**Steps:**
1. User sees activity table with truncated messages
2. User clicks a row

**Expected Results:**
- [ ] Row expands inline showing full message content
- [ ] Shows input tokens, output tokens, session ID, skill used
- [ ] Clicking the same row collapses it

### Flow 2: Filter by Agent
**Steps:**
1. User selects "Nova" from the agent dropdown

**Expected Results:**
- [ ] Table shows only Nova's activities
- [ ] `onFilterChange` is called with `{ agentId: "nova-id" }`
- [ ] Active filter chip appears showing "Nova"

### Flow 3: Search Messages
**Steps:**
1. User types "deploy" in the search input

**Expected Results:**
- [ ] Table filters to show only entries with "deploy" in the message
- [ ] `onFilterChange` is called with `{ search: "deploy" }`

### Flow 4: Clear All Filters
**Steps:**
1. User has multiple active filters
2. User clicks "Clear all" button

**Expected Results:**
- [ ] All filters are reset
- [ ] `onClearFilters` is called
- [ ] Table shows all entries

### Flow 5: Sort by Column
**Steps:**
1. User clicks "Cost" column header

**Expected Results:**
- [ ] Table sorts by cost descending
- [ ] `onSort` is called with "cost"
- [ ] Sort indicator arrow appears on the column

---

## Empty State Tests

### No Activity Entries
**Setup:** `activities` array is empty

**Expected Results:**
- [ ] Table shows empty state message
- [ ] Filter bar is still visible

### No Results After Filter
**Setup:** All filters applied, no matching entries

**Expected Results:**
- [ ] Table shows "No results" message
- [ ] Active filter chips are visible for clearing

---

## Component Interaction Tests

### Activity Table Row
- [ ] Shows time as relative ("6h ago") or absolute ("Feb 19, 12:22 PM")
- [ ] Agent cell shows emoji and name
- [ ] Message is truncated to single line
- [ ] Cost formatted as currency ("$0.0247")
- [ ] Tokens formatted with commas ("3,998")

### Live Indicator
- [ ] Shows green dot and "Live" text when `isLive` is true

---

## Edge Cases
- [ ] Very long messages truncate properly in table, show fully when expanded
- [ ] Handles 0 tokens and $0.00 cost gracefully
- [ ] Multiple filters combine correctly (AND logic)
