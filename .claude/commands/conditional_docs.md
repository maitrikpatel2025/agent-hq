# Conditional Documentation Guide

This prompt helps you determine what documentation you should read based on the specific changes you need to make in the codebase. Review the conditions below and read the relevant documentation before proceeding with your task.

## Instructions
- Review the task you've been asked to perform
- Check each documentation path in the Conditional Documentation section
- For each path, evaluate if any of the listed conditions apply to your task
  - IMPORTANT: Only read the documentation if any one of the conditions match your task
- IMPORTANT: You don't want to excessively read documentation. Only read the documentation if it's relevant to your task.

## Conditional Documentation

- README.md
  - Conditions:
    - When operating on anything under app/server
    - When operating on anything under app/client
    - When first understanding the project structure
    - When you want to learn the commands to start or stop the server or client

- app/client/src/index.css
  - Conditions:
    - When you need to make changes to the client's style

- .claude/commands/classify_adw.md
  - Conditions:
    - When adding or removing new `adws/adw_*.py` files

- adws/README.md
  - Conditions:
    - When you're operating in the `adws/` directory

- app_docs/agentic_kpis.md
  - Conditions:
    - When tracking or reporting ADW performance metrics
    - When working with agentic KPIs or workflow run statistics
    - When updating or analyzing the ADW KPIs table

- app_docs/feature-d35db10d-dashboard-fleet-overview.md
  - Conditions:
    - When working with the Dashboard page or its widget components
    - When modifying or extending `app/server/dashboard_routes.py`
    - When adding new dashboard widgets under `app/client/src/components/dashboard/`
    - When troubleshooting the `/api/dashboard` endpoint or widget data shapes

- app_docs/feature-fb641441-agents-fleet-roster-crud.md
  - Conditions:
    - When working with the Agents page (`app/client/src/pages/Agents.jsx`)
    - When modifying or extending agent CRUD routes in `app/server/gateway_routes.py`
    - When adding or changing components under `app/client/src/components/agents/`
    - When troubleshooting agent create, update, or delete operations
    - When working with real-time agent presence/online status indicators
