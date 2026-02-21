# Start the Application

## Variables

CLIENT_PORT: 3000
SERVER_PORT: 8000

## Workflow

Check to see if processes are already running on CLIENT_PORT and SERVER_PORT.

### If already running:
- Open the frontend in the browser: `open http://localhost:CLIENT_PORT`
- Mention the API docs are available at: `http://localhost:SERVER_PORT/docs`

### If not running:
Run these commands:

1. `nohup sh ./scripts/start.sh > /dev/null 2>&1 &`
2. `sleep 5`
3. `open http://localhost:CLIENT_PORT`

## Report
- Let the user know that the application is starting (or already running)
- Mention the services:
  - **Frontend**: http://localhost:3000
  - **Backend API**: http://localhost:8000
  - **API Documentation**: http://localhost:8000/docs
- To stop all services: `./scripts/stop_apps.sh`
