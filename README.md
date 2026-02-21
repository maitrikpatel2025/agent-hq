# Agent HQ

A full-stack application powered by AI-assisted development workflows.

## Prerequisites

- Python 3.10+
- UV (Python package manager)
- Node.js 18+
- npm (comes with Node.js)

## Setup

### 1. Install UV (Recommended)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Install Dependencies

```bash
# Backend
cd app/server
uv sync

# Frontend
cd app/client
npm install
```

### 3. Environment Configuration

```bash
cp .env.example .env
# Edit .env and add your credentials
```

## Quick Start

```bash
./scripts/start.sh
```

Press `Ctrl+C` to stop all services.

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Manual Start

### Backend
```bash
cd app/server
uv run python server.py
```

### Frontend
```bash
cd app/client
npm start
```

## Development

### Backend Commands
```bash
cd app/server
uv run python server.py      # Start server with hot reload
uv run pytest               # Run tests
uv run ruff check .         # Run linter
uv run ruff format .        # Format code
```

### Frontend Commands
```bash
cd app/client
npm start                   # Start dev server
npm run build              # Build for production
npm test                   # Run tests
```

## Project Structure

```
.
├── app/                           # Main application
│   ├── client/                    # React frontend
│   │   ├── src/
│   │   │   ├── App.jsx            # Root component
│   │   │   ├── index.css          # Global styles
│   │   │   └── index.js           # Entry point
│   │   └── package.json
│   │
│   └── server/                    # FastAPI backend
│       ├── server.py              # Main application
│       └── pyproject.toml         # UV package management
│
├── adws/                          # AI Developer Workflow (ADW) system
│   ├── adw_modules/               # Core ADW modules
│   ├── adw_triggers/              # Automation triggers
│   ├── adw_tests/                 # ADW test suite
│   └── *.py                       # Workflow scripts
│
├── scripts/                       # Utility scripts
├── ai_docs/                       # AI/LLM documentation
└── specs/                         # Feature specifications
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test` | GET | Simple health check |
| `/api/health` | GET | Detailed health check |
| `/docs` | GET | Interactive API documentation (Swagger UI) |

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS | Styling |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | High-performance async API framework |
| UV | Fast Python package manager |
| Uvicorn | ASGI server |
| Pydantic | Data validation |

## Testing

### Backend Tests
```bash
cd app/server
uv run pytest               # Run all tests
uv run pytest -v            # Verbose output
uv run pytest --cov=.       # With coverage
```

### Frontend Tests
```bash
cd app/client
npm test
```

## License

MIT License - See LICENSE file for details.
