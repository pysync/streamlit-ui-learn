import React from 'react';
import PropTypes from 'prop-types';

// Import artifact types and visualization constants
import { ARTIFACT_TYPES } from '../../constants/sdlcConstants';
import { VISUALIZATION_TYPES } from '../../constants/visualizationTypes';

// Import renderer components
import DocumentRenderer from './DocumentRenderer';
import DiagramRenderer from './DiagramRenderer';
import TableRenderer from './TableRenderer';
import GanttRenderer from './GanttRenderer';

// Default renderer for unknown types
import GenericRenderer from './GenericRenderer';

/**
 * Factory component that returns the appropriate renderer based on artifact type
 */
const ArtifactRendererFactory = ({
  artifact,
  visualization,
  visualizations,
  isEditable,
  onVisualizationChange,
  onContentUpdate,
  layoutMode
}) => {
  // Map visualization types to their renderer components
  const rendererMap = {
    [VISUALIZATION_TYPES.DOCUMENT]: DocumentRenderer,
    [VISUALIZATION_TYPES.DIAGRAM]: DiagramRenderer,
    [VISUALIZATION_TYPES.FLOWCHART]: DiagramRenderer,
    [VISUALIZATION_TYPES.SEQUENCE]: DiagramRenderer,
    [VISUALIZATION_TYPES.TABLE]: TableRenderer,
    [VISUALIZATION_TYPES.MATRIX]: TableRenderer,
    [VISUALIZATION_TYPES.GANTT]: GanttRenderer,
    [VISUALIZATION_TYPES.TIMELINE]: GanttRenderer
  };

  // Determine renderer based on visualization type if available, otherwise use artifact type
  let RendererComponent = GenericRenderer;
  
  if (visualization && visualization.type) {
    RendererComponent = rendererMap[visualization.type] || GenericRenderer;
  } else {
    // Fallback to artifact type-based rendering if no visualization is specified
    // This maps artifact types to common visualizations
    const artifactTypeDefaultMap = {
      [ARTIFACT_TYPES.PROJECT_PLAN]: GanttRenderer,
      [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC]: DocumentRenderer,
      [ARTIFACT_TYPES.NOTE]: DocumentRenderer,
      [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: TableRenderer,
      [ARTIFACT_TYPES.USE_CASE_DIAGRAMS]: DiagramRenderer,
      // Add more mappings as needed
    };
    
    RendererComponent = artifactTypeDefaultMap[artifact.art_type] || GenericRenderer;
  }

  return (
    <RendererComponent
      artifact={artifact}
      visualization={visualization}
      visualizations={visualizations}
      isEditable={isEditable}
      onVisualizationChange={onVisualizationChange}
      onContentUpdate={onContentUpdate}
      layoutMode={layoutMode}
    />
  );
};

ArtifactRendererFactory.propTypes = {
  artifact: PropTypes.object.isRequired,
  visualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onVisualizationChange: PropTypes.func,
  onContentUpdate: PropTypes.func,
  layoutMode: PropTypes.string
};

export default ArtifactRendererFactory; 