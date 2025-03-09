# backend/crud/artifact.py
import datetime
from sqlmodel import Session, select, desc
from backend.models.artifact import Artifact
from backend.config import db_engine  # Clear name for the database engine
from typing import List, Optional, Dict, Tuple
from sqlmodel import Session, select, func
from backend.models.artifact import Artifact
from backend.config import db_engine
import datetime

def insert_artifact_version(
    workspace_id: int,
    document_id: str,
    art_type: str,
    title: str,
    content: str,
    version: int,
    parent_version: Optional[int],
    references: Optional[Dict],
    status: str
) -> Artifact:
    now = datetime.datetime.now().isoformat()
    artifact = Artifact(
        workspace_id=workspace_id,
        document_id=document_id,
        art_type=art_type,
        title=title,
        content=content,
        version=version,
        parent_version=parent_version,
        references=references,
        status=status,
        created_at=now,
        updated_at=now,
    )
    with Session(db_engine) as session:
        session.add(artifact)
        session.commit()
        session.refresh(artifact)
    return artifact

def create_new_artifact(
    workspace_id: int,
    document_id: str,
    title: str,
    content: str,
    art_type: str = "doc",
    references: Optional[Dict] = None
) -> Artifact:
    """
    Creates a new document (artifact) with version 1.
    """
    return insert_artifact_version(
        workspace_id=workspace_id,
        document_id=document_id,
        art_type=art_type,
        title=title,
        content=content,
        version=1,
        parent_version=None,
        references=references,
        status="current"
    )

def list_artifacts(workspace_id: int, limit: int = 10, page: int = 1) -> Tuple[List[Artifact], int]:
    with Session(db_engine) as session:
        if limit == -1:
            # Return full list if limit is -1
            statement = select(Artifact).where(Artifact.workspace_id == workspace_id)
            artifacts = session.exec(statement).all()
            return artifacts, len(artifacts)  # Count using len() on the list
        else:
            # Calculate offset page and limit
            offset = (page - 1) * limit
            statement = select(Artifact).\
                where(Artifact.workspace_id == workspace_id)\
                .order_by(desc(Artifact.updated_at))\
                .limit(limit)\
                .offset(offset)
            artifacts = session.exec(statement).all()
            total_statement = select(Artifact).where(Artifact.workspace_id == workspace_id)
            total_count = len(session.exec(total_statement).all())  # Count total artifacts
            return artifacts, total_count

def search_artifacts(
    workspace_id: int, 
    art_type: Optional[str] = None,
    version: Optional[int] = None,
    status: Optional[str] = None,
    keyword: Optional[str] = None
) -> Tuple[List[Artifact], int]:
    with Session(db_engine) as session:
        query = select(Artifact).where(Artifact.workspace_id == workspace_id)  # Filter by workspace_id
        if art_type:
            query = query.where(Artifact.art_type == art_type)
        if version:
            query = query.where(Artifact.version == version)
        if status:
            query = query.where(Artifact.status == status)
        if keyword:
            query = query.where(Artifact.title.contains(keyword) | Artifact.content.contains(keyword))
        
        query = query.order_by(desc(Artifact.updated_at))
        artifacts = session.exec(query).all()
        
        total = len(artifacts)
    return artifacts, total
    
def get_artifact_by_internal_id(artifact_id: int) -> Optional[Artifact]:
    with Session(db_engine) as session:
        return session.get(Artifact, artifact_id)

def get_current_artifact(document_id: str) -> Optional[Artifact]:
    """
    Retrieves the current (latest) artifact version for the given document_id.
    """
    with Session(db_engine) as session:
        statement = select(Artifact).where(
            Artifact.document_id == document_id,
            Artifact.status == "current"
        ).order_by(Artifact.version.desc())
        return session.exec(statement).first()

def get_artifact_versions(document_id: str) -> List[Artifact]:
    with Session(db_engine) as session:
        statement = select(Artifact).where(
            Artifact.document_id == document_id
        ).order_by(Artifact.version.desc())
        return session.exec(statement).all()

def update_artifact_version(
    document_id: str,
    new_title: str,
    new_content: str,
    new_art_type: str,
    new_references: Optional[Dict] = None
) -> Artifact:
    """
    Archives the current version of the document (by document_id) and creates a new version with updated content.
    """
    # Fetch the current artifact based on document_id.
    current = get_current_artifact(document_id)
    if not current:
        raise Exception("Artifact not found.")

    current_version = current.version
    new_version = current_version + 1

    # Archive the current version
    with Session(db_engine) as session:
        artifact = session.get(Artifact, current.id)
        if artifact:
            # Mark the current artifact as archived and update the timestamp
            artifact.status = "archived"
            artifact.updated_at = datetime.datetime.now()  # Set to current datetime
            session.add(artifact)
            session.commit()  # Commit the archive update

    # Use the same artifact workspace_id as the current version
    workspace_id = current.workspace_id
    
    # if new_art_type is provided, use it, otherwise use the current art_type
    art_type = new_art_type if new_art_type else current.art_type
    
    # If no new references are provided, keep the current ones
    references = new_references if new_references else current.references

    # If no new title is provided, keep the current title
    title = new_title if new_title else current.title

    # If no new content is provided, keep the current content
    content = new_content if new_content else current.content

    # Insert the new version of the artifact
    return insert_artifact_version(
        workspace_id=workspace_id,
        document_id=document_id,
        art_type=art_type,
        title=title,
        content=content,
        version=new_version,
        parent_version=current_version,
        references=references,
        status="current"
    )

