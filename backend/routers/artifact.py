# backend/routers/artifact.py
from fastapi import status, APIRouter, UploadFile, File, HTTPException, Query, Depends
from typing import List, Tuple, Optional
from backend.schemas.artifact import (
    ArtifactCreate,
    ArtifactUpdate,
    RollbackRequest,
    ReIndexRequest,
    ClearIndexRequest,
    ArtifactResponse,
    PaginatedResponse
)
from backend.crud.artifact import (
    create_new_artifact,
    list_artifacts,
    search_artifacts,
    get_artifact_by_internal_id,
    get_current_artifact,
    get_artifact_versions,
    update_artifact_version,
    set_artifact_meta,
    rollback_artifact_version,
    delete_artifact_by_id,
    delete_artifacts_by_document,
)
from backend.crud.index import (
    clear_index, 
    reindex_all_documents, 
    get_reindexing_status
)

router = APIRouter(prefix="/artifacts", tags=["Artifacts"])

# -----------------------------------------------------------------------------
# List artifacts with pagination and optional filters
# -----------------------------------------------------------------------------
@router.get("/", response_model=PaginatedResponse)
def api_list_artifacts(
    workspace_id: int,  # Added required workspace_id query parameter
    limit: int = Query(10, gt=0),
    page: int = Query(1, gt=0),
    art_type: Optional[str] = None,
    version: Optional[int] = None,
    status: Optional[str] = None,
    keyword: Optional[str] = None,
):
    if art_type or version or status or keyword:
        artifacts, total = search_artifacts(
            workspace_id=workspace_id, 
            art_type=art_type, 
            version=version, 
            status=status, 
            keyword=keyword
        )
    else:
        artifacts, total = list_artifacts(workspace_id=workspace_id, page=page, limit=limit)

    return PaginatedResponse(
        total=total,
        page=page,
        limit=limit,
        items=artifacts
    )

# -----------------------------------------------------------------------------
# saerch artifacts with pagination and optional filters - alias for list_artifacts
# -----------------------------------------------------------------------------
@router.get("/search", response_model=PaginatedResponse)
def api_search_artifacts(
    workspace_id: int,
    limit: int = Query(10, gt=0),
    page: int = Query(1, gt=0),
    art_type: Optional[str] = None,
    version: Optional[int] = None,
    status: Optional[str] = None,
    keyword: Optional[str] = None,
):
    return api_list_artifacts(workspace_id, limit, page, art_type, version, status, keyword)
    
# -----------------------------------------------------------------------------
# Get artifact by its internal ID
# -----------------------------------------------------------------------------
@router.get("/{artifact_id}", response_model=ArtifactResponse)
def api_get_artifact_by_id(artifact_id: int):
    artifact = get_artifact_by_internal_id(artifact_id)
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")
    return artifact

# -----------------------------------------------------------------------------
# Get the latest version of an artifact by document_id
# -----------------------------------------------------------------------------
@router.get("/current/{document_id}", response_model=ArtifactResponse)
def api_get_current_artifact(document_id: str):
    artifact = get_current_artifact(document_id)
    if not artifact:
        raise HTTPException(status_code=404, detail="Current artifact not found")
    return artifact

# -----------------------------------------------------------------------------
# Get all versions of an artifact by document_id
# -----------------------------------------------------------------------------
@router.get("/versions/{document_id}", response_model=List[ArtifactResponse])
def api_get_artifact_versions(document_id: str):
    artifacts = get_artifact_versions(document_id)
    if not artifacts:
        raise HTTPException(status_code=404, detail="No artifact versions found")
    return artifacts

# -----------------------------------------------------------------------------
# Create a new artifact (initial version)
# -----------------------------------------------------------------------------
@router.post("/", response_model=ArtifactResponse,  status_code=status.HTTP_201_CREATED)
def api_create_artifact(artifact_data: ArtifactCreate):
    artifact = create_new_artifact(
        workspace_id=artifact_data.workspace_id,
        document_id=artifact_data.document_id,
        title=artifact_data.title,
        content=artifact_data.content,
        art_type=artifact_data.art_type,
        dependencies=artifact_data.dependencies
    )
    return artifact

# -----------------------------------------------------------------------------
# Update artifact version: Archive current version and create a new version
# -----------------------------------------------------------------------------
@router.put("/{document_id}/update", response_model=ArtifactResponse, status_code=status.HTTP_200_OK)
def api_update_artifact_version(document_id: str, update_data: ArtifactUpdate):
    artifact = update_artifact_version(
        document_id,
        update_data.title,
        update_data.content,
        update_data.dependencies,
    )
        
    return artifact

