from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents import get_agents, update_agent_status
from state import get_state, activate_disaster, add_blocked_road, add_event, clear_state
from graph import get_graph
from route_engine import calculate_routes
from allocation_engine import calculate_priorities
from decision_engine import generate_agent_decisions
from metrics_engine import calculate_metrics

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
def trigger_disaster(disaster_type: str = "flood") -> dict:
    """
    Triggers disaster response mode with a specific disaster type.
    
    Args:
        disaster_type: Type of disaster - "flood", "bridge_collapse", or "supply_chain_disruption"
    
    Activates disaster, blocks roads based on type, calculates alternate routes, 
    updates agent statuses, and logs events.
    """
    # Check if a disaster is already active
    state = get_state()
    if state["disaster_active"]:
        # Disaster already active - return early without running logic again
        return {
            "message": "Disaster already active",
            "disaster_active": True
        }
    
    # Define roads blocked for each disaster type
    # Each disaster has different impact on the road network
    disaster_roads = {
        "flood": {
            "roads": ["warehouse1-depot1", "hospital1-depot2"],
            "tuples": [("warehouse1", "depot1"), ("hospital1", "depot2")],
            "event": "Flood detected in Sector Alpha"
        },
        "bridge_collapse": {
            "roads": ["camp1-command_center", "warehouse1-command_center"],
            "tuples": [("camp1", "command_center"), ("warehouse1", "command_center")],
            "event": "Bridge collapse reported near Command Center"
        },
        "supply_chain_disruption": {
            "roads": ["warehouse1-warehouse2", "warehouse2-hospital1"],
            "tuples": [("warehouse1", "warehouse2"), ("warehouse2", "hospital1")],
            "event": "Supply chain disruption detected - warehouse network affected"
        }
    }
    
    # Get disaster configuration, default to flood if invalid type provided
    if disaster_type not in disaster_roads:
        disaster_type = "flood"
    
    disaster_config = disaster_roads[disaster_type]
    
    # Activate disaster mode
    activate_disaster()
    
    # Block affected roads based on disaster type
    for road in disaster_config["roads"]:
        add_blocked_road(road)
    
    # Get the list of blocked roads as tuples for route calculation
    blocked_roads_list = disaster_config["tuples"]
    
    # Log the disaster event from dispatch center
    add_event(f"DISPATCH: {disaster_config['event']}")
    
    # Calculate alternative routes avoiding blocked roads
    routes = calculate_routes(blocked_roads_list)
    priorities = calculate_priorities()

    decisions = generate_agent_decisions(priorities)

    for decision in decisions:
        add_event(
            f"[AUTO-AGENT] {decision['agent']} -> {decision['action']}"
        )
    
    # Add agent-style event log messages describing route decisions
    # Each agent reports their status and actions
    
    # Food delivery vehicle reports
    if routes["food_route"] != "NO_ROUTE":
        intermediate_stop = routes["food_route"][1]
        add_event(f"AGENT-V1: Primary food delivery route blocked. Alternate route selected via {intermediate_stop}.")
    else:
        add_event("⚠️ AGENT-V1: All food delivery routes unavailable - network isolated")
    
    # Medicine convoy vehicle reports
    if routes["medicine_route"] != "NO_ROUTE":
        intermediate_stop = routes["medicine_route"][1]
        add_event(f"AGENT-V2: Medicine convoy rerouted through {intermediate_stop} after road closure.")
    else:
        add_event("⚠️ AGENT-V2: All medicine delivery routes unavailable - network isolated")
    
    # Ambulance reports with ETA
    if routes["emergency_route"] != "NO_ROUTE":
        intermediate_stop = routes["emergency_route"][1]
        add_event(f"AMB-1: Emergency response route recalculated. New path via {intermediate_stop}. Proceeding to destination.")
    else:
        add_event("⚠️ AMB-1: Emergency response blocked - all routes unavailable. Awaiting network recovery.")
    
    # Update agent statuses
    # Change vehicles and supply trucks to rerouting status
    for agent in get_agents():
        if agent["type"] in ["vehicle", "supply_truck"]:
            update_agent_status(agent["id"], "rerouting")
    
    # Return current state with routes and disaster type included
    state = get_state()
    metrics = calculate_metrics(
        get_state(),
        routes,
        decisions
    )
    return {
        "disaster_active": state["disaster_active"],
        "disaster_type": disaster_type,
        "blocked_roads": state["blocked_roads"],
        "agents": get_agents(),
        "routes": routes,
        "decisions": decisions,
        "metrics": metrics,
        "event_log": state["event_log"]
    }


@app.post("/simulation/reset")
def reset_simulation() -> dict:
    """
    Resets the entire simulation to its initial state.
    Clears disaster mode, blocked roads, events, and resets all agents to active.
    """
    # Reset all state variables (disaster_active, blocked_roads, event_log)
    clear_state()
    
    # Reset all agents back to status="active"
    for agent in get_agents():
        update_agent_status(agent["id"], "active")
    
    # Return success message
    return {
        "message": "Simulation reset successfully"
    }


@app.get("/simulation/status")
def get_simulation_status() -> dict:
    """
    Returns the complete simulation status.
    Includes graph topology, agents, disaster state, resource priorities, and metrics.
    """
    # Get the network graph
    graph = get_graph()
    
    # Extract nodes and edges from graph
    graph_nodes = list(graph.nodes())
    graph_edges = list(graph.edges(data=True))
    
    # Get current state
    state = get_state()
    
    # Get all agents for metrics calculation
    all_agents = get_agents()
    
    # Calculate resource allocation priorities for camps
    priorities = calculate_priorities()
    
    # Calculate metrics
    # Count total agents
    total_agents = len(all_agents)
    
    # Count agents by status
    active_agents = sum(1 for agent in all_agents if agent["status"] == "active")
    rerouting_agents = sum(1 for agent in all_agents if agent["status"] == "rerouting")
    
    # Count blocked roads
    blocked_roads_count = len(state["blocked_roads"])
    
    # Build metrics dictionary
    metrics = {
        "total_agents": total_agents,
        "active_agents": active_agents,
        "rerouting_agents": rerouting_agents,
        "blocked_roads": blocked_roads_count,
        "disaster_active": state["disaster_active"]
    }
    
    # Return complete simulation status
    return {
        "graph": {
            "nodes": graph_nodes,
            "edges": graph_edges
        },
        "agents": all_agents,
        "disaster": {
            "active": state["disaster_active"],
            "blocked_roads": state["blocked_roads"]
        },
        "event_log": state["event_log"],
        "priorities": priorities,
        "metrics": metrics
    }

@app.post("/hardware/alert")
def hardware_alert(message: str = "FLOOD WARNING"):

    add_event(f"[HARDWARE] Speaker Alert Broadcasted: {message}")

    return {
        "status": "alert_sent",
        "message": message
    }