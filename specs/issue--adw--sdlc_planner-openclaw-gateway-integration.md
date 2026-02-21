# Feature: OpenClaw Gateway Integration

## Metadata
issue_number: ``
adw_id: ``
issue_json: ``

## Feature Description
Connect Agent HQ to the OpenClaw Gateway at `187.77.102.9:52592` via WebSocket. This integration establishes the FastAPI backend as a bridge/proxy between the React frontend and the OpenClaw Gateway, implementing the full OpenClaw WebSocket protocol (3-stage handshake, request/response, event streaming). The backend maintains a persistent WebSocket connection to the gateway, exposes REST endpoints for the frontend to consume, and forwards real-time events via Server-Sent Events (SSE). This enables all Agent HQ pages (Dashboard, Agents, Activity, Usage, Jobs, Skills, AI Council, Settings) to display live data from the gateway instead of static placeholder content.

## User Story
As an Agent HQ operator
I want the application to connect to my OpenClaw Gateway instance in real-time
So that I can monitor agents, view activity feeds, manage jobs, and control my AI assistant platform from a unified dashboard

## Problem Statement
Agent HQ currently has a fully built UI shell with navigation and placeholder pages, but no connection to any backend data source. The OpenClaw Gateway exposes a rich WebSocket API with 60+ RPC methods and 19 event types, but there is no client implementation to consume this API. Without this integration, Agent HQ is non-functional — it cannot display agent status, activity, usage metrics, or allow any management operations.

## Solution Statement
Implement a **backend-to-gateway WebSocket bridge** (Option A from the feature request) where the FastAPI server maintains a persistent WebSocket connection to the OpenClaw Gateway. The backend:
1. Connects to the gateway on startup using the OpenClaw 3-stage handshake protocol
2. Exposes REST API endpoints that proxy RPC calls to the gateway
3. Streams real-time gateway events to the frontend via SSE
4. Handles reconnection, heartbeat monitoring, and connection state management

The React frontend:
1. Calls the FastAPI REST endpoints for data fetching
2. Subscribes to the SSE stream for real-time updates
3. Manages gateway connection state with a status indicator in the UI

## Relevant Files
Use these files to implement the feature:

- `README.md` — Project structure and tech stack reference
- `ai_docs/openclaw_gateway_api.md` — Complete OpenClaw Gateway API reference (protocol, methods, events, schemas). **Read this file thoroughly before implementation.**
- `app/server/server.py` — Main FastAPI application; add gateway client initialization, new API routes, and SSE endpoint here
- `app/server/pyproject.toml` — Server dependencies; add `websockets` as explicit dependency
- `.env.example` — Environment variable template; add gateway config vars
- `.env` — Active environment config; add gateway config vars
- `app/client/.env` — Client environment config
- `app/client/src/App.jsx` — Root component; add gateway context provider
- `app/client/src/pages/Dashboard.jsx` — Dashboard page; wire up to gateway data
- `app/client/src/pages/Agents.jsx` — Agents page; wire up to agents.list
- `app/client/src/pages/Activity.jsx` — Activity page; wire up to sessions + events
- `app/client/src/pages/Usage.jsx` — Usage page; wire up to sessions.usage
- `app/client/src/pages/Jobs.jsx` — Jobs page; wire up to cron.list
- `app/client/src/pages/Skills.jsx` — Skills page; wire up to skills.status
- `app/client/src/pages/Settings.jsx` — Settings page; wire up to config.get/patch
- `app/client/src/components/shell/AppShell.jsx` — App shell; add gateway connection status indicator
- `app/client/package.json` — Client dependencies
- `.claude/commands/test_e2e.md` — Read to understand how to create an E2E test file

### New Files

- `app/server/gateway_client.py` — OpenClaw WebSocket client: connection lifecycle, handshake, RPC dispatch, event listener, reconnection logic
- `app/server/gateway_routes.py` — FastAPI router with REST endpoints that proxy to gateway RPC methods, plus SSE event stream endpoint
- `app/server/gateway_models.py` — Pydantic models for gateway request/response schemas
- `app/server/tests/test_gateway_client.py` — Unit tests for the gateway client
- `app/server/tests/test_gateway_routes.py` — Unit tests for the gateway API routes
- `app/client/src/services/gateway.js` — Frontend service layer: REST API calls + SSE subscription
- `app/client/src/context/GatewayContext.jsx` — React context for gateway connection state and data
- `app/client/src/hooks/useGateway.js` — Custom hook for consuming gateway context
- `app/client/src/components/GatewayStatus.jsx` — Connection status indicator component
- `.claude/commands/e2e/test_openclaw_gateway_integration.md` — E2E test spec for gateway integration

