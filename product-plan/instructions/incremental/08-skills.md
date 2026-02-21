# Milestone 8: Skills

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

Implement the Skills section — a panel for managing agent capabilities synced with the gateway.

## Overview

The Skills section displays all available agent capabilities in a card grid. Users can browse skills, toggle them globally on or off, and open a detail modal to manage per-agent assignment — controlling which agents have access to which skills.

**Key Functionality:**
- Browse all skills in a responsive card grid
- Toggle a skill's global enabled/disabled state from the card
- Open detail modal to view full description and manage per-agent assignment
- Toggle skill access per agent in the detail modal

## Components Provided

Copy from `product-plan/sections/skills/components/`:

- `SkillsPanel` — Grid layout of skill cards
- `SkillCard` — Card showing name, description, toggle, and agent count
- `SkillDetailModal` — Modal with global toggle and per-agent assignment list

## Props Reference

**Data props:**

- `skills: Skill[]` — Skill objects with id, name, description, enabled state, and agentIds
- `agents: AgentRef[]` — Agent references (id, emoji, name, role) for assignment UI

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onToggleSkill` | User toggles a skill's global enabled state |
| `onSelectSkill` | User clicks a skill card to open detail modal |
| `onToggleAgentSkill` | User toggles a skill for a specific agent |

## Expected User Flows

### Flow 1: Enable a Skill Globally
1. User sees "GitHub Issues" skill card with toggle off (muted)
2. User clicks the toggle switch
3. **Outcome:** Skill becomes enabled, card changes from muted to full color

### Flow 2: Manage Per-Agent Assignment
1. User clicks the "Web Search" skill card (not the toggle)
2. Detail modal opens with full description
3. User sees list of all agents with individual toggles
4. User enables the skill for a specific agent
5. User closes modal
6. **Outcome:** Skill's agent count updates on the card

## Empty States

- **No skills:** Grid shows "No skills available" message

## Testing

See `product-plan/sections/skills/tests.md` for UI behavior test specs.

## Files to Reference

- `product-plan/sections/skills/README.md` — Feature overview
- `product-plan/sections/skills/tests.md` — UI behavior test specs
- `product-plan/sections/skills/components/` — React components
- `product-plan/sections/skills/types.ts` — TypeScript interfaces
- `product-plan/sections/skills/sample-data.json` — Test data
- `product-plan/sections/skills/screenshot.png` — Visual reference

## Done When

- [ ] Skills card grid renders with all skills
- [ ] Global toggle enables/disables skills from the card
- [ ] Disabled skills appear muted/dimmed
- [ ] Clicking a card (not toggle) opens detail modal
- [ ] Detail modal shows full description and per-agent toggle list
- [ ] Per-agent toggles work independently
- [ ] Agent count on cards updates correctly
- [ ] Empty state displays when no skills
- [ ] Responsive on mobile
- [ ] Matches the visual design (see screenshot)
