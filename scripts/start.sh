#!/bin/bash

# =============================================================================
# Agent HQ - Start All Services
# =============================================================================
# Starts backend (FastAPI) and frontend (React)
# =============================================================================

# Port configuration - check .ports.env for worktree-specific ports
SCRIPT_DIR_TEMP="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT_TEMP="$( dirname "$SCRIPT_DIR_TEMP" )"

if [ -f "$PROJECT_ROOT_TEMP/.ports.env" ]; then
    source "$PROJECT_ROOT_TEMP/.ports.env"
    SERVER_PORT=${BACKEND_PORT:-8000}
    CLIENT_PORT=${FRONTEND_PORT:-3000}
    echo -e "\033[0;34m[start.sh] Using ports from .ports.env: Backend=$SERVER_PORT, Frontend=$CLIENT_PORT\033[0m"
else
    SERVER_PORT=8000
    CLIENT_PORT=3000
fi

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Agent HQ - Starting Services                       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"

# Function to kill process on port
kill_port() {
    local port=$1
    local process_name=$2

    # Find process using the port
    local pid=$(lsof -ti:$port 2>/dev/null)

    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Found $process_name running on port $port (PID: $pid). Killing it...${NC}"
        kill -9 $pid 2>/dev/null
        sleep 1
        echo -e "${GREEN}$process_name on port $port has been terminated.${NC}"
    fi
}

# Kill any existing processes on our ports
kill_port $SERVER_PORT "backend server"
kill_port $CLIENT_PORT "frontend server"

# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( dirname "$SCRIPT_DIR" )"

# Check if .env exists in server directory
if [ ! -f "$PROJECT_ROOT/app/server/.env" ]; then
    echo -e "${YELLOW}Warning: No .env file found in app/server/.${NC}"
    if [ -f "$PROJECT_ROOT/app/server/env.example" ]; then
        echo "Creating .env from env.example..."
        cp "$PROJECT_ROOT/app/server/env.example" "$PROJECT_ROOT/app/server/.env"
        echo -e "${YELLOW}Please edit app/server/.env and add your credentials${NC}"
    else
        echo "Please create app/server/.env with your configuration"
        exit 1
    fi
fi

# Check if .env exists in client directory
if [ ! -f "$PROJECT_ROOT/app/client/.env" ]; then
    echo -e "${YELLOW}Creating client .env file...${NC}"
    if [ -f "$PROJECT_ROOT/app/client/env.example" ]; then
        cp "$PROJECT_ROOT/app/client/env.example" "$PROJECT_ROOT/app/client/.env"
    else
        echo "REACT_APP_API_URL=/api" > "$PROJECT_ROOT/app/client/.env"
    fi
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${BLUE}Shutting down services...${NC}"

    # Kill all child processes
    jobs -p | xargs -r kill 2>/dev/null

    # Wait for processes to terminate
    wait 2>/dev/null

    echo -e "${GREEN}Services stopped successfully.${NC}"
    exit 0
}

# Trap EXIT, INT, and TERM signals
trap cleanup EXIT INT TERM

# Check if UV is installed
if ! command -v uv &> /dev/null; then
    echo -e "${YELLOW}UV not found. Installing UV...${NC}"
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
fi

# Start backend
echo -e "\n${GREEN}Starting backend server (FastAPI with UV)...${NC}"
cd "$PROJECT_ROOT/app/server"

# Sync dependencies with UV
echo "Syncing dependencies..."
uv sync --quiet 2>/dev/null || uv pip install -e . --quiet 2>/dev/null

# Start server with UV
API_PORT=$SERVER_PORT uv run python server.py &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}Backend failed to start!${NC}"
    echo "Trying alternative startup..."
    python server.py &
    BACKEND_PID=$!
    sleep 3
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}Backend startup failed!${NC}"
        exit 1
    fi
fi

# Start frontend
echo -e "\n${GREEN}Starting frontend server (React)...${NC}"
cd "$PROJECT_ROOT/app/client"

# Install npm packages if needed
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

PORT=$CLIENT_PORT npm start &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Check if frontend is running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}Frontend failed to start!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           All Services Running                              ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║  Frontend:  http://localhost:$CLIENT_PORT                         ║${NC}"
echo -e "${BLUE}║  Backend:   http://localhost:$SERVER_PORT                         ║${NC}"
echo -e "${BLUE}║  API Docs:  http://localhost:$SERVER_PORT/docs                    ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Press Ctrl+C to stop all services                           ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Wait for user to press Ctrl+C
wait
