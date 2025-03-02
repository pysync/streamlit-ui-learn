import datetime
import json
import pytest
from typing import Dict

from backend.crud.artifact import (
    insert_artifact_version,
    create_new_artifact,
    list_artifacts,
)

from backend.crud.index import (
    reindex_all_documents,
)

from sqlmodel import Session, delete, select

from backend.models.artifact import Artifact
from backend.config import db_engine
from backend.config import init_db
from backend.rag.crud import insert_doc
from backend.rag.index import chroma_collection, vector_index, reset
from backend.crud.workspace import create_workspace 

init_db()



# Fixture to clear the artifacts table before each test.
@pytest.fixture(autouse=True)
def clear_artifacts_table():
    with Session(db_engine) as session:
        session.exec(delete(Artifact))
        session.commit()

# Fixture to clear data in vector index
@pytest.fixture(autouse=True)
def clear_artifacts_index():
    reset()

# Fixture to create a workspace before tests
@pytest.fixture
def workspace():
    # Creating a workspace for each test
    item = create_workspace(title="Test Workspace")
    return item # object.
 
# Helper function to insert an artifact and index it in the vector store.
def insert_and_index_artifact(workspace_id: int, doc_id: str, title: str, content: str):
    # Create and insert the artifact
    create_new_artifact(workspace_id, doc_id, title, content)
    
    # Insert the document into the vector store (chroma collection)
    insert_doc(workspace_id, doc_id, title, content)

# Test case to verify that documents are indexed properly in the vector store
def test_index_artifact_in_vector_store(workspace):
    doc_id = "doc5"
    title = "Test Document 5"
    content = "This is a test document for indexing in vector store"

    # Insert and index the artifact
    insert_and_index_artifact(workspace.id, doc_id, title, content)

    # Query the vector store to check if the document is indexed
    ret = chroma_collection.get(limit=1)

    # Check if the document ID is in the indexed results
    assert doc_id in [meta['document_id'] for meta in ret['metadatas']]
    assert title in [meta['title'] for meta in ret['metadatas']]
    

    # Optionally, print the return value for debugging
    print(ret)

# Test case to check that artifacts are properly listed
def test_list_artifacts(workspace):
    create_new_artifact(workspace.id, "doc3", "Title 3", "Content 3")
    create_new_artifact(workspace.id, "doc4", "Title 4", "Content 4")
    artifacts, total = list_artifacts(workspace_id=workspace.id, limit=10, page=1)
    assert len(artifacts) >= 2

# Test case to check if artifact is indexed after it's created
def test_reindex_all_artifacts(workspace):
    data = [{
        "doc_id": f"doc{i}",
        "title": f"Title {i}",
        "content": f"Content {i}"
    } for i in range(10)]
    
    # Create a new artifact
    for item in data:
        create_new_artifact(workspace.id, item["doc_id"], item["title"], item["content"])
    
    artifacts, total = list_artifacts(workspace_id=workspace.id, limit=-1)
    assert len(artifacts) == 10
    
    # Reindex
    reindex_all_documents(workspace_id)

    # Query the vector store and check the document
    ret = chroma_collection.get()

    # Assert if the all document is indexed
    assert len(ret['metadatas']) == 10


# Test case to check if full indexes
