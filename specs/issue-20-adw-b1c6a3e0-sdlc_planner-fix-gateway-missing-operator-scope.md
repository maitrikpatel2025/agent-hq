# Bug: Gateway missing scope: operator.read when accessing Agents page

## Metadata
issue_number: `b1c6a3e0`
adw_id: `20`
issue_json: `{"number":20,"title":"Gateway missing scope: operator.read when accessing Agents page"}`

## Bug Description
When navigating to the Agents page, the Gateway WebSocket connection handshake does not correctly request the required `operator.read` scope. As a result, `agents.list` RPC calls are rejected by the Gateway with:

```
Gateway error: missing scope: operator.read
```

The Agents page is completely non-functional — the roster fails to load and all CRUD operations are blocked. Other pages making Gateway RPC calls (Activity, Usage, Jobs, Skills) may be similarly affected.

**Expected behavior**: The `connect` handshake includes `scopes: ["operator.read", "operator.write", "operator.admin"]` so subsequent RPC calls are authorized.

**Actual behavior**: The handshake creates `ConnectParams` without explicitly passing scopes, and the Gateway denies `agents.list` with a missing scope error.

## Problem Statement
`GatewayClient._perform_handshake()` in `app/server/gateway_client.py` creates `ConnectParams` with only `client` and `auth` kwargs — it does not explicitly pass the required `scopes` list. Although `ConnectParams.scopes` has a `default_factory` in the model, the code is implicitly relying on that default rather than explicitly declaring the scopes it needs. There are also zero tests verifying that the actual WebSocket connect frame includes the operator scopes, meaning any future refactor of `ConnectParams` could silently break authentication.

## Solution Statement
1. Make the `scopes` list explicit in `_perform_handshake()` in `gateway_client.py` so the intent is unambiguous and cannot be accidentally dropped by model refactors.
2. Add a unit test using a mock WebSocket that captures the raw frame sent during the handshake and asserts `operator.read`, `operator.write`, and `operator.admin` are all present.
3. Create an E2E test file that navigates to the Agents page and confirms it loads agent data (or shows a "Gateway not connected" state) without a scope authorization error.

## Steps to Reproduce
1. Start the application with valid Gateway credentials (`OPENCLAW_GATEWAY_URL` + `OPENCLAW_GATEWAY_TOKEN` set in `.env`)
2. Navigate to `http://localhost:3000/agents`
3. Observe the browser console or network tab — `GET /api/gateway/agents` returns HTTP 502 with `"Gateway error: missing scope: operator.read"`
4. The Agents page displays the red error message instead of the agent roster

## Root Cause Analysis
In `app/server/gateway_client.py` at line 195, `_perform_handshake()` creates `ConnectParams` as:

```python
connect_params = ConnectParams(
    client=ClientInfo(),
    auth={"token": self.token} if self.token else {},
)
```

The `scopes` kwarg is omitted entirely. The `ConnectParams` model in `gateway_models.py` declares a `default_factory` for `scopes`:

```python
scopes: list[str] = Field(
    default_factory=lambda: ["operator.read", "operator.write", "operator.admin"]
)
```

While the default_factory should provide the correct values, the omission is fragile:
- Any future change to the model default would silently change what scopes are sent
- The intent of the handshake code is not self-documenting
- No tests validate the actual on-wire content of the connect frame

According to the official OpenClaw Gateway Protocol documentation, the `connect` request **must** include `scopes: ["operator.read", "operator.write", "operator.admin"]` for all operator-level RPC methods (`agents.list`, `sessions.list`, `cron.list`, etc.).

## Relevant Files
Use these files to fix the bug:

- **`app/server/gateway_client.py`** — Contains `_perform_handshake()` where `ConnectParams` is constructed without explicit `scopes`. This is the primary fix location (line 195-204).
- **`app/server/gateway_models.py`** — Contains `ConnectParams` and `ClientInfo` model definitions. Verify `scopes` default_factory is correct; no structural changes needed.
- **`app/server/tests/test_gateway_client.py`** — Existing unit tests for `GatewayClient`. New tests for handshake scope inclusion go here.
- **`ai_docs/openclaw_gateway_api.md`** — Reference for the required connect handshake format and operator scope list (Section: "Connection Handshake (3-Stage)" and "Roles & Scopes").
- **`app_docs/feature-fb641441-agents-fleet-roster-crud.md`** — Documents the Agents feature that depends on proper gateway authentication.

