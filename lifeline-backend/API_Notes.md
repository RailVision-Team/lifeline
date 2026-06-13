# Backend API Notes

## GET /simulation/status

Returns:

- graph nodes
- graph edges
- agents
- routes
- priorities
- disaster state
- event log

## POST /disaster/trigger

Activates disaster simulation.

Effects:
- blocks roads
- recalculates routes
- recalculates priorities
- updates agent status
- generates event log entries

Response:
- routes
- priorities
- updated state

Backend Complete (Jun 10)

Endpoints:
- /health
- /agents
- /state
- /simulation/status
- /disaster/trigger

Features:
- Graph engine
- Route engine
- Priority allocation
- Disaster state management
- Event logging
- Metrics generation

# Hardware ESP32 GPO PINS CONNECTIONS to LEDs
GPIO18 = GREEN_STATUS
GPIO19 = YELLOW_DISASTER
GPIO21 = RED_CRITICAL
GPIO22 = BLUE_CONNECTED