/**
 * Service to handle artifact type-specific operations and normalization
 */

// Default content structures for different artifact types
const defaultContentTemplates = {
  doc: {
    blocks: [
      { 
        key: 'initial',
        text: 'Enter your document content here.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {}
      }
    ],
    entityMap: {}
  },
  
  diagram: {
    elements: [
      {
        id: 'node-1',
        type: 'node',
        position: { x: 150, y: 150 },
        label: 'Start',
        width: 80,
        height: 40
      }
    ],
    settings: {
      diagramType: 'flowchart',
      direction: 'LR'
    }
  },
  
  table: {
    columns: [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'name', headerName: 'Name', width: 200 },
      { field: 'description', headerName: 'Description', width: 300 }
    ],
    data: [
      { id: 1, name: 'Item 1', description: 'Description 1' }
    ]
  },
  
  gantt: {
    tasks: [
      {
        id: 'task-1',
        name: 'New Task',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'not_started'
      }
    ],
    phases: [
      {
        id: 'phase-1',
        name: 'Phase 1'
      }
    ],
    timeline: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
};

/**
 * Get a default content template for the specified artifact type
 * @param {string} artifactType - The type of artifact
 * @returns {object} Default content structure for the artifact type
 */
export const getDefaultContentForType = (artifactType) => {
  // Map similar types to their base template
  const typeMap = {
    'document': 'doc',
    'flowchart': 'diagram',
    'sequence': 'diagram',
    'matrix': 'table',
    'timeline': 'gantt'
  };
  
  // Get the base type or use the provided type
  const baseType = typeMap[artifactType] || artifactType;
  
  // Return the template or an empty object if not found
  return defaultContentTemplates[baseType] || {};
};

/**
 * Normalize artifact content to ensure it's in the expected format
 * @param {object|string} content - The artifact content
 * @param {string} artifactType - The type of artifact
 * @returns {object} Normalized content
 */
export const normalizeContent = (content, artifactType) => {
  // If content is empty or invalid, return default template
  if (!content) {
    return getDefaultContentForType(artifactType);
  }
  
  let contentObj;
  
  // Parse string content to object
  if (typeof content === 'string') {
    try {
      contentObj = JSON.parse(content);
    } catch (e) {
      console.error('Error parsing artifact content:', e);
      return getDefaultContentForType(artifactType);
    }
  } else {
    contentObj = content;
  }
  
  return contentObj;
};

/**
 * Get available visualizations for the specified artifact type
 * @param {string} artifactType - The type of artifact
 * @returns {array} Available visualizations
 */
export const getVisualizationsForType = (artifactType) => {
  // Visualizations by artifact type
  const visualizationMap = {
    doc: [
      { id: 'default', name: 'Document View', icon: 'document' },
      { id: 'outline', name: 'Outline View', icon: 'list' }
    ],
    
    diagram: [
      { id: 'visual', name: 'Diagram View', icon: 'diagram' },
      { id: 'code', name: 'Code View', icon: 'code' }
    ],
    
    table: [
      { id: 'table', name: 'Table View', icon: 'table' },
      { id: 'card', name: 'Card View', icon: 'grid' },
      { id: 'chart', name: 'Chart View', icon: 'chart' }
    ],
    
    gantt: [
      { id: 'gantt', name: 'Gantt View', icon: 'gantt' },
      { id: 'timeline', name: 'Timeline View', icon: 'timeline' },
      { id: 'list', name: 'Task List', icon: 'list' }
    ]
  };
  
  // Map similar types to their base type
  const typeMap = {
    'document': 'doc',
    'flowchart': 'diagram',
    'sequence': 'diagram',
    'matrix': 'table',
    'timeline': 'gantt'
  };
  
  // Get the base type or use the provided type
  const baseType = typeMap[artifactType] || artifactType;
  
  // Return visualizations for the type or an empty array if not found
  return visualizationMap[baseType] || [];
};

export default {
  getDefaultContentForType,
  normalizeContent,
  getVisualizationsForType
}; 