# Agent HQ Application

A full-stack application with a React frontend and FastAPI backend.

## Project Structure

```
app/
├── client/                       # Frontend (React)
│   ├── src/
│   │   ├── App.jsx               # Root component
│   │   ├── index.css             # Global styles
│   │   └── index.js              # Entry point
│   └── package.json
│
└── server/                       # Backend (FastAPI + UV)
    ├── server.py                 # Main FastAPI application
    └── pyproject.toml            # UV package management
```

## Quick Start

### Prerequisites

- **Python 3.10+** - [Download](https://python.org)
- **UV** (recommended) - Fast Python package manager
- **Node.js 18+** - [Download](https://nodejs.org)
- **npm** - Comes with Node.js

### Install UV (Recommended)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Start All Services

```bash
./scripts/start.sh
```

- Server: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

### Stop All Services

```bash
./scripts/stop_apps.sh
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test` | GET | Health check |
| `/api/health` | GET | Detailed health check |
| `/docs` | GET | Interactive API documentation (Swagger UI) |

## Configuration

### Environment Variables

All configuration is done via environment variables in `.env` files:

#### Server (`app/server/.env`)

```bash
# FastAPI Server
API_DEBUG=True
API_HOST=0.0.0.0
API_PORT=8000

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Client (`app/client/.env`)

```bash
REACT_APP_API_URL=http://localhost:8000/api
```

## Running Tests

```bash
cd app/server
uv run pytest
```

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS | Styling |

### Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | High-performance async API framework |
| UV | Fast Python package manager |
| Uvicorn | ASGI server |
| Pydantic | Data validation |

## Utility Scripts

| Script | Description |
|--------|-------------|
| `scripts/start.sh` | Start all services |
| `scripts/start_server.sh` | Start backend only |
| `scripts/start_client.sh` | Start frontend only |
| `scripts/stop_apps.sh` | Stop all services |

## License

MIT License - See LICENSE file for details.
