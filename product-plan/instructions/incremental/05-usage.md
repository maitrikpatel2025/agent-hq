# Milestone 5: Usage

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

Implement the Usage section — token and cost analytics with full visibility into API spend.

## Overview

The Usage section opens with summary metric cards showing total cost, tokens, and averages with sparklines, followed by a time-series trend chart and tabular breakdowns by agent and model — all filterable by time period.

**Key Functionality:**
- Select time period (today, week, month, year)
- View summary metric cards with sparklines and delta badges
- View cost-over-time trend chart
- View breakdown tables by agent and by model
- Compare current period to previous period

## Components Provided

Copy from `product-plan/sections/usage/components/`:

- `UsageAnalytics` — Main container with period selector tabs
- `MetricCard` — Individual metric display with sparkline chart
- `UsageChart` — SVG line/area chart showing cost over time
- `BreakdownTable` — Grid-based table for agent or model breakdowns

## Props Reference

**Data props:**

- `selectedPeriod: UsagePeriod` — "today" | "week" | "month" | "year"
- `summary: UsageSummary` — Totals, deltas, sparkline data
- `timeSeries: TimeSeriesPoint[]` — Date/cost/token data points for chart
- `byAgent: AgentUsage[]` — Per-agent cost and token breakdown
- `byModel: ModelUsage[]` — Per-model cost and token breakdown

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onPeriodChange` | User selects a different time period tab |
| `onAgentClick` | User clicks an agent row in breakdown |

## Expected User Flows

### Flow 1: Compare Time Periods
1. User sees "Week" selected by default
2. User clicks "Month" tab
3. **Outcome:** All metrics, chart, and tables update to monthly view

### Flow 2: Identify Top Spender
1. User scrolls to "By Agent" breakdown table
2. Agents are sorted by cost descending
3. **Outcome:** User identifies which agent has highest spend

## Empty States

- **No usage data:** Metric cards show $0.00, chart shows empty state
- **Single agent:** Breakdown shows one row

## Testing

See `product-plan/sections/usage/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/usage/README.md` — Feature overview
- `product-plan/sections/usage/tests.md` — UI behavior test specs
- `product-plan/sections/usage/components/` — React components
- `product-plan/sections/usage/types.ts` — TypeScript interfaces
- `product-plan/sections/usage/sample-data.json` — Test data
- `product-plan/sections/usage/screenshot.png` — Visual reference

## Done When

- [ ] Period selector tabs work (Today, Week, Month, Year)
- [ ] Metric cards show formatted numbers with sparklines and deltas
- [ ] Cost chart renders with correct data points
- [ ] By Agent table shows sorted breakdown with cost and tokens
- [ ] By Model table shows sorted breakdown
- [ ] Token counts abbreviated (1.2M, 450K)
- [ ] Currency formatted with 2 decimal places
- [ ] Responsive: breakdown tables stack on mobile
- [ ] Matches the visual design (see screenshot)
