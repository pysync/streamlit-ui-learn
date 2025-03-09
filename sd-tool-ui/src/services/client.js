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
  status = 'current',
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
  const { document_id, title, content, art_type, references = null } = artifactData;
  
  const url = `${BASE_URL}/artifacts`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      document_id,
      workspace_id,
      title,
      content,
      art_type,
      references
    }),
  });
  return checkResponse(response);
}

/**
 * Update artifact version: archive current and create a new version.
 */
export async function updateArtifactVersion(document_id, artifactData) {
  const { title, content, art_type, references = null } = artifactData
  const url = `${BASE_URL}/artifacts/${document_id}/update`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, art_type, references }),
  });
  return checkResponse(response);
}

/**
 * Set artifact metadata: Update current version without creating a new version.
 */
export async function setArtifactMeta(document_id, artifactData) {
  // artifactData should have: title, content, art_type, references (optional)
  const { title, content, art_type, references } = artifactData;
  const url = `${BASE_URL}/artifacts/${document_id}/setmeta`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, art_type, references }),
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

/**
 * Download artifact file.
 * @param {string} document_id - The document ID of the artifact
 * @param {string} filename - The filename to save as
 */
export async function downloadArtifact(document_id, filename) {
  const url = `${BASE_URL}/artifacts/download/${document_id}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Download failed');
    }
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
    return true;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}

/**
 * Fetches available context actions for the markdown editor
 * @returns {Promise<Array>} Array of context actions
 */
export const getContextActions = async () => {
  try {
    // Instead of making an actual API call that might fail,
    // just return the default actions for now
    // When the API is ready, uncomment the fetch code
    
    /*
    const response = await fetch('/api/context-actions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch context actions: ${response.statusText}`);
    }

    const data = await response.json();
    return data.context_actions || [];
    */
    
    // Return default actions
    return [
      { id: 1, title: "Quick Refine", msg: "Help me refine this document" },
      { id: 2, title: "Summarize", msg: "Summarize this content" },
      { id: 3, title: "Extract Requirements", msg: "Extract requirements from this text" },
      { id: 4, title: "Suggest Improvements", msg: "Suggest improvements for this document" }
    ];
  } catch (error) {
    console.error('Error fetching context actions:', error);
    // Return some default actions as fallback
    return [
      { id: 1, title: "Quick Refine", msg: "Help me refine this document" },
      { id: 2, title: "Summarize", msg: "Summarize this content" },
      { id: 3, title: "Extract Requirements", msg: "Extract requirements from this text" },
      { id: 4, title: "Suggest Improvements", msg: "Suggest improvements for this document" }
    ];
  }
};
