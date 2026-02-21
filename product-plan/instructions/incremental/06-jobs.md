# Milestone 6: Jobs

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

Implement the Jobs section — scheduled and recurring job management synced with the gateway.

## Overview

The Jobs section displays all scheduled jobs in a table with key details visible at a glance. Users can toggle jobs on/off, filter and search, and expand rows to view run history — providing complete visibility into the automated job system.

**Key Functionality:**
- View all jobs in a table with name, agent, schedule, enabled status, last/next run
- Toggle job enabled/disabled state directly from the table
- Filter by agent and enabled status, search by name
- Expand rows inline to view recent run history

## Components Provided

Copy from `product-plan/sections/jobs/components/`:

- `JobsTable` — Main table with search, agent filter, status filter, expandable rows
- `RunHistoryTable` — Mini table showing recent job runs with status badges

## Props Reference

**Data props:**

- `jobs: Job[]` — Job objects with id, name, agent info, schedule, enabled state, last/next run
- `jobRuns: Record<string, JobRun[]>` — Keyed by job ID, array of run history entries

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onToggleEnabled` | User toggles a job's enabled switch |

## Expected User Flows

### Flow 1: Toggle Job Enabled State
1. User sees "Nightly Data Cleanup" with toggle off
2. User clicks the toggle switch
3. **Outcome:** Job becomes enabled, `onToggleEnabled` called with job ID and `true`

### Flow 2: View Run History
1. User clicks a job row
2. Row expands showing recent runs
3. **Outcome:** Run history table shows timestamp, status badge, duration

### Flow 3: Search and Filter
1. User types "health" in search, or selects agent from dropdown
2. **Outcome:** Table filters to matching jobs

## Empty States

- **No jobs:** Table shows "No scheduled jobs" message
- **No run history:** Expanded row shows "No runs yet"
- **No filter results:** Table shows "No jobs match" message

## Testing

See `product-plan/sections/jobs/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/jobs/README.md` — Feature overview
- `product-plan/sections/jobs/tests.md` — UI behavior test specs
- `product-plan/sections/jobs/components/` — React components
- `product-plan/sections/jobs/types.ts` — TypeScript interfaces
- `product-plan/sections/jobs/sample-data.json` — Test data
- `product-plan/sections/jobs/screenshot.png` — Visual reference

## Done When

- [ ] Jobs table renders with all columns
- [ ] Enable/disable toggle works for each job
- [ ] Search filters by job name
- [ ] Agent and status filter dropdowns work
- [ ] Rows expand to show run history inline
- [ ] Run status badges: green (success), red (failed), amber (running)
- [ ] Last run shows relative time with status dot
- [ ] Empty states display properly
- [ ] Responsive on mobile
- [ ] Matches the visual design (see screenshot)
