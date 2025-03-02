# backend/routers/workspace.py
from fastapi import status, APIRouter, HTTPException
from backend.schemas.workspace import (
    WorkspaceCreate,
    WorkspaceUpdate,
    WorkspaceResponse,
    PaginatedResponse,
)
from backend.crud.workspace import (
    create_workspace,
    get_workspace,
    list_workspaces,
    update_workspace,
    delete_workspace,
)

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.post("/", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
def create_workspace_route(workspace_data: WorkspaceCreate):
    """API endpoint to create a new workspace."""
    workspace = create_workspace(title=workspace_data.title, description=workspace_data.description)
    return workspace


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace_route(workspace_id: int):
    """API endpoint to retrieve a workspace by ID."""
    workspace = get_workspace(workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.get("/", response_model=PaginatedResponse)
def list_workspaces_route(page: int = 1, limit: int = 10):
    """API endpoint to list all workspaces with pagination."""
    workspaces, total = list_workspaces(limit=limit, page=page)
    return PaginatedResponse(total=total, page=page, limit=limit, items=workspaces)


@router.put("/{workspace_id}", response_model=WorkspaceResponse)
def update_workspace_route(workspace_id: int, workspace_data: WorkspaceUpdate):
    """API endpoint to update a workspace."""
    workspace = update_workspace(
        workspace_id=workspace_id, title=workspace_data.title, description=workspace_data.description
    )
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workspace_route(workspace_id: int):
    """API endpoint to delete a workspace."""
    if not delete_workspace(workspace_id):
        raise HTTPException(status_code=404, detail="Workspace not found")
    return {"message": "Workspace deleted successfully"}
