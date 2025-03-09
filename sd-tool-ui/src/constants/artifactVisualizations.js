import { ARTIFACT_TYPES } from './sdlcConstants';
import { VISUALIZATION_TYPES } from './visualizationTypes';

/**
 * Mapping of artifact types to their available visualizations
 * and default visualization settings.
 * Only includes artifact types that are currently implemented.
 */
export const ARTIFACT_VISUALIZATIONS = {
  // *** Phase 1: Core Implemented Artifacts ***
  
  // Document-based artifacts
  [ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'requirements', label: 'Requirements Table' }
  ],
  
  [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Requirements Table' }
  ],
  
  [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true }
  ],
  
  [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC]: [
    { type: VISUALIZATION_TYPES.DOCUMENT, label: 'Document View', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Requirements Table' }
  ],
  
  // Table-based artifacts
  [ARTIFACT_TYPES.DATA_DICTIONARY]: [
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'dictionary', label: 'Data Dictionary', isDefault: true }
  ],
  
  [ARTIFACT_TYPES.TEST_CASES_SPECIFICATION]: [
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'testcases', label: 'Test Cases', isDefault: true }
  ],
  
  [ARTIFACT_TYPES.TEST_DATA]: [
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'testdata', label: 'Test Data', isDefault: true }
  ],
  
  [ARTIFACT_TYPES.DEFECT_REPORT]: [
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'defects', label: 'Defect List', isDefault: true }
  ],
  
  [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: [
    { type: VISUALIZATION_TYPES.TABLE, subtype: 'risks', label: 'Risk Register', isDefault: true }
  ],
  
  // Matrix-based artifacts  
  [ARTIFACT_TYPES.REQUIREMENTS_TRACEABILITY_MATRIX]: [
    { type: VISUALIZATION_TYPES.MATRIX, label: 'Traceability Matrix', isDefault: true },
    { type: VISUALIZATION_TYPES.TABLE, label: 'Requirements Table' }
  ],

  // *** The following artifact visualizations will be implemented in future phases ***
  /*
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
  ]
  */
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