/**
 * Adapters for table-based artifacts
 * These functions transform artifact content to match the expected format for TableViewer
 */

import { ARTIFACT_TYPES } from '../../../constants/sdlcConstants';

/**
 * Transforms test cases artifact to table format
 * @param {Object} artifact - The test cases artifact
 * @returns {Object} Transformed content for TableViewer
 */
export const testCasesAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        columns: [
          { field: 'id', headerName: 'ID', width: 100 },
          { field: 'title', headerName: 'Test Case', flex: 1 },
          { field: 'description', headerName: 'Description', flex: 1 },
          { field: 'status', headerName: 'Status', width: 120 },
          { field: 'priority', headerName: 'Priority', width: 120 }
        ],
        rows: []
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.columns && content.rows) {
    return content;
  }
  
  // If we have test cases array but not in the right format
  if (content && Array.isArray(content.testCases)) {
    return {
      columns: [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Test Case', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 1 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'priority', headerName: 'Priority', width: 120 },
        { field: 'steps', headerName: 'Steps', flex: 1 },
        { field: 'expectedResult', headerName: 'Expected Result', flex: 1 }
      ],
      rows: content.testCases.map((testCase, index) => ({
        id: testCase.id || `TC-${index + 1}`,
        title: testCase.title || '',
        description: testCase.description || '',
        status: testCase.status || 'Not Started',
        priority: testCase.priority || 'Medium',
        steps: testCase.steps || '',
        expectedResult: testCase.expectedResult || ''
      }))
    };
  }
  
  // Default structure
  return {
    columns: [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'title', headerName: 'Test Case', flex: 1 },
      { field: 'description', headerName: 'Description', flex: 1 },
      { field: 'status', headerName: 'Status', width: 120 },
      { field: 'priority', headerName: 'Priority', width: 120 },
      { field: 'steps', headerName: 'Steps', flex: 1 },
      { field: 'expectedResult', headerName: 'Expected Result', flex: 1 }
    ],
    rows: []
  };
};

/**
 * Transforms risk register artifact to table format
 * @param {Object} artifact - The risk register artifact
 * @returns {Object} Transformed content for TableViewer
 */
export const riskRegisterAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        columns: [
          { field: 'id', headerName: 'ID', width: 100 },
          { field: 'description', headerName: 'Risk Description', flex: 1 },
          { field: 'probability', headerName: 'Probability', width: 120 },
          { field: 'impact', headerName: 'Impact', width: 120 },
          { field: 'severity', headerName: 'Severity', width: 120 },
          { field: 'mitigation', headerName: 'Mitigation Strategy', flex: 1 },
          { field: 'owner', headerName: 'Owner', width: 150 },
          { field: 'status', headerName: 'Status', width: 120 }
        ],
        rows: []
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.columns && content.rows) {
    return content;
  }
  
  // If we have risks array but not in the right format
  if (content && Array.isArray(content.risks)) {
    return {
      columns: [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'description', headerName: 'Risk Description', flex: 1 },
        { field: 'probability', headerName: 'Probability', width: 120 },
        { field: 'impact', headerName: 'Impact', width: 120 },
        { field: 'severity', headerName: 'Severity', width: 120 },
        { field: 'mitigation', headerName: 'Mitigation Strategy', flex: 1 },
        { field: 'owner', headerName: 'Owner', width: 150 },
        { field: 'status', headerName: 'Status', width: 120 }
      ],
      rows: content.risks.map((risk, index) => ({
        id: risk.id || `R-${index + 1}`,
        description: risk.description || '',
        probability: risk.probability || 'Medium',
        impact: risk.impact || 'Medium',
        severity: risk.severity || 'Medium',
        mitigation: risk.mitigation || '',
        owner: risk.owner || '',
        status: risk.status || 'Open'
      }))
    };
  }
  
  // Default structure
  return {
    columns: [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'description', headerName: 'Risk Description', flex: 1 },
      { field: 'probability', headerName: 'Probability', width: 120 },
      { field: 'impact', headerName: 'Impact', width: 120 },
      { field: 'severity', headerName: 'Severity', width: 120 },
      { field: 'mitigation', headerName: 'Mitigation Strategy', flex: 1 },
      { field: 'owner', headerName: 'Owner', width: 150 },
      { field: 'status', headerName: 'Status', width: 120 }
    ],
    rows: []
  };
};

/**
 * Transforms defect report artifact to table format
 * @param {Object} artifact - The defect report artifact
 * @returns {Object} Transformed content for TableViewer
 */
export const defectReportAdapter = (artifact) => {
  let content = artifact.content;
  
  // Parse content if it's a string
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      // If parsing fails, create a basic structure
      return {
        columns: [
          { field: 'id', headerName: 'ID', width: 100 },
          { field: 'title', headerName: 'Defect Title', flex: 1 },
          { field: 'description', headerName: 'Description', flex: 1 },
          { field: 'severity', headerName: 'Severity', width: 120 },
          { field: 'priority', headerName: 'Priority', width: 120 },
          { field: 'status', headerName: 'Status', width: 120 },
          { field: 'assignee', headerName: 'Assignee', width: 150 },
          { field: 'reportedBy', headerName: 'Reported By', width: 150 },
          { field: 'reportedDate', headerName: 'Reported Date', width: 150 }
        ],
        rows: []
      };
    }
  }
  
  // If content is already in the right format, return it
  if (content && content.columns && content.rows) {
    return content;
  }
  
  // If we have defects array but not in the right format
  if (content && Array.isArray(content.defects)) {
    return {
      columns: [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Defect Title', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 1 },
        { field: 'severity', headerName: 'Severity', width: 120 },
        { field: 'priority', headerName: 'Priority', width: 120 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'assignee', headerName: 'Assignee', width: 150 },
        { field: 'reportedBy', headerName: 'Reported By', width: 150 },
        { field: 'reportedDate', headerName: 'Reported Date', width: 150 }
      ],
      rows: content.defects.map((defect, index) => ({
        id: defect.id || `DEF-${index + 1}`,
        title: defect.title || '',
        description: defect.description || '',
        severity: defect.severity || 'Medium',
        priority: defect.priority || 'Medium',
        status: defect.status || 'New',
        assignee: defect.assignee || '',
        reportedBy: defect.reportedBy || '',
        reportedDate: defect.reportedDate || new Date().toISOString().split('T')[0]
      }))
    };
  }
  
  // Default structure
  return {
    columns: [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'title', headerName: 'Defect Title', flex: 1 },
      { field: 'description', headerName: 'Description', flex: 1 },
      { field: 'severity', headerName: 'Severity', width: 120 },
      { field: 'priority', headerName: 'Priority', width: 120 },
      { field: 'status', headerName: 'Status', width: 120 },
      { field: 'assignee', headerName: 'Assignee', width: 150 },
      { field: 'reportedBy', headerName: 'Reported By', width: 150 },
      { field: 'reportedDate', headerName: 'Reported Date', width: 150 }
    ],
    rows: []
  };
};

/**
 * Get the appropriate adapter for a given artifact type
 * @param {string} artifactType - The artifact type
 * @returns {Function} The adapter function for the artifact type
 */
export const getTableAdapter = (artifactType) => {
  switch (artifactType) {
    case ARTIFACT_TYPES.TEST_CASES:
      return testCasesAdapter;
    case ARTIFACT_TYPES.RISK_REGISTER:
      return riskRegisterAdapter;
    case ARTIFACT_TYPES.DEFECT_REPORT:
      return defectReportAdapter;
    default:
      return (artifact) => artifact.content;
  }
}; 