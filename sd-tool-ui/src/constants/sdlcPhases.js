/**
 * Constants defining SDLC phases and their associated artifact types
 */

export const SDLC_PHASES = {
  PLANNING: 'planning',
  REQUIREMENTS: 'requirements',
  DESIGN: 'design'
};

export const PHASE_LABELS = {
  [SDLC_PHASES.PLANNING]: 'Planning',
  [SDLC_PHASES.REQUIREMENTS]: 'Requirements',
  [SDLC_PHASES.DESIGN]: 'Design'
};

export const ARTIFACT_TYPES = {
  // Planning phase artifacts
  NOTE: 'note',
  WIREFRAME: 'wireframe',
  BACKLOG_ITEM: 'backlog_item',
  
  // Requirements phase artifacts
  SRS_DOCUMENT: 'srs_document',
  REQUIREMENT: 'requirement',
  
  // Design phase artifacts
  SCREEN_MAP: 'screen_map',
  API_SPEC: 'api_spec',
  ER_DIAGRAM: 'er_diagram',
  SEQUENCE_DIAGRAM: 'sequence_diagram',
  ACTIVITY_DIAGRAM: 'activity_diagram'
};

export const ARTIFACT_TYPE_LABELS = {
  [ARTIFACT_TYPES.NOTE]: 'Idea Note',
  [ARTIFACT_TYPES.WIREFRAME]: 'Wireframe',
  [ARTIFACT_TYPES.BACKLOG_ITEM]: 'Backlog Item',
  [ARTIFACT_TYPES.SRS_DOCUMENT]: 'SRS Document',
  [ARTIFACT_TYPES.REQUIREMENT]: 'Requirement',
  [ARTIFACT_TYPES.SCREEN_MAP]: 'Screen Map',
  [ARTIFACT_TYPES.API_SPEC]: 'API Specification',
  [ARTIFACT_TYPES.ER_DIAGRAM]: 'ER Diagram',
  [ARTIFACT_TYPES.SEQUENCE_DIAGRAM]: 'Sequence Diagram',
  [ARTIFACT_TYPES.ACTIVITY_DIAGRAM]: 'Activity Diagram'
};

// Map artifact types to their corresponding SDLC phase
export const ARTIFACT_TYPE_TO_PHASE = {
  [ARTIFACT_TYPES.NOTE]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.WIREFRAME]: SDLC_PHASES.PLANNING,
  [ARTIFACT_TYPES.BACKLOG_ITEM]: SDLC_PHASES.PLANNING,
  
  [ARTIFACT_TYPES.SRS_DOCUMENT]: SDLC_PHASES.REQUIREMENTS,
  [ARTIFACT_TYPES.REQUIREMENT]: SDLC_PHASES.REQUIREMENTS,
  
  [ARTIFACT_TYPES.SCREEN_MAP]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.API_SPEC]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.ER_DIAGRAM]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.SEQUENCE_DIAGRAM]: SDLC_PHASES.DESIGN,
  [ARTIFACT_TYPES.ACTIVITY_DIAGRAM]: SDLC_PHASES.DESIGN
};

// Get the appropriate icon for each artifact type
export const getArtifactIcon = (artifactType) => {
  // This will be implemented when we add the icons
  // For now, return null
  return null;
};

// Get the file extension for each artifact type
export const getFileExtension = (artifactType) => {
  switch (artifactType) {
    case ARTIFACT_TYPES.NOTE:
    case ARTIFACT_TYPES.SRS_DOCUMENT:
      return '.md';
    case ARTIFACT_TYPES.WIREFRAME:
      return '.excalidraw';
    case ARTIFACT_TYPES.SCREEN_MAP:
    case ARTIFACT_TYPES.ER_DIAGRAM:
    case ARTIFACT_TYPES.SEQUENCE_DIAGRAM:
    case ARTIFACT_TYPES.ACTIVITY_DIAGRAM:
      return '.diagram';
    case ARTIFACT_TYPES.API_SPEC:
      return '.json';
    default:
      return '';
  }
}; 