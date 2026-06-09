import networkx as nx


def get_graph() -> nx.Graph:
    """
    Creates and returns a NetworkX graph for the Lifeline disaster response network.
    
    Nodes represent locations (camps, warehouses, hospitals, depots, command center).
    Edges represent roads with weights indicating distance between locations.
    """
    
    # Create an empty undirected graph
    graph = nx.Graph()
    
    # Add all locations as nodes
    locations = ["camp1", "camp2", "warehouse1", "warehouse2", "hospital1", "depot1", "depot2", "command_center"]
    graph.add_nodes_from(locations)
    
    # Add weighted edges (roads) connecting locations
    # Format: (source, destination, weight_in_km)
    roads = [
        ("command_center", "camp1", 5),
        ("command_center", "camp2", 8),
        ("command_center", "warehouse1", 3),
        ("command_center", "hospital1", 4),
        ("camp1", "warehouse1", 6),
        ("camp1", "depot1", 7),
        ("camp2", "warehouse2", 5),
        ("camp2", "depot2", 9),
        ("warehouse1", "hospital1", 2),
        ("warehouse2", "hospital1", 4),
        ("depot1", "camp1", 7),
        ("depot2", "camp2", 9),
        ("warehouse1", "warehouse2", 10),
    ]
    graph.add_weighted_edges_from(roads)
    
    return graph


if __name__ == "__main__":
    # Test the function
    g = get_graph()
    print(f"Nodes: {list(g.nodes())}")
    print(f"Number of edges: {g.number_of_edges()}")
