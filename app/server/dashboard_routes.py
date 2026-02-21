"""FastAPI router exposing /api/dashboard — aggregates agent fleet data into widget shapes."""

from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, Depends

from gateway_client import GatewayClient, get_gateway_client

logger = logging.getLogger("dashboard_routes")

router = APIRouter(prefix="/api", tags=["dashboard"])

QUICK_ACTIONS = [
    {
        "id": "qa-1",
        "label": "Dispatch Task",
        "description": "Assign a one-off task to an agent",
        "targetSection": "tasks",
    },
    {
        "id": "qa-2",
        "label": "Start Council",
        "description": "Open a multi-agent debate session",
        "targetSection": "ai-council",
    },
    {
        "id": "qa-3",
        "label": "Create Job",
        "description": "Schedule a recurring job for an agent",
        "targetSection": "jobs",
    },
]


async def _safe_rpc(client: GatewayClient, method: str, params: dict | None = None) -> Any:
    """Call gateway RPC, returning None on any failure."""
    if not client.is_connected:
        return None
    try:
        return await client.send_request(method, params or {})
    except Exception as exc:
        logger.warning("dashboard_routes: RPC %s failed: %s", method, exc)
        return None


def _map_agents(raw_agents: Any) -> list[dict]:
    agents = []
    if isinstance(raw_agents, list):
        items = raw_agents
    elif isinstance(raw_agents, dict):
        items = raw_agents.get("agents", [])
    else:
        return agents

    for agent in items:
        identity = agent.get("identity") or {}
        agents.append({
            "id": agent.get("id", ""),
            "name": identity.get("name") or agent.get("name") or agent.get("id", ""),
            "role": identity.get("role") or identity.get("description") or "Agent",
            "model": agent.get("model_id") or agent.get("model") or "",
            "status": "online",
        })
    return agents


def _map_activity(raw_sessions: Any) -> list[dict]:
    activity = []
    if isinstance(raw_sessions, list):
        items = raw_sessions
    elif isinstance(raw_sessions, dict):
        items = raw_sessions.get("sessions", [])
    else:
        return activity

    for session in items[:7]:
        last_message = session.get("lastMessage") or {}
        snippet = ""
        if isinstance(last_message, dict):
            content = last_message.get("content") or ""
            snippet = content[:120] if isinstance(content, str) else ""
        activity.append({
            "id": session.get("key") or session.get("id") or "",
            "agentName": session.get("agentId") or session.get("agentName") or "Agent",
            "timestamp": session.get("updatedAt") or session.get("createdAt") or "",
            "snippet": snippet,
        })
    return activity


def _map_cost(raw_usage: Any) -> dict:
    today_total = 0.0
    top_agent_name = "—"
    top_agent_amount = 0.0

    if isinstance(raw_usage, dict):
        total = raw_usage.get("total") or {}
        if isinstance(total, dict):
            today_total = float(total.get("cost", 0) or 0)
        else:
            today_total = float(raw_usage.get("cost", 0) or 0)

        # Try per-agent breakdown for top spender
        by_agent = raw_usage.get("byAgent") or raw_usage.get("agents") or {}
        if isinstance(by_agent, dict):
            best_cost = 0.0
            for agent_id, agent_usage in by_agent.items():
                if isinstance(agent_usage, dict):
                    cost = float(agent_usage.get("cost", 0) or 0)
                    if cost > best_cost:
                        best_cost = cost
                        top_agent_name = agent_id
                        top_agent_amount = cost

    if top_agent_amount == 0.0:
        top_agent_amount = today_total
        if today_total > 0:
            top_agent_name = "Agent"

    return {
        "todayTotal": today_total,
        "yesterdayTotal": 0.0,
        "currency": "USD",
        "topAgent": {"name": top_agent_name, "amount": top_agent_amount},
    }


def _map_jobs(raw_jobs: Any) -> list[dict]:
    jobs = []
    if isinstance(raw_jobs, list):
        items = raw_jobs
    elif isinstance(raw_jobs, dict):
        items = raw_jobs.get("jobs") or raw_jobs.get("crons") or []
    else:
        return jobs

    for job in items:
        jobs.append({
            "id": job.get("id", ""),
            "name": job.get("name") or job.get("id", ""),
            "agentName": job.get("agentId") or job.get("agentName") or "",
            "nextRunAt": job.get("nextRunAt") or job.get("schedule") or "",
            "enabled": bool(job.get("enabled", True)),
        })
    return jobs


@router.get("/dashboard")
async def get_dashboard(client: GatewayClient = Depends(get_gateway_client)):
    """Aggregate fleet data into a single dashboard payload for the frontend."""
    raw_agents, raw_sessions, raw_usage, raw_jobs = None, None, None, None

    if client.is_connected:
        import asyncio
        results = await asyncio.gather(
            _safe_rpc(client, "agents.list"),
            _safe_rpc(client, "sessions.list", {"limit": 7, "includeLastMessage": True}),
            _safe_rpc(client, "sessions.usage"),
            _safe_rpc(client, "cron.list"),
            return_exceptions=True,
        )
        raw_agents = results[0] if not isinstance(results[0], Exception) else None
        raw_sessions = results[1] if not isinstance(results[1], Exception) else None
        raw_usage = results[2] if not isinstance(results[2], Exception) else None
        raw_jobs = results[3] if not isinstance(results[3], Exception) else None

    return {
        "agents": _map_agents(raw_agents),
        "recentActivity": _map_activity(raw_sessions),
        "costSummary": _map_cost(raw_usage),
        "upcomingJobs": _map_jobs(raw_jobs),
        "pipeline": {"scheduled": 0, "queue": 0, "inProgress": 0, "done": 0},
        "quickActions": QUICK_ACTIONS,
    }
