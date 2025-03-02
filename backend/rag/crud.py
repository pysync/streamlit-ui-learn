# backend/rag/crud.py
from llama_index.core import Document
from backend.rag.index import vector_index, reset

def clear_index(workspace_id: int):
    """
    Clears the entire vector store (Chroma DB).
    """
    reset()
    
def insert_doc(workspace_id: int, document_id: str, title: str, content: str):
    """
    Insert a new document into the vector index.
    """
    doc = Document(text=content, metadata={"title": title, "workspace_id": workspace_id}, id_=document_id)
    vector_index.insert(doc)

def delete_doc(document_id: str):
    """
    Delete a document from the vector index.
    """
    vector_index.delete(document_id)
    
def update_doc(workspace_id: int, document_id: str, title: str, content: str):
    """
    Update an existing document in the vector index.
    """
    doc = Document(text=content, metadata={"title": title, "workspace_id": workspace_id}, id_=document_id)
    vector_index.update(doc)
