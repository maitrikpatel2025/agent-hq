# Test Specs: AI Council

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview
Multi-agent debate system with session creation, real-time thread, and synthesis.

---

## User Flow Tests

### Flow 1: Create a New Council Session
**Steps:**
1. User clicks "+ New Session" button
2. Modal opens with topic input, agent selection, format selector
3. User enters topic: "Should we migrate to microservices?"
4. User selects 3 agents
5. User selects debate format
6. User clicks "Start Session"

**Expected Results:**
- [ ] `onCreateSession` is called with topic, participant IDs, format ID
- [ ] Modal closes
- [ ] New session appears at top of list with "In Progress" status

#### Failure Path: No Topic
**Steps:**
1. User opens create modal
2. User leaves topic empty
3. User clicks "Start Session"

**Expected Results:**
- [ ] Validation error shown for topic field
- [ ] Modal stays open

### Flow 2: View Session Thread
**Steps:**
1. User clicks a completed session from the list

**Expected Results:**
- [ ] `onSelectSession` is called with session ID
- [ ] Thread view shows all agent messages chronologically
- [ ] Each message attributed to agent emoji and name
- [ ] Synthesis panel shows summary, agreements, disagreements, recommendation

### Flow 3: Browse Session History
**Steps:**
1. User sees list of past sessions

**Expected Results:**
- [ ] Sessions show topic, status badge, participant avatars, date
- [ ] "In Progress" sessions have green badge
- [ ] "Completed" sessions have neutral badge

---

## Empty State Tests

### No Sessions
**Setup:** `sessions` array is empty

**Expected Results:**
- [ ] Shows empty state with message to create first session
- [ ] "+ New Session" button is visible

---

## Component Interaction Tests

### Session List Item
- [ ] Shows session topic as heading
- [ ] Shows participant avatars (emojis) in a row
- [ ] Shows agent count
- [ ] Shows date and time
- [ ] Status badge: "In Progress" (green) or "Completed" (neutral)

### Synthesis Panel
- [ ] Shows "Summary" section with text
- [ ] Shows "Agreements" as bullet list
- [ ] Shows "Disagreements" as bullet list
- [ ] Shows "Recommendation" with highlighted text

---

## Edge Cases
- [ ] Session with no messages shows "Waiting for responses" state
- [ ] Session with no synthesis (in-progress) hides synthesis panel
- [ ] Very long topics truncate in list view, show fully in thread
- [ ] Single-agent session renders correctly
