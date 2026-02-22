"""Unit tests for agent CRUD API routes."""

from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from gateway_client import GatewayClient, get_gateway_client
from gateway_models import ConnectionState
from server import app


def _make_disconnected_client():
    client = GatewayClient(url="", token="")
    return client


def _make_connected_client(return_value=None):
    client = GatewayClient(url="ws://test", token="test-token")
    client.state = ConnectionState.CONNECTED
    client.send_request = AsyncMock(return_value=return_value or {"ok": True})
    return client


@pytest.fixture
def disconnected_client():
    client = _make_disconnected_client()
    app.dependency_overrides[get_gateway_client] = lambda: client
    yield client
    app.dependency_overrides.pop(get_gateway_client, None)


@pytest.fixture
def connected_client():
    client = _make_connected_client()
    app.dependency_overrides[get_gateway_client] = lambda: client
    yield client
    app.dependency_overrides.pop(get_gateway_client, None)


@pytest.fixture
async def http_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


# --- 503 when disconnected ---


class TestAgentCrudRoutes503:
    @pytest.mark.asyncio
    async def test_create_agent_503(self, http_client, disconnected_client):
        resp = await http_client.post(
            "/api/gateway/agents",
            json={"id": "test", "name": "Test", "workspace": "/tmp/test"},
        )
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_update_agent_503(self, http_client, disconnected_client):
        resp = await http_client.patch(
            "/api/gateway/agents/test-agent",
            json={"name": "Updated"},
        )
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_delete_agent_503(self, http_client, disconnected_client):
        resp = await http_client.delete("/api/gateway/agents/test-agent")
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_list_agent_files_503(self, http_client, disconnected_client):
        resp = await http_client.get("/api/gateway/agents/test-agent/files")
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_get_agent_file_content_503(self, http_client, disconnected_client):
        resp = await http_client.get(
            "/api/gateway/agents/test-agent/files/content?path=/README.md"
        )
        assert resp.status_code == 503


# --- Success responses when connected ---


class TestAgentCrudRoutesSuccess:
    @pytest.mark.asyncio
    async def test_create_agent_success(self, http_client, connected_client):
        connected_client.send_request = AsyncMock(
            return_value={"id": "new-agent", "name": "New Agent"}
        )
        resp = await http_client.post(
            "/api/gateway/agents",
            json={"id": "new-agent", "name": "New Agent", "workspace": "/tmp/new-agent"},
        )
        assert resp.status_code == 200
        connected_client.send_request.assert_awaited_once_with(
            "agents.create",
            {"id": "new-agent", "name": "New Agent", "workspace": "/tmp/new-agent"},
        )

    @pytest.mark.asyncio
    async def test_create_agent_with_optional_fields(self, http_client, connected_client):
        connected_client.send_request = AsyncMock(return_value={"id": "new-agent"})
        resp = await http_client.post(
            "/api/gateway/agents",
            json={
                "id": "new-agent",
                "name": "New Agent",
                "workspace": "/tmp/new-agent",
                "emoji": "🤖",
                "avatar": "https://example.com/avatar.png",
            },
        )
        assert resp.status_code == 200
        connected_client.send_request.assert_awaited_once_with(
            "agents.create",
            {
                "id": "new-agent",
                "name": "New Agent",
                "workspace": "/tmp/new-agent",
                "emoji": "🤖",
                "avatar": "https://example.com/avatar.png",
            },
        )

    @pytest.mark.asyncio
    async def test_update_agent_success(self, http_client, connected_client):
        connected_client.send_request = AsyncMock(return_value={"id": "test-agent", "name": "Updated"})
        resp = await http_client.patch(
            "/api/gateway/agents/test-agent",
            json={"name": "Updated Name", "emoji": "🚀"},
        )
        assert resp.status_code == 200
        connected_client.send_request.assert_awaited_once_with(
            "agents.update",
            {"id": "test-agent", "name": "Updated Name", "emoji": "🚀"},
        )

    @pytest.mark.asyncio
    async def test_delete_agent_success(self, http_client, connected_client):
        connected_client.send_request = AsyncMock(return_value={"deleted": True})
        resp = await http_client.delete("/api/gateway/agents/test-agent")
        assert resp.status_code == 200
        connected_client.send_request.assert_awaited_once_with(
            "agents.delete",
            {"id": "test-agent"},
        )

    @pytest.mark.asyncio
    async def test_delete_agent_with_files(self, http_client, connected_client):
        connected_client.send_request = AsyncMock(return_value={"deleted": True})
        resp = await http_client.delete("/api/gateway/agents/test-agent?deleteFiles=true")
        assert resp.status_code == 200
        connected_client.send_request.assert_awaited_once_with(
            "agents.delete",
            {"id": "test-agent", "deleteFiles": True},
        )

    @pytest.mark.asyncio
    async def test_list_agent_files_success(self, http_client, connected_client):
        connected_client.send_request = AsyncMock(
            return_value={"files": ["README.md", "CLAUDE.md"]}
        )
        resp = await http_client.get("/api/gateway/agents/test-agent/files")
        assert resp.status_code == 200
        connected_client.send_request.assert_awaited_once_with(
            "agents.files.list",
            {"agentId": "test-agent"},
        )

    @pytest.mark.asyncio
    async def test_get_agent_file_content_success(self, http_client, connected_client):
        connected_client.send_request = AsyncMock(
            return_value={"content": "# README\nHello world"}
        )
        resp = await http_client.get(
            "/api/gateway/agents/test-agent/files/content?path=README.md"
        )
        assert resp.status_code == 200
        connected_client.send_request.assert_awaited_once_with(
            "agents.files.get",
            {"agentId": "test-agent", "path": "README.md"},
        )


# --- Validation (422) for missing required fields ---


class TestAgentCrudValidation:
    @pytest.mark.asyncio
    async def test_create_agent_missing_id(self, http_client, connected_client):
        resp = await http_client.post(
            "/api/gateway/agents",
            json={"name": "Test Agent", "workspace": "/tmp/test"},
        )
        assert resp.status_code == 422

    @pytest.mark.asyncio
    async def test_create_agent_missing_name(self, http_client, connected_client):
        resp = await http_client.post(
            "/api/gateway/agents",
            json={"id": "test", "workspace": "/tmp/test"},
        )
        assert resp.status_code == 422

    @pytest.mark.asyncio
    async def test_create_agent_missing_workspace(self, http_client, connected_client):
        resp = await http_client.post(
            "/api/gateway/agents",
            json={"id": "test", "name": "Test Agent"},
        )
        assert resp.status_code == 422

    @pytest.mark.asyncio
    async def test_get_file_content_missing_path(self, http_client, connected_client):
        resp = await http_client.get("/api/gateway/agents/test-agent/files/content")
        assert resp.status_code == 422
