#!/bin/bash

# =============================================================================
# Environment Setup Script
# =============================================================================
# Creates .env files for all components from templates
# =============================================================================

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Agent HQ - Environment Setup                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/../app" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# =============================================================================
# Setup Server .env
# =============================================================================
echo "Setting up Server environment..."
if [ -f "$APP_DIR/server/.env" ]; then
    echo -e "${YELLOW}Server .env already exists, skipping...${NC}"
else
    if [ -f "$APP_DIR/server/env.example" ]; then
        cp "$APP_DIR/server/env.example" "$APP_DIR/server/.env"
        echo -e "${GREEN}Created app/server/.env${NC}"
        echo -e "${YELLOW}   Please edit this file with your actual credentials!${NC}"
    else
        echo -e "${RED}Server env.example not found!${NC}"
    fi
fi

# =============================================================================
# Setup Client .env
# =============================================================================
echo ""
echo "Setting up Client environment..."
if [ -f "$APP_DIR/client/.env" ]; then
    echo -e "${YELLOW}Client .env already exists, skipping...${NC}"
else
    if [ -f "$APP_DIR/client/env.example" ]; then
        cp "$APP_DIR/client/env.example" "$APP_DIR/client/.env"
        echo -e "${GREEN}Created app/client/.env${NC}"
    else
        # Create minimal client .env
        echo "REACT_APP_API_URL=http://localhost:8000/api" > "$APP_DIR/client/.env"
        echo -e "${GREEN}Created app/client/.env with default API URL${NC}"
    fi
fi

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Environment Setup Complete                         ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                               ║"
echo "║  Edit these files with your actual credentials:              ║"
echo "║                                                               ║"
echo "║  1. app/server/.env - Server credentials                     ║"
echo "║  2. app/client/.env - API URL (usually fine as default)      ║"
echo "║                                                               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
