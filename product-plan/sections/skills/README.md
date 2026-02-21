# Skills

## Overview
Skills panel displaying all available agent capabilities synced from the OpenClaw Gateway. Users can browse skills, toggle them on/off, and manage per-agent assignment via detail modal.

## User Flows
- Browse skills in responsive card grid with name, description, and toggle
- Toggle a skill's global enabled/disabled state from the card
- Click a skill card to open detail modal with per-agent assignment
- In modal, toggle skill for each agent individually
- Close modal to return to grid

## Design Decisions
- Responsive card grid layout
- Visual distinction between enabled (full color) and disabled (muted) cards
- Detail modal with global toggle and per-agent assignment list
- Agent assignment list shows emoji, name, and toggle per agent

## Data Shapes
**Entities:** Skill, AgentRef

## Visual Reference
See `screenshot.png` for the target UI design.

## Components Provided
- `SkillsPanel` — Grid of skill cards
- `SkillCard` — Card with skill name, description, toggle, agent count
- `SkillDetailModal` — Modal with global toggle and per-agent assignment

## Callback Props
| Callback | Triggered When |
|----------|---------------|
| `onToggleSkill` | User toggles a skill's global state |
| `onSelectSkill` | User clicks a skill card |
| `onToggleAgentSkill` | User toggles per-agent assignment |
