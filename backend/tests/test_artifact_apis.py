import io
import pytest
from fastapi import status, HTTPException
from fastapi.testclient import TestClient
from sqlmodel import Session, delete
from backend.app import app
from backend.models.artifact import Artifact
from backend.config import db_engine
from backend.config import init_db

init_db()

client = TestClient(app) 

# Clear the artifacts table before each test.
@pytest.fixture(autouse=True)
def clear_db():
    with Session(db_engine) as session:
        session.exec(delete(Artifact))
        session.commit()

# Helper function to create a workspace first
def create_workspace():
    payload = {
        "title": "Test Workspace"
    }
    response = client.post("/workspaces/", json=payload)
    assert response.status_code == 201
    
    print("Use workspace id: ", response.json()['id'])
    
    return response.json()["id"]

def test_create_artifact():
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    payload = {
        "workspace_id": workspace_id,  # Pass workspace_id
        "document_id": "doc1",
        "title": "Test Title",
        "content": "Test Content",
        "art_type": "doc"
    }
    response = client.post("/artifacts/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["document_id"] == "doc1"
    assert data["title"] == "Test Title"
    assert data["content"] == "Test Content"
    assert data["version"] == 1
    assert data["status"] == "current"
    assert data["art_type"] == "doc"



def test_list_artifacts():
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    response = client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": "doc2", "title": "Title2", "content": "Content2", "art_type": "doc"})
    assert response.status_code == 201
    response = client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": "doc3", "title": "Title3", "content": "Content3", "art_type": "doc"})
    assert response.status_code == 201
    
    response = client.get("/artifacts/", params={"workspace_id": workspace_id, "limit": 10, "page": 1})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert len(data) >= 2


def test_get_artifact_by_id():
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    response = client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": "doc4", "title": "Title4", "content": "Content4"})
    assert response.status_code == 201
    artifact_id = response.json()["id"]
    response = client.get(f"/artifacts/{artifact_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == artifact_id


def test_get_first_version_artifact():
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    # Create and update to have first versions
    response = client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": "doc5", "title": "Title5", "content": "Content5"})
    
    response = client.get("/artifacts/current/doc5")
    assert response.status_code == 200
    data = response.json()
    assert data["document_id"] == "doc5"
    assert data["status"] == "current"
    assert data["version"] == 1


def test_get_current_artifact():
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    # Create and update to have two versions
    response = client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": "doc5", "title": "Title5", "content": "Content5"})
    data = response.json()
    assert response.status_code == 201
    assert data["document_id"] == "doc5"
    assert data["status"] == "current"
    assert data["version"] == 1
    
    response = client.put("/artifacts/doc5/update", json={"title": "Title5 Updated", "content": "Content5 Updated"})
    assert response.status_code == 200
    
    response = client.get("/artifacts/current/doc5")
    assert response.status_code == 200
    data = response.json()
    assert data["document_id"] == "doc5"
    assert data["status"] == "current"
    assert data["title"] == "Title5 Updated"
    assert data["content"] == "Content5 Updated"
    assert data["version"] == 2
    
def test_get_artifact_versions():
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    # Create one artifact and update twice (3 versions total)
    response = client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": "doc6", "title": "Title6", "content": "Content6"})
    response = client.put("/artifacts/doc6/update", json={"title": "Title6 Updated", "content": "Content6 Updated"})
    response = client.put("/artifacts/doc6/update", json={"title": "Title6 Updated2", "content": "Content6 Updated2"})
    response = client.get("/artifacts/versions/doc6")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3  # initial + 2 updates


def test_search_artifacts():
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    # Create artifacts with distinctive titles
    response = client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": "doc7", "title": "Alpha Title", "content": "Content7"})
    assert response.status_code == 201  # Check that the creation succeeded
    response = client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": "doc8", "title": "Beta Title", "content": "Content8"})
    assert response.status_code == 201  # Check that the creation succeeded

    # Search for artifacts containing the keyword 'Alpha'
    response = client.get("/artifacts/search", params={"workspace_id": workspace_id, "keyword": "Alpha"})
    assert response.status_code == 200
    data = response.json()

    # Assert that only one result is returned
    assert len(data["items"]) == 1  # Make sure the result is correct, based on 'items'
    assert data["items"][0]["title"] == "Alpha Title"

def test_update_artifact_version():
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": "doc9", "title": "Title9", "content": "Content9"})
    response_update = client.put("/artifacts/doc9/update", json={"new_title": "Title9 Updated", "new_content": "Content9 Updated"})
    assert response_update.status_code == 200
    updated = response_update.json()
    assert updated["version"] == 2
    # Verify that the previous version is archived
    response_versions = client.get("/artifacts/versions/doc9")
    versions = response_versions.json()
    archived = [v for v in versions if v["status"] == "archived"]
    current = [v for v in versions if v["status"] == "current"]
    assert len(archived) == 1
    assert len(current) == 1


def test_rollback_artifact_version():
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    response_create = client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": "doc10", "title": "Title10", "content": "Content10"})
    assert response_create.status_code == 201
    response_update = client.put("/artifacts/doc10/update", json={"title": "Title10 Updated", "content": "Content10 Updated"})
    assert response_update.status_code == 200
    response_rollback = client.post("/artifacts/doc10/rollback", json={"target_version": 1})
    assert response_rollback.status_code == 200
    data = response_rollback.json()
    # The rolled-back version should have the original title and content.
    assert data["title"] == "Title10"
    # Its version should be greater than the previous current version.
    assert data["version"] > 1


def test_delete_artifact_by_id():
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    res_create = client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": "doc11", "title": "Title11", "content": "Content11"})
    artifact_id = res_create.json()["id"]
    response_delete = client.delete(f"/artifacts/{artifact_id}")
    assert response_delete.status_code == 204
    response_get = client.get(f"/artifacts/{artifact_id}")
    assert response_get.status_code == 404


def test_delete_artifacts_by_document():
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    doc_id = "doc12"
    # Create two versions
    client.post("/artifacts/", json={"workspace_id": workspace_id, "document_id": doc_id, "title": "Title12", "content": "Content12"})
    client.put(f"/artifacts/{doc_id}/update", json={"new_title": "Title12 Updated", "new_content": "Content12 Updated"})
    # Delete only version 1
    response_del_version = client.delete(f"/artifacts/document/{doc_id}", params={"version": 1})
    assert response_del_version.status_code == 204
    remaining = client.get(f"/artifacts/versions/{doc_id}")
    remaining_data = remaining.json()
    # Expect only one version remains.
    assert len(remaining_data) == 1
    # Now delete all versions.
    response_del_all = client.delete(f"/artifacts/document/{doc_id}")
    assert response_del_all.status_code == 204
    remaining_all = client.get(f"/artifacts/versions/{doc_id}")
    # When no versions exist, we expect a 404.
    assert remaining_all.status_code == 404


# Test for uploading an artifact
def test_upload_artifact():
    # Step 1: Create a workspace and get the workspace_id
    workspace_id = create_workspace()
    
    # Step 2: Prepare the file content for upload
    file_content = "Uploaded artifact content"
    file_bytes = file_content.encode("utf-8")
    file_obj = io.BytesIO(file_bytes)
    file_obj.name = "upload_test.txt"
    
    # Step 3: Upload the file with workspace_id as a query parameter
    response = client.post(
        "/artifacts/upload",  # The endpoint that handles file uploads
        params={"workspace_id": workspace_id},  # Pass workspace_id as a query parameter
        files={"file": (file_obj.name, file_obj, "text/plain")}  # File to be uploaded
    )
    
    # Step 4: Assert that the file upload was successful
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "upload_test.txt"
    assert data["workspace_id"] == workspace_id  # Check that the artifact was created under the correct workspace

def test_set_artifact_meta_api():
    """
    Test the PUT /artifacts/{document_id}/setmeta API endpoint to update artifact metadata.
    """
    workspace_id = create_workspace()  # Create workspace and get workspace_id
    
    # Step 1: Create an initial artifact
    create_payload = {
        "workspace_id": workspace_id, 
        "document_id": "doc_meta_api_test", 
        "title": "Initial API Title", 
        "content": "Initial API Content",
        "art_type": "doc"
    }
    response_create = client.post("/artifacts/", json=create_payload)
    assert response_create.status_code == status.HTTP_201_CREATED
    initial_data = response_create.json()
    document_id = initial_data["document_id"]
    initial_version = initial_data["version"]

    # Step 2: Define updated metadata payload
    update_payload = {
        "title": "Updated API Title",
        "content": "Updated API Content",
        "art_type": "doc",
        "dependencies": [1, 2]
    }

    # Step 3: Call the /setmeta endpoint
    response_update = client.put(f"/artifacts/{document_id}/setmeta", json=update_payload)
    assert response_update.status_code == status.HTTP_200_OK
    updated_data = response_update.json()

    # Step 4: Assertions to verify metadata update
    assert updated_data["document_id"] == document_id
    assert updated_data["title"] == update_payload["title"]
    assert updated_data["content"] == update_payload["content"]
    assert updated_data["dependencies"] == update_payload["dependencies"]
    assert updated_data["version"] == initial_version # Version should NOT change
    assert updated_data["status"] == "current"

    # Step 5: Optionally, fetch the artifact again to double-check persistence in DB
    response_fetch = client.get(f"/artifacts/current/{document_id}")
    assert response_fetch.status_code == status.HTTP_200_OK
    fetched_data = response_fetch.json()
    assert fetched_data["title"] == update_payload["title"]
    assert fetched_data["content"] == update_payload["content"]
    assert fetched_data["version"] == initial_version
