#!/bin/bash

# =============================================================================
# Agent HQ - Stop All Services
# =============================================================================

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Stopping Agent HQ services...${NC}"

# Kill any running start.sh processes
echo -e "${GREEN}Killing start.sh processes...${NC}"
pkill -f "start.sh" 2>/dev/null

# Kill start_all.sh processes
echo -e "${GREEN}Killing start_all.sh processes...${NC}"
pkill -f "start_all.sh" 2>/dev/null

# Kill server processes
echo -e "${GREEN}Killing server processes...${NC}"
pkill -f "server.py" 2>/dev/null
pkill -f "uvicorn" 2>/dev/null

# Kill React processes
echo -e "${GREEN}Killing React processes...${NC}"
pkill -f "react-scripts" 2>/dev/null
pkill -f "node.*start" 2>/dev/null

# Check for .ports.env to get worktree-specific ports
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( dirname "$SCRIPT_DIR" )"

PORTS_TO_KILL="3000,5000,8000"
if [ -f "$PROJECT_ROOT/.ports.env" ]; then
    source "$PROJECT_ROOT/.ports.env"
    PORTS_TO_KILL="${BACKEND_PORT:-8000},${FRONTEND_PORT:-3000}"
    echo -e "${GREEN}Using ports from .ports.env: $PORTS_TO_KILL${NC}"
fi

# Kill processes on specific ports
echo -e "${GREEN}Killing processes on ports $PORTS_TO_KILL...${NC}"
lsof -ti:$PORTS_TO_KILL 2>/dev/null | xargs kill -9 2>/dev/null

echo -e "${GREEN}All services stopped successfully!${NC}"
