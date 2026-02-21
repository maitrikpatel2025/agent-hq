# Test Specs: Skills

These test specs are **framework-agnostic**. Adapt them to your testing setup.

## Overview
Skills card grid with enable/disable toggles and per-agent assignment modal.

---

## User Flow Tests

### Flow 1: Toggle Skill Globally
**Steps:**
1. User sees "GitHub Issues" skill with toggle off
2. User clicks the toggle switch on the card

**Expected Results:**
- [ ] `onToggleSkill` is called with skill ID and `true`
- [ ] Card visual changes from muted/dimmed to full color

### Flow 2: Open Skill Detail and Assign to Agent
**Steps:**
1. User clicks the "Web Search" skill card (not the toggle)
2. Detail modal opens showing full description
3. User sees list of all agents with per-agent toggles
4. User enables the skill for a specific agent

**Expected Results:**
- [ ] `onSelectSkill` is called with skill ID (to open modal)
- [ ] Modal shows skill name, description, global toggle
- [ ] Agent list shows emoji, name, and toggle per agent
- [ ] `onToggleAgentSkill` is called with skill ID, agent ID, and enabled state

### Flow 3: Close Modal
**Steps:**
1. User clicks close button or clicks outside the modal

**Expected Results:**
- [ ] Modal closes, grid view is restored

---

## Empty State Tests

### No Skills
**Setup:** `skills` array is empty

**Expected Results:**
- [ ] Shows empty state message

---

## Component Interaction Tests

### Skill Card
- [ ] Shows skill name and short description (truncated)
- [ ] Shows enable/disable toggle
- [ ] Shows agent count (e.g., "3 agents")
- [ ] Disabled skills appear muted/dimmed
- [ ] Clicking card (not toggle) opens detail modal

---

## Edge Cases
- [ ] Skill with 0 agents shows "0 agents"
- [ ] Very long skill descriptions truncate on card
- [ ] Disabling a skill globally doesn't change per-agent assignments
