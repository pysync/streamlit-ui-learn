import pytest
from sqlmodel import Session, delete
from backend.models.workspace import Workspace
from backend.config import db_engine
from backend.crud.workspace import (
    create_workspace,
    get_workspace,
    update_workspace,
    delete_workspace,
    list_workspaces,
)

from backend.config import init_db

init_db()

# Fixture to clear the workspace table before each test
@pytest.fixture(autouse=True)
def clear_workspace_table():
    with Session(db_engine) as session:
        session.exec(delete(Workspace))
        session.commit()

# Test creating a workspace
def test_create_workspace():
    title = "Test Workspace"
    description = "This is a test workspace."

    workspace = create_workspace(title, description)

    assert workspace.id is not None
    assert workspace.title == title
    assert workspace.description == description

# Test retrieving a workspace
def test_get_workspace():
    title = "Workspace 1"
    description = "First workspace"
    
    created_workspace = create_workspace(title, description)
    retrieved_workspace = get_workspace(created_workspace.id)

    assert retrieved_workspace is not None
    assert retrieved_workspace.id == created_workspace.id
    assert retrieved_workspace.title == title
    assert retrieved_workspace.description == description

# Test updating a workspace
def test_update_workspace():
    title = "Original Workspace"
    description = "Original description"
    
    workspace = create_workspace(title, description)

    new_title = "Updated Workspace"
    new_description = "Updated description"

    updated_workspace = update_workspace(workspace.id, new_title, new_description)

    assert updated_workspace is not None
    assert updated_workspace.id == workspace.id
    assert updated_workspace.title == new_title
    assert updated_workspace.description == new_description

# Test deleting a workspace
def test_delete_workspace():
    workspace = create_workspace("To Be Deleted", "Delete this workspace")

    delete_workspace(workspace.id)
    retrieved_workspace = get_workspace(workspace.id)
    assert retrieved_workspace is None  # Should be None after deletion

# Test listing workspaces with pagination
def test_list_workspaces():
    create_workspace("Workspace A", "Description A")
    create_workspace("Workspace B", "Description B")
    create_workspace("Workspace C", "Description C")

    workspaces, total = list_workspaces(limit=2, page=1)

    assert len(workspaces) == 2  # Should return only 2 due to pagination
    assert total >= 3  # At least 3 total workspaces in DB
