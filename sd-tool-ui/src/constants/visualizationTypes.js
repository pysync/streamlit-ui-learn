/**
 * Visualization types currently implemented in the system
 */
export const VISUALIZATION_TYPES = {
  DOCUMENT: 'document',
  TABLE: 'table',
  DIAGRAM: 'diagram',
  CHART: 'chart',
  KANBAN: 'kanban',
  TIMELINE: 'timeline'
};

/**
 * Visualization labels for UI display
 */
export const VISUALIZATION_LABELS = {
  [VISUALIZATION_TYPES.DOCUMENT]: 'Document',
  [VISUALIZATION_TYPES.TABLE]: 'Table',
  [VISUALIZATION_TYPES.DIAGRAM]: 'Diagram',
  [VISUALIZATION_TYPES.CHART]: 'Chart',
  [VISUALIZATION_TYPES.KANBAN]: 'Kanban Board',
  [VISUALIZATION_TYPES.TIMELINE]: 'Timeline'
}; 