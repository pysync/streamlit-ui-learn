import datetime
import json
import pytest
from typing import Dict

from sqlmodel import Session, delete, select
from backend.crud.artifact import (
    insert_artifact_version,
    create_new_artifact,
    list_artifacts,
    search_artifacts,
    get_artifact_by_internal_id,
    get_current_artifact,
    get_artifact_versions,
    set_artifact_meta,
    update_artifact_version,
    rollback_artifact_version,
    delete_artifact_by_id,
    delete_artifacts_by_document,
)
from backend.crud.workspace import create_workspace  # Import the workspace creation function
from backend.models.artifact import Artifact
from backend.config import db_engine
from backend.config import init_db

init_db()

# Fixture to clear the artifacts table before each test.
@pytest.fixture(autouse=True)
def clear_artifacts_table():
    with Session(db_engine) as session:
        session.exec(delete(Artifact))
        session.commit()

# Fixture to create a workspace before tests
@pytest.fixture
def workspace():
    # Creating a workspace for each test
    item = create_workspace(title="Test Workspace")
    return item # object.


def test_insert_artifact_version(workspace):
    doc_id = "doc1"
    art_type = "doc"
    title = "Title 1"
    content = "Content 1"
    version = 1
    parent_version = None
    dependencies: Dict = {"dep": "value"}
    status = "current"
    
    artifact = insert_artifact_version(
        document_id=doc_id,
        art_type=art_type,
        title=title,
        content=content,
        version=version,
        parent_version=parent_version,
        dependencies=dependencies,
        status=status,
        workspace_id=workspace.id  # Use the created workspace ID
    )
    
    assert artifact.id is not None
    assert artifact.document_id == doc_id
    assert artifact.art_type == art_type
    assert artifact.title == title
    assert artifact.content == content
    assert artifact.version == version
    assert artifact.parent_version is None
    assert artifact.dependencies == dependencies
    assert artifact.status == status

def test_create_new_artifact(workspace):
    doc_id = "doc2"
    title = "New Title"
    content = "New Content"
    
    artifact = create_new_artifact(document_id=doc_id, title=title, content=content, workspace_id=workspace.id)
    
    assert artifact.version == 1
    assert artifact.status == "current"
    assert artifact.document_id == doc_id
    assert artifact.art_type == "doc"

def test_list_artifacts(workspace):
    create_new_artifact(workspace.id, "doc3", "Title 3", "Content 3")
    create_new_artifact(workspace.id, "doc4", "Title 4", "Content 4")
    
    artifacts, total = list_artifacts(workspace_id=workspace.id,limit=10, page=1)
    assert len(artifacts) >= 2

def test_search_artifacts(workspace):
    create_new_artifact(workspace.id, "doc5", "Searchable Title", "Some Content")
    create_new_artifact(workspace.id, "doc5", "Another Title", "Different Content")
    
    # Search by keyword in title.
    results, total = search_artifacts(workspace_id=workspace.id, keyword="Searchable")
    assert len(results) == 1
    # Filter by art_type.
    results, total = search_artifacts(workspace_id=workspace.id, art_type="doc")
    assert all(a.art_type == "doc" for a in results)
    # Filter by version.
    results, total = search_artifacts(workspace_id=workspace.id, version=1)
    assert all(a.version == 1 for a in results)
    # Filter by status.
    results, total = search_artifacts(workspace_id=workspace.id, status="current")
    assert all(a.status == "current" for a in results)

def test_get_artifact_by_internal_id(workspace):
    artifact = create_new_artifact(workspace.id, "doc6", "Title 6", "Content 6")
    fetched = get_artifact_by_internal_id(artifact.id)
    assert fetched is not None
    assert fetched.id == artifact.id

def test_get_current_artifact_and_versions(workspace):
    doc_id = "doc7"
    artifact1 = create_new_artifact(workspace.id, doc_id, "Title 7", "Content 7")
    artifact2 = update_artifact_version(doc_id, "Title 7 Updated", "Content 7 Updated", new_art_type="doc")
    
    current = get_current_artifact(doc_id)
    assert current is not None
    assert current.version == artifact2.version
    versions = get_artifact_versions(doc_id)
    assert len(versions) == 2
    archived = [a for a in versions if a.status == "archived"]
    current_versions = [a for a in versions if a.status == "current"]
    assert len(archived) == 1
    assert len(current_versions) == 1


