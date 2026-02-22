#!/bin/bash

# =============================================================================
# Agent HQ - Auto Deploy
# =============================================================================
# Pulls latest code from main, syncs deps, and restarts the app.
# Does NOT touch the webhook server on port 8001.
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_ROOT/logs/deploy.log"

mkdir -p "$PROJECT_ROOT/logs"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "========== DEPLOY STARTED =========="

# 1. Pull latest code
log "Pulling latest from origin/main..."
cd "$PROJECT_ROOT"
git fetch origin main >> "$LOG_FILE" 2>&1
git reset --hard origin/main >> "$LOG_FILE" 2>&1
COMMIT=$(git rev-parse --short HEAD)
log "Now at commit: $COMMIT"

# 2. Sync Python deps
log "Syncing Python dependencies..."
cd "$PROJECT_ROOT/app/server"
uv sync --quiet >> "$LOG_FILE" 2>&1

# 3. Sync JS deps
log "Syncing JS dependencies..."
cd "$PROJECT_ROOT/app/client"
npm install --silent >> "$LOG_FILE" 2>&1

# 4. Kill app processes (ports 8000 and 3000 only, NOT 8001)
log "Stopping app processes on ports 8000 and 3000..."
lsof -ti:8000 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 2

# 5. Restart app
log "Starting server..."
cd "$PROJECT_ROOT"
nohup bash scripts/start_server.sh >> "$LOG_FILE" 2>&1 &
sleep 3

log "Starting client..."
cd "$PROJECT_ROOT/app/client"
BROWSER=none PORT=3000 nohup npm start >> "$LOG_FILE" 2>&1 &
sleep 3

log "Deploy complete. Commit: $COMMIT"
log "========== DEPLOY FINISHED =========="
