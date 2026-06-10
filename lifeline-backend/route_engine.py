import networkx as nx
from typing import Dict, List, Union
from graph import get_graph


def calculate_routes(blocked_roads: List[tuple]) -> Dict[str, Union[List[str], str]]:
    """
    Calculate optimal routes for disaster response deliveries while avoiding blocked roads.
    
    This function finds the shortest paths between critical locations (depots/hospitals 
    and camps) while avoiding roads that are blocked or damaged.
    
    Args:
        blocked_roads: A list of tuples representing blocked roads.
                      Each tuple should be (source_location, destination_location).
                      Example: [("camp1", "warehouse1"), ("depot1", "hospital1")]
    
    Returns:
        A dictionary containing three delivery routes:
        - "food_route": Shortest path from depot1 to camp1
        - "medicine_route": Shortest path from depot2 to camp2
        - "emergency_route": Shortest path from hospital1 to camp1
        
        If a route cannot be found, that key will contain the string "NO_ROUTE".
        
        Example return value:
        {
            "food_route": ["depot1", "warehouse1", "camp1"],
            "medicine_route": ["depot2", "warehouse2", "camp2"],
            "emergency_route": ["hospital1", "warehouse1", "camp1"]
        }
    """
    
    # Step 1: Get the original graph from graph.py
    original_graph = get_graph()
    
    # Step 2: Create a copy of the graph (don't modify the original)
    # We use deepcopy behavior through copy() which works for NetworkX graphs
    working_graph = original_graph.copy()
    
    # Step 3: Remove blocked roads from the working graph
    # We need to check both directions since the graph is undirected
    for source, destination in blocked_roads:
        # Remove the edge if it exists (edges are bidirectional in undirected graphs)
        if working_graph.has_edge(source, destination):
            working_graph.remove_edge(source, destination)
    
    # Step 4: Define the routes we need to calculate
    # Each route is defined as (source_location, destination_location, route_name)
    routes_to_calculate = [
        ("depot1", "camp1", "food_route"),
        ("depot2", "camp2", "medicine_route"),
        ("hospital1", "camp1", "emergency_route"),
    ]
    
    # Step 5: Calculate shortest paths for each route
    result = {}
    
    for source, destination, route_name in routes_to_calculate:
        try:
            # Use NetworkX's shortest_path function with edge weights (distance)
            # This finds the path that minimizes total distance
            shortest_path = nx.shortest_path(
                working_graph,
                source=source,
                target=destination,
                weight="weight"
            )
            result[route_name] = shortest_path
        except nx.NetworkXNoPath:
            # If no path exists between source and destination, mark as NO_ROUTE
            result[route_name] = "NO_ROUTE"
        except nx.NodeNotFound:
            # If a location doesn't exist in the graph, mark as NO_ROUTE
            result[route_name] = "NO_ROUTE"
    
    return result


def print_route_details(routes: Dict[str, Union[List[str], str]]) -> None:
    """
    Pretty-print the calculated routes with details.
    
    Args:
        routes: The dictionary of routes returned by calculate_routes()
    """
    print("\n=== LIFELINE DISASTER RESPONSE ROUTES ===\n")
    
    for route_name, route_path in routes.items():
        print(f"{route_name.upper()}:")
        
        if route_path == "NO_ROUTE":
            print("  ⚠️  Route unavailable - all roads blocked\n")
        else:
            print(f"  Path: {' → '.join(route_path)}\n")


if __name__ == "__main__":
    # Test section: Run with no blocked roads
    print("Test 1: All roads available")
    routes_clear = calculate_routes([])
    print_route_details(routes_clear)
    
    # Test section: Run with some blocked roads
    print("\nTest 2: With some blocked roads")
    blocked = [("depot1", "warehouse1"), ("warehouse2", "camp2")]
    routes_blocked = calculate_routes(blocked)
    print_route_details(routes_blocked)
    
    # Test section: Show raw dictionary output
    print("\nTest 3: Raw dictionary output")
    print(routes_clear)