# -----------------------------------------------------------------------------
# Set artifact meta data : without archive current version and and create a new version
# -----------------------------------------------------------------------------
@router.put("/{document_id}/setmeta", response_model=ArtifactResponse, status_code=status.HTTP_200_OK)
def api_set_artifact_meta(document_id: str, update_data: ArtifactUpdate):
    artifact = set_artifact_meta(
        document_id,
        update_data.title,
        update_data.content,
        update_data.dependencies
    )
        
    return artifact

# -----------------------------------------------------------------------------
# Rollback artifact to a previous version
# -----------------------------------------------------------------------------
@router.post("/{document_id}/rollback", response_model=ArtifactResponse)
def api_rollback_artifact_version(document_id: str, rollback_data: RollbackRequest):
    try:
        artifact = rollback_artifact_version(document_id, rollback_data.target_version)
        return artifact
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
# -----------------------------------------------------------------------------
# Delete an artifact by its internal ID
# -----------------------------------------------------------------------------
@router.delete("/{artifact_id}", status_code=status.HTTP_204_NO_CONTENT)
def api_delete_artifact_by_id(artifact_id: int):
    success = delete_artifact_by_id(artifact_id)
    if not success:
        raise HTTPException(status_code=404, detail="Artifact not found")
    return {"message": "Artifact deleted successfully"}

# -----------------------------------------------------------------------------
# Delete artifacts by document_id (optionally specify a version)
# -----------------------------------------------------------------------------
@router.delete("/document/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def api_delete_artifacts_by_document(document_id: str, version: Optional[int] = Query(None)):
    count = delete_artifacts_by_document(document_id, version=version)
    if count == 0:
        raise HTTPException(status_code=404, detail="No artifacts found for deletion")
    return {"message": f"Deleted {count} artifact(s)"}

# -----------------------------------------------------------------------------
# Upload an artifact file
# -----------------------------------------------------------------------------
@router.post("/upload", response_model=ArtifactResponse, status_code=status.HTTP_201_CREATED)
async def api_upload_artifact(workspace_id: int, file: UploadFile = File(...)):
    """
    Uploads a plain text file as an artifact.

    Args:
    - workspace_id: The workspace ID to associate the artifact with.
    - file: The file to be uploaded.

    Returns:
    - The created artifact details.
    """
    # Validate file content type
    if file.content_type != "text/plain":
        raise HTTPException(status_code=400, detail="Only plain text files are supported.")

    # Read the file content
    content_bytes = await file.read()
    try:
        text = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Error decoding file. Ensure it is UTF-8 encoded.")

    # Use the file's name as the document_id
    document_id = file.filename

    # Create the artifact using the workspace_id
    artifact = create_new_artifact(workspace_id, document_id, file.filename, text)
    return artifact

# for vector db store management
@router.post("/artifacts/clear_index")
async def clear_vector_store(data: ClearIndexRequest):
    """
    API to clear the vector store index (ChromaDB).
    """
    result = clear_index(data.workspace_id)
    return result


@router.post("/", response_model=ArtifactResponse,  status_code=status.HTTP_201_CREATED)
def api_create_artifact(artifact_data: ArtifactCreate):
    artifact = create_new_artifact(
        workspace_id=artifact_data.workspace_id,
        document_id=artifact_data.document_id,
        title=artifact_data.title,
        content=artifact_data.content,
        art_type=artifact_data.art_type
    )
    return artifact


@router.post("/reindex_all", status_code=status.HTTP_201_CREATED)
def reindex_all(data: ReIndexRequest):
    """
    API to reindex all documents in the vector store. Returns task ID for status tracking.
    """
    try:
        result = reindex_all_documents(data.workspace_id)
        return {"message": f"indexing.."}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Reindex Failed.")

@router.get("/reindex_status/{task_id}")
def get_status(task_id: str):
    """
    API to get the status of reindexing by task ID.
    """
    result = get_reindexing_status(task_id)
    if result == {"status": "not found"}:
        raise HTTPException(status_code=404, detail="Task ID not found.")
    return result

@router.get("/reindex_status")
def get_all_status():
    """
    API to get the status of all reindexing tasks.
    """
    return get_reindexing_status()