# Feature: Application Shell & Design Tokens

## Metadata
issue_number: ``
adw_id: ``
issue_json: ``

## Feature Description
Set up the design tokens (violet/emerald/stone color palette, DM Sans + IBM Plex Mono typography) and the application shell — the persistent chrome that wraps all sections. The shell consists of a collapsible sidebar navigation with 10 navigation items linking to correct routes, a top header bar with user menu and avatar, responsive behavior (full sidebar on desktop, collapsed on tablet, overlay on mobile), and light/dark mode support. This is the foundational Milestone 1 for the Agent HQ product.

## User Story
As an Agent HQ operator
I want a persistent navigation shell with sidebar, header, and routing
So that I can navigate between all 10 sections of the application with a consistent, responsive layout

## Problem Statement
The current application is a blank React page with placeholder text ("Ready to build something new"). There is no navigation, no routing, no design tokens, and no application shell. The existing Tailwind config uses an old Inter/neutral/blue color scheme that doesn't match the product design system (DM Sans/violet/emerald/stone). Without the shell, no further milestones (Dashboard, Agents, Activity, etc.) can be built.

## Solution Statement
Integrate the pre-built shell components (`AppShell`, `MainNav`, `UserMenu`) from `product-plan/shell/components/` into the React client. Convert the TypeScript components to JSX (the project uses `.jsx` not `.tsx`). Update the Tailwind config to use the new design tokens (stone neutral, violet primary, emerald secondary). Update Google Fonts from Inter to DM Sans + IBM Plex Mono. Set up React Router v6 with routes for all 10 navigation items. Implement light/dark mode toggle. Each route will render a placeholder page for now, to be filled in by later milestones.

## Relevant Files
Use these files to implement the feature:

- `README.md` — Project overview, tech stack (React 18, React Router v6, Tailwind CSS, FastAPI), start/build commands
- `app/client/public/index.html` — Update Google Fonts links (replace Inter with DM Sans + IBM Plex Mono), update body classes from `bg-neutral-50 text-neutral-900` to `bg-stone-100 text-stone-900`
- `app/client/tailwind.config.js` — Replace the old neutral/blue color scheme with the new violet/emerald/stone design tokens, update font families to DM Sans + IBM Plex Mono
- `app/client/src/index.css` — Add CSS custom properties for design tokens, add dark mode base styles
- `app/client/src/App.jsx` — Replace placeholder content with React Router setup and AppShell wrapper
- `app/client/src/index.js` — Entry point (wrap with BrowserRouter)
- `app/client/package.json` — Verify lucide-react and react-router-dom are already installed (they are)
- `product-plan/design-system/tokens.css` — Reference for CSS custom properties
- `product-plan/design-system/tailwind-colors.md` — Reference for Tailwind color usage patterns
- `product-plan/design-system/fonts.md` — Reference for Google Fonts import and font usage
- `product-plan/shell/README.md` — Shell design intent and layout specs
- `product-plan/shell/components/AppShell.tsx` — Main layout wrapper component (convert to JSX)
- `product-plan/shell/components/MainNav.tsx` — Sidebar navigation with icon mapping (convert to JSX)
- `product-plan/shell/components/UserMenu.tsx` — Header user menu with avatar and dropdown (convert to JSX)
- `.claude/commands/test_e2e.md` — Read this to understand how to create an E2E test file

### New Files
- `app/client/src/components/shell/AppShell.jsx` — Main layout wrapper (converted from TSX)
- `app/client/src/components/shell/MainNav.jsx` — Sidebar navigation (converted from TSX)
- `app/client/src/components/shell/UserMenu.jsx` — User menu with avatar dropdown (converted from TSX)
- `app/client/src/components/shell/index.js` — Shell barrel export
- `app/client/src/pages/Dashboard.jsx` — Placeholder page for Dashboard route
- `app/client/src/pages/Agents.jsx` — Placeholder page for Agents route
- `app/client/src/pages/Activity.jsx` — Placeholder page for Activity route
- `app/client/src/pages/Usage.jsx` — Placeholder page for Usage route
- `app/client/src/pages/Jobs.jsx` — Placeholder page for Jobs route
- `app/client/src/pages/Tasks.jsx` — Placeholder page for Tasks route
- `app/client/src/pages/Skills.jsx` — Placeholder page for Skills route
- `app/client/src/pages/AiCouncil.jsx` — Placeholder page for AI Council route
- `app/client/src/pages/Settings.jsx` — Placeholder page for Settings route
- `app/client/src/pages/Help.jsx` — Placeholder page for Help route
- `.claude/commands/e2e/test_application_shell.md` — E2E test specification for the shell

## Implementation Plan
### Phase 1: Foundation
Update the design tokens across the project. This includes replacing the Google Fonts in `index.html` (swap Inter for DM Sans + IBM Plex Mono), rewriting `tailwind.config.js` to use the violet/emerald/stone color palette with DM Sans and IBM Plex Mono font families, and adding base dark mode CSS custom properties to `index.css`.

