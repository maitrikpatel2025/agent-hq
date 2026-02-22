"""Unit tests for the gateway WebSocket client."""


import json

import pytest

from gateway_client import GatewayClient
from gateway_models import ClientInfo, ConnectParams, ConnectionState


class TestGatewayClientInit:
    """Test GatewayClient initialization and configuration."""

    def test_default_init(self):
        client = GatewayClient(url="", token="")
        assert client.state == ConnectionState.DISCONNECTED
        assert client.server_info is None
        assert client.available_methods == []
        assert client.available_events == []

    def test_init_with_url(self):
        client = GatewayClient(url="ws://localhost:9999", token="test-token")
        assert client.url == "ws://localhost:9999"
        assert client.token == "test-token"
        assert client.is_configured is True

    def test_not_configured_without_url(self):
        client = GatewayClient(url="", token="")
        assert client.is_configured is False

    def test_is_connected_false_by_default(self):
        client = GatewayClient(url="ws://localhost:9999", token="")
        assert client.is_connected is False


class TestRequestIdGeneration:
    """Test request ID generation and uniqueness."""

    def test_incremental_ids(self):
        client = GatewayClient(url="", token="")
        ids = [client._next_request_id() for _ in range(5)]
        assert ids == ["1", "2", "3", "4", "5"]

    def test_ids_are_unique(self):
        client = GatewayClient(url="", token="")
        ids = {client._next_request_id() for _ in range(100)}
        assert len(ids) == 100


class TestConnectionState:
    """Test connection state tracking."""

    def test_initial_state_is_disconnected(self):
        client = GatewayClient(url="", token="")
        assert client.state == ConnectionState.DISCONNECTED

    def test_get_status_when_disconnected(self):
        client = GatewayClient(url="ws://test:1234", token="tok")
        status = client.get_status()
        assert status.state == ConnectionState.DISCONNECTED
        assert status.server is None
        assert status.gatewayUrl == "ws://test:1234"


class TestSendRequestErrors:
    """Test send_request raises when disconnected."""

    @pytest.mark.asyncio
    async def test_send_request_raises_when_disconnected(self):
        client = GatewayClient(url="ws://localhost:9999", token="")
        with pytest.raises(ConnectionError, match="Not connected"):
            await client.send_request("agents.list")


class TestEventCallbacks:
    """Test event callback registration and dispatch."""

    def test_register_event_callback(self):
        client = GatewayClient(url="", token="")

        def callback(event):
            pass

        client.on_event("agent", callback)
        assert "agent" in client._event_callbacks
        assert callback in client._event_callbacks["agent"]

    def test_register_multiple_callbacks(self):
        client = GatewayClient(url="", token="")

        def cb1(event):
            pass

        def cb2(event):
            pass

        client.on_event("agent", cb1)
        client.on_event("agent", cb2)
        assert len(client._event_callbacks["agent"]) == 2

    def test_register_global_callback(self):
        client = GatewayClient(url="", token="")

        def callback(event):
            pass

        client.on_any_event(callback)
        assert callback in client._global_event_callbacks


class TestConnectWithoutUrl:
    """Test connect behavior when not configured."""

    @pytest.mark.asyncio
    async def test_connect_skips_when_not_configured(self):
        client = GatewayClient(url="", token="")
        await client.connect()
        assert client.state == ConnectionState.DISCONNECTED

    @pytest.mark.asyncio
    async def test_disconnect_when_not_connected(self):
        client = GatewayClient(url="", token="")
        await client.disconnect()
        assert client.state == ConnectionState.DISCONNECTED


class TestConnectParamsScopes:
    """Test that ConnectParams always carries the required operator scopes."""

    def test_default_connect_params_includes_operator_scopes(self):
        params = ConnectParams()
        assert "operator.read" in params.scopes
        assert "operator.write" in params.scopes
        assert "operator.admin" in params.scopes

    def test_connect_params_with_explicit_client_and_auth_includes_scopes(self):
        params = ConnectParams(client=ClientInfo(), auth={})
        assert "operator.read" in params.scopes
        assert "operator.write" in params.scopes
        assert "operator.admin" in params.scopes

    def test_connect_params_model_dump_contains_scopes(self):
        params = ConnectParams(client=ClientInfo(), auth={})
        dumped = params.model_dump()
        assert dumped["scopes"] == ["operator.read", "operator.write", "operator.admin"]


class TestHandshakeScopeInWireFrame:
    """Test that _perform_handshake sends all required operator scopes on the wire."""

    @pytest.mark.asyncio
    async def test_handshake_sends_operator_scopes(self):
        from unittest.mock import AsyncMock

        client = GatewayClient(url="ws://fake:9999", token="test-token")

        challenge_frame = json.dumps({
            "type": "event",
            "event": "connect.challenge",
            "payload": {"nonce": "abc", "ts": 1234567890},
        })
        hello_ok_frame = json.dumps({
            "type": "res",
            "id": "1",
            "ok": True,
            "payload": {
                "type": "hello-ok",
                "protocol": 3,
                "server": {"version": "1.0.0", "commit": "abc", "connId": "conn-1"},
                "features": {"methods": ["agents.list"], "events": ["presence"]},
                "snapshot": {"uptimeMs": 1000},
            },
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

    @pytest.mark.asyncio
    async def test_handshake_sends_operator_role(self):
        from unittest.mock import AsyncMock

        client = GatewayClient(url="ws://fake:9999", token="test-token")

        challenge_frame = json.dumps({
            "type": "event",
            "event": "connect.challenge",
            "payload": {"nonce": "xyz", "ts": 9999},
        })
        hello_ok_frame = json.dumps({
            "type": "res",
            "id": "1",
            "ok": True,
            "payload": {
                "type": "hello-ok",
                "protocol": 3,
                "server": {"version": "1.0.0", "commit": "abc", "connId": "conn-2"},
                "features": {"methods": [], "events": []},
                "snapshot": {"uptimeMs": 500},
            },
        })

        mock_ws = AsyncMock()
        mock_ws.recv = AsyncMock(side_effect=[challenge_frame, hello_ok_frame])
        sent_frames = []
        mock_ws.send = AsyncMock(side_effect=lambda frame: sent_frames.append(frame))

        client._ws = mock_ws
        await client._perform_handshake()

        connect_frame = json.loads(sent_frames[0])
        assert connect_frame["params"]["role"] == "operator"
