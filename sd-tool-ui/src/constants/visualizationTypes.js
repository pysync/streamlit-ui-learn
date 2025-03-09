/**
 * Visualization type definitions for SDLC artifacts
 */

// Basic visualization types
export const VISUALIZATION_TYPES = {
  // Document-based visualizations
  DOCUMENT: 'document',
  RICH_TEXT: 'richText',
  MARKDOWN: 'markdown',
  
  // Table/matrix visualizations
  TABLE: 'table',
  MATRIX: 'matrix',
  GRID: 'grid',
  
  // Chart/graph visualizations
  CHART: 'chart',
  BAR_CHART: 'barChart',
  PIE_CHART: 'pieChart',
  LINE_CHART: 'lineChart',
  
  // Timeline visualizations
  TIMELINE: 'timeline',
  GANTT: 'gantt',
  
  // Diagram visualizations
  DIAGRAM: 'diagram',
  ERD: 'erd',         // Entity Relationship Diagram
  FLOW: 'flow',       // Flow Diagram
  UML: 'uml',         // UML Diagram
  NETWORK: 'network', // Network Diagram
  
  // List visualizations
  LIST: 'list',
  CARD: 'card',
  KANBAN: 'kanban',
  
  // API visualizations
  SWAGGER: 'swagger',
  API_EXPLORER: 'apiExplorer',
  
  // Special visualizations
  DASHBOARD: 'dashboard',
  TREE: 'tree',
  MAP: 'map',
  CODE: 'code'
};

// Subtypes for main visualization types
export const VISUALIZATION_SUBTYPES = {
  // Table subtypes
  [VISUALIZATION_TYPES.TABLE]: {
    STANDARD: 'standard',
    REQUIREMENTS: 'requirements',
    TEST_CASES: 'testCases',
    DEFECTS: 'defects',
    RISKS: 'risks',
    STAKEHOLDERS: 'stakeholders',
  },
  
  // Chart subtypes
  [VISUALIZATION_TYPES.CHART]: {
    STATUS: 'status',
    PROGRESS: 'progress',
    DISTRIBUTION: 'distribution',
    COVERAGE: 'coverage',
    BURNDOWN: 'burndown',
    RISK_MATRIX: 'riskMatrix',
  },
  
  // Diagram subtypes
  [VISUALIZATION_TYPES.DIAGRAM]: {
    CLASS: 'class',
    SEQUENCE: 'sequence',
    ACTIVITY: 'activity',
    USE_CASE: 'useCase',
    ER: 'er',
    DEPLOYMENT: 'deployment',
    ARCHITECTURE: 'architecture',
  }
};

// Visualization type settings schemas
export const VISUALIZATION_SETTINGS_SCHEMAS = {
  [VISUALIZATION_TYPES.GANTT]: {
    showCriticalPath: { type: 'boolean', default: true },
    showProgress: { type: 'boolean', default: true },
    timeScale: { 
      type: 'string', 
      enum: ['day', 'week', 'month', 'quarter'], 
      default: 'week' 
    },
    groupBy: {
      type: 'string',
      enum: ['none', 'phase', 'resource', 'status'],
      default: 'phase'
    }
  },
  
  [VISUALIZATION_TYPES.TABLE]: {
    pageSize: { type: 'number', default: 20 },
    showFilters: { type: 'boolean', default: true },
    enableSorting: { type: 'boolean', default: true },
    enableEditing: { type: 'boolean', default: false },
    enableSelection: { type: 'boolean', default: true },
    enablePagination: { type: 'boolean', default: true },
    enableExport: { type: 'boolean', default: true }
  },
  
  [VISUALIZATION_TYPES.ERD]: {
    showDataTypes: { type: 'boolean', default: true },
    showDescriptions: { type: 'boolean', default: false },
    showNullable: { type: 'boolean', default: true },
    layout: {
      type: 'string',
      enum: ['auto', 'vertical', 'horizontal', 'radial'],
      default: 'auto'
    }
  }
  // Add more schemas as needed for other visualization types
}; 