### New Files
- **`.claude/commands/e2e/test_gateway_operator_scope.md`** — E2E test that verifies the Agents page renders without a scope authorization error. Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_openclaw_gateway_integration.md` to understand the E2E test format before creating this file.

## Step by Step Tasks

### Step 1: Fix `_perform_handshake` to explicitly pass required scopes
- Open `app/server/gateway_client.py`
- In `_perform_handshake()` (around line 195), update the `ConnectParams` instantiation to explicitly include the `scopes` list:
  ```python
  connect_params = ConnectParams(
      client=ClientInfo(),
      role="operator",
      scopes=["operator.read", "operator.write", "operator.admin"],
      auth={"token": self.token} if self.token else {},
  )
  ```
- Also add a debug log after the params are created to confirm scopes are set:
  ```python
  logger.debug(f"Connecting with scopes: {connect_params.scopes}")
  ```

### Step 2: Verify `ConnectParams` model is correct in `gateway_models.py`
- Open `app/server/gateway_models.py`
- Confirm the `ConnectParams.scopes` field has the correct default_factory as a safety net:
  ```python
  scopes: list[str] = Field(
      default_factory=lambda: ["operator.read", "operator.write", "operator.admin"]
  )
  ```
- If the default_factory is missing or empty, add/fix it — this is the second line of defense
- No other structural changes to the model are needed

### Step 3: Add unit tests that verify the connect frame includes operator scopes
- Open `app/server/tests/test_gateway_client.py`
- Add a new test class `TestConnectParamsScopes` with tests that:
  1. Verify `ConnectParams()` constructed with no args includes the required scopes in its `scopes` field
  2. Verify `ConnectParams(client=ClientInfo(), auth={})` (as used in the handshake) also includes the scopes
  3. Verify `connect_params.model_dump()` output contains `"scopes": ["operator.read", "operator.write", "operator.admin"]`
- Add a new test class `TestHandshakeScopeInWireFrame` with an async test that:
  1. Creates a `GatewayClient` with a mocked WebSocket
  2. Simulates the 3-stage handshake (send mock `connect.challenge` event, capture the client's connect frame, send mock `hello-ok` response)
  3. Parses the captured connect frame JSON and asserts `params["scopes"]` contains all three operator scopes
  4. Example structure:
  ```python
  @pytest.mark.asyncio
  async def test_handshake_sends_operator_scopes(self):
      import json
      from unittest.mock import AsyncMock, MagicMock

      client = GatewayClient(url="ws://fake:9999", token="test-token")

      challenge_frame = json.dumps({
          "type": "event",
          "event": "connect.challenge",
          "payload": {"nonce": "abc", "ts": 1234567890}
      })
      hello_ok_frame = json.dumps({
          "type": "res", "id": "1", "ok": True,
          "payload": {
              "type": "hello-ok",
              "protocol": 3,
              "server": {"version": "1.0.0", "commit": "abc", "connId": "conn-1"},
              "features": {"methods": ["agents.list"], "events": ["presence"]},
              "snapshot": {"uptimeMs": 1000}
          }
      })

      mock_ws = AsyncMock()
      mock_ws.recv = AsyncMock(side_effect=[challenge_frame, hello_ok_frame])
      sent_frames = []
      mock_ws.send = AsyncMock(side_effect=lambda frame: sent_frames.append(frame))

      client._ws = mock_ws
      await client._perform_handshake()

      assert len(sent_frames) == 1
      connect_frame = json.loads(sent_frames[0])
      assert connect_frame["method"] == "connect"
      scopes = connect_frame["params"]["scopes"]
      assert "operator.read" in scopes
      assert "operator.write" in scopes
      assert "operator.admin" in scopes
  ```

### Step 4: Create E2E test file for gateway operator scope validation
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_openclaw_gateway_integration.md` to understand the E2E test format
- Create `.claude/commands/e2e/test_gateway_operator_scope.md` with these test steps:
  1. Navigate to the application URL
  2. Navigate to the Agents page (`/agents`)
  3. Verify the page does NOT show a red error containing "missing scope" text
  4. Verify the page shows either: (a) the agent roster with agent cards, or (b) a "Gateway not connected" message (but NOT a scope error)
  5. Take a screenshot proving no scope authorization error is present
  6. Check the browser console for any Gateway scope errors
  - Keep the test minimal and focused: we only need to prove the scope error is gone

### Step 5: Run validation commands
- Run all validation commands listed in the **Validation Commands** section below

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

**Reproduce the bug before fix (should fail with scope error when gateway is connected)**:
- With a running gateway, `GET /api/gateway/agents` should return 502 with `"missing scope: operator.read"` before the fix

**After the fix — verify scopes appear in the connect frame**:
- Read `.claude/commands/test_e2e.md`, then read and execute your new E2E `.claude/commands/e2e/test_gateway_operator_scope.md` test file to validate the Agents page loads without a scope error

**Unit tests (must all pass)**:
```bash
cd app/server && uv run pytest tests/test_gateway_client.py -v
```

**All server tests (no regressions)**:
```bash
cd app/server && uv run pytest
```

**Frontend lint check**:
```bash
cd app/client && npx eslint src/ --max-warnings=0 --quiet
```

**Frontend build**:
```bash
cd app/client && npm run build
```

## Notes
- The fix in `gateway_client.py` is intentionally explicit even though `ConnectParams.scopes` has a default_factory — this ensures the intent is clear and is robust against future model refactors
- The three required scopes are: `operator.read` (for all list/read operations), `operator.write` (for create/update/delete), `operator.admin` (for administrative operations)
- All pages that call Gateway RPC methods (Agents, Activity, Usage, Jobs, Skills) will benefit from this fix — they all share the same `GatewayClient` connection
- No new libraries are required for this fix
- The E2E test should be minimal: it only needs to prove the scope error is gone, not test the full Agents CRUD flow (that is covered by `test_agents_fleet_roster_crud.md`)
