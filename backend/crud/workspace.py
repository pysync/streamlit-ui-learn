# backend/crud/workspace.py
import datetime
from sqlmodel import select
from backend.models.workspace import Workspace
from backend.config import db_engine  # Database engine for session handling
from typing import List, Optional, Tuple
from sqlmodel import Session, func


def create_workspace(title: str, description: Optional[str] = None) -> Workspace:
    """Create a new workspace."""
    now = datetime.datetime.now().isoformat()
    workspace = Workspace(
        title=title,
        description=description,
        created_at=now,
        updated_at=now,
    )
    with Session(db_engine) as session:
        session.add(workspace)
        session.commit()
        session.refresh(workspace)
    return workspace


def get_workspace(workspace_id: int) -> Optional[Workspace]:
    """Retrieve a workspace by ID."""
    with Session(db_engine) as session:
        return session.get(Workspace, workspace_id)


def list_workspaces(limit: int = 10, page: int = 1) -> Tuple[List[Workspace], int]:
    """Retrieve a paginated list of workspaces."""
    with Session(db_engine) as session:
        total = session.exec(select(func.count()).select_from(Workspace)).one()
        
        workspaces = (
            session.exec(select(Workspace).offset((page - 1) * limit).limit(limit))
            .all()
        )
    return workspaces, total


def update_workspace(workspace_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Optional[Workspace]:
    """Update a workspace's title or description."""
    with Session(db_engine) as session:
        workspace = session.get(Workspace, workspace_id)
        if not workspace:
            raise Exception("Workspace not found.")
            
    
        if title:
            workspace.title = title
        if description:
            workspace.description = description
        workspace.updated_at = datetime.datetime.now().isoformat()
        session.add(workspace)
        session.commit()
        session.refresh(workspace)
    return workspace


def delete_workspace(workspace_id: int) -> bool:
    """Delete a workspace by ID."""
    with Session(db_engine) as session:
        workspace = session.get(Workspace, workspace_id)
        if workspace:
            session.delete(workspace)
            session.commit()
            return workspace