## Implementation Plan

### Phase 1: Foundation
Set up the environment configuration, install dependencies, and build the core WebSocket client that implements the OpenClaw protocol. This phase establishes the connection layer without exposing any API endpoints yet.

Key work:
- Add `OPENCLAW_GATEWAY_URL` and `OPENCLAW_GATEWAY_TOKEN` to environment configs
- Add `websockets` library as an explicit server dependency
- Implement `gateway_client.py` with the full connection lifecycle:
  - WebSocket connect to gateway URL
  - Handle `connect.challenge` event (Stage 1)
  - Send `connect` request with auth token, client info, scopes (Stage 2)
  - Process `hello-ok` response, store available methods/events (Stage 3)
  - RPC request/response dispatch with request ID tracking
  - Event listener with callback registration
  - Heartbeat monitoring (respond to `tick` events)
  - Auto-reconnection with exponential backoff
  - Graceful shutdown handling (`shutdown` event)
- Define Pydantic models in `gateway_models.py` for protocol frames and key data schemas

### Phase 2: Core Implementation
Build the FastAPI API layer that proxies gateway RPC methods as REST endpoints, and implement the SSE stream for real-time event forwarding. Build the frontend service layer and React context.

Key work:
- Create `gateway_routes.py` FastAPI router with endpoints:
  - `GET /api/gateway/status` — Connection status
  - `GET /api/gateway/agents` — Proxy `agents.list`
  - `GET /api/gateway/agents/{agent_id}` — Proxy `agent.identity.get`
  - `GET /api/gateway/sessions` — Proxy `sessions.list`
  - `GET /api/gateway/sessions/usage` — Proxy `sessions.usage`
  - `GET /api/gateway/jobs` — Proxy `cron.list`
  - `GET /api/gateway/skills` — Proxy `skills.status`
  - `GET /api/gateway/config` — Proxy `config.get`
  - `PATCH /api/gateway/config` — Proxy `config.patch`
  - `GET /api/gateway/models` — Proxy `models.list`
  - `GET /api/gateway/events` — SSE stream of gateway events
- Initialize gateway client on FastAPI startup, teardown on shutdown
- Create frontend `gateway.js` service with API client functions and SSE subscription
- Create `GatewayContext.jsx` and `useGateway.js` for React state management

### Phase 3: Integration
Wire all existing UI pages to consume live gateway data. Add connection status indicator to the app shell. Replace placeholder content with real data-driven components.

Key work:
- Wrap `App.jsx` with `GatewayProvider`
- Add `GatewayStatus` indicator to `AppShell.jsx` header
- Update `Dashboard.jsx` — agent status grid, activity feed, usage summary
- Update `Agents.jsx` — list agents with identity cards from `agents.list`
- Update `Activity.jsx` — session list + real-time event feed
- Update `Usage.jsx` — usage stats from `sessions.usage`
- Update `Jobs.jsx` — job list from `cron.list`
- Update `Skills.jsx` — skills status from `skills.status`
- Update `Settings.jsx` — config viewer/editor from `config.get`/`config.patch`

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E test specification
- Create `.claude/commands/e2e/test_openclaw_gateway_integration.md` with test steps that validate:
  - Gateway connection status indicator is visible in the app shell header
  - Dashboard page loads and displays agent status section, activity section, and usage summary section (even if gateway is offline, shows appropriate "disconnected" or "no data" states)
  - Agents page renders an agent list area (empty state or populated)
  - Activity page renders a session/event feed area
  - Usage page renders usage metrics area
  - Jobs page renders a jobs list area
  - Skills page renders a skills panel area
  - Settings page renders a config section area
- User story: "As an operator, I can see the gateway connection status and navigate to all pages which display structured data sections ready for gateway data."
- Success criteria: All pages render their data sections without errors; connection status indicator is present

### Step 2: Add environment configuration
- Add to `.env.example`:
  ```
  # OpenClaw Gateway Configuration
  OPENCLAW_GATEWAY_URL=ws://187.77.102.9:52592
  OPENCLAW_GATEWAY_TOKEN=your-openclaw-gateway-token-here
  ```
