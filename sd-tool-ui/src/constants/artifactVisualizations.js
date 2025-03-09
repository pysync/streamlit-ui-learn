import { ARTIFACT_TYPES } from './sdlcConstants';
import { VISUALIZATION_TYPES } from './visualizationTypes';

/**
 * Mapping of artifact types to their available visualizations
 * and default visualization settings
 */
export const ARTIFACT_VISUALIZATIONS = {
  // Planning Phase Artifacts
  [ARTIFACT_TYPES.BUSINESS_CASE]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.CHART, subtype: 'status', label: 'ROI Analysis' }
  ],
  
  [ARTIFACT_TYPES.PROJECT_CHARTER]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'standard', label: 'Key Information' }
  ],
  
  [ARTIFACT_TYPES.PROJECT_PLAN]: [
    { type: VISUALIZATION_TYPES.GANTT, label: 'Gantt Chart', isDefault: true },
    { type: VISUALIZATION_TYPES.TIMELINE, label: 'Timeline View' },
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'standard', label: 'Task List' },
    { type: VISUALIZATION_TYPES.CHART, subtype: 'progress', label: 'Progress Chart' }
  ],
  
  [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: [
    { type: VISUALIZATION_TYPES.MATRIX, label: 'Stakeholder Matrix', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'stakeholders', label: 'Stakeholder Table' },
    { type: VISUALIZATION_TYPES.CHART, label: 'Power/Interest Grid' }
  ],
  
  [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: [
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'risks', label: 'Risk Register', isDefault: true },
    { type: VISUALIZATION_TYPES.CHART, subtype: 'riskMatrix', label: 'Risk Matrix' },
    { type: VISUALIZATION_TYPES.CHART, subtype: 'distribution', label: 'Risk Distribution' }
  ],
  
  // Requirements Phase Artifacts
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Requirements Table' }
  ],
  
  [ARTIFACT_TYPES.USER_STORIES]: [
    { type: VISUALIZATION_TYPES.KANBAN, label: 'Kanban Board', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Story List' },
    { type: VISUALIZATION_TYPES.TREE, label: 'Epic Hierarchy' }
  ],
  
  [ARTIFACT_TYPES.USE_CASE_DIAGRAMS]: [
    { type: VISUALIZATION_TYPES.DIAGRAM, subtype: 'useCase', label: 'Use Case Diagram', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Use Case Table' }
  ],
  
  [ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'requirements', label: 'Requirements Table' },
    { type: VISUALIZATION_TYPES.TREE, label: 'Requirements Hierarchy' }
  ],
  
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'NFR Table' },
    { type: VISUALIZATION_TYPES.CHART, label: 'Categories Chart' }
  ],
  
  [ARTIFACT_TYPES.DATA_DICTIONARY]: [
    { type: VISUALIZATION_TYPES.TABLE, label: 'Data Elements Table', isDefault: true },
    { type: VISUALIZATION_TYPES.TREE, label: 'Data Hierarchy' }
  ],
  
  [ARTIFACT_TYPES.REQUIREMENTS_TRACEABILITY_MATRIX]: [
    { type: VISUALIZATION_TYPES.MATRIX, label: 'Traceability Matrix', isDefault: true },
    { type: VISUALIZATION_TYPES.DIAGRAM, label: 'Traceability Diagram' },
    { type: VISUALIZATION_TYPES.CHART, label: 'Coverage Chart' }
  ],
  
  // Design Phase Artifacts
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.DIAGRAM, subtype: 'architecture', label: 'Architecture Diagram' }
  ],
  
  [ARTIFACT_TYPES.DATABASE_DESIGN_DOCUMENT]: [
    { type: VISUALIZATION_TYPES.DIAGRAM, subtype: 'er', label: 'ER Diagram', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Tables & Columns' },
    { type: VISUALIZATION_TYPES.CODE, label: 'SQL Schema' }
  ],
  
  [ARTIFACT_TYPES.API_SPECIFICATION]: [
    { type: VISUALIZATION_TYPES.SWAGGER, label: 'Swagger UI', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Endpoints Table' },
    { type: VISUALIZATION_TYPES.DIAGRAM, label: 'API Flow Diagram' }
  ],
  
  [ARTIFACT_TYPES.UI_UX_DESIGN_SPECIFICATION]: [
    { type: VISUALIZATION_TYPES.DIAGRAM, label: 'Wireframes', isDefault: true },
    { type: VISUALIZATION_TYPES.DIAGRAM, label: 'Screen Flow' },
    { type: VISUALIZATION_TYPES.TABLE, label: 'UI Components' }
  ],
  
  [ARTIFACT_TYPES.TECHNICAL_DESIGN_DOCUMENT]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.DIAGRAM, subtype: 'class', label: 'Class Diagram' },
    { type: VISUALIZATION_TYPES.DIAGRAM, subtype: 'sequence', label: 'Sequence Diagram' }
  ],
  
  [ARTIFACT_TYPES.DEPLOYMENT_ARCHITECTURE]: [
    { type: VISUALIZATION_TYPES.DIAGRAM, subtype: 'deployment', label: 'Deployment Diagram', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Infrastructure Components' }
  ],
  
  [ARTIFACT_TYPES.SECURITY_DESIGN_DOCUMENT]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.DIAGRAM, label: 'Security Architecture' }
  ],
  
  // Testing Phase Artifacts
  [ARTIFACT_TYPES.TEST_PLAN]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.CHART, label: 'Test Coverage' }
  ],
  
  [ARTIFACT_TYPES.TEST_CASES_SPECIFICATION]: [
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'testCases', label: 'Test Cases Table', isDefault: true },
    { type: VISUALIZATION_TYPES.MATRIX, label: 'Requirements Coverage Matrix' },
    { type: VISUALIZATION_TYPES.CHART, label: 'Test Status Chart' }
  ],
  
  [ARTIFACT_TYPES.TEST_DATA]: [
    { type: VISUALIZATION_TYPES.TABLE, label: 'Test Data Table', isDefault: true }
  ],
  
  [ARTIFACT_TYPES.TEST_EXECUTION_REPORT]: [
    { type: VISUALIZATION_TYPES.DASHBOARD, label: 'Test Dashboard', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Test Results Table' },
    { type: VISUALIZATION_TYPES.CHART, subtype: 'status', label: 'Test Results Chart' }
  ],
  
  [ARTIFACT_TYPES.DEFECT_REPORT]: [
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'defects', label: 'Defects Table', isDefault: true },
    { type: VISUALIZATION_TYPES.CHART, label: 'Defect Trends' },
    { type: VISUALIZATION_TYPES.CHART, label: 'Defect Distribution' }
  ],
  
  [ARTIFACT_TYPES.PERFORMANCE_TEST_REPORT]: [
    { type: VISUALIZATION_TYPES.DASHBOARD, label: 'Performance Dashboard', isDefault: true },
    { type: VISUALIZATION_TYPES.CHART, subtype: 'lineChart', label: 'Performance Metrics' },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Detailed Results' }
  ],
  
  [ARTIFACT_TYPES.SECURITY_TEST_REPORT]: [
    { type: VISUALIZATION_TYPES.DASHBOARD, label: 'Security Dashboard', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Vulnerabilities Table' },
    { type: VISUALIZATION_TYPES.CHART, label: 'Risk Distribution' }
  ],
  
  [ARTIFACT_TYPES.UAT_PLAN]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Test Scenarios' }
  ],
  
  [ARTIFACT_TYPES.UAT_REPORT]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.CHART, label: 'Acceptance Status' },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Issues Found' }
  ]
};

/**
 * Get default visualization for an artifact type
 * @param {string} artifactType - The artifact type
 * @return {Object} The default visualization object or first available visualization
 */
export const getDefaultVisualization = (artifactType) => {
  const visualizations = ARTIFACT_VISUALIZATIONS[artifactType] || [];
  const defaultViz = visualizations.find(v => v.isDefault);
  return defaultViz || visualizations[0] || null;
};

/**
 * Check if a visualization type is valid for an artifact type
 * @param {string} artifactType - The artifact type
 * @param {string} visualizationType - The visualization type
 * @param {string} [subtype] - Optional visualization subtype
 * @return {boolean} True if valid
 */
export const isValidVisualization = (artifactType, visualizationType, subtype = null) => {
  const visualizations = ARTIFACT_VISUALIZATIONS[artifactType] || [];
  return visualizations.some(v => 
    v.type === visualizationType && 
    (subtype === null || v.subtype === subtype)
  );
}; 