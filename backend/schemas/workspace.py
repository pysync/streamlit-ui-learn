# backend/schemas/workspace.py
from pydantic import BaseModel
from typing import Optional, List
import datetime


class WorkspaceCreate(BaseModel):
    title: str
    description: Optional[str] = None


class WorkspaceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class WorkspaceResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: List[WorkspaceResponse]
