/**
 * Templates and utilities for handling different artifact type content structures
 */
import { ARTIFACT_TYPES } from '../constants/sdlcConstants';
import { VISUALIZATION_TYPES, VISUALIZATION_SUBTYPES } from '../constants/visualizationTypes';

// Default content templates for different artifact types
export const defaultContentTemplates = {
  // Document-based artifacts
  [ARTIFACT_TYPES.BUSINESS_CASE]: {
    blocks: [
      { 
        key: 'initial',
        text: 'Enter your business case content here.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {}
      }
    ],
    entityMap: {}
  },
  
  [ARTIFACT_TYPES.PROJECT_CHARTER]: {
    blocks: [
      { 
        key: 'initial',
        text: 'Enter your project charter content here.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {}
      }
    ],
    entityMap: {}
  },
  
  // Diagram-based artifacts
  [ARTIFACT_TYPES.USE_CASE_DIAGRAMS]: {
    elements: [
      {
        id: 'actor-1',
        type: 'actor',
        position: { x: 100, y: 150 },
        label: 'User',
        width: 60,
        height: 80
      },
      {
        id: 'usecase-1',
        type: 'usecase',
        position: { x: 250, y: 150 },
        label: 'Perform Action',
        width: 120,
        height: 60
      }
    ],
    settings: {
      diagramType: 'usecase',
      direction: 'LR'
    }
  },
  
  // Table-based artifacts
  [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: {
    columns: [
      { id: 'name', name: 'Stakeholder Name', width: 200 },
      { id: 'role', name: 'Role', width: 150 },
      { id: 'interest', name: 'Interest Level', width: 120 },
      { id: 'power', name: 'Power Level', width: 120 },
      { id: 'impact', name: 'Impact', width: 150 },
      { id: 'strategy', name: 'Engagement Strategy', width: 200 }
    ],
    rows: [
      { id: '1', name: '', role: '', interest: 'Medium', power: 'Low', impact: '', strategy: '' }
    ],
    settings: {
      tableType: 'stakeholder'
    }
  },
  
  // Gantt-based artifacts
  [ARTIFACT_TYPES.PROJECT_PLAN]: {
    tasks: [
      {
        id: '1',
        name: 'Project Start',
        start: new Date().toISOString(),
        end: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        progress: 0,
        type: 'milestone'
      },
      {
        id: '2',
        name: 'Planning Phase',
        start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
        end: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
        progress: 0,
        type: 'task'
      }
    ],
    links: [],
    settings: {
      viewMode: 'Month'
    }
  }
};

/**
 * Get default content template for an artifact type
 * @param {string} artifactType - The artifact type from ARTIFACT_TYPES constant
 * @return {Object} Default content structure for the artifact type
 */
export const getDefaultContentForType = (artifactType) => {
  // Return the template if it exists, otherwise return a simple document template
  return defaultContentTemplates[artifactType] || defaultContentTemplates[ARTIFACT_TYPES.NOTE];
};

/**
 * Normalize string content into appropriate structure based on artifact type
 * @param {string|Object} content - The content to normalize
 * @param {string} artifactType - The artifact type
 * @return {Object} Normalized content object
 */
export const normalizeContent = (content, artifactType) => {
  // If content is already an object, return it
  if (typeof content === 'object' && content !== null) {
    return content;
  }
  
  // If content is a string, try to parse it as JSON
  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch (e) {
      // Not valid JSON, so convert to appropriate default structure
      // For document types, wrap plain text in a simple document structure
      if (artifactType === ARTIFACT_TYPES.NOTE || 
          artifactType === ARTIFACT_TYPES.BUSINESS_CASE ||
          artifactType === ARTIFACT_TYPES.PROJECT_CHARTER) {
        return {
          blocks: [
            {
              key: 'initial',
              text: content || '',
              type: 'unstyled',
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {}
            }
          ],
          entityMap: {}
        };
      }
      
      // For other types, return the default template
      return getDefaultContentForType(artifactType);
    }
  }
  
  // Fallback to default template
  return getDefaultContentForType(artifactType);
};

export default {
  getDefaultContentForType,
  normalizeContent,
  defaultContentTemplates
}; 