- Add the same variables to `.env` with placeholder values
- Add `REACT_APP_API_URL` reference is already correct (`http://localhost:8000/api`)

### Step 3: Add server dependencies
- Add `websockets>=13.0` to `app/server/pyproject.toml` under `dependencies`
- Add `sse-starlette>=2.0.0` to `app/server/pyproject.toml` under `dependencies` (for SSE support)
- Run `cd app/server && uv sync` to install

### Step 4: Create gateway Pydantic models
- Create `app/server/gateway_models.py` with Pydantic models:
  - `GatewayFrame` — base frame with `type` field
  - `GatewayRequest` — `type="req"`, `id`, `method`, `params`
  - `GatewayResponse` — `type="res"`, `id`, `ok`, `payload`, optional `error`
  - `GatewayEvent` — `type="event"`, `event`, `payload`, optional `seq`, `stateVersion`
  - `GatewayError` — `code`, `message`, `details`, `retryable`, `retryAfterMs`
  - `ConnectParams` — client info for the connect handshake request
  - `ConnectionStatus` — connection state enum and status model for the API
  - `AgentSummary` — agent data model
  - `SessionUsage` — usage data model
  - `CronJob` — cron job data model

### Step 5: Implement the gateway WebSocket client
- Create `app/server/gateway_client.py` implementing:
  - `GatewayClient` class with:
    - `connect()` — establish WebSocket connection, perform 3-stage handshake
    - `disconnect()` — graceful close
    - `send_request(method, params)` — send RPC request, await response with timeout
    - `_handle_messages()` — background task to process incoming frames (responses + events)
    - `_perform_handshake()` — wait for `connect.challenge`, send `connect`, await `hello-ok`
    - `_reconnect_loop()` — exponential backoff reconnection (1s, 2s, 4s, 8s, max 30s)
    - Event callback registration: `on_event(event_name, callback)`
    - Connection state tracking: `disconnected`, `connecting`, `connected`, `reconnecting`
    - Pending request tracking with `asyncio.Future` for request/response correlation
    - `tick` event handling to track liveness
  - Module-level singleton `gateway_client` instance
  - `get_gateway_client()` function for dependency injection

### Step 6: Create gateway API routes
- Create `app/server/gateway_routes.py` with a FastAPI `APIRouter`:
  - `GET /api/gateway/status` — return connection state, server info from hello-ok
  - `GET /api/gateway/agents` — call `agents.list`, return agent list
  - `GET /api/gateway/agents/{agent_id}/identity` — call `agent.identity.get`
  - `GET /api/gateway/sessions` — call `sessions.list` with optional query params (limit, agentId, search)
  - `GET /api/gateway/sessions/usage` — call `sessions.usage` with optional date range params
  - `GET /api/gateway/jobs` — call `cron.list`
  - `POST /api/gateway/jobs/{job_id}/run` — call `cron.run`
  - `GET /api/gateway/skills` — call `skills.status`
  - `GET /api/gateway/models` — call `models.list`
  - `GET /api/gateway/config` — call `config.get`
  - `PATCH /api/gateway/config` — call `config.patch`
  - `GET /api/gateway/health` — call `health` on gateway
  - `GET /api/gateway/events` — SSE endpoint that streams gateway events to frontend
- All endpoints should handle disconnected state gracefully (return 503 with message)
- All endpoints should catch and forward gateway errors properly

### Step 7: Integrate gateway client into FastAPI server
- Update `app/server/server.py`:
  - Import and include the gateway router
  - Add `lifespan` context manager to start gateway client on startup, stop on shutdown
  - Keep existing `/api/test` and `/api/health` endpoints unchanged

### Step 8: Write server unit tests
- Create `app/server/tests/__init__.py` (empty)
- Create `app/server/tests/test_gateway_client.py`:
  - Test `GatewayClient` initialization with config
  - Test request ID generation and tracking
  - Test connection state transitions
  - Test send_request raises when disconnected
  - Test event callback registration and dispatch
  - Mock WebSocket for handshake testing
- Create `app/server/tests/test_gateway_routes.py`:
  - Test `/api/gateway/status` returns connection info
  - Test all proxy endpoints return 503 when gateway is disconnected
  - Test existing `/api/test` and `/api/health` still work (regression)
  - Use httpx async test client with FastAPI TestClient

