import { ARTIFACT_TYPES } from '../constants/sdlcConstants';
import { getDefaultVisualization } from '../constants/artifactVisualizations';
import { createDefaultArtifactContent } from '../constants/artifactSchemas';

/**
 * Mock data service for testing artifact functionality
 */

// Sample project plan data
const PROJECT_PLAN_DATA = {
  artifactType: ARTIFACT_TYPES.PROJECT_PLAN,
  artifactId: "PROJECT_PLAN-1",
  title: "System Modernization Project Plan",
  description: "Comprehensive project plan for the system modernization initiative",
  version: "1.0",
  status: "active",
  createdBy: "user123",
  createdAt: "2023-08-15T10:30:00Z",
  lastModifiedBy: "user123",
  lastModifiedAt: "2023-08-16T14:20:00Z",
  content: {
    projectObjectives: "Modernize the legacy system with improved performance and security",
    projectScope: "End-to-end replacement of customer-facing modules",
    constraints: "Budget limit of $1.5M, completion by Q4 2023",
    timeline: {
      startDate: "2023-01-15",
      endDate: "2023-12-31",
      workingDays: [1, 2, 3, 4, 5]  // Monday to Friday
    },
    phases: [
      {
        id: "phase1",
        name: "Requirements & Analysis",
        startDate: "2023-01-15",
        endDate: "2023-03-31",
        color: "#4285F4",
        description: "Gather and analyze requirements",
        completionPercentage: 100
      },
      {
        id: "phase2",
        name: "Design",
        startDate: "2023-04-01",
        endDate: "2023-06-30",
        color: "#34A853",
        description: "System and detailed design",
        completionPercentage: 75
      },
      {
        id: "phase3",
        name: "Implementation",
        startDate: "2023-07-01",
        endDate: "2023-10-31",
        color: "#FBBC05",
        description: "Development and integration",
        completionPercentage: 30
      },
      {
        id: "phase4",
        name: "Testing & Deployment",
        startDate: "2023-11-01",
        endDate: "2023-12-31",
        color: "#EA4335",
        description: "Testing, UAT, and deployment",
        completionPercentage: 0
      }
    ],
    tasks: [
      {
        id: "task1",
        name: "Requirements Gathering",
        phaseId: "phase1",
        startDate: "2023-01-15",
        endDate: "2023-02-15",
        references: [],
        assignees: ["John Doe"],
        status: "completed",
        completionPercentage: 100,
        description: "Gather requirements from stakeholders"
      },
      {
        id: "task2",
        name: "Requirements Analysis",
        phaseId: "phase1",
        startDate: "2023-02-16",
        endDate: "2023-03-31",
        references: ["task1"],
        assignees: ["Jane Smith"],
        status: "completed",
        completionPercentage: 100,
        description: "Analyze and document requirements"
      },
      {
        id: "task3",
        name: "System Architecture",
        phaseId: "phase2",
        startDate: "2023-04-01",
        endDate: "2023-05-15",
        references: ["task2"],
        assignees: ["Alice Johnson"],
        status: "completed",
        completionPercentage: 100,
        description: "Design system architecture"
      },
      {
        id: "task4",
        name: "Database Design",
        phaseId: "phase2",
        startDate: "2023-04-15",
        endDate: "2023-05-31",
        references: ["task3"],
        assignees: ["Bob Brown"],
        status: "in_progress",
        completionPercentage: 80,
        description: "Design database schema"
      },
      {
        id: "task5",
        name: "UI/UX Design",
        phaseId: "phase2",
        startDate: "2023-05-01",
        endDate: "2023-06-30",
        references: ["task3"],
        assignees: ["Charlie Green"],
        status: "in_progress",
        completionPercentage: 60,
        description: "Design user interface"
      }
      // More tasks would be defined here
    ],
    risks: [
      {
        id: "risk1",
        description: "Key technical staff unavailable",
        category: "Resource",
        probability: "medium",
        impact: "high",
        mitigation: "Cross-train team members",
        owner: "Project Manager"
      }
    ]
  },
  references: [
    { artifactType: ARTIFACT_TYPES.BUSINESS_CASE, artifactId: "BUSINESS_CASE-1", title: "Business Case" },
    { artifactType: ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS, artifactId: "STAKEHOLDER_ANALYSIS-1", title: "Stakeholder Analysis" }
  ],
  visualization: [
    { type: "gantt", label: "Gantt Chart", isDefault: true },
    { type: "timeline", label: "Timeline" },
    { type: "table", subtype: "taskList", label: "Task List" },
    { type: "chart", subtype: "resourceUtilization", label: "Resource Utilization" }
  ]
};

