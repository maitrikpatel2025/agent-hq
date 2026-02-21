# Agent HQ Server

FastAPI backend for Agent HQ.

## Setup

```bash
cd app/server
uv sync
```

## Running

```bash
uv run python server.py
```

Server runs at http://localhost:8000

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test` | GET | Health check |
| `/api/health` | GET | Detailed health check |
| `/docs` | GET | Swagger UI |

## Testing

```bash
uv run pytest
uv run ruff check .
```
