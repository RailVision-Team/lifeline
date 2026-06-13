from agents import get_agents
def generate_agent_decisions(priorities):
    """
    Generates autonomous agent decisions based on
    priority rankings and agent specialization.
    """

    agents = get_agents()
    decisions = []
    if not priorities:
        return decisions

    highest_priority = priorities[0]["camp"]

    second_priority = (
        priorities[1]["camp"]
        if len(priorities) > 1
        else highest_priority
    )

    for agent in agents:
        if agent["type"] == "ambulance":
            decisions.append({
                "agent": agent["id"],
                "action": f"Deploy emergency response to {highest_priority}"
            })

        elif agent["type"] == "vehicle":
            if "medicine" in agent["mission"].lower():
                decisions.append({
                    "agent": agent["id"],
                    "action": f"Deliver medicine to {highest_priority}"
                })

            else:
                decisions.append({
                    "agent": agent["id"],
                    "action": f"Deliver supplies to {second_priority}"
                })

        elif agent["type"] == "supply_truck":
            decisions.append({
                "agent": agent["id"],
                "action": f"Deliver emergency food to {highest_priority}"
            })

    return decisions