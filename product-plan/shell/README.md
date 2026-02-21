# Application Shell

## Overview

Agent HQ uses a collapsible sidebar navigation with a top header bar. The sidebar provides quick access to all 8 sections plus utility items (Settings, Help). The header contains the user menu with avatar and sign-out dropdown.

## Navigation Items

- **Dashboard** → At-a-glance system overview
- **Agents** → Agent roster with identity cards
- **Activity** → Chronological feed of agent responses
- **Usage** → Token and cost analytics
- **Jobs** → Scheduled job management
- **Tasks** → Kanban task board
- **Skills** → Skills panel
- **AI Council** → Multi-agent debate system
- **Settings** → Application configuration (utility)
- **Help** → Documentation and support (utility)

## Layout Pattern

- Sidebar width: 240px expanded, 64px collapsed
- Header height: 56px
- Content area fills remaining space with overflow scrolling

## Responsive Behavior

- **Desktop:** Full sidebar (expandable/collapsible), header with user menu
- **Tablet:** Sidebar defaults to collapsed (icon-only)
- **Mobile:** Sidebar hidden, accessible via hamburger menu as overlay

## Components

- `AppShell.tsx` — Main layout wrapper
- `MainNav.tsx` — Sidebar navigation
- `UserMenu.tsx` — Header user menu with avatar

## Visual Reference

See `screenshot.png` for the visual design.
