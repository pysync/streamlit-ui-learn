// src/services/client.js

const BASE_URL = "http://localhost:8000";

// Helper function to check the API response
async function checkResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }
  return response.json();
}

// Helper function to check the API status
async function checkStatus(response) {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Request failed');
    }
    return response
  }
  
/* --------------------------
   Workspace API Functions
-----------------------------*/

/**
 * Get a paginated list of workspaces.
 */
export async function getWorkspaces(page = 1, limit = 10) {
  const url = `${BASE_URL}/workspaces/?page=${page}&limit=${limit}`;
  const response = await fetch(url);
  return checkResponse(response);
}

/**
 * Create a new workspace.
 */
export async function createWorkspace(title, description) {
  const url = `${BASE_URL}/workspaces/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  return checkResponse(response);
}

/**
 * Get details for a specific workspace by ID.
 */
export async function getWorkspace(workspace_id) {
  const url = `${BASE_URL}/workspaces/${workspace_id}`;
  const response = await fetch(url);
  return checkResponse(response);
}

/**
 * Update an existing workspace.
 */
export async function updateWorkspace(workspace_id, title, description) {
  const url = `${BASE_URL}/workspaces/${workspace_id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  return checkResponse(response);
}

/**
 * Delete a workspace by ID.
 */
export async function deleteWorkspace(workspace_id) {
  const url = `${BASE_URL}/workspaces/${workspace_id}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });
  return checkStatus(response);
}

/* --------------------------
   Artifact API Functions
-----------------------------*/

/**
 * List artifacts for a workspace with optional filters.
 */
export async function listArtifacts(
  workspace_id,
  page = 1,
  limit = 10,
  art_type = null,
  version = null,
  status = null,
  keyword = null
) {
  let url = `${BASE_URL}/artifacts/?workspace_id=${workspace_id}&page=${page}&limit=${limit}`;
  if (art_type) url += `&art_type=${art_type}`;
  if (version) url += `&version=${version}`;
  if (status) url += `&status=${status}`;
  if (keyword) url += `&keyword=${keyword}`;
  const response = await fetch(url);
  return checkResponse(response);
}

/**
 * Search artifacts (alias for listArtifacts).
 */
export const searchArtifacts = listArtifacts;

/**
 * Get an artifact by its internal ID.
 */
export async function getArtifactById(artifact_id) {
  const url = `${BASE_URL}/artifacts/${artifact_id}`;
  const response = await fetch(url);
  return checkResponse(response);
}

/**
 * Get the current (latest) version of an artifact by document ID.
 */
export async function getCurrentArtifact(document_id) {
  const url = `${BASE_URL}/artifacts/current/${document_id}`;
  const response = await fetch(url);
  return checkResponse(response);
}

/**
 * Get all versions of an artifact by document ID.
 */
export async function getArtifactVersions(document_id) {
  const url = `${BASE_URL}/artifacts/versions/${document_id}`;
  const response = await fetch(url);
  return checkResponse(response);
}

/**
 * Create a new artifact (initial version) in a workspace.
 */
export async function createArtifact(workspace_id, artifactData) {
  // artifact data should have:  document_id, title, content, art_type
  const { document_id, title, content, art_type } = artifactData
  const url = `${BASE_URL}/artifacts/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace_id, document_id, title, content, art_type }),
  });
  return checkResponse(response);
}

/**
 * Update artifact version: archive current and create a new version.
 */
export async function updateArtifactVersion(document_id, artifactData) {
  const { title, content, dependencies = null } = artifactData
  const url = `${BASE_URL}/artifacts/${document_id}/update`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, dependencies }),
  });
  return checkResponse(response);
}

/**
 * Set artifact metadata: Update current version without creating a new version.
 */
export async function setArtifactMeta(document_id, artifactData) {
  // artifactData should have: title, content, dependencies (optional)
  const { title, content, dependencies } = artifactData;
  const url = `${BASE_URL}/artifacts/${document_id}/setmeta`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, dependencies }),
  });
  return checkResponse(response);
}

/**
 * Rollback an artifact to a previous version.
 */
export async function rollbackArtifactVersion(document_id, target_version) {
  const url = `${BASE_URL}/artifacts/${document_id}/rollback`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_version }),
  });
  return checkResponse(response);
}

/**
 * Delete an artifact by its internal ID.
 */
export async function deleteArtifactById(artifact_id) {
  const url = `${BASE_URL}/artifacts/${artifact_id}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });
  return checkStatus(response);
}

/**
 * Delete artifacts by document ID (optionally specify version).
 */
export async function deleteArtifactsByDocument(document_id, version = null) {
  let url = `${BASE_URL}/artifacts/document/${document_id}`;
  if (version) {
    url += `?version=${version}`;
  }
  const response = await fetch(url, {
    method: 'DELETE',
  });
  return checkStatus(response);
}

/**
 * Upload an artifact file.
 * @param {number} workspace_id - The ID of the workspace.
 * @param {File} file - A File object from an input element.
 */
export async function uploadArtifact(workspace_id, file) {
  const url = `${BASE_URL}/artifacts/upload?workspace_id=${workspace_id}`;
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  return checkResponse(response);
}

/* --------------------------
   Vector DB and Reindexing API Functions
-----------------------------*/

/**
 * Clear the vector store index for a workspace.
 */
export async function clearVectorStore(workspace_id) {
  const url = `${BASE_URL}/artifacts/clear_index`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace_id }),
  });
  return checkResponse(response);
}

/**
 * Reindex all documents in the vector store for a workspace.
 */
export async function reindexAll(workspace_id) {
  const url = `${BASE_URL}/artifacts/reindex_all`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace_id }),
  });
  return checkResponse(response);
}

/**
 * Get the reindexing status by task ID.
 */
export async function getReindexingStatus(task_id) {
  const url = `${BASE_URL}/artifacts/reindex_status/${task_id}`;
  const response = await fetch(url);
  return checkResponse(response);
}

/**
 * Get the status of all reindexing tasks.
 */
export async function getAllReindexingStatus() {
  const url = `${BASE_URL}/artifacts/reindex_status`;
  const response = await fetch(url);
  return checkResponse(response);
}
