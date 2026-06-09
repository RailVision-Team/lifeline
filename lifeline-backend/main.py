from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents import get_agents, update_agent_status
from state import get_state, activate_disaster, add_blocked_road, add_event

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"status": "lifeline backend running"}


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": "lifeline-backend",
        "version": "1.0"
    }


@app.get("/agents")
def get_all_agents() -> list[dict]:
    """Returns all disaster response agents."""
    return get_agents()


@app.get("/state")
def get_system_state() -> dict:
    """Returns the current system state."""
    return get_state()


@app.post("/disaster/trigger")
def trigger_disaster() -> dict:
    """
    Triggers disaster response mode.
    Activates disaster, blocks roads, updates agent statuses, and logs events.
    """
    # Activate disaster mode
    activate_disaster()
    
    # Block affected roads
    add_blocked_road("warehouse1-depot1")
    add_blocked_road("hospital1-depot2")
    
    # Log the disaster event
    add_event("Flood detected in Sector Alpha")
    
    # Update agent statuses
    # Change vehicles and supply trucks to rerouting status
    for agent in get_agents():
        if agent["type"] in ["vehicle", "supply_truck"]:
            update_agent_status(agent["id"], "rerouting")
    
    # Return current state
    state = get_state()
    return {
        "disaster_active": state["disaster_active"],
        "blocked_roads": state["blocked_roads"],
        "agents": get_agents(),
        "event_log": state["event_log"]
    }