### Step 9: Create frontend gateway service
- Create `app/client/src/services/gateway.js`:
  - `fetchGatewayStatus()` — GET `/api/gateway/status`
  - `fetchAgents()` — GET `/api/gateway/agents`
  - `fetchAgentIdentity(agentId)` — GET `/api/gateway/agents/{agentId}/identity`
  - `fetchSessions(params)` — GET `/api/gateway/sessions`
  - `fetchSessionsUsage(params)` — GET `/api/gateway/sessions/usage`
  - `fetchJobs()` — GET `/api/gateway/jobs`
  - `runJob(jobId)` — POST `/api/gateway/jobs/{jobId}/run`
  - `fetchSkills()` — GET `/api/gateway/skills`
  - `fetchModels()` — GET `/api/gateway/models`
  - `fetchConfig()` — GET `/api/gateway/config`
  - `patchConfig(patch)` — PATCH `/api/gateway/config`
  - `subscribeToEvents(onEvent)` — EventSource to `/api/gateway/events`, returns cleanup function
- Use `axios` (already in package.json) for REST calls
- Base URL from `REACT_APP_API_URL` environment variable

### Step 10: Create React gateway context and hook
- Create `app/client/src/context/GatewayContext.jsx`:
  - `GatewayProvider` component that:
    - Polls gateway status every 10 seconds
    - Subscribes to SSE event stream
    - Stores connection state: `{ status, serverInfo, agents, events }`
    - Provides `refreshAgents()`, `refreshSessions()`, etc. functions
  - `GatewayContext` React context
- Create `app/client/src/hooks/useGateway.js`:
  - `useGateway()` — returns full gateway context
  - `useGatewayStatus()` — returns just connection status

### Step 11: Create gateway status indicator component
- Create `app/client/src/components/GatewayStatus.jsx`:
  - Small pill/badge in the header showing connection state
  - Green dot + "Connected" when connected
  - Yellow dot + "Connecting" when connecting/reconnecting
  - Red dot + "Disconnected" when disconnected
  - Tooltip with server version and uptime on hover
  - Uses `useGatewayStatus()` hook

### Step 12: Integrate context and status into App shell
- Update `app/client/src/App.jsx`:
  - Wrap the `AppShell` with `GatewayProvider`
- Update `app/client/src/components/shell/AppShell.jsx`:
  - Import and render `GatewayStatus` in the header bar (next to the dark mode toggle)

### Step 13: Update Dashboard page with gateway data
- Update `app/client/src/pages/Dashboard.jsx`:
  - Agent status grid: fetch `agents.list`, display agent cards with name, emoji, status
  - Recent activity: show last 5 session entries from `sessions.list`
  - Usage summary: show total tokens and cost from `sessions.usage`
  - Upcoming jobs: show next 3 scheduled jobs from `cron.list`
  - Handle loading states with skeleton UI
  - Handle disconnected state with "Gateway not connected" message

### Step 14: Update Agents page with gateway data
- Update `app/client/src/pages/Agents.jsx`:
  - Fetch agents via `fetchAgents()`
  - Display agent identity cards (name, emoji, avatar placeholder)
  - Handle empty state and loading state
  - Handle disconnected state

### Step 15: Update Activity page with gateway data
- Update `app/client/src/pages/Activity.jsx`:
  - Fetch recent sessions via `fetchSessions({ limit: 20, includeLastMessage: true })`
  - Display chronological feed of session entries
  - Subscribe to real-time `agent` and `chat` events from SSE stream
  - Handle empty, loading, and disconnected states

### Step 16: Update Usage page with gateway data
- Update `app/client/src/pages/Usage.jsx`:
  - Fetch usage stats via `fetchSessionsUsage()`
  - Display total tokens (input/output), total cost, number of turns
  - Handle empty, loading, and disconnected states

### Step 17: Update Jobs page with gateway data
- Update `app/client/src/pages/Jobs.jsx`:
  - Fetch jobs via `fetchJobs()`
  - Display job list with name, schedule, enabled status, last run info
  - Handle empty, loading, and disconnected states

### Step 18: Update Skills page with gateway data
- Update `app/client/src/pages/Skills.jsx`:
  - Fetch skills via `fetchSkills()`
  - Display skills list with name, enabled status
  - Handle empty, loading, and disconnected states

