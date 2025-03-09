import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress } from '@mui/material';
import { ARTIFACT_TYPES } from '../../constants/sdlcConstants';

// Import viewer components
const DocumentViewer = React.lazy(() => import('./types/DocumentViewer'));
const DiagramViewer = React.lazy(() => import('./types/DiagramViewer'));
const TableViewer = React.lazy(() => import('./types/TableViewer'));
const KanbanViewer = React.lazy(() => import('./types/KanbanViewer'));
const ProjectPlanViewer = React.lazy(() => import('./types/ProjectPlanViewer'));
const ExcalidrawViewer = React.lazy(() => import('./types/ExcalidrawViewer'));
const GenericViewer = React.lazy(() => import('./types/GenericViewer'));

// Map artifact types to viewer components
const TYPE_TO_VIEWER = {
  [ARTIFACT_TYPES.REQUIREMENTS_SPEC]: DocumentViewer,
  [ARTIFACT_TYPES.DESIGN_DOCUMENT]: DocumentViewer,
  [ARTIFACT_TYPES.PROJECT_PLAN]: ProjectPlanViewer,
  [ARTIFACT_TYPES.UML_DIAGRAM]: DiagramViewer,
  [ARTIFACT_TYPES.USER_STORIES]: KanbanViewer,
  [ARTIFACT_TYPES.TEST_CASES]: TableViewer,
  // Add other mappings as needed
};

/**
 * Factory component that returns the appropriate viewer based on artifact type
 */
const ArtifactFactory = ({
  artifact,
  activeVisualization,
  visualizations,
  isEditable,
  onVisualizationChange,
  onContentUpdate,
}) => {
  if (!artifact) {
    return <Box>No artifact selected</Box>;
  }

  // Determine the appropriate viewer component
  const ViewerComponent = TYPE_TO_VIEWER[artifact.type] || GenericViewer;

  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    }>
      <ViewerComponent
        artifact={artifact}
        activeVisualization={activeVisualization}
        visualizations={visualizations}
        isEditable={isEditable}
        onVisualizationChange={onVisualizationChange}
        onContentUpdate={onContentUpdate}
      />
    </Suspense>
  );
};

ArtifactFactory.propTypes = {
  artifact: PropTypes.object,
  activeVisualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onVisualizationChange: PropTypes.func,
  onContentUpdate: PropTypes.func,
};

export default ArtifactFactory; 