# Jobs

## Overview
Scheduled and recurring job management synced with the OpenClaw Gateway's cron system. Displays all jobs in a table with inline expandable run history.

## User Flows
- View all jobs in a table showing name, agent, schedule, enabled status, last/next run
- Toggle a job's enabled/disabled state from the table row
- Filter by agent, enabled status, or search by name
- Click a row to expand inline run history

## Design Decisions
- Table layout with inline expandable rows
- Run history as nested mini table
- Status badges: green for success, red for failed, amber for running
- Toggle switch on each row for enable/disable

## Data Shapes
**Entities:** Job, JobRun

## Visual Reference
See `screenshot.png` for the target UI design.

## Components Provided
- `JobsTable` — Table with search, filters, expandable rows
- `RunHistoryTable` — Mini table showing recent runs

## Callback Props
| Callback | Triggered When |
|----------|---------------|
| `onToggleEnabled` | User toggles a job's enabled state |
