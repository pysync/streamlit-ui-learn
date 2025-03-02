from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, Dict, List
from sqlalchemy import Column, JSON
import datetime


class Workspace(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None

    created_at: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())
    
    # Relationship to artifacts
    artifacts: List["Artifact"] = Relationship(back_populates="workspace")
    