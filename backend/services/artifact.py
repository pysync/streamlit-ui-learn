# backend/services/artifact.py

from backend.crud.artifact import create_new_artifact
from backend.rag.crud import insert_doc


def upload_artifact(document_id:str, title: str, content: str, art_type:str, dependencies:dict):
    """
    Process the uploaded document:
    - Create an artifact record (e.g., storing title and content).
    - Update the vector DB (via LlamaIndex) for retrieval.
    """
    # Create the artifact (this could be a DB insertion)
    artifact = create_new_artifact(document_id, title, content, art_type=art_type, dependencies=dependencies)
    
    print(f"Uploaded artifact: {artifact}")
    # Update the vector DB index with the document.
    insert_doc(f"{document_id}", title, content)
    
    return {"message": "Artifact uploaded successfully", "artifact": artifact}