def test_update_artifact_version(workspace):
    doc_id = "doc8"
    artifact1 = create_new_artifact(workspace.id, doc_id, "Title 8", "Content 8")
    artifact2 = update_artifact_version(doc_id, "Title 8 Updated", "Content 8 Updated", new_art_type="doc")
    
    assert artifact2.version == artifact1.version + 1
    assert artifact2.status == "current"
    old = get_artifact_by_internal_id(artifact1.id)
    assert old.status == "archived"

def test_rollback_artifact_version(workspace):
    doc_id = "doc9"
    artifact1 = create_new_artifact(workspace.id, doc_id, "Title 9", "Content 9")
    artifact2 = update_artifact_version(doc_id, "Title 9 Updated", "Content 9 Updated", new_art_type="doc")
    
    rolled_back = rollback_artifact_version(doc_id, 1)
    
    # The rolled-back version should have the title and content from version 1.
    assert rolled_back.title == artifact1.title
    assert rolled_back.content == artifact1.content
    # New version should be greater than the previous current version.
    assert rolled_back.version == artifact2.version + 1

def test_set_artifact_meta(workspace):
    """
    Test updating artifact metadata using set_artifact_meta function
    without creating a new version.
    """
    # Step 1: Create an artifact
    initial_artifact = create_new_artifact(workspace.id, "doc_meta_test", "Original Title", "Original Content", art_type="doc")
    initial_version = initial_artifact.version # Capture initial version

    # Step 2: Define updated metadata
    updated_title = "Updated Title for Meta Test"
    updated_content = "Updated Content for Meta Test"

    # Step 3: Call set_artifact_meta to update metadata
    updated_artifact = set_artifact_meta(
        document_id="doc_meta_test", # Use document_id to identify the artifact
        new_title=updated_title,
        new_content=updated_content
    )

    # Step 4: Assert that the artifact exists after update
    assert updated_artifact is not None
    fetched_artifact = get_artifact_by_internal_id(updated_artifact.id)
    assert fetched_artifact is not None

    # Step 5: Assert that metadata has been updated correctly
    assert fetched_artifact.title == updated_title
    assert fetched_artifact.content == updated_content

    # Step 6: Assert that the version number has NOT changed
    assert fetched_artifact.version == initial_version
    assert fetched_artifact.version == 1 # Assuming initial version was 1, if not adjust accordingly
    
def test_delete_artifact_by_id(workspace):
    artifact = create_new_artifact(workspace.id, "doc10", "Title 10", "Content 10")
    deleted = delete_artifact_by_id(artifact.id)
    assert deleted is not None
    fetched = get_artifact_by_internal_id(artifact.id)
    assert fetched is None

def test_delete_artifacts_by_document(workspace):
    doc_id = "doc11"
    # Create multiple versions.
    create_new_artifact(workspace.id, doc_id, "Title 11", "Content 11")
    update_artifact_version(doc_id, "Title 11 Updated", "Content 11 Updated", new_art_type="doc")
    
    count = delete_artifacts_by_document(doc_id)
    assert count >= 2
    remains, total = list_artifacts(workspace_id=workspace.id,limit=-1)
    remaining = [a for a in remains if a.document_id == doc_id]
    assert len(remaining) == 0

    # Create again and then delete only one version.
    create_new_artifact(workspace.id, doc_id, "Title 11", "Content 11")
    update_artifact_version(doc_id, "Title 11 Updated", "Content 11 Updated", new_art_type="doc")
    
    count_single = delete_artifacts_by_document(doc_id, version=1)
    # With two versions created, deleting version 1 should leave one remaining.
    remains, total = list_artifacts(workspace_id=workspace.id,limit=-1)
    remaining_after = [a for a in remains if a.document_id == doc_id]
    assert len(remaining_after) == 1