### Phase 2: Core Implementation
Convert the three TypeScript shell components (`AppShell.tsx`, `MainNav.tsx`, `UserMenu.tsx`) to JSX and place them in `app/client/src/components/shell/`. Remove TypeScript interfaces and type annotations. Adapt the components to work with React Router's `useNavigate` and `useLocation` hooks for navigation and active state. Create 10 minimal placeholder pages (one per route) in `app/client/src/pages/`.

### Phase 3: Integration
Wire everything together in `App.jsx`: wrap the app in `BrowserRouter`, define all 10 routes, integrate the `AppShell` as the layout wrapper passing navigation items with active state derived from the current route. Add a dark mode toggle mechanism (class-based, persisted to localStorage). Ensure the sidebar collapse state persists to localStorage. Verify responsive behavior across desktop, tablet, and mobile breakpoints.

## Step by Step Tasks

### Task 1: Create E2E Test Specification
- Read `.claude/commands/test_e2e.md` to understand the E2E test format
- Create `.claude/commands/e2e/test_application_shell.md` with test steps that validate:
  - Shell renders with sidebar navigation and header
  - All 10 navigation items are visible and clickable
  - Clicking a nav item navigates to the correct route and highlights the active item with violet accent
  - Sidebar collapse toggle works (collapses to icon-only 64px width)
  - User menu shows avatar initials and opens dropdown on click
  - Sign out button is present in dropdown
  - Responsive: at mobile viewport, sidebar is hidden and hamburger menu appears
  - Responsive: clicking hamburger opens sidebar as overlay
  - Dark mode toggle switches theme
  - After page reload, sidebar collapse state persists

### Task 2: Update Design Tokens — Google Fonts
- Edit `app/client/public/index.html`:
  - Replace the Inter Google Fonts link with DM Sans + IBM Plex Mono:
    ```html
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    ```
  - Update the body class from `bg-neutral-50 text-neutral-900` to `bg-stone-100 text-stone-900`

