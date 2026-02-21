# Test Specs: Jobs

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview
Scheduled job table with enable/disable toggles and inline expandable run history.

---

## User Flow Tests

### Flow 1: Toggle Job Enabled State
**Steps:**
1. User sees "Nightly Data Cleanup" with toggle off
2. User clicks the toggle switch

**Expected Results:**
- [ ] `onToggleEnabled` is called with job ID and `true`
- [ ] Toggle visually switches to enabled state

### Flow 2: Expand Run History
**Steps:**
1. User clicks a job row (e.g., "Daily Standup Summary")

**Expected Results:**
- [ ] Row expands to show run history mini table
- [ ] Run history shows timestamp, status badge, duration
- [ ] Status badges: green for success, red for failed, amber for running

### Flow 3: Search Jobs
**Steps:**
1. User types "health" in search input

**Expected Results:**
- [ ] Only jobs with "health" in the name are shown

### Flow 4: Filter by Agent
**Steps:**
1. User selects "Sentinel" from agent dropdown

**Expected Results:**
- [ ] Only jobs assigned to Sentinel are shown

---

## Empty State Tests

### No Jobs
**Setup:** `jobs` array is empty

**Expected Results:**
- [ ] Table shows empty state message

### No Run History
**Setup:** Job exists but `jobRuns` for that job is empty

**Expected Results:**
- [ ] Expanded row shows "No runs yet" message

---

## Component Interaction Tests

### Job Table Row
- [ ] Shows job name, agent (emoji + name), human-readable schedule
- [ ] Enabled toggle reflects current state
- [ ] Last run shows relative time with status dot
- [ ] Next run shows relative time or "—" if disabled

---

## Edge Cases
- [ ] Job with null lastRunAt shows "Never" or "—"
- [ ] Disabled jobs show "—" for next run
- [ ] Very long job names truncate properly
