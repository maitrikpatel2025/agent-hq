# AI Council

## Overview
Multi-agent strategic debate system where the user poses a topic and selected agents weigh in with their unique perspectives, ending with an auto-generated synthesis.

## User Flows
- Create a new council session with topic, participating agents, and debate format
- Watch real-time chat-style debate thread unfold
- View auto-generated synthesis with key takeaways and recommended action
- Browse past sessions from chronological list
- Open past sessions to review full thread and synthesis

## Design Decisions
- Session list with topic, date, participant count, and status badge
- Chat-style thread with agent avatar (emoji), name, and timestamped messages
- Synthesis panel with summary, agreement/disagreement highlights, and recommendation
- Session creation modal with topic input, agent multi-select, format selector

## Data Shapes
**Entities:** CouncilSession, CouncilMessage, CouncilSynthesis, Agent, DebateFormat

## Visual Reference
See `screenshot.png` for the target UI design.

## Components Provided
- `AICouncil` — Main view switching between session list and thread
- `SessionListItem` — List item with topic, status badge, participant avatars
- `SessionThread` — Detail view with message thread and synthesis
- `SynthesisPanel` — Panel with summary, agreements, disagreements, recommendation
- `NewSessionModal` — Modal for creating new debate sessions

## Callback Props
| Callback | Triggered When |
|----------|---------------|
| `onCreateSession` | User submits new session |
| `onSelectSession` | User clicks a session to view |
