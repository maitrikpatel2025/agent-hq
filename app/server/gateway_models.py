"""Pydantic models for OpenClaw Gateway WebSocket protocol frames and data schemas."""

from __future__ import annotations

from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field

# --- Protocol Frame Models ---


class GatewayRequest(BaseModel):
    """Client -> Server request frame."""

    type: str = "req"
    id: str
    method: str
    params: dict[str, Any] = Field(default_factory=dict)


class GatewayError(BaseModel):
    """Error payload within a response frame."""

    code: str
    message: str
    details: Any = None
    retryable: bool = False
    retryAfterMs: Optional[int] = None


class GatewayResponse(BaseModel):
    """Server -> Client response frame."""

    type: str = "res"
    id: str
    ok: bool
    payload: Any = None
    error: Optional[GatewayError] = None


class GatewayEvent(BaseModel):
    """Server -> Client unsolicited event frame."""

    type: str = "event"
    event: str
    payload: dict[str, Any] = Field(default_factory=dict)
    seq: Optional[int] = None
    stateVersion: Optional[dict[str, int]] = None


# --- Connect Handshake Models ---


class ClientInfo(BaseModel):
    id: str = "webchat"
    version: str = "1.0.0"
    platform: str = "web"
    mode: str = "webchat"


class ConnectParams(BaseModel):
    """Parameters for the connect handshake request."""

    minProtocol: int = 3
    maxProtocol: int = 3
    client: ClientInfo = Field(default_factory=ClientInfo)
    role: str = "operator"
    scopes: list[str] = Field(
        default_factory=lambda: ["operator.read", "operator.write", "operator.admin"]
    )
    caps: list[str] = Field(default_factory=list)
    commands: list[str] = Field(default_factory=list)
    permissions: dict[str, Any] = Field(default_factory=dict)
    auth: dict[str, str] = Field(default_factory=dict)
    locale: str = "en-US"
    userAgent: str = "agent-hq/1.0.0"


# --- Connection Status Models ---


class ConnectionState(str, Enum):
    DISCONNECTED = "disconnected"
    CONNECTING = "connecting"
    CONNECTED = "connected"
    RECONNECTING = "reconnecting"


class ServerInfo(BaseModel):
    version: Optional[str] = None
    commit: Optional[str] = None
    connId: Optional[str] = None


class ConnectionStatus(BaseModel):
    """Connection status exposed via the REST API."""

    state: ConnectionState = ConnectionState.DISCONNECTED
    server: Optional[ServerInfo] = None
    availableMethods: list[str] = Field(default_factory=list)
    availableEvents: list[str] = Field(default_factory=list)
    uptimeMs: Optional[int] = None
    gatewayUrl: Optional[str] = None


# --- Data Schema Models ---


class AgentIdentity(BaseModel):
    name: Optional[str] = None
    theme: Optional[str] = None
    emoji: Optional[str] = None
    avatar: Optional[str] = None
    avatarUrl: Optional[str] = None


class AgentSummary(BaseModel):
    id: str
    name: Optional[str] = None
    identity: Optional[AgentIdentity] = None


class SessionUsage(BaseModel):
    key: Optional[str] = None
    inputTokens: int = 0
    outputTokens: int = 0
    totalTokens: int = 0
    cost: float = 0.0
    turns: int = 0
    startDate: Optional[str] = None
    endDate: Optional[str] = None


class CronSchedule(BaseModel):
    kind: str
    at: Optional[str] = None
    everyMs: Optional[int] = None
    expr: Optional[str] = None
    tz: Optional[str] = None
    staggerMs: Optional[int] = None


class CronPayload(BaseModel):
    kind: str
    text: Optional[str] = None
    message: Optional[str] = None
    model: Optional[str] = None
    thinking: Optional[str] = None


class CronJobState(BaseModel):
    nextRunAtMs: Optional[int] = None
    runningAtMs: Optional[int] = None
    lastRunAtMs: Optional[int] = None
    lastStatus: Optional[str] = None
    lastError: Optional[str] = None
    lastDurationMs: Optional[int] = None
    consecutiveErrors: Optional[int] = None


class CronJob(BaseModel):
    id: str
    agentId: Optional[str] = None
    sessionKey: Optional[str] = None
    name: str
    description: Optional[str] = None
    enabled: bool = True
    deleteAfterRun: Optional[bool] = None
    createdAtMs: Optional[int] = None
    updatedAtMs: Optional[int] = None
    schedule: Optional[CronSchedule] = None
    sessionTarget: Optional[str] = None
    wakeMode: Optional[str] = None
    payload: Optional[CronPayload] = None
    delivery: Optional[dict[str, Any]] = None
    state: Optional[CronJobState] = None


# --- Agent CRUD Request Models ---


class AgentCreateRequest(BaseModel):
    id: str
    name: str
    workspace: str
    emoji: Optional[str] = None
    avatar: Optional[str] = None


class AgentUpdateRequest(BaseModel):
    name: Optional[str] = None
    workspace: Optional[str] = None
    emoji: Optional[str] = None
    avatar: Optional[str] = None


class AgentDeleteRequest(BaseModel):
    deleteFiles: Optional[bool] = False
