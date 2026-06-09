from graph import get_graph

graph = get_graph()

print("Nodes:")
print(graph.nodes())

print("\nEdges:")
print(graph.edges(data=True))