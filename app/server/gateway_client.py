"""OpenClaw Gateway WebSocket client.

Manages the persistent WebSocket connection to the OpenClaw Gateway,
implementing the 3-stage handshake, RPC request/response dispatch,
event listener callbacks, heartbeat monitoring, and auto-reconnection.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import uuid
from collections.abc import Callable
from typing import Any

import websockets
from websockets.exceptions import ConnectionClosed

from gateway_models import (
    ClientInfo,
    ConnectParams,
    ConnectionState,
    ConnectionStatus,
    GatewayEvent,
    GatewayRequest,
    GatewayResponse,
    ServerInfo,
)

logger = logging.getLogger("gateway_client")


class GatewayClient:
    """WebSocket client for the OpenClaw Gateway."""

    def __init__(self, url: str | None = None, token: str | None = None):
        self.url = url if url is not None else os.getenv("OPENCLAW_GATEWAY_URL", "")
        self.token = token if token is not None else os.getenv("OPENCLAW_GATEWAY_TOKEN", "")
        self.state = ConnectionState.DISCONNECTED
        self.server_info: ServerInfo | None = None
        self.available_methods: list[str] = []
        self.available_events: list[str] = []
        self.uptime_ms: int | None = None

        self._ws: Any = None
        self._request_counter = 0
        self._pending_requests: dict[str, asyncio.Future] = {}
        self._event_callbacks: dict[str, list[Callable]] = {}
        self._global_event_callbacks: list[Callable] = []
        self._message_task: asyncio.Task | None = None
        self._reconnect_task: asyncio.Task | None = None
        self._should_reconnect = True
        self._reconnect_delay = 1.0
        self._max_reconnect_delay = 30.0

    @property
    def is_connected(self) -> bool:
        return self.state == ConnectionState.CONNECTED

    @property
    def is_configured(self) -> bool:
        return bool(self.url)

    def get_status(self) -> ConnectionStatus:
        return ConnectionStatus(
            state=self.state,
            server=self.server_info,
            availableMethods=self.available_methods,
            availableEvents=self.available_events,
            uptimeMs=self.uptime_ms,
            gatewayUrl=self.url if self.url else None,
        )

    def _next_request_id(self) -> str:
        self._request_counter += 1
        return str(self._request_counter)

    def on_event(self, event_name: str, callback: Callable) -> None:
        """Register a callback for a specific event type."""
        if event_name not in self._event_callbacks:
            self._event_callbacks[event_name] = []
        self._event_callbacks[event_name].append(callback)

    def on_any_event(self, callback: Callable) -> None:
        """Register a callback for all events."""
        self._global_event_callbacks.append(callback)

    async def connect(self) -> None:
        """Establish WebSocket connection and perform handshake."""
        if not self.is_configured:
            logger.warning("Gateway URL not configured, skipping connection")
            return

        self.state = ConnectionState.CONNECTING
        self._should_reconnect = True

        try:
            logger.info(f"Connecting to gateway at {self.url}")
            # Origin header must match the gateway host for webchat mode
            origin = self.url.replace("ws://", "http://").replace("wss://", "https://")
            self._ws = await websockets.connect(
                self.url,
                additional_headers={"Origin": origin},
                max_size=4 * 1024 * 1024,
                close_timeout=5,
            )
            await self._perform_handshake()
            self.state = ConnectionState.CONNECTED
            self._reconnect_delay = 1.0
            logger.info("Gateway connection established successfully")

            # Start message handler
            self._message_task = asyncio.create_task(self._handle_messages())

        except Exception as e:
            logger.error(f"Failed to connect to gateway: {e}")
            self.state = ConnectionState.DISCONNECTED
            if self._should_reconnect:
                self._start_reconnect()

    async def disconnect(self) -> None:
        """Gracefully close the connection."""
        self._should_reconnect = False

        if self._reconnect_task and not self._reconnect_task.done():
            self._reconnect_task.cancel()
            try:
                await self._reconnect_task
            except asyncio.CancelledError:
                pass

        if self._message_task and not self._message_task.done():
            self._message_task.cancel()
            try:
                await self._message_task
            except asyncio.CancelledError:
                pass

        if self._ws:
            try:
                await self._ws.close()
            except Exception:
                pass

        # Cancel all pending requests
        for future in self._pending_requests.values():
            if not future.done():
                future.cancel()
        self._pending_requests.clear()

        self.state = ConnectionState.DISCONNECTED
        logger.info("Gateway connection closed")

    async def send_request(
        self, method: str, params: dict[str, Any] | None = None, timeout: float = 30.0
    ) -> Any:
        """Send an RPC request and await the response."""
        if not self.is_connected or not self._ws:
            raise ConnectionError("Not connected to gateway")

        request_id = self._next_request_id()
        request = GatewayRequest(
            id=request_id,
            method=method,
            params=params or {},
        )

        future: asyncio.Future = asyncio.get_event_loop().create_future()
        self._pending_requests[request_id] = future

        try:
            await self._ws.send(request.model_dump_json())
            result = await asyncio.wait_for(future, timeout=timeout)
            return result
        except asyncio.TimeoutError:
            self._pending_requests.pop(request_id, None)
            raise TimeoutError(f"Request {method} timed out after {timeout}s")
        except Exception:
            self._pending_requests.pop(request_id, None)
            raise

    async def _perform_handshake(self) -> None:
        """Execute the 3-stage handshake protocol."""
        # Stage 1: Wait for connect.challenge
        raw = await asyncio.wait_for(self._ws.recv(), timeout=10.0)
        challenge = json.loads(raw)

        if challenge.get("type") != "event" or challenge.get("event") != "connect.challenge":
            raise ConnectionError(f"Expected connect.challenge, got: {challenge}")

        logger.debug("Received connect.challenge")

        # Stage 2: Send connect request
        connect_params = ConnectParams(
            client=ClientInfo(),
            auth={"token": self.token} if self.token else {},
        )

        connect_request = GatewayRequest(
            id="1",
            method="connect",
            params=connect_params.model_dump(),
        )

        # Reset request counter since we use "1" for handshake
        self._request_counter = 1

        await self._ws.send(connect_request.model_dump_json())
        logger.debug("Sent connect request")

        # Stage 3: Wait for hello-ok
        raw = await asyncio.wait_for(self._ws.recv(), timeout=10.0)
        response = json.loads(raw)

        if response.get("type") != "res" or not response.get("ok"):
            error = response.get("error", {})
            raise ConnectionError(
                f"Handshake failed: {error.get('message', 'Unknown error')}"
            )

        payload = response.get("payload", {})
        if payload.get("type") != "hello-ok":
            raise ConnectionError(f"Expected hello-ok, got: {payload.get('type')}")

        # Store server info
        server_data = payload.get("server", {})
        self.server_info = ServerInfo(**server_data)

        features = payload.get("features", {})
        self.available_methods = features.get("methods", [])
        self.available_events = features.get("events", [])

        snapshot = payload.get("snapshot", {})
        self.uptime_ms = snapshot.get("uptimeMs")

        logger.info(
            f"Handshake complete - server v{self.server_info.version}, "
            f"{len(self.available_methods)} methods, {len(self.available_events)} events"
        )

    async def _handle_messages(self) -> None:
        """Background task to process incoming WebSocket frames."""
        try:
            async for raw in self._ws:
                try:
                    data = json.loads(raw)
                    frame_type = data.get("type")

                    if frame_type == "res":
                        self._handle_response(data)
                    elif frame_type == "event":
                        await self._handle_event(data)
                    else:
                        logger.warning(f"Unknown frame type: {frame_type}")

                except json.JSONDecodeError:
                    logger.error("Received malformed JSON from gateway")
                except Exception as e:
                    logger.error(f"Error processing message: {e}")

        except ConnectionClosed as e:
            logger.warning(f"Gateway connection closed: code={e.code}")
        except asyncio.CancelledError:
            return
        except Exception as e:
            logger.error(f"Message handler error: {e}")

        # Connection lost
        self.state = ConnectionState.DISCONNECTED
        if self._should_reconnect:
            self._start_reconnect()

    def _handle_response(self, data: dict) -> None:
        """Match a response to its pending request."""
        request_id = data.get("id")
        future = self._pending_requests.pop(request_id, None)
        if future and not future.done():
            response = GatewayResponse(**data)
            if response.ok:
                future.set_result(response.payload)
            else:
                error = response.error
                msg = error.message if error else "Unknown error"
                future.set_exception(Exception(f"Gateway error: {msg}"))

    async def _handle_event(self, data: dict) -> None:
        """Dispatch event to registered callbacks."""
        event = GatewayEvent(**data)

        # Handle tick events for liveness
        if event.event == "tick":
            logger.debug("Received tick")
            return

        # Handle shutdown events
        if event.event == "shutdown":
            logger.warning(f"Gateway shutdown: {event.payload}")
            restart_ms = event.payload.get("restartExpectedMs")
            if restart_ms:
                self._reconnect_delay = restart_ms / 1000.0

        # Dispatch to event-specific callbacks
        callbacks = self._event_callbacks.get(event.event, [])
        for callback in callbacks:
            try:
                result = callback(event)
                if asyncio.iscoroutine(result):
                    await result
            except Exception as e:
                logger.error(f"Event callback error for {event.event}: {e}")

        # Dispatch to global callbacks
        for callback in self._global_event_callbacks:
            try:
                result = callback(event)
                if asyncio.iscoroutine(result):
                    await result
            except Exception as e:
                logger.error(f"Global event callback error: {e}")

    def _start_reconnect(self) -> None:
        """Start the reconnection loop."""
        if self._reconnect_task and not self._reconnect_task.done():
            return
        self._reconnect_task = asyncio.create_task(self._reconnect_loop())

    async def _reconnect_loop(self) -> None:
        """Reconnect with exponential backoff."""
        while self._should_reconnect:
            self.state = ConnectionState.RECONNECTING
            delay = self._reconnect_delay

            logger.info(f"Reconnecting in {delay:.1f}s...")
            await asyncio.sleep(delay)

            if not self._should_reconnect:
                break

            # Increase backoff
            self._reconnect_delay = min(
                self._reconnect_delay * 2, self._max_reconnect_delay
            )

            try:
                await self.connect()
                if self.is_connected:
                    return
            except Exception as e:
                logger.error(f"Reconnection attempt failed: {e}")


# Module-level singleton
gateway_client = GatewayClient()


def get_gateway_client() -> GatewayClient:
    """Dependency injection helper for FastAPI."""
    return gateway_client
