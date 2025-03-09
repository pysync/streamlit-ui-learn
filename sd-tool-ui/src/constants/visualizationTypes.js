/**
 * Visualization types currently implemented in the system
 */
export const VISUALIZATION_TYPES = {
  // Core visualization types (implemented)
  DOCUMENT: 'DOCUMENT',
  TABLE: 'TABLE',
  
  // Phase 1 additional types
  MATRIX: 'MATRIX',  // For requirements traceability
  CHART: 'CHART',    // For basic charts and graphs
  
  // Future visualization types (not yet implemented)
  /*
  DIAGRAM: 'DIAGRAM',
  GANTT: 'GANTT',
  TIMELINE: 'TIMELINE',
  KANBAN: 'KANBAN',
  CODE: 'CODE', 
  DASHBOARD: 'DASHBOARD',
  TREE: 'TREE'
  */
};

/**
 * Visualization labels for UI display
 */
export const VISUALIZATION_LABELS = {
  // Core visualization labels
  [VISUALIZATION_TYPES.DOCUMENT]: 'Document View',
  [VISUALIZATION_TYPES.TABLE]: 'Table View',
  [VISUALIZATION_TYPES.MATRIX]: 'Matrix View',
  [VISUALIZATION_TYPES.CHART]: 'Chart View',
  
  // Future visualization labels
  /*
  [VISUALIZATION_TYPES.DIAGRAM]: 'Diagram View',
  [VISUALIZATION_TYPES.GANTT]: 'Gantt Chart',
  [VISUALIZATION_TYPES.TIMELINE]: 'Timeline View',
  [VISUALIZATION_TYPES.KANBAN]: 'Kanban Board',
  [VISUALIZATION_TYPES.CODE]: 'Code View',
  [VISUALIZATION_TYPES.DASHBOARD]: 'Dashboard View',
  [VISUALIZATION_TYPES.TREE]: 'Tree View'
  */
}; 