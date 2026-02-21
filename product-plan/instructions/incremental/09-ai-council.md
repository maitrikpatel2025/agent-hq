# Milestone 9: AI Council

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

Implement the AI Council — a multi-agent strategic debate system.

## Overview

The AI Council lets users pose a topic and have selected agents weigh in with their unique perspectives. Users create sessions with a topic, select participating agents and debate format, then watch a chat-style thread unfold. Completed sessions include an auto-generated synthesis with key takeaways and a recommended action.

**Key Functionality:**
- Create new council sessions with topic, agents, and debate format
- View real-time chat-style debate thread with agent messages
- View auto-generated synthesis with agreements, disagreements, and recommendation
- Browse past sessions from a chronological list
- Review completed session threads and syntheses

## Components Provided

Copy from `product-plan/sections/ai-council/components/`:

- `AICouncil` — Main view switching between session list and thread detail
- `SessionListItem` — List item showing topic, status badge, participant avatars, date
- `SessionThread` — Detail view with message thread and participant info
- `SynthesisPanel` — Panel showing summary, agreements, disagreements, recommendation
- `NewSessionModal` — Modal for creating sessions with topic, agent select, format

## Props Reference

**Data props:**

- `agents: Agent[]` — Available agents for session creation (id, emoji, name, role, model)
- `sessions: CouncilSession[]` — Session objects with topic, status, participants, messages, synthesis
- `debateFormats: DebateFormat[]` — Available debate formats (id, label, description)

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onCreateSession` | User submits the new session modal |
| `onSelectSession` | User clicks a session to view its thread |

## Expected User Flows

### Flow 1: Create a Council Session
1. User clicks "+ New Session" button
2. Modal opens with topic input, agent multi-select, format selector
3. User enters topic, selects agents, picks format
4. User clicks "Start Session"
5. **Outcome:** New session appears with "In Progress" status

### Flow 2: Review Completed Session
1. User clicks a completed session from the list
2. Thread view shows all agent messages chronologically
3. Synthesis panel shows summary, agreements, disagreements, recommendation
4. **Outcome:** User reviews the full debate and AI-generated synthesis

### Flow 3: Browse Session History
1. User sees chronological list of all sessions
2. Each shows topic, participant avatars, date, status badge
3. **Outcome:** Quick overview of all past debates

## Empty States

- **No sessions:** Show message prompting to create first session, "+ New Session" visible
- **In-progress session with no messages:** Show "Waiting for responses" state
- **No synthesis yet:** Hide synthesis panel for in-progress sessions

## Testing

See `product-plan/sections/ai-council/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/ai-council/README.md` — Feature overview
- `product-plan/sections/ai-council/tests.md` — UI behavior test specs
- `product-plan/sections/ai-council/components/` — React components
- `product-plan/sections/ai-council/types.ts` — TypeScript interfaces
- `product-plan/sections/ai-council/sample-data.json` — Test data
- `product-plan/sections/ai-council/screenshot.png` — Visual reference

## Done When

- [ ] Session list renders with topics, status badges, participant avatars, dates
- [ ] "+ New Session" opens creation modal
- [ ] Modal validates topic (required) and requires at least 2 agents
- [ ] Clicking a session opens its thread view
- [ ] Thread shows agent messages with emoji, name, timestamp
- [ ] Completed sessions show synthesis panel
- [ ] Synthesis shows summary, agreements, disagreements, recommendation
- [ ] Empty state shows when no sessions exist
- [ ] Responsive on mobile
- [ ] Matches the visual design (see screenshot)
