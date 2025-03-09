import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or auth context
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      console.log('Authentication error');
      // Example: window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Artifact API Service
 */
const artifactService = {
  /**
   * Get all artifacts
   * @param {Object} filters - Optional filters
   * @returns {Promise} Promise resolving to array of artifacts
   */
  getAllArtifacts: (filters = {}) => {
    return api.get('/artifacts', { params: filters })
      .then(response => response.data);
  },
  
  /**
   * Get artifact by ID
   * @param {string} artifactId - Artifact ID
   * @returns {Promise} Promise resolving to artifact
   */
  getArtifactById: (artifactId) => {
    return api.get(`/artifacts/${artifactId}`)
      .then(response => response.data);
  },
  
  /**
   * Create artifact
   * @param {Object} artifact - Artifact data
   * @returns {Promise} Promise resolving to created artifact
   */
  createArtifact: (artifact) => {
    return api.post('/artifacts', artifact)
      .then(response => response.data);
  },
  
  /**
   * Update artifact
   * @param {string} artifactId - Artifact ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise} Promise resolving to updated artifact
   */
  updateArtifact: (artifactId, updates) => {
    return api.patch(`/artifacts/${artifactId}`, updates)
      .then(response => response.data);
  },
  
  /**
   * Delete artifact
   * @param {string} artifactId - Artifact ID
   * @returns {Promise} Promise resolving to success status
   */
  deleteArtifact: (artifactId) => {
    return api.delete(`/artifacts/${artifactId}`)
      .then(response => response.data);
  },
  
  /**
   * Update artifact content
   * @param {string} artifactId - Artifact ID
   * @param {Object} content - New content
   * @returns {Promise} Promise resolving to updated artifact
   */
  updateArtifactContent: (artifactId, content) => {
    return api.put(`/artifacts/${artifactId}/content`, { content })
      .then(response => response.data);
  },
  
  /**
   * Update artifact visualization
   * @param {string} artifactId - Artifact ID
   * @param {Array} visualization - New visualization settings
   * @returns {Promise} Promise resolving to updated artifact
   */
  updateArtifactVisualization: (artifactId, visualization) => {
    return api.put(`/artifacts/${artifactId}/visualization`, { visualization })
      .then(response => response.data);
  },
  
  /**
   * Add reference to artifact
   * @param {string} artifactId - Artifact ID
   * @param {Object} reference - Reference to add
   * @returns {Promise} Promise resolving to updated artifact
   */
  addArtifactReference: (artifactId, reference) => {
    return api.post(`/artifacts/${artifactId}/references`, reference)
      .then(response => response.data);
  },
  
  /**
   * Remove reference from artifact
   * @param {string} artifactId - Artifact ID
   * @param {string} referenceId - Reference ID to remove
   * @returns {Promise} Promise resolving to updated artifact
   */
  removeArtifactReference: (artifactId, referenceId) => {
    return api.delete(`/artifacts/${artifactId}/references/${referenceId}`)
      .then(response => response.data);
  }
};

export default artifactService; 