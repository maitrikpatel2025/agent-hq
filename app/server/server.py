import logging
import os
from contextlib import asynccontextmanager

import uvicorn
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402

from dashboard_routes import router as dashboard_router  # noqa: E402
from gateway_client import gateway_client  # noqa: E402
from gateway_routes import router as gateway_router  # noqa: E402

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger("server")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Start gateway client on startup, stop on shutdown."""
    if gateway_client.is_configured:
        logger.info("Starting gateway client connection...")
        await gateway_client.connect()
    else:
        logger.warning(
            "OPENCLAW_GATEWAY_URL not configured. Gateway features disabled."
        )
    yield
    if gateway_client.is_configured:
        logger.info("Shutting down gateway client...")
        await gateway_client.disconnect()


app = FastAPI(title="Agent HQ API", version="0.1.0", lifespan=lifespan)

cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")

# Auto-include the worktree frontend origin when FRONTEND_PORT is set
frontend_port = os.getenv("FRONTEND_PORT")
if frontend_port and cors_origins != ["*"]:
    worktree_origin = f"http://localhost:{frontend_port}"
    if worktree_origin not in cors_origins:
        cors_origins.append(worktree_origin)

# Wildcard origin with credentials is invalid per CORS spec; browsers reject it.
# When origins are explicit, enable credentials; otherwise disable them.
cors_allow_credentials = cors_origins != ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=cors_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(gateway_router)
app.include_router(dashboard_router)


@app.get("/api/test")
async def test():
    return {"message": "API is running!"}


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "agent-hq-api"}


if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", 8000)),
        reload=os.getenv("API_DEBUG", "true").lower() == "true",
    )