### Task 3: Update Design Tokens — Tailwind Configuration
- Rewrite `app/client/tailwind.config.js`:
  - Replace `fontFamily.sans` with `['DM Sans', 'system-ui', 'sans-serif']`
  - Replace `fontFamily.mono` with `['IBM Plex Mono', 'Consolas', 'Monaco', 'monospace']`
  - Remove the old custom neutral/primary/success/warning/error color definitions
  - The built-in Tailwind `violet`, `emerald`, and `stone` colors are sufficient — no custom hex definitions needed
  - Keep the existing `darkMode: 'class'` setting
  - Keep useful existing `keyframes`, `animation`, `borderRadius`, `boxShadow` extensions
  - Remove spacing overrides that conflict with Tailwind defaults (let Tailwind's default spacing work)

### Task 4: Update Global Styles
- Edit `app/client/src/index.css`:
  - Keep the three Tailwind directives
  - Add CSS custom properties for the design tokens in a `@layer base` block:
    ```css
    @layer base {
      :root {
        --font-heading: 'DM Sans', sans-serif;
        --font-body: 'DM Sans', sans-serif;
        --font-mono: 'IBM Plex Mono', monospace;
      }
    }
    ```

### Task 5: Create Shell Components
- Create `app/client/src/components/shell/` directory
- Convert `product-plan/shell/components/AppShell.tsx` to `app/client/src/components/shell/AppShell.jsx`:
  - Remove all TypeScript interfaces and type annotations (`AppShellProps`, parameter types, etc.)
  - Remove `type` import from React
  - Keep all logic, state management, and JSX identical
  - The `onNavigate` callback will be wired to React Router's `useNavigate`
- Convert `product-plan/shell/components/MainNav.tsx` to `app/client/src/components/shell/MainNav.jsx`:
  - Remove `NavigationItem` interface and type annotations
  - Remove `IconComponent` type and `ComponentType`/`SVGProps` imports
  - Keep the icon map, rendering logic, and JSX identical
- Convert `product-plan/shell/components/UserMenu.tsx` to `app/client/src/components/shell/UserMenu.jsx`:
  - Remove `UserMenuProps` interface and type annotations
  - Remove generic type parameter from `useRef<HTMLDivElement>(null)`
  - Keep all logic and JSX identical
- Create `app/client/src/components/shell/index.js` barrel export

### Task 6: Create Placeholder Pages
- Create 10 placeholder page components in `app/client/src/pages/`:
  - Each page should be a simple functional component with:
    - A consistent layout: `<div className="p-6">` wrapper
    - An `<h1>` with the page name using `text-2xl font-semibold text-stone-900 dark:text-stone-100`
    - A `<p>` with placeholder text using `text-stone-500 dark:text-stone-400 mt-2`
  - Pages: `Dashboard.jsx`, `Agents.jsx`, `Activity.jsx`, `Usage.jsx`, `Jobs.jsx`, `Tasks.jsx`, `Skills.jsx`, `AiCouncil.jsx`, `Settings.jsx`, `Help.jsx`

### Task 7: Wire Up Routing and App Shell
- Edit `app/client/src/index.js`:
  - Import `BrowserRouter` from `react-router-dom`
  - Wrap `<App />` in `<BrowserRouter>`
- Rewrite `app/client/src/App.jsx`:
  - Import `useNavigate`, `useLocation`, `Routes`, `Route` from `react-router-dom`
  - Import `AppShell` from `./components/shell`
  - Import all 10 page components
  - Define the `navigationItems` array matching the route table:
    ```
    Dashboard → /
    Agents → /agents
    Activity → /activity
    Usage → /usage
    Jobs → /jobs
    Tasks → /tasks
    Skills → /skills
    AI Council → /ai-council
    ```
  - Use `useLocation` to determine `isActive` for each nav item
  - Pass `useNavigate()` as the `onNavigate` handler
  - Pass a hardcoded user object `{ name: 'Operator' }` (to be replaced with real auth later)
  - Define `<Routes>` with all 10 routes inside the `<AppShell>` children
  - The `/` route renders `Dashboard`, redirect unknown routes to `/`

### Task 8: Implement Dark Mode Toggle
- Add a dark mode toggle mechanism:
  - Create a `useDarkMode` hook or inline logic in `App.jsx` that:
    - Reads initial dark mode preference from `localStorage` key `theme`
    - Falls back to system preference via `window.matchMedia('(prefers-color-scheme: dark)')`
    - Toggles the `dark` class on `document.documentElement`
    - Persists the choice to `localStorage`
  - Add a dark mode toggle button in the header area of `AppShell` (or pass it as a prop to the header)
  - Use `Sun`/`Moon` icons from lucide-react for the toggle

### Task 9: Run Validation Commands
- Run `cd app/client && npm run build` to validate the build succeeds with zero errors
- Run `cd app/server && uv run pytest` to validate no server regressions
- Manually verify (via E2E test):
  - Shell renders correctly
  - All 10 nav links work
  - Sidebar collapse toggle works and persists
  - Dark mode toggle works and persists
  - Responsive behavior works at different viewports

## Testing Strategy
### Unit Tests
- No unit tests are strictly required for this milestone since the shell components are pure UI with minimal logic
- The sidebar collapse localStorage persistence can be validated via E2E testing
- The dark mode toggle localStorage persistence can be validated via E2E testing

### Edge Cases
- Sidebar collapse state when localStorage is unavailable or cleared
- Dark mode preference when neither localStorage nor system preference is set (default to light)
- Navigation to unknown routes (should redirect to Dashboard `/`)
- Very long user names in the UserMenu (should truncate gracefully)
- Rapid sidebar collapse/expand toggling
- Mobile overlay sidebar: clicking overlay backdrop should close sidebar
- Window resize from mobile to desktop should close mobile overlay

## Acceptance Criteria
- [ ] Design tokens are configured (violet/emerald/stone palette, DM Sans + IBM Plex Mono fonts)
- [ ] Shell renders with collapsible sidebar navigation
- [ ] All 10 navigation items link to correct routes (`/`, `/agents`, `/activity`, `/usage`, `/jobs`, `/tasks`, `/skills`, `/ai-council`, `/settings`, `/help`)
- [ ] Active navigation item is highlighted with violet accent
- [ ] User menu shows user info with avatar initials
- [ ] Sidebar collapse toggle works and persists to localStorage
- [ ] Responsive: sidebar collapses on tablet, becomes overlay on mobile
- [ ] Light and dark mode both work
- [ ] `npm run build` completes with zero errors
- [ ] `uv run pytest` passes with zero regressions

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `cd app/server && uv run pytest` - Run server tests to validate the feature works with zero regressions
- `cd app/client && npm run build` - Run frontend build to validate the feature works with zero regressions

## Notes
- The shell components from `product-plan/shell/components/` are in TypeScript (`.tsx`). The project uses JavaScript (`.jsx`), so all type annotations must be stripped during conversion.
- The project already has `lucide-react` and `react-router-dom` installed — no new dependencies are needed.
- The `tailwind.config.js` currently has extensive custom color definitions using hex values. Since Tailwind v3 includes `violet`, `emerald`, and `stone` in its default palette, we can simplify the config significantly by removing custom color overrides and using the built-in Tailwind colors directly.
- The spacing overrides in the current tailwind config redefine Tailwind's default spacing scale. These should be removed to use Tailwind's standard spacing so the shell component classes (which assume default spacing) work correctly.
- Placeholder pages are intentionally minimal — they will be replaced by full implementations in subsequent milestones (Dashboard, Agents, Activity, etc.).
- The user object is hardcoded as `{ name: 'Operator' }` for now. Real authentication will be added in a future milestone.
