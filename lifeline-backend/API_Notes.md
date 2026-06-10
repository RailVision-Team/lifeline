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