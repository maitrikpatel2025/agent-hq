# Usage

## Overview
Token and cost analytics with time-period selection, trend charts, and breakdowns by agent and model — giving full visibility into API spend.

## User Flows
- Select time period (today, week, month, year) to filter all metrics
- View summary metric cards with sparklines and delta badges
- View time-series chart showing cost over time
- View breakdown tables by agent and by model

## Design Decisions
- Time period selector as segmented control at top
- 5 metric cards in horizontal row with sparklines
- Full-width area chart below metrics
- Two breakdown tables side by side on desktop, stacked on mobile
- Token counts abbreviated (1.2M, 450K)

## Data Shapes
**Entities:** UsageSummary, TimeSeriesPoint, AgentUsage, ModelUsage

## Visual Reference
See `screenshot.png` for the target UI design.

## Components Provided
- `UsageAnalytics` — Main container with period selector
- `MetricCard` — Metric display card with sparkline
- `UsageChart` — SVG line chart for cost over time
- `BreakdownTable` — Grid table for agent/model breakdown

## Callback Props
| Callback | Triggered When |
|----------|---------------|
| `onPeriodChange` | User selects a different time period |
| `onAgentClick` | User clicks an agent row |
