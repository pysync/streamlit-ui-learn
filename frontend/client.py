# frontend/client.py 

import requests
from typing import Optional, List

# Set your backend base URL here
BACKEND_URL = "http://localhost:8000"

# ---------------------------
# Workspace API Functions
# ---------------------------

def get_workspaces(page: int = 1, limit: int = 10):
    """
    List workspaces with pagination.
    """
    url = f"{BACKEND_URL}/workspaces/"
    params = {"page": page, "limit": limit}
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def create_workspace(title: str, description: str):
    """
    Create a new workspace.
    """
    url = f"{BACKEND_URL}/workspaces/"
    data = {"title": title, "description": description}
    response = requests.post(url, json=data)
    response.raise_for_status()
    return response.json()

def get_workspace(workspace_id: int):
    """
    Get a workspace by its ID.
    """
    url = f"{BACKEND_URL}/workspaces/{workspace_id}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def update_workspace(workspace_id: int, title: str, description: str):
    """
    Update a workspace.
    """
    url = f"{BACKEND_URL}/workspaces/{workspace_id}"
    data = {"title": title, "description": description}
    response = requests.put(url, json=data)
    response.raise_for_status()
    return response.json()

def delete_workspace(workspace_id: int):
    """
    Delete a workspace.
    """
    url = f"{BACKEND_URL}/workspaces/{workspace_id}"
    response = requests.delete(url)
    response.raise_for_status()
    return response.json()


# ---------------------------
# Artifact API Functions
# ---------------------------

def list_artifacts(
    workspace_id: int, 
    page: int = 1, 
    limit: int = 10, 
    art_type: Optional[str] = None,
    version: Optional[int] = None, 
    status: Optional[str] = None, 
    keyword: Optional[str] = None
):
    """
    List artifacts for a workspace with optional filters and pagination.
    """
    url = f"{BACKEND_URL}/artifacts/"
    params = {
        "workspace_id": workspace_id,
        "page": page,
        "limit": limit
    }
    if art_type is not None:
        params["art_type"] = art_type
    if version is not None:
        params["version"] = version
    if status is not None:
        params["status"] = status
    if keyword is not None:
        params["keyword"] = keyword
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def search_artifacts(
    workspace_id: int, 
    page: int = 1, 
    limit: int = 10, 
    art_type: Optional[str] = None,
    version: Optional[int] = None, 
    status: Optional[str] = None, 
    keyword: Optional[str] = None
):
    """
    Search artifacts (alias for list_artifacts).
    """
    return list_artifacts(workspace_id, page, limit, art_type, version, status, keyword)

def get_artifact_by_id(artifact_id: int):
    """
    Get an artifact by its internal ID.
    """
    url = f"{BACKEND_URL}/artifacts/{artifact_id}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def get_current_artifact(document_id: str):
    """
    Get the latest version of an artifact by document ID.
    """
    url = f"{BACKEND_URL}/artifacts/current/{document_id}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def get_artifact_versions(document_id: str):
    """
    Get all versions of an artifact by document ID.
    """
    url = f"{BACKEND_URL}/artifacts/versions/{document_id}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def create_artifact(workspace_id: int, document_id: str, title: str, content: str, art_type: str):
    """
    Create a new artifact (initial version).
    """
    url = f"{BACKEND_URL}/artifacts/"
    data = {
        "workspace_id": workspace_id,
        "document_id": document_id,
        "title": title,
        "content": content,
        "art_type": art_type
    }
    response = requests.post(url, json=data)
    response.raise_for_status()
    return response.json()

def update_artifact_version(document_id: str, title: str, content: str, dependencies: Optional[List[int]]):
    """
    Update artifact version (archive current and create new).
    """
    url = f"{BACKEND_URL}/artifacts/{document_id}/update"
    data = {"title": title, "content": content, "dependencies": dependencies}
    response = requests.put(url, json=data)
    response.raise_for_status()
    return response.json()

def rollback_artifact_version(document_id: str, target_version: int):
    """
    Rollback artifact to a previous version.
    """
    url = f"{BACKEND_URL}/artifacts/{document_id}/rollback"
    data = {"target_version": target_version}
    response = requests.post(url, json=data)
    response.raise_for_status()
    return response.json()

def delete_artifact_by_id(artifact_id: int):
    """
    Delete an artifact by its internal ID.
    """
    url = f"{BACKEND_URL}/artifacts/{artifact_id}"
    response = requests.delete(url)
    response.raise_for_status()
    return response.json()

def delete_artifacts_by_document(document_id: str, version: Optional[int] = None):
    """
    Delete artifacts by document ID (optionally specify version).
    """
    url = f"{BACKEND_URL}/artifacts/document/{document_id}"
    params = {}
    if version is not None:
        params["version"] = version
    response = requests.delete(url, params=params)
    response.raise_for_status()
    return response.json()

def upload_artifact(workspace_id: int, file_path: str):
    """
    Upload an artifact file.
    Note: Only plain text files are supported.
    """
    url = f"{BACKEND_URL}/artifacts/upload"
    params = {"workspace_id": workspace_id}
    with open(file_path, "rb") as f:
        files = {"file": (file_path, f, "text/plain")}
        response = requests.post(url, params=params, files=files)
    response.raise_for_status()
    return response.json()

# ---------------------------
# Vector DB and Reindexing API Functions
# ---------------------------

def clear_vector_store(workspace_id: int):
    """
    Clear the vector store index.
    """
    url = f"{BACKEND_URL}/artifacts/clear_index"
    data = { "workspace_id": workspace_id}
    response = requests.post(url, json=data)
    response.raise_for_status()
    return response.json()

def reindex_all(workspace_id: int):
    """
    Reindex all documents in the vector store.
    """
    url = f"{BACKEND_URL}/artifacts/reindex_all"
    data = { "workspace_id": workspace_id}
    print("post data: ", data)
    response = requests.post(url, json=data)
    response.raise_for_status()
    return response.json()


def get_reindexing_status(task_id: str):
    """
    Get the reindexing status by task ID.
    """
    url = f"{BACKEND_URL}/artifacts/reindex_status/{task_id}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def get_all_reindexing_status():
    """
    Get the status of all reindexing tasks.
    """
    url = f"{BACKEND_URL}/artifacts/reindex_status"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()
