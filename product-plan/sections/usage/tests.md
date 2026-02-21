# Test Specs: Usage

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview
Token and cost analytics with time-period selection, metric cards, trend chart, and breakdown tables.

---

## User Flow Tests

### Flow 1: Change Time Period
**Steps:**
1. User sees "Week" selected by default
2. User clicks "Month" tab

**Expected Results:**
- [ ] `onPeriodChange` is called with "month"
- [ ] All metrics, chart, and tables update to monthly data

### Flow 2: View Agent Breakdown
**Steps:**
1. User scrolls to "By Agent" table
2. User sees agents sorted by highest cost first

**Expected Results:**
- [ ] Table shows agent name, role, cost, input/output/total tokens
- [ ] Cost formatted as currency ("$38.42")
- [ ] Tokens abbreviated ("612K", "1.3M")

---

## Component Interaction Tests

### Metric Card
- [ ] Shows title label (e.g., "TOTAL COST")
- [ ] Shows large formatted number (e.g., "$127.43")
- [ ] Delta badge with trend arrow (green for decrease, red for increase)
- [ ] Sparkline chart renders

### Usage Chart
- [ ] Shows cost over time as line/area chart
- [ ] Y-axis shows dollar amounts
- [ ] X-axis shows date labels
- [ ] Data points are plotted correctly

### Breakdown Table
- [ ] Shows rows sorted by cost descending
- [ ] Mini progress bar shows proportion of total spend

---

## Edge Cases
- [ ] Handles $0.00 total cost without errors
- [ ] Handles single data point in chart
- [ ] Delta of 0% shows neutral indicator
- [ ] Very large numbers abbreviated correctly
