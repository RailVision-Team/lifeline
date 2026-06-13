from agents import get_agents
from graph import get_graph


def calculate_metrics(state, routes, decisions):

    graph = get_graph()

    total_roads = graph.number_of_edges()

    blocked_roads = len(state["blocked_roads"])

    network_health = round(
        ((total_roads - blocked_roads) / total_roads) * 100,
        1
    )

    active_agents = len([
        a for a in get_agents()
        if a["status"] in ["active", "rerouting"]
    ])

    resource_allocation = round(
        (len(decisions) / len(get_agents())) * 100,
        1
    )

    successful_routes = len([
        r for r in routes.values()
        if r != "NO_ROUTE"
    ])

    response_efficiency = round(
        (successful_routes / len(routes)) * 100,
        1
    )

    return {
        "active_agents": active_agents,
        "network_health": network_health,
        "resource_allocation": resource_allocation,
        "response_efficiency": response_efficiency
    }