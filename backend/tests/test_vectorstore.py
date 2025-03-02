from backend.vectorstore.update import update_index
from backend.vectorstore.index import vector_index, get_all_documents
from backend.vectorstore.query_engine import query_engine

def test_update_index():
    title = "Test Document"
    content = "This is a test document for indexing."
    
    # Insert the document into the vector store.
    ret = update_index(title, content)
    assert ret != None
    


def test_update_index_and_query():
    # Insert a document into the vector index
    title = "Test Document"
    content = "This is a test document for indexing."
    update_index(title, content)
    
    # Build the query engine and run a query.
    response = query_engine.query("What is this test document about?")

    # Check that we got some response text (the exact response depends on your LLM/embedding behavior)
    assert response != None