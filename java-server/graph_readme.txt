Overview of data model:
Graphs consist of two generic classes, each of which has two inherited classes:
-Node
	-Graph
	-ServiceNode
-Edge
	-ConstEdge
	-RealEdge
Nodes contain a set of Edges. Graphs hold a set of Nodes. ServiceNodes refer to web services. RealEdges connect Nodes to other nodes. ConstEdges allow the user to add constant inputs.

Testing:
edu.csula.directstem.util.TestGraphs runs a simple test of the system: 
-Reads an example web service graph from ex.JSON (lines 24-45)
-tests converting it back into JSON (line 46)
-tests its output (line 47)

JSON format:
ex.json is written to be somewhat self-documenting, and the structure is very close to the Java class structure.