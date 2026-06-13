from agents import get_agents


def generate_agent_decisions(priorities):
    """
    Assigns agents based on camp priorities.

    Higher priority camps receive emergency resources first.
    """

    agents = get_agents()

    decisions = []

    if not priorities:
        return decisions

    highest_priority_camp = priorities[0]["camp"]

    for agent in agents:

        if agent["type"] == "ambulance":
            decisions.append({
                "agent": agent["id"],
                "action": f"Deploy to {highest_priority_camp}"
            })

        elif agent["type"] == "vehicle":
            decisions.append({
                "agent": agent["id"],
                "action": f"Deliver supplies to {highest_priority_camp}"
            })

        elif agent["type"] == "supply_truck":
            decisions.append({
                "agent": agent["id"],
                "action": f"Deliver emergency food to {highest_priority_camp}"
            })

    return decisions