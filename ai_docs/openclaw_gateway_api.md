# OpenClaw Gateway API Reference

Complete API reference for connecting Agent HQ to the OpenClaw Gateway.

**Gateway Deployment:** `http://187.77.102.9:52592`
**Chat URL:** `http://187.77.102.9:52592/chat?session=agent:claw:main`
**WebSocket URL:** `ws://187.77.102.9:52592`

---

## Table of Contents

- [Overview](#overview)
- [Connection & Authentication](#connection--authentication)
- [WebSocket Protocol](#websocket-protocol)
- [RPC Methods](#rpc-methods)
- [Gateway Events](#gateway-events)
- [Data Schemas](#data-schemas)
- [HTTP Endpoints](#http-endpoints)
- [Webhooks](#webhooks)
- [Agent HQ Integration Map](#agent-hq-integration-map)
- [Configuration Reference](#configuration-reference)
- [Key File Paths](#key-file-paths)
- [Resources](#resources)

---

## Overview

OpenClaw Gateway is a **self-hosted AI assistant platform** where the Gateway is the central **WebSocket control plane** that:

- Connects to AI model providers (Claude, GPT-4, Gemini, Ollama)
- Routes conversations across 13+ messaging platforms
- Manages agent sessions, tool execution, and event broadcasting
- Exposes optional OpenAI-compatible HTTP endpoints

The Gateway multiplexes **WebSocket, HTTP APIs, and the Control UI** on a single port.

---

## Connection & Authentication

### Authentication Modes

| Mode | Config Key | Description |
|------|-----------|-------------|
| `token` (recommended) | `gateway.auth.token` | Bearer token via env `OPENCLAW_GATEWAY_TOKEN` |
| `password` | `gateway.auth.password` | Shared password via env `OPENCLAW_GATEWAY_PASSWORD` |
| `trusted-proxy` | `gateway.auth.trustedProxy` | Reverse proxy identity headers |
| `none` | - | No auth (loopback only) |

### Token Auth Setup

```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "${OPENCLAW_GATEWAY_TOKEN}"
    }
  }
}
```

HTTP header: `Authorization: Bearer <token>`

### Rate Limiting

- Control-plane writes: **3 requests per 60 seconds** per `deviceId+clientIp`
- Auth failures: `429` with `Retry-After` header
- Config: `gateway.auth.rateLimit.maxAttempts` (default 10), `windowMs` (60000), `lockoutMs` (300000)

---

## WebSocket Protocol

**Protocol Version:** 3

### Frame Types

All communication uses **JSON text frames** over WebSocket.

#### Request (Client -> Server)

```json
{
  "type": "req",
  "id": "<unique-id>",
  "method": "<method-name>",
  "params": { }
}
```

#### Response (Server -> Client)

```json
{
  "type": "res",
  "id": "<matching-request-id>",
  "ok": true,
  "payload": { }
}
```

Error response:

```json
{
  "type": "res",
  "id": "<matching-request-id>",
  "ok": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": {},
    "retryable": false,
    "retryAfterMs": 5000
  }
}
```

#### Event (Server -> Client, unsolicited)

```json
{
  "type": "event",
  "event": "<event-name>",
  "payload": { },
  "seq": 42,
  "stateVersion": { "presence": 1, "health": 2 }
}
```

### Connection Handshake (3-Stage)

#### Stage 1: Server Challenge

Server sends immediately on WebSocket open:

```json
{
  "type": "event",
  "event": "connect.challenge",
  "payload": {
    "nonce": "<random-nonce>",
    "ts": 1737264000000
  }
}
```

#### Stage 2: Client Connect Request

Client **must** send `connect` as the first frame (non-connect = socket closed):

```json
{
  "type": "req",
  "id": "1",
  "method": "connect",
  "params": {
    "minProtocol": 3,
    "maxProtocol": 3,
    "client": {
      "id": "agent-hq",
      "version": "1.0.0",
      "platform": "web",
      "mode": "operator"
    },
    "role": "operator",
    "scopes": ["operator.read", "operator.write", "operator.admin"],
    "caps": [],
    "commands": [],
    "permissions": {},
    "auth": {
      "token": "<OPENCLAW_GATEWAY_TOKEN>"
    },
    "locale": "en-US",
    "userAgent": "agent-hq/1.0.0"
  }
}
```

#### Stage 3: Server Hello-Ok

```json
{
  "type": "res",
  "id": "1",
  "ok": true,
  "payload": {
    "type": "hello-ok",
    "protocol": 3,
    "server": {
      "version": "1.2.3",
      "commit": "abc123",
      "connId": "conn-uuid"
    },
    "features": {
      "methods": ["agents.list", "sessions.list", "..."],
      "events": ["agent", "chat", "presence", "..."]
    },
    "snapshot": {
      "presence": [],
      "health": {},
      "stateVersion": { "presence": 0, "health": 0 },
      "uptimeMs": 123456,
      "sessionDefaults": {
        "defaultAgentId": "main",
        "mainKey": "main",
        "mainSessionKey": "agent:main:main"
      },
      "authMode": "token"
    },
    "policy": {
      "maxPayload": 1048576,
      "maxBufferedBytes": 4194304,
      "tickIntervalMs": 15000
    }
  }
}
```

### Connection Lifecycle

1. **WebSocket Open** -> connect to `ws://187.77.102.9:52592`
2. **Receive** `connect.challenge` event from server
3. **Send** `connect` request with auth token + client info
4. **Receive** `hello-ok` with system snapshot, available methods/events
5. **Steady State** -> send `req` frames, receive `res` + `event` frames
6. **Heartbeat** -> server sends `tick` events every `tickIntervalMs` (15s default)
7. **Shutdown** -> server broadcasts `shutdown` event, closes with code 1001

### Reconnection

- Events are **NOT replayed** on reconnect
- Client must refresh full state on sequence gaps (using `seq` and `stateVersion`)
- Re-run the full handshake on every reconnection

---

## RPC Methods

### Roles & Scopes

| Scope | Purpose |
|-------|---------|
| `operator.read` | Read-only access |
| `operator.write` | Write/mutation access |
| `operator.admin` | Administrative operations |
| `operator.approvals` | Exec approval workflow |
| `operator.pairing` | Device pairing management |

### Agent Operations

| Method | Params | Description |
|--------|--------|-------------|
| `agent` | `{ message, agentId?, sessionKey?, model?, thinking? }` | Execute single agent turn |
| `agent.identity.get` | `{ agentId }` | Get agent metadata (name, avatar, emoji) |
| `agent.wait` | `{ runId }` | Block/poll until agent run completes |

### Agent CRUD

| Method | Params | Description |
|--------|--------|-------------|
| `agents.list` | `{}` | List all configured agents |
| `agents.create` | `{ id, name, workspace, emoji?, avatar? }` | Create new agent |
| `agents.update` | `{ id, ...fields }` | Modify agent settings |
| `agents.delete` | `{ id, deleteFiles? }` | Remove agent |

### Agent Workspace Files

| Method | Params | Description |
|--------|--------|-------------|
| `agents.files.list` | `{ agentId }` | List workspace files |
| `agents.files.get` | `{ agentId, path }` | Read a workspace file |
| `agents.files.set` | `{ agentId, path, content }` | Write/update a workspace file |

### Session Management

| Method | Params | Description |
|--------|--------|-------------|
| `sessions.list` | `{ limit?, agentId?, search?, includeLastMessage? }` | List all sessions |
| `sessions.preview` | `{ keys[] }` | Get transcript previews |
| `sessions.patch` | `{ key, model?, thinkingLevel?, label? }` | Update session config |
| `sessions.reset` | `{ key, reason? }` | Clear transcript |
| `sessions.delete` | `{ key, deleteTranscript? }` | Remove session |
| `sessions.compact` | `{ key, maxLines? }` | Trigger context compaction |
| `sessions.usage` | `{ key?, startDate?, endDate?, mode? }` | Token/cost usage stats |

### Chat (WebChat)

| Method | Params | Description |
|--------|--------|-------------|
| `chat.history` | `{ sessionKey }` | Retrieve message history |
| `chat.send` | `{ sessionKey, message, attachments?, thinking?, idempotencyKey }` | Send message |
| `chat.abort` | `{ sessionKey }` | Cancel running agent request |
| `chat.inject` | `{ sessionKey, message }` | Inject system message (admin) |

### Message Sending

| Method | Params | Description |
|--------|--------|-------------|
| `send` | `{ to, message?, mediaUrl?, channel?, accountId?, idempotencyKey }` | Send to channel |
| `poll` | `{ to, question, options[], channel?, idempotencyKey }` | Create poll |
| `wake` | `{ mode }` | System wake signal (`"now"` or `"next-heartbeat"`) |

### Cron / Jobs

| Method | Params | Description |
|--------|--------|-------------|
| `cron.list` | `{}` | List all scheduled jobs |
| `cron.status` | `{}` | Cron subsystem status |
| `cron.add` | `{ name, schedule, sessionTarget, payload, delivery?, agentId? }` | Create job |
| `cron.update` | `{ id, ...fields }` | Modify job |
| `cron.remove` | `{ id }` | Delete job |
| `cron.run` | `{ id, mode? }` | Execute job immediately (`"due"` or `"force"`) |
| `cron.runs` | `{ id }` | List execution history |

### Skills

| Method | Params | Description |
|--------|--------|-------------|
| `skills.status` | `{ agentId? }` | Skills status for an agent |
| `skills.bins` | `{}` | List available skill bundles |
| `skills.install` | `{ name, installId, timeoutMs? }` | Install from ClawHub |
| `skills.update` | `{ skillKey, enabled?, apiKey?, env? }` | Update skill settings |

### Models

| Method | Params | Description |
|--------|--------|-------------|
| `models.list` | `{}` | List available AI models |

### Channels

| Method | Params | Description |
|--------|--------|-------------|
| `channels.status` | `{ probe?, timeoutMs? }` | Channel health & status |
| `channels.logout` | `{ channel, accountId? }` | Disconnect channel |
| `web.login.start` | `{ force?, timeoutMs? }` | Start web login flow |
| `web.login.wait` | `{ timeoutMs? }` | Wait for login completion |

### Configuration

| Method | Params | Description |
|--------|--------|-------------|
| `config.get` | `{}` | Retrieve full config with `baseHash` |
| `config.set` | `{ raw, baseHash? }` | Replace config (JSON5 string) |
| `config.apply` | `{ config, baseHash? }` | Atomically apply config |
| `config.patch` | `{ patch, baseHash? }` | Partial update (JSON merge patch) |
| `config.schema` | `{}` | Return validation schema + UI hints |

### System

| Method | Params | Description |
|--------|--------|-------------|
| `status` | `{}` | System status |
| `usage.status` | `{}` | Usage status |
| `usage.cost` | `{}` | Usage cost |
| `system-presence` | `{}` | Query connected devices |
| `logs.tail` | `{ cursor? }` | Stream recent logs |
| `health` | `{}` | Health check probe |

### Device Pairing

| Method | Params | Description |
|--------|--------|-------------|
| `device.pair.list` | `{}` | List paired devices |
| `device.pair.approve` | `{ requestId }` | Approve pairing |
| `device.pair.reject` | `{ requestId }` | Reject pairing |
| `device.pair.remove` | `{ deviceId }` | Remove paired device |
| `device.token.rotate` | `{ deviceId }` | Rotate device token |
| `device.token.revoke` | `{ deviceId }` | Revoke device token |

### Node Management

| Method | Params | Description |
|--------|--------|-------------|
| `node.list` | `{}` | List all paired nodes |
| `node.describe` | `{ nodeId }` | Get node capabilities |
| `node.invoke` | `{ nodeId, command, paramsJSON? }` | Execute remote action |
| `node.rename` | `{ nodeId, name }` | Rename a node |
| `node.pair.request` | `{ ... }` | Initiate pairing |
| `node.pair.list` | `{}` | List pending requests |
| `node.pair.approve` | `{ requestId }` | Approve pairing |
| `node.pair.reject` | `{ requestId }` | Reject pairing |

### Exec Approvals

| Method | Params | Description |
|--------|--------|-------------|
| `exec.approvals.get` | `{}` | Get approval config |
| `exec.approvals.set` | `{ ... }` | Set approval config |
| `exec.approval.request` | `{ ... }` | Request command approval |
| `exec.approval.resolve` | `{ requestId, approve }` | Resolve approval |
| `exec.approval.waitDecision` | `{ requestId }` | Wait for decision |

### Wizard / Onboarding

| Method | Params | Description |
|--------|--------|-------------|
| `wizard.start` | `{ mode }` | Begin setup wizard |
| `wizard.next` | `{ answer }` | Progress wizard |
| `wizard.cancel` | `{}` | Cancel wizard |
| `wizard.status` | `{}` | Check wizard state |

### Voice / TTS

| Method | Params | Description |
|--------|--------|-------------|
| `talk.config` | `{}` | Get voice config |
| `talk.mode` | `{ enabled }` | Enable/disable talk |
| `tts.status` | `{}` | TTS subsystem status |
| `tts.providers` | `{}` | List TTS providers |
| `tts.enable` | `{}` | Enable TTS |
| `tts.disable` | `{}` | Disable TTS |
| `tts.convert` | `{ text }` | Convert text to speech |
| `tts.setProvider` | `{ provider }` | Set TTS provider |

---

## Gateway Events

### Event List (19 Types)

| Event | Description |
|-------|-------------|
| `connect.challenge` | Auth challenge during connection handshake |
| `agent` | Agent execution lifecycle (text streaming, tool calls) |
| `chat` | WebChat message events |
| `presence` | Device join/leave with role and scope metadata |
| `tick` | Periodic heartbeat with timestamp/uptime |
| `health` | Health status changes |
| `heartbeat` | Client heartbeat events |
| `shutdown` | Graceful shutdown (reason + optional `restartExpectedMs`) |
| `cron` | Cron job lifecycle (run start/finish) |
| `talk.mode` | Voice talk mode state changes |
| `node.pair.requested` | Incoming node pairing request |
| `node.pair.resolved` | Node pairing decision result |
| `node.invoke.request` | Node invocation request (gateway -> node) |
| `device.pair.requested` | Incoming device pairing request |
| `device.pair.resolved` | Device pairing decision result |
| `voicewake.changed` | Voice wake setting changes |
| `exec.approval.requested` | Execution approval needed |
| `exec.approval.resolved` | Execution approval decision |
| `update.available` | System update available |

### Agent Event Sub-Types

The `agent` event contains a `stream` field with these sub-types:

| Stream | Description |
|--------|-------------|
| `lifecycle` | Start, end, error phases of agent run |
| `text_delta` | Streaming text output chunks |
| `tool_start` | Tool invocation begin |
| `tool_output` | Tool invocation result |
| `model_fallback` | Model provider failover |
| `exec.approval.requested` | Human approval for elevated command |

```json
{
  "type": "event",
  "event": "agent",
  "payload": {
    "runId": "run-uuid",
    "seq": 1,
    "stream": "text_delta",
    "ts": 1737264000000,
    "data": {
      "text": "Hello! How can I help?"
    }
  }
}
```

### Chat Event States

| State | Description |
|-------|-------------|
| `delta` | Streaming partial response |
| `final` | Complete response |
| `aborted` | Request was cancelled |
| `error` | Error occurred |

```json
{
  "type": "event",
  "event": "chat",
  "payload": {
    "runId": "run-uuid",
    "sessionKey": "agent:main:webchat:main",
    "seq": 1,
    "state": "delta",
    "message": { "role": "assistant", "content": "..." },
    "usage": { "inputTokens": 100, "outputTokens": 50 }
  }
}
```

### Tick Event

```json
{
  "type": "event",
  "event": "tick",
  "payload": { "ts": 1737264000000 }
}
```

### Shutdown Event

```json
{
  "type": "event",
  "event": "shutdown",
  "payload": {
    "reason": "config-restart",
    "restartExpectedMs": 5000
  }
}
```

### Presence Event

```json
{
  "type": "event",
  "event": "presence",
  "payload": {
    "deviceId": "device-123",
    "roles": ["operator"],
    "scopes": ["operator.read", "operator.write"],
    "platform": "web",
    "ts": 1737264000000
  }
}
```

---

## Data Schemas

### ErrorShape

```typescript
interface ErrorShape {
  code: string;
  message: string;
  details?: unknown;
  retryable?: boolean;
  retryAfterMs?: number;
}
```

### AgentSummary

```typescript
interface AgentSummary {
  id: string;
  name?: string;
  identity?: {
    name?: string;
    theme?: string;
    emoji?: string;
    avatar?: string;
    avatarUrl?: string;
  };
}
```

### ModelChoice

```typescript
interface ModelChoice {
  id: string;
  name: string;
  provider: string;
  contextWindow?: number;
  reasoning?: boolean;
}
```

### CronJob

```typescript
interface CronJob {
  id: string;
  agentId?: string;
  sessionKey?: string;
  name: string;
  description?: string;
  enabled: boolean;
  deleteAfterRun?: boolean;
  createdAtMs: number;
  updatedAtMs: number;
  schedule: CronSchedule;
  sessionTarget: "main" | "isolated";
  wakeMode: "next-heartbeat" | "now";
  payload: CronPayload;
  delivery?: CronDelivery;
  state: CronJobState;
}

type CronSchedule =
  | { kind: "at"; at: string }           // ISO 8601 one-shot
  | { kind: "every"; everyMs: number }    // fixed interval
  | { kind: "cron"; expr: string; tz?: string; staggerMs?: number }; // cron expression

type CronPayload =
  | { kind: "systemEvent"; text: string }
  | { kind: "agentTurn"; message: string; model?: string; thinking?: string };

interface CronDelivery {
  mode: "none" | "announce" | "webhook";
  channel?: string;
  to?: string;
  bestEffort?: boolean;
}

interface CronJobState {
  nextRunAtMs?: number;
  runningAtMs?: number;
  lastRunAtMs?: number;
  lastStatus?: string;
  lastError?: string;
  lastDurationMs?: number;
  consecutiveErrors?: number;
}
```

### PresenceEntry

```typescript
interface PresenceEntry {
  host?: string;
  ip?: string;
  version?: string;
  platform?: string;
  deviceFamily?: string;
  mode?: string;
  lastInputSeconds?: number;
  ts: number;
  deviceId?: string;
  roles?: string[];
  scopes?: string[];
  instanceId?: string;
}
```

### ChannelAccountSnapshot

```typescript
interface ChannelAccountSnapshot {
  accountId: string;
  name?: string;
  enabled?: boolean;
  configured?: boolean;
  linked?: boolean;
  running?: boolean;
  connected?: boolean;
  reconnectAttempts?: number;
  lastConnectedAt?: number;
  lastError?: string;
  lastStartAt?: number;
  lastStopAt?: number;
  lastInboundAt?: number;
  lastOutboundAt?: number;
  dmPolicy?: string;
  allowFrom?: string[];
}
```

### AgentsFileEntry

```typescript
interface AgentsFileEntry {
  name: string;
  path: string;
  missing: boolean;
  size?: number;
  updatedAtMs?: number;
  content?: string;
}
```

### Session Key Format

```
agent:{agentId}:{channel}:{chatType}:{identifier}[:{threadId}]
```

- `agentId` - Agent handling session (e.g., "main")
- `channel` - Provider (whatsapp, telegram, discord, slack, webchat)
- `chatType` - Conversation type (main, dm, group, channel, thread)
- `identifier` - Peer/chat ID
- `threadId` - Optional thread identifier

### Sessions Usage Result

```typescript
interface SessionUsage {
  key: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  turns: number;
  startDate: string;
  endDate: string;
}
```

---

## HTTP Endpoints

All HTTP endpoints are served on the same port as the WebSocket gateway.

### Route Map

| Method | Path | Purpose | Auth | Default |
|--------|------|---------|------|---------|
| `WS` | `/` | Gateway WebSocket | Connect frame | Enabled |
| `GET` | `/` | Control UI (Vite + Lit SPA) | Session | Enabled |
| `POST` | `/v1/chat/completions` | OpenAI-compatible chat | Bearer token | **Disabled** |
| `POST` | `/tools/invoke` | Direct tool invocation | Bearer token | Enabled |
| `POST` | `/hooks/wake` | System event webhook | Bearer token | Requires config |
| `POST` | `/hooks/agent` | Agent turn webhook | Bearer token | Requires config |
| `POST` | `/hooks/<name>` | Custom mapped webhooks | Bearer token | Requires config |
| `*` | `/api/channels/*` | Channel API routes | Bearer token | Enabled |
| `GET` | `/__openclaw__/canvas/` | Canvas host | Session | Enabled |
| `GET` | `/__openclaw__/a2ui/` | Agent-to-UI canvas | Session | Enabled |

### OpenAI-Compatible Chat Completions

**Must be explicitly enabled:**

```json
{
  "gateway": {
    "http": {
      "endpoints": {
        "chatCompletions": {
          "enabled": true
        }
      }
    }
  }
}
```

**Non-streaming request:**

```bash
curl http://187.77.102.9:52592/v1/chat/completions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openclaw:main",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

**Streaming request:**

```bash
curl -N http://187.77.102.9:52592/v1/chat/completions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openclaw:main",
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "stream": true
  }'
```

**Agent selection:**
- Via model field: `"model": "openclaw:<agentId>"` or `"model": "agent:<agentId>"`
- Via header: `x-openclaw-agent-id: <agentId>`
- Default: `main` agent

**Session routing:**
- Stateless per request by default
- Include `"user": "<string>"` for conversation continuity
- Or use header: `x-openclaw-session-key`

### Tools Invoke API

```bash
curl -X POST http://187.77.102.9:52592/tools/invoke \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "sessions_list",
    "action": "json",
    "args": {},
    "sessionKey": "main",
    "dryRun": false
  }'
```

**Max payload:** 2 MB

**Response codes:**

| Code | Meaning |
|------|---------|
| `200` | Success: `{ ok: true, result }` |
| `400` | Invalid request |
| `401` | Unauthorized |
| `404` | Tool unavailable |
| `429` | Rate-limited |
| `500` | Execution error |

**Hard-denied tools:** `sessions_spawn`, `sessions_send`, `gateway`, `whatsapp_login`

---

## Webhooks

### Configuration

```json
{
  "hooks": {
    "enabled": true,
    "token": "shared-secret",
    "path": "/hooks",
    "maxBodyBytes": 262144,
    "defaultSessionKey": "hook:ingress",
    "allowRequestSessionKey": false,
    "allowedAgentIds": ["hooks", "main"]
  }
}
```

### POST /hooks/wake

Enqueues system event for the main session.

```json
{ "text": "System line", "mode": "now" }
```

Response: `200`

### POST /hooks/agent

Launches isolated agent turn.

```json
{
  "message": "Generate daily report",
  "agentId": "main",
  "sessionKey": "hook:daily-report",
  "model": "anthropic/claude-sonnet-4-5",
  "thinking": "low",
  "deliver": true,
  "channel": "slack",
  "to": "channel:C1234567890"
}
```

Response: `202` (async)

### POST /hooks/\<name\>

Custom mapped webhooks via `hooks.mappings` configuration.

### Auth

Required: `Authorization: Bearer <token>` or `x-openclaw-token: <token>` header.
Query-string tokens are **rejected** with `400`.

---

## Agent HQ Integration Map

How each Agent HQ section maps to OpenClaw Gateway methods:

### Dashboard

| Widget | Method(s) | Event(s) |
|--------|-----------|----------|
| Agent status grid | `agents.list` | `presence` |
| Recent activity feed | `sessions.list` + `chat.history` | `agent`, `chat` |
| Usage cost summary | `sessions.usage` | - |
| Upcoming jobs | `cron.list` | `cron` |
| Task pipeline | Custom (local state) | - |

### Agents Page

| Action | Method |
|--------|--------|
| List agents | `agents.list` |
| Create agent | `agents.create` |
| Update agent | `agents.update` |
| Delete agent | `agents.delete` |
| Get identity | `agent.identity.get` |
| List workspace files | `agents.files.list` |
| Read workspace file | `agents.files.get` |
| Write workspace file | `agents.files.set` |

### Activity Page

| Action | Method | Event |
|--------|--------|-------|
| Load history | `sessions.list` + `chat.history` | - |
| Real-time feed | - | `agent` (text_delta, tool_start, tool_output) |
| Filter by agent | `sessions.list` with `agentId` param | - |
| Token breakdown | `sessions.usage` | - |

### Usage Page

| Action | Method |
|--------|--------|
| Period summary | `sessions.usage` with `startDate`/`endDate` |
| Per-agent breakdown | `sessions.usage` with `key` filter |
| Cost over time | `sessions.usage` (multiple date ranges) |
| Model breakdown | `models.list` + `sessions.usage` |

### Jobs Page

| Action | Method | Event |
|--------|--------|-------|
| List jobs | `cron.list` | - |
| Create job | `cron.add` | - |
| Edit job | `cron.update` | - |
| Delete job | `cron.remove` | - |
| Enable/disable | `cron.update` with `enabled` | - |
| Manual run | `cron.run` | `cron` |
| Run history | `cron.runs` | `cron` |

### Skills Page

| Action | Method |
|--------|--------|
| List skills | `skills.status` |
| Enable/disable | `skills.update` with `enabled` |
| Per-agent assignment | `skills.update` with `skillKey` |
| Install skill | `skills.install` |

### AI Council

| Action | Method |
|--------|--------|
| Send message | `chat.send` with specific session |
| Get history | `chat.history` |
| Abort run | `chat.abort` |

### Settings Page

| Action | Method |
|--------|--------|
| Get config | `config.get` |
| Update config | `config.patch` |
| Full replace | `config.apply` |

---

## Configuration Reference

### Gateway Server Config

```json
{
  "gateway": {
    "mode": "local",
    "port": 18789,
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "${OPENCLAW_GATEWAY_TOKEN}",
      "rateLimit": {
        "maxAttempts": 10,
        "windowMs": 60000,
        "lockoutMs": 300000,
        "exemptLoopback": true
      }
    },
    "controlUi": {
      "enabled": true,
      "basePath": "/openclaw",
      "allowedOrigins": []
    },
    "tls": {
      "enabled": false,
      "autoGenerate": false,
      "certPath": "",
      "keyPath": ""
    },
    "http": {
      "endpoints": {
        "chatCompletions": { "enabled": false }
      }
    },
    "reload": {
      "mode": "hybrid",
      "debounceMs": 300
    }
  }
}
```

### Bind Modes

| Mode | Address | Use Case |
|------|---------|----------|
| `loopback` | `127.0.0.1` | Local only, most secure |
| `lan` | Primary LAN IPv4 | Local network access |
| `tailnet` | Tailscale IP | Private mesh network |
| `custom` | User-specified | Custom deployments |
| `auto` | Auto-detect | Automatic selection |

### Hot Reload

| Category | Hot-Reloadable |
|----------|---------------|
| Channels, agents, models, hooks, cron, sessions, tools, UI, logging | Yes |
| Port, bind, auth mode, TLS, plugins, discovery | No (restart required) |

### Agent Config

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace",
      "model": {
        "primary": "anthropic/claude-sonnet-4-5",
        "fallbacks": ["openai/gpt-5.2"]
      },
      "thinkingDefault": "low",
      "timeoutSeconds": 600,
      "contextTokens": 200000,
      "maxConcurrent": 3,
      "heartbeat": { "every": "30m" }
    },
    "list": [
      {
        "id": "main",
        "default": true,
        "name": "Main Agent",
        "identity": {
          "name": "Samantha",
          "emoji": "...",
          "avatar": "avatars/samantha.png"
        }
      }
    ]
  }
}
```

### Cron Config

```json
{
  "cron": {
    "enabled": true,
    "maxConcurrentRuns": 2,
    "sessionRetention": "24h"
  }
}
```

### Skills Config

```json
{
  "skills": {
    "allowBundled": ["gemini", "peekaboo"],
    "load": {
      "extraDirs": ["~/custom-skills"],
      "watch": true,
      "watchDebounceMs": 250
    },
    "entries": {
      "skill-name": {
        "enabled": true,
        "apiKey": "KEY_VALUE",
        "env": { "VAR_NAME": "value" }
      }
    }
  }
}
```

---

## Key File Paths (on VPS)

| Path | Purpose |
|------|---------|
| `~/.openclaw/openclaw.json` | Main configuration (JSON5) |
| `~/.openclaw/workspace/` | Default agent workspace |
| `~/.openclaw/skills/` | Managed/local skills |
| `~/.openclaw/hooks/` | Managed hooks |
| `~/.openclaw/cron/jobs.json` | Persisted cron jobs |
| `~/.openclaw/cron/runs/<jobId>.jsonl` | Cron run history |
| `~/.openclaw/agents/<agentId>/agent/` | Per-agent state directory |
| `~/.openclaw/agents/<agentId>/sessions/` | Per-agent session store |
| `~/.openclaw/.env` | Global environment fallback |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `OPENCLAW_GATEWAY_TOKEN` | Gateway auth token |
| `OPENCLAW_GATEWAY_PASSWORD` | Gateway auth password |
| `OPENCLAW_GATEWAY_PORT` | Override gateway port |
| `OPENCLAW_HOME` | Home directory for path resolution |
| `OPENCLAW_STATE_DIR` | Override state directory |
| `OPENCLAW_CONFIG_PATH` | Override config file path |
| `ANTHROPIC_API_KEY` | Anthropic provider key |
| `OPENAI_API_KEY` | OpenAI provider key |

---

## Resources

| Resource | URL |
|----------|-----|
| GitHub | https://github.com/openclaw/openclaw |
| Docs | https://docs.openclaw.ai |
| Gateway Protocol | https://docs.openclaw.ai/gateway/protocol |
| Gateway Config | https://docs.openclaw.ai/gateway/configuration |
| HTTP API | https://docs.openclaw.ai/gateway/openai-http-api |
| Tools Invoke | https://docs.openclaw.ai/gateway/tools-invoke-http-api |
| Webhooks | https://docs.openclaw.ai/automation/webhook |
| Cron Jobs | https://docs.openclaw.ai/automation/cron-jobs |
| Skills | https://docs.openclaw.ai/tools/skills |
| Agents | https://docs.openclaw.ai/concepts/multi-agent |
| Docker Install | https://docs.openclaw.ai/install/docker |
| DeepWiki | https://deepwiki.com/openclaw/openclaw |
