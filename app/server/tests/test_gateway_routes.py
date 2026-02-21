"""Unit tests for the gateway API routes."""

import pytest
from httpx import ASGITransport, AsyncClient

from gateway_client import GatewayClient, get_gateway_client
from server import app


# Create a disconnected client for testing
def _make_disconnected_client():
    client = GatewayClient(url="", token="")
    return client


@pytest.fixture
def disconnected_client():
    client = _make_disconnected_client()
    app.dependency_overrides[get_gateway_client] = lambda: client
    yield client
    app.dependency_overrides.pop(get_gateway_client, None)


@pytest.fixture
async def http_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


# --- Regression tests: existing endpoints still work ---


class TestExistingEndpoints:
    @pytest.mark.asyncio
    async def test_api_test(self, http_client):
        resp = await http_client.get("/api/test")
        assert resp.status_code == 200
        assert resp.json()["message"] == "API is running!"

    @pytest.mark.asyncio
    async def test_api_health(self, http_client):
        resp = await http_client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert data["service"] == "agent-hq-api"


# --- Gateway status endpoint ---


class TestGatewayStatus:
    @pytest.mark.asyncio
    async def test_status_returns_disconnected(self, http_client, disconnected_client):
        resp = await http_client.get("/api/gateway/status")
        assert resp.status_code == 200
        data = resp.json()
        assert data["state"] == "disconnected"


# --- All proxy endpoints return 503 when disconnected ---


class TestProxyEndpoints503:
    """All gateway proxy endpoints should return 503 when gateway is disconnected."""

    @pytest.mark.asyncio
    async def test_agents_503(self, http_client, disconnected_client):
        resp = await http_client.get("/api/gateway/agents")
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_agent_identity_503(self, http_client, disconnected_client):
        resp = await http_client.get("/api/gateway/agents/main/identity")
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_sessions_503(self, http_client, disconnected_client):
        resp = await http_client.get("/api/gateway/sessions")
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_sessions_usage_503(self, http_client, disconnected_client):
        resp = await http_client.get("/api/gateway/sessions/usage")
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_jobs_503(self, http_client, disconnected_client):
        resp = await http_client.get("/api/gateway/jobs")
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_skills_503(self, http_client, disconnected_client):
        resp = await http_client.get("/api/gateway/skills")
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_models_503(self, http_client, disconnected_client):
        resp = await http_client.get("/api/gateway/models")
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_config_503(self, http_client, disconnected_client):
        resp = await http_client.get("/api/gateway/config")
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_patch_config_503(self, http_client, disconnected_client):
        resp = await http_client.patch(
            "/api/gateway/config", json={"test": "value"}
        )
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_gateway_health_503(self, http_client, disconnected_client):
        resp = await http_client.get("/api/gateway/health")
        assert resp.status_code == 503

    @pytest.mark.asyncio
    async def test_run_job_503(self, http_client, disconnected_client):
        resp = await http_client.post("/api/gateway/jobs/test-job/run")
        assert resp.status_code == 503
