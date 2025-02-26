import streamlit as st
from streamlit_agraph import agraph, Node, Edge, Config

st.title("Graphviz Example")
st.text("Best for: General Graphs and Diagrams") 
# DOT language graph definition
dot_code = """
digraph G {
    rankdir=LR;
    A [label="Start"];
    B [label="Process"];
    C [label="End"];

    A -> B;
    B -> C;
}
"""

# Streamlit-Graphviz component
try:
    # Use graphviz.Source directly from graphviz
    import graphviz
    graph = graphviz.Source(dot_code)
    st.graphviz_chart(graph)  # Streamlit native function for rendering Graphviz
except ImportError:
    st.error("Graphviz is not installed. Please install it using `pip install graphviz`.")

# streamlit-agraph library usage (alternative, but generally less performant for large graphs)
try:
    nodes = []
    edges = []
    # Extract nodes and edges from the DOT code (this requires parsing)
    # **This is a simplified example.  A real implementation would need robust DOT parsing**
    for line in dot_code.splitlines():
        if "label=" in line:
            node_name = line.split(" ")[0].strip()  # Very basic node name extraction
            label = line.split("label=\"")[1].split("\"")[0]
            nodes.append(Node(id=node_name, label=label, size=15, shape="circle", color="#ADD8E6"))
        if "->" in line:
            source = line.split("->")[0].strip()
            target = line.split("->")[1].strip().replace(";", "")
            edges.append(Edge(source=source, target=target))

    config = Config(width=500,
                    height=300,
                    directed=True,
                    nodeHighlightBehavior=True,
                    highlightColor="#F7A7A6",  # Set highlight color
                    collapsible=True)


    return_value = agraph(nodes=nodes,
                           edges=edges,
                           config=config)
    st.write(return_value)


except ImportError:
    st.error("streamlit-agraph is not installed. Please install it using `pip install streamlit-agraph graphviz`.")
except Exception as e:
    st.error(f"Error rendering graph: {e}")