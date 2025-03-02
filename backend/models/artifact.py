# backend/models/artifact.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, Dict
from sqlalchemy import Column, JSON
import datetime

class Artifact(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    document_id: str = Field(index=True)  # external identifier for a document
    art_type: str = Field(default="doc")  # type of artifact; default is "doc"
    title: str
    content: str
    version: int = Field(default=1)  # version number (starts at 1)
    parent_version: Optional[int] = None  # previous version number (if any)
    status: str = Field(default="current")  # "current" or "archived"
    dependencies: Optional[Dict] = Field(
        default=None, sa_column=Column(JSON, nullable=True)
    )
    created_at: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())

    # Optional reference to workspace
    workspace_id: Optional[int] = Field(default=None, foreign_key="workspace.id")
    workspace: Optional['Workspace'] = Relationship(back_populates="artifacts")