import networkx as nx
from typing import List, Dict, Union
from graph import get_graph


def calculate_priorities(source_location: str = "command_center") -> List[Dict[str, Union[str, float]]]:
    """
    Calculates priority scores for resource allocation to camps.
    
    Priority is based on camp demand and distance from source location.
    Higher priority means the camp needs more urgent attention.
    
    Priority Score Formula:
        priority_score = camp_demand / distance_from_source
    
    Args:
        source_location: Starting location to measure distances from (default: "command_center")
                        Other options: "depot1", "depot2", "warehouse1", "warehouse2"
    
    Returns:
        A list of camps sorted by priority score (highest priority first).
        Each camp has:
        - "camp": name of the camp
        - "priority_score": calculated priority value
        
        Example:
        [
            {"camp": "camp1", "priority_score": 18.0},
            {"camp": "camp2", "priority_score": 7.5}
        ]
    """
    
    # Define camp demand values
    # These represent the number of supplies needed at each camp
    camp_demands = {
        "camp1": 90,
        "camp2": 60
    }
    
    # Get the network graph
    graph = get_graph()
    
    # List to store camps with their priority scores
    camps_with_priority = []
    
    # Calculate priority score for each camp
    for camp_name, demand in camp_demands.items():
        try:
            # Calculate shortest path length (distance) from source to camp
            # NetworkX shortest_path_length returns the sum of edge weights
            distance = nx.shortest_path_length(
                graph,
                source=source_location,
                target=camp_name,
                weight="weight"
            )
            
            # Calculate priority score
            # Higher demand and shorter distance = higher priority
            priority_score = demand / distance
            
            # Add to results
            camps_with_priority.append({
                "camp": camp_name,
                "priority_score": priority_score
            })
        
        except nx.NetworkXNoPath:
            # If no path exists, set priority to 0 (lowest priority)
            camps_with_priority.append({
                "camp": camp_name,
                "priority_score": 0.0
            })
        
        except nx.NodeNotFound:
            # If source or camp location doesn't exist in graph
            camps_with_priority.append({
                "camp": camp_name,
                "priority_score": 0.0
            })
    
    # Sort by priority score in descending order (highest priority first)
    camps_with_priority.sort(key=lambda x: x["priority_score"], reverse=True)
    
    return camps_with_priority


if __name__ == "__main__":
    # Test section: Calculate priorities from command center
    print("Test 1: Priorities from Command Center")
    priorities = calculate_priorities()
    for camp in priorities:
        print(f"  {camp['camp']}: priority score = {camp['priority_score']:.2f}")
    
    # Test section: Calculate priorities from depot1
    print("\nTest 2: Priorities from Depot 1")
    priorities_depot = calculate_priorities(source_location="depot1")
    for camp in priorities_depot:
        print(f"  {camp['camp']}: priority score = {camp['priority_score']:.2f}")
    
    # Test section: Show full output format
    print("\nTest 3: Full JSON-like output")
    print(calculate_priorities())