// Add more mock artifacts here

// Collection of mock artifacts
const MOCK_ARTIFACTS = {
  "PROJECT_PLAN-1": PROJECT_PLAN_DATA,
  // Add more artifacts here
};

/**
 * Get a list of all artifacts
 * @returns {Promise} Promise resolving to array of artifacts
 */
export const getAllArtifacts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Object.values(MOCK_ARTIFACTS));
    }, 500); // Simulate network delay
  });
};

/**
 * Get an artifact by ID
 * @param {string} artifactId - The ID of the artifact to retrieve
 * @returns {Promise} Promise resolving to the artifact or null if not found
 */
export const getArtifactById = (artifactId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ARTIFACTS[artifactId] || null);
    }, 300); // Simulate network delay
  });
};

/**
 * Create a new artifact
 * @param {string} artifactType - The type of artifact to create
 * @param {Object} initialData - Optional initial data
 * @returns {Promise} Promise resolving to the created artifact
 */
export const createArtifact = (artifactType, initialData = {}) => {
  return new Promise((resolve) => {
    // Generate a new ID
    const artifactId = `${artifactType}-${Date.now()}`;
    
    // Create default visualization
    const visualization = initialData.visualization || 
      [getDefaultVisualization(artifactType)].filter(Boolean);
    
    // Create default content
    const content = initialData.content || createDefaultArtifactContent(artifactType);
    
    // Create the new artifact
    const newArtifact = {
      artifactType,
      artifactId,
      title: initialData.title || `New ${artifactType}`,
      description: initialData.description || '',
      version: "1.0",
      status: "draft",
      createdBy: "current_user", // This would come from auth context
      createdAt: new Date().toISOString(),
      lastModifiedBy: "current_user",
      lastModifiedAt: new Date().toISOString(),
      content,
      references: initialData.references || [],
      visualization
    };
    
    // Add to mock collection
    MOCK_ARTIFACTS[artifactId] = newArtifact;
    
    setTimeout(() => {
      resolve(newArtifact);
    }, 500); // Simulate network delay
  });
};

/**
 * Update an artifact
 * @param {string} artifactId - The ID of the artifact to update
 * @param {Object} updates - The updates to apply
 * @returns {Promise} Promise resolving to the updated artifact
 */
export const updateArtifact = (artifactId, updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const artifact = MOCK_ARTIFACTS[artifactId];
      
      if (!artifact) {
        reject(new Error(`Artifact with ID ${artifactId} not found`));
        return;
      }
      
      // Apply updates
      const updatedArtifact = {
        ...artifact,
        ...updates,
        lastModifiedBy: "current_user", // This would come from auth context
        lastModifiedAt: new Date().toISOString()
      };
      
      // Update in mock collection
      MOCK_ARTIFACTS[artifactId] = updatedArtifact;
      
      resolve(updatedArtifact);
    }, 500); // Simulate network delay
  });
};

/**
 * Delete an artifact
 * @param {string} artifactId - The ID of the artifact to delete
 * @returns {Promise} Promise resolving to success status
 */
export const deleteArtifact = (artifactId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!MOCK_ARTIFACTS[artifactId]) {
        reject(new Error(`Artifact with ID ${artifactId} not found`));
        return;
      }
      
      // Delete from mock collection
      delete MOCK_ARTIFACTS[artifactId];
      
      resolve({ success: true });
    }, 500); // Simulate network delay
  });
}; 