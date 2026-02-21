"""FastAPI router with REST endpoints that proxy to OpenClaw Gateway RPC methods."""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sse_starlette.sse import EventSourceResponse

from gateway_client import GatewayClient, get_gateway_client

logger = logging.getLogger("gateway_routes")

router = APIRouter(prefix="/api/gateway", tags=["gateway"])


def _require_connected(client: GatewayClient) -> None:
    """Raise 503 if the gateway client is not connected."""
    if not client.is_connected:
        raise HTTPException(
            status_code=503,
            detail="Gateway not connected. The OpenClaw Gateway is currently unreachable.",
        )


async def _proxy_rpc(client: GatewayClient, method: str, params: dict | None = None) -> Any:
    """Send an RPC request to the gateway and return the payload."""
    _require_connected(client)
    try:
        return await client.send_request(method, params)
    except ConnectionError:
        raise HTTPException(status_code=503, detail="Gateway connection lost during request.")
    except TimeoutError:
        raise HTTPException(status_code=504, detail=f"Gateway request '{method}' timed out.")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gateway error: {str(e)}")


# --- Status ---


@router.get("/status")
async def gateway_status(client: GatewayClient = Depends(get_gateway_client)):
    """Return the current gateway connection status."""
    return client.get_status().model_dump()


# --- Agents ---


@router.get("/agents")
async def list_agents(client: GatewayClient = Depends(get_gateway_client)):
    """List all configured agents via agents.list."""
    return await _proxy_rpc(client, "agents.list")


@router.get("/agents/{agent_id}/identity")
async def get_agent_identity(
    agent_id: str, client: GatewayClient = Depends(get_gateway_client)
):
    """Get agent metadata via agent.identity.get."""
    return await _proxy_rpc(client, "agent.identity.get", {"agentId": agent_id})


# --- Sessions ---


@router.get("/sessions")
async def list_sessions(
    limit: Optional[int] = Query(None),
    agentId: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    includeLastMessage: Optional[bool] = Query(None),
    client: GatewayClient = Depends(get_gateway_client),
):
    """List sessions via sessions.list."""
    params: dict[str, Any] = {}
    if limit is not None:
        params["limit"] = limit
    if agentId is not None:
        params["agentId"] = agentId
    if search is not None:
        params["search"] = search
    if includeLastMessage is not None:
        params["includeLastMessage"] = includeLastMessage
    return await _proxy_rpc(client, "sessions.list", params)


@router.get("/sessions/usage")
async def sessions_usage(
    key: Optional[str] = Query(None),
    startDate: Optional[str] = Query(None),
    endDate: Optional[str] = Query(None),
    mode: Optional[str] = Query(None),
    client: GatewayClient = Depends(get_gateway_client),
):
    """Get token/cost usage stats via sessions.usage."""
    params: dict[str, Any] = {}
    if key is not None:
        params["key"] = key
    if startDate is not None:
        params["startDate"] = startDate
    if endDate is not None:
        params["endDate"] = endDate
    if mode is not None:
        params["mode"] = mode
    return await _proxy_rpc(client, "sessions.usage", params)


# --- Jobs ---


@router.get("/jobs")
async def list_jobs(client: GatewayClient = Depends(get_gateway_client)):
    """List all scheduled jobs via cron.list."""
    return await _proxy_rpc(client, "cron.list")


@router.post("/jobs/{job_id}/run")
async def run_job(job_id: str, client: GatewayClient = Depends(get_gateway_client)):
    """Execute a job immediately via cron.run."""
    return await _proxy_rpc(client, "cron.run", {"id": job_id, "mode": "force"})


# --- Skills ---


@router.get("/skills")
async def skills_status(
    agentId: Optional[str] = Query(None),
    client: GatewayClient = Depends(get_gateway_client),
):
    """Get skills status via skills.status."""
    params: dict[str, Any] = {}
    if agentId is not None:
        params["agentId"] = agentId
    return await _proxy_rpc(client, "skills.status", params)


# --- Models ---


@router.get("/models")
async def list_models(client: GatewayClient = Depends(get_gateway_client)):
    """List available AI models via models.list."""
    return await _proxy_rpc(client, "models.list")


# --- Config ---


@router.get("/config")
async def get_config(client: GatewayClient = Depends(get_gateway_client)):
    """Retrieve full config via config.get."""
    return await _proxy_rpc(client, "config.get")


@router.patch("/config")
async def patch_config(
    request: Request, client: GatewayClient = Depends(get_gateway_client)
):
    """Partial config update via config.patch."""
    body = await request.json()
    return await _proxy_rpc(client, "config.patch", {"patch": body})


# --- Health ---


@router.get("/health")
async def gateway_health(client: GatewayClient = Depends(get_gateway_client)):
    """Gateway health check via health method."""
    return await _proxy_rpc(client, "health")


# --- SSE Events ---


@router.get("/events")
async def event_stream(client: GatewayClient = Depends(get_gateway_client)):
    """SSE endpoint that streams gateway events to frontend clients."""
    event_queue: asyncio.Queue = asyncio.Queue(maxsize=100)

    def on_event(event):
        try:
            event_queue.put_nowait(event)
        except asyncio.QueueFull:
            # Drop oldest event if queue is full
            try:
                event_queue.get_nowait()
                event_queue.put_nowait(event)
            except asyncio.QueueEmpty:
                pass

    client.on_any_event(on_event)

    async def generate():
        try:
            # Send initial status
            status = client.get_status().model_dump()
            yield {
                "event": "status",
                "data": json.dumps(status),
            }

            while True:
                try:
                    event = await asyncio.wait_for(event_queue.get(), timeout=15.0)
                    yield {
                        "event": event.event,
                        "data": json.dumps(event.payload),
                    }
                except asyncio.TimeoutError:
                    # Send keepalive
                    yield {"event": "ping", "data": "{}"}
        except asyncio.CancelledError:
            return
        finally:
            # Remove callback
            if on_event in client._global_event_callbacks:
                client._global_event_callbacks.remove(on_event)

    return EventSourceResponse(generate())
