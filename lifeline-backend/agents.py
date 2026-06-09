def get_agents() -> list[dict]:
    """
    Creates and returns a list of disaster response agents.
    
    Each agent represents a vehicle or resource deployed in the disaster response network.
    Agents have unique IDs, types, current locations, status, assigned missions, and capacity.
    """
    
    # List of agents for disaster response
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
            "status": "rerouting",
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
    
    return agents


if __name__ == "__main__":
    # Test the function
    all_agents = get_agents()
    for agent in all_agents:
        print(f"Agent: {agent['id']}, Type: {agent['type']}, Location: {agent['current_location']}, Status: {agent['status']}")
