# Milestone 1: Shell

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

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

Set up the design tokens and application shell — the persistent chrome that wraps all sections.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Colors:**
- **Primary:** `violet` — Buttons, links, active nav items, key accents
- **Secondary:** `emerald` — Online status, success states, status indicators
- **Neutral:** `stone` — Backgrounds, text, borders, cards

**Typography:**
- **Heading:** DM Sans (semibold/bold weights)
- **Body:** DM Sans (regular/medium weights)
- **Mono:** IBM Plex Mono (monospaced values, token counts, costs)

### 2. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with collapsible sidebar and header
- `MainNav.tsx` — Sidebar navigation with icon mapping
- `UserMenu.tsx` — Header user menu with avatar and dropdown

**Wire Up Navigation:**

Connect navigation to your routing:

| Navigation Item | Route | Description |
|----------------|-------|-------------|
| Dashboard | `/` or `/dashboard` | At-a-glance system overview |
| Agents | `/agents` | Agent roster with identity cards |
| Activity | `/activity` | Chronological feed of agent responses |
| Usage | `/usage` | Token and cost analytics |
| Jobs | `/jobs` | Scheduled job management |
| Tasks | `/tasks` | Kanban task board |
| Skills | `/skills` | Skills panel |
| AI Council | `/ai-council` | Multi-agent debate system |
| Settings | `/settings` | Application configuration (utility) |
| Help | `/help` | Documentation and support (utility) |

**User Menu:**

The user menu expects:
- User name (string)
- Avatar initials fallback (auto-generated from name)
- Logout callback

**Layout:**
- Sidebar width: 240px expanded, 64px collapsed
- Header height: 56px
- Content area fills remaining space with overflow scrolling
- Sidebar collapse state persisted to localStorage

**Responsive Behavior:**
- **Desktop:** Full sidebar (expandable/collapsible via toggle)
- **Tablet:** Sidebar defaults to collapsed (icon-only)
- **Mobile:** Sidebar hidden, accessible via hamburger menu as overlay

## Files to Reference

- `product-plan/design-system/` — Design tokens (colors, fonts, CSS)
- `product-plan/shell/README.md` — Shell design intent and layout specs
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (violet/emerald/stone palette, DM Sans + IBM Plex Mono fonts)
- [ ] Shell renders with collapsible sidebar navigation
- [ ] All 10 navigation items link to correct routes
- [ ] Active navigation item is highlighted with violet accent
- [ ] User menu shows user info with avatar initials
- [ ] Sidebar collapse toggle works and persists to localStorage
- [ ] Responsive: sidebar collapses on tablet, becomes overlay on mobile
- [ ] Light and dark mode both work