def rollback_artifact_version(document_id: str, target_version: int) -> Artifact:
    """
    Rolls back the document to a target version by archiving the current version and re-creating the target version as the new current version.
    """
    # Fetch target artifact by document_id and target_version
    with Session(db_engine) as session:
        statement = select(Artifact).where(
            Artifact.document_id == document_id,
            Artifact.version == target_version
        )
        target = session.exec(statement).first()
        
    if not target:
        raise Exception(f"Target version {target_version} not found for document {document_id}.")
    
    # Get current version of the artifact
    current = get_current_artifact(document_id)

    if not current:
        raise Exception("Current artifact for document {document_id} not found.")

    # Archive the current version if exists
    with Session(db_engine) as session:
        artifact = session.get(Artifact, current.id)
        if artifact:
            artifact.status = "archived"
            artifact.updated_at = datetime.datetime.now().isoformat()
            session.add(artifact)
            session.commit()

    # Set new version; If current doesn't exist, use target's version
    new_version = target_version if not current else current.version + 1

    # Use the same artifact workspace_id as the current version
    workspace_id = current.workspace_id
    
    # Prepare new version data
    art_type = target.art_type
    title = target.title
    content = target.content
    references = target.references if target.references else []

    # Insert new artifact version
    return insert_artifact_version(
        workspace_id=workspace_id,
        document_id=document_id,
        art_type=art_type,
        title=title,
        content=content,
        version=new_version,
        parent_version=target.version,
        references=references,
        status="current"
    )

def set_artifact_meta(
    document_id: str,
    new_title: Optional[str] = None,
    new_content: Optional[str] = None,
    new_art_type: Optional[str] = None,
    new_references: Optional[Dict] = None
) -> Artifact:
    """
    Updates the metadata (title, content, references) of the current version of an artifact
    without creating a new version or archiving the existing one.
    """
    # Fetch the current artifact based on document_id.
    current = get_current_artifact(document_id)
    if not current:
        raise Exception(f"Current artifact for document {document_id} not found.")

    # Update the artifact's metadata in place
    with Session(db_engine) as session:
        artifact = session.get(Artifact, current.id)
        if artifact:
            # Update title if provided
            if new_title is not None:
                artifact.title = new_title
            # Update content if provided
            if new_content is not None:
                artifact.content = new_content  
            # Update art_type if provided
            if new_art_type is not None:
                artifact.art_type = new_art_type
            # Update references if provided
            if new_references is not None:
                artifact.references = new_references

            # Update the timestamp
            artifact.updated_at = datetime.datetime.now()

            session.add(artifact)
            session.commit()
            session.refresh(artifact) # Refresh to get the latest state from the database
            return artifact
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artifact not found in session.")
        
def set_artifact_indexed(internal_artifact_id: int) -> Artifact:
    """
    Set indexed time of the document (by internal_artifact_id).
    """

    # Set indexed time and indexed id
    with Session(db_engine) as session:
        artifact = session.get(Artifact, internal_artifact_id)
        if artifact:
            # Mark the current artifact as archived and update the timestamp
            artifact.indexed_at = datetime.datetime.now()  # Set to current datetime
            session.add(artifact)
            session.commit()  # Commit the archive update
            return artifact


def delete_artifact_by_id(internal_id: int) -> Optional[Artifact]:
    """
    Delete an artifact by its internal id.
    Returns the deleted artifact (if found) or None.
    """
    with Session(db_engine) as session:
        artifact = session.get(Artifact, internal_id)
        if artifact:
            session.delete(artifact)
            session.commit()
        return artifact

def delete_artifacts_by_document(document_id: str, version: Optional[int] = None) -> int:
    """
    Delete artifacts by document_id.
    If version is provided, delete only the artifact with that version.
    If version is None, delete all artifacts with the given document_id.
    Returns the number of artifacts deleted.
    """
    with Session(db_engine) as session:
        if version is None:
            statement = select(Artifact).where(Artifact.document_id == document_id)
        else:
            statement = select(Artifact).where(
                Artifact.document_id == document_id, Artifact.version == version
            )
        artifacts_to_delete = session.exec(statement).all()
        count = len(artifacts_to_delete)
        for artifact in artifacts_to_delete:
            session.delete(artifact)
        session.commit()
        return count