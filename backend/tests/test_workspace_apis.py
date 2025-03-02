import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, delete
from backend.app import app
from backend.models.workspace import Workspace
from backend.schemas.workspace import WorkspaceCreate, WorkspaceUpdate
from backend.config import db_engine, init_db

init_db()

client = TestClient(app)

# Clear the workspaces table before each test.
@pytest.fixture(autouse=True)
def clear_db():
    with Session(db_engine) as session:
        session.exec(delete(Workspace))
        session.commit()

# Test creating a workspace
def test_create_workspace():
    data = {"title": "Test Workspace", "description": "A test workspace."}
    response = client.post("/workspaces/", json=data)
    assert response.status_code == 201
    json_response = response.json()
    assert json_response["title"] == data["title"]
    assert json_response["description"] == data["description"]
    assert "id" in json_response

# Test retrieving all workspaces (paginated)
def test_list_workspaces():
    # Create multiple workspaces
    for i in range(3):
        client.post("/workspaces/", json={"title": f"Workspace {i}", "description": f"Description {i}"})
    
    response = client.get("/workspaces/?page=1&limit=2")
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["total"] >= 3  # Ensure it counted all
    assert len(json_response["items"]) == 2  # Page size limit works

# Test retrieving a workspace by ID
def test_get_workspace():
    data = {"title": "Test Workspace", "description": "A test workspace."}
    create_response = client.post("/workspaces/", json=data)
    workspace_id = create_response.json()["id"]

    response = client.get(f"/workspaces/{workspace_id}")
    assert response.status_code == 200
    assert response.json()["id"] == workspace_id

# Test updating a workspace
def test_update_workspace():
    data = {"title": "Old Title", "description": "Old Description"}
    create_response = client.post("/workspaces/", json=data)
    workspace_id = create_response.json()["id"]

    update_data = {"title": "New Title", "description": "New Description"}
    response = client.put(f"/workspaces/{workspace_id}", json=update_data)
    
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["title"] == update_data["title"]
    assert json_response["description"] == update_data["description"]

# Test deleting a workspace
def test_delete_workspace():
    data = {"title": "Delete Me", "description": "This workspace will be deleted."}
    create_response = client.post("/workspaces/", json=data)
    workspace_id = create_response.json()["id"]

    delete_response = client.delete(f"/workspaces/{workspace_id}")
    assert delete_response.status_code == 204  # No content

    # Ensure it was deleted
    get_response = client.get(f"/workspaces/{workspace_id}")
    assert get_response.status_code == 404  # Not found
