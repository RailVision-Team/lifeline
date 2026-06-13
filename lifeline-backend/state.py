# Global state variables to track disaster response status
# These are stored in memory and shared across all function calls
from datetime import datetime

disaster_active = False
blocked_roads = []
event_log = []


def activate_disaster() -> None:
    """
    Activates the disaster response mode.
    Sets disaster_active to True and logs the event.
    """
    global disaster_active
    disaster_active = True
    add_event("Disaster activated - Response mode ON")


def deactivate_disaster() -> None:
    """
    Deactivates the disaster response mode.
    Sets disaster_active to False and logs the event.
    """
    global disaster_active
    disaster_active = False
    add_event("Disaster deactivated - Response mode OFF")


def add_blocked_road(road: str) -> None:
    """
    Adds a road to the blocked roads list.
    
    Args:
        road: String representing the blocked road (e.g., "depot1-warehouse1")
    """
    if road not in blocked_roads:
        blocked_roads.append(road)
        add_event(f"Road blocked: {road}")


def add_event(message: str) -> None:
    """
    Adds an event message to the event log.
    Used for tracking all state changes and important events.
    
    Args:
        message: String describing the event
    """
    timestamp = datetime.now().strftime("%H:%M:%S")
    event_log.append(f"[{timestamp}] {message}")


def get_state() -> dict:
    """
    Returns the current state of the disaster response system.
    
    Returns:
        Dictionary containing:
        - disaster_active: True if disaster mode is on
        - blocked_roads: List of blocked roads
        - event_log: List of all events logged
        - total_events: Count of events
    """
    return {
        "disaster_active": disaster_active,
        "blocked_roads": blocked_roads,
        "event_log": event_log,
        "total_events": len(event_log)
    }

def clear_state() -> None:
    """
    Resets the entire system state.
    Useful for restarting simulations.
    """
    global disaster_active

    disaster_active = False
    blocked_roads.clear()
    event_log.clear()