### Step 19: Update Settings page with gateway data
- Update `app/client/src/pages/Settings.jsx`:
  - Fetch config via `fetchConfig()`
  - Display config as a read-only JSON viewer
  - Handle empty, loading, and disconnected states

### Step 20: Run validation commands
- Run `cd app/server && uv run pytest` to validate all server tests pass
- Run `cd app/client && npm run build` to validate frontend builds with zero errors
- Run E2E test: `/test_e2e "" "" .claude/commands/e2e/test_openclaw_gateway_integration.md`

## Testing Strategy

### Unit Tests
- **Gateway Client Tests** (`test_gateway_client.py`):
  - Connection state machine transitions (disconnected -> connecting -> connected)
  - Request ID uniqueness and correlation
  - Handshake protocol sequence validation
  - Event callback registration and dispatch
  - Reconnection backoff timing
  - Graceful disconnect behavior
  - Error handling for malformed frames
- **Gateway Routes Tests** (`test_gateway_routes.py`):
  - Each proxy endpoint returns correct data shape when connected
  - All endpoints return 503 with descriptive error when gateway is disconnected
  - SSE endpoint streams events correctly
  - Query parameter forwarding (limit, agentId, date ranges)
  - Existing health/test endpoints unaffected (regression)

### Edge Cases
- Gateway is unreachable at startup — client enters reconnection loop, API returns 503
- Gateway disconnects mid-session — client reconnects, frontend shows "reconnecting" status
- Gateway sends malformed JSON — client logs error, continues processing
- Auth token is invalid — client receives error response at handshake Stage 3, does not retry with same token
- Gateway rate limits the connection — client respects `retryAfterMs` from error response
- SSE client disconnects — EventSource auto-reconnects, no server-side leak
- Multiple rapid API calls while gateway is processing — request queue with proper ID tracking
- Environment variables not set — server starts but logs warning, gateway client disabled
- Gateway sends `shutdown` event — client waits for `restartExpectedMs` then reconnects

## Acceptance Criteria
- FastAPI server connects to OpenClaw Gateway via WebSocket on startup when `OPENCLAW_GATEWAY_URL` is configured
- 3-stage handshake (challenge -> connect -> hello-ok) completes successfully
- All proxy REST endpoints return live data from the gateway when connected
- All proxy REST endpoints return HTTP 503 with descriptive message when disconnected
- SSE endpoint streams gateway events to connected frontend clients
- Gateway connection status indicator is visible in the app shell header
- Dashboard shows agent grid, activity feed, usage summary, and upcoming jobs
- Agents page lists agents from the gateway
- Activity page shows session history and real-time events
- Usage page shows token/cost metrics
- Jobs page lists scheduled cron jobs
- Skills page lists installed skills
- Settings page displays gateway configuration
- Auto-reconnection works with exponential backoff after disconnection
- All existing endpoints (`/api/test`, `/api/health`) continue to work
- Server starts without errors even when gateway env vars are not configured (graceful degradation)
- All server unit tests pass
- Frontend builds with zero errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `cd app/server && uv run pytest` - Run server tests to validate the feature works with zero regressions
- `cd app/client && npm run build` - Run frontend build to validate the feature works with zero regressions

## Notes
- The `websockets` library is already transitively available via `uvicorn[standard]`, but we add it as an explicit dependency for clarity since we use it directly in `gateway_client.py`.
- New dependency: `sse-starlette>=2.0.0` for Server-Sent Events support in FastAPI. Install with `cd app/server && uv add sse-starlette`.
- New dependency: `websockets>=13.0` as explicit dependency. Install with `cd app/server && uv add websockets`.
- The gateway at `187.77.102.9:52592` must be reachable from the development machine for full integration testing. The implementation should degrade gracefully when it's not available.
- The `ai_docs/openclaw_gateway_api.md` file is the single source of truth for the OpenClaw protocol — reference it for all method signatures, event payloads, and data schemas during implementation.
- The frontend uses `axios` (already installed) for HTTP requests and native `EventSource` for SSE — no additional frontend dependencies needed.
- All pages currently have placeholder content — this feature replaces every page's content with data-driven UI while maintaining the existing Tailwind CSS design system (stone color palette, dark mode support, DM Sans font).
