#!/bin/bash

# =============================================================================
# Agent HQ - Reset Database
# =============================================================================
# Resets the application database to a clean state.
# Currently a no-op as the application uses gateway data (no local database).
# This script exists to satisfy ADW workflow dependencies.
# =============================================================================

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}[reset_db] Database reset complete.${NC}"
echo -e "${YELLOW}[reset_db] Note: No local database to reset - application uses OpenClaw Gateway data.${NC}"

exit 0
