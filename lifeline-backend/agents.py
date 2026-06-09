# Global list of disaster response agents
# Each agent is a dictionary with properties for tracking and routing
agents = [
    {
        "id": "vehicle_1",
        "type": "vehicle",
        "current_location": "depot1",
        "status": "active",
        "mission": "deliver food",
        "capacity": 100  # kg
    },
    {
        "id": "vehicle_2",
        "type": "vehicle",
        "current_location": "depot2",
        "status": "active",
        "mission": "deliver medicine",
        "capacity": 50  # kg
    },
    {
        "id": "ambulance_1",
        "type": "ambulance",
        "current_location": "hospital1",
        "status": "active",
        "mission": "emergency response",
        "capacity": 4  # patients
    },
    {
        "id": "supply_truck_1",
        "type": "supply_truck",
        "current_location": "command_center",
        "status": "active",
        "mission": "deliver food",
        "capacity": 200  # kg
    }
]


def get_agents() -> list[dict]:
    """
    Returns the list of disaster response agents.
    Each agent represents a vehicle or resource deployed in the disaster response network.
    """
    return agents


def update_agent_status(agent_id: str, new_status: str) -> bool:
    """
    Updates the status of an agent by its ID.
    
    Args:
        agent_id: The ID of the agent to update
        new_status: The new status value (e.g., "active", "rerouting", "blocked")
    
    Returns:
        True if agent was found and updated, False otherwise
    """
    for agent in agents:
        if agent["id"] == agent_id:
            agent["status"] = new_status
            return True
    return False


def update_agent_mission(agent_id: str, new_mission: str) -> bool:
    """
    Updates the mission of an agent by its ID.
    
    Args:
        agent_id: The ID of the agent to update
        new_mission: The new mission (e.g., "deliver medicine", "emergency response")
    
    Returns:
        True if agent was found and updated, False otherwise
    """
    for agent in agents:
        if agent["id"] == agent_id:
            agent["mission"] = new_mission
            return True
    return False
