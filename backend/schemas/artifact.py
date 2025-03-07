# backend/schemas/artifact.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


#  Schema for creating a new artifact (POST request)
class ArtifactCreate(BaseModel):
    workspace_id: int
    title: str
    content: str
    document_id: str
    art_type: Optional[str] = None
    dependencies: Optional[List[int]] = None


#  Schema for updating an artifact (PUT request)
class ArtifactUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    dependencies: Optional[List[int]] = None


class RollbackRequest(BaseModel):
    target_version: int

class ReIndexRequest(BaseModel):
    workspace_id: int

class ClearIndexRequest(BaseModel):
    workspace_id: int
    
#  Schema for returning artifact details (GET responses)
class ArtifactResponse(BaseModel):
    id: int
    title: str
    art_type: str
    version: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    indexed_at: Optional[datetime] = None
    content: Optional[str] = None
    workspace_id: int = None
    document_id: str
    parent_version: Optional[int] = None
    dependencies: Optional[List[int]] = None  # List of dependent artifact IDs

    class Config:
        from_attributes = True  # Allows direct conversion from ORM models


# ✅ Pagination response schema (for listing/search results)
class PaginatedResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: List[ArtifactResponse]