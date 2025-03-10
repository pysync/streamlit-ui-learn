import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ARTIFACT_TYPES } from '../../constants/sdlcConstants';

// Import adapters
import { getDocumentAdapter } from './adapters/documentAdapters';
import { getDiagramAdapter } from './adapters/diagramAdapters';
import { getTableAdapter } from './adapters/tableAdapters';

// Lazy load base viewers
const DocumentViewer = React.lazy(() => import('./base/DocumentViewer'));
const TableViewer = React.lazy(() => import('./base/TableViewer'));
const DiagramViewer = React.lazy(() => import('./base/DiagramViewer'));
const KanbanViewer = React.lazy(() => import('./base/KanbanViewer'));
const GanttViewer = React.lazy(() => import('./base/GanttViewer'));

// Lazy load specialized viewers
const ProjectCharterViewer = React.lazy(() => import('./specialized/ProjectCharterViewer'));
const RequirementsViewer = React.lazy(() => import('./specialized/RequirementsViewer'));
const ApiSpecificationViewer = React.lazy(() => import('./specialized/ApiSpecificationViewer'));
const SystemArchitectureViewer = React.lazy(() => import('./specialized/SystemArchitectureViewer'));
const DatabaseDesignViewer = React.lazy(() => import('./specialized/DatabaseDesignViewer'));
const UserStoriesViewer = React.lazy(() => import('./specialized/UserStoriesViewer'));



/**
 * Factory component that renders the appropriate artifact viewer based on artifact type and visualization
 */
const ArtifactRendererFactory = ({
  artifact,
  visualization,
  visualizations = [],
  isEditable = true,
  onContentUpdate,
  onVisualizationChange,
  layoutMode = 'single'
}) => {
  if (!artifact) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No artifact to display
        </Typography>
      </Box>
    );
  }

  // Determine which viewer to use
  const getViewer = () => {
    // If visualization specifies a viewer, use that
    if (visualization?.viewer) {
      return visualization.viewer;
    }

    // Otherwise, determine based on artifact type
    switch (artifact.art_type) {
      // Document-based artifacts
      case ARTIFACT_TYPES.PROJECT_CHARTER:
        return 'projectCharter';
      case ARTIFACT_TYPES.BUSINESS_REQUIREMENTS:
      case ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS:
      case ARTIFACT_TYPES.TECHNICAL_REQUIREMENTS:
        return 'requirements';
      case ARTIFACT_TYPES.API_SPECIFICATION:
        return 'apiSpecification';
      case ARTIFACT_TYPES.SYSTEM_ARCHITECTURE:
        return 'systemArchitecture';
      case ARTIFACT_TYPES.DATABASE_DESIGN:
        return 'databaseDesign';
      case ARTIFACT_TYPES.USER_STORIES:
        return 'userStories';
      
      // Diagram-based artifacts
      case ARTIFACT_TYPES.USE_CASE_DIAGRAM:
      case ARTIFACT_TYPES.CLASS_DIAGRAM:
      case ARTIFACT_TYPES.SEQUENCE_DIAGRAM:
      case ARTIFACT_TYPES.ACTIVITY_DIAGRAM:
      case ARTIFACT_TYPES.COMPONENT_DIAGRAM:
      case ARTIFACT_TYPES.DEPLOYMENT_DIAGRAM:
      case ARTIFACT_TYPES.ER_DIAGRAM:
        return 'diagram';
      
      // Table-based artifacts
      case ARTIFACT_TYPES.TEST_CASES:
      case ARTIFACT_TYPES.RISK_REGISTER:
      case ARTIFACT_TYPES.ISSUE_LOG:
        return 'table';
      
      // Special artifacts
      case ARTIFACT_TYPES.KANBAN_BOARD:
        return 'kanban';
      case ARTIFACT_TYPES.PROJECT_SCHEDULE:
        return 'gantt';
      
      // Default to document viewer
      default:
        return 'document';
    }
  };

  // Get the appropriate adapter for the artifact type
  const getAdapter = () => {
    switch (artifact.art_type) {
      // Document-based artifacts
      case ARTIFACT_TYPES.PROJECT_CHARTER:
      case ARTIFACT_TYPES.BUSINESS_REQUIREMENTS:
      case ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS:
      case ARTIFACT_TYPES.TECHNICAL_REQUIREMENTS:
      case ARTIFACT_TYPES.TECHNICAL_DESIGN:
      case ARTIFACT_TYPES.TEST_PLAN:
      case ARTIFACT_TYPES.USER_MANUAL:
        return getDocumentAdapter(artifact.art_type);
      
      // Diagram-based artifacts
      case ARTIFACT_TYPES.USE_CASE_DIAGRAM:
      case ARTIFACT_TYPES.CLASS_DIAGRAM:
      case ARTIFACT_TYPES.SEQUENCE_DIAGRAM:
      case ARTIFACT_TYPES.ACTIVITY_DIAGRAM:
      case ARTIFACT_TYPES.COMPONENT_DIAGRAM:
      case ARTIFACT_TYPES.DEPLOYMENT_DIAGRAM:
      case ARTIFACT_TYPES.ER_DIAGRAM:
        return getDiagramAdapter(artifact.art_type);
      
      // Table-based artifacts
      case ARTIFACT_TYPES.TEST_CASES:
      case ARTIFACT_TYPES.RISK_REGISTER:
      case ARTIFACT_TYPES.ISSUE_LOG:
        return getTableAdapter(artifact.art_type);
      
      // Default to no adapter (pass through)
      default:
        return (a) => a;
    }
  };

  // Apply adapter to artifact
  const adapter = getAdapter();
  const adaptedArtifact = adapter ? { ...artifact, content: adapter(artifact) } : artifact;

  // Get the viewer to use
  const viewer = getViewer();

  // Render the appropriate viewer
  const renderViewer = () => {
    return (
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      }>
        {viewer === 'document' && (
          <DocumentViewer
            artifact={adaptedArtifact}
            visualization={visualization}
            visualizations={visualizations}
            isEditable={isEditable}
            onContentUpdate={onContentUpdate}
            onVisualizationChange={onVisualizationChange}
            layoutMode={layoutMode}
          />
        )}
        
        {viewer === 'diagram' && (
          <DiagramViewer
            artifact={adaptedArtifact}
            visualization={visualization}
            visualizations={visualizations}
            isEditable={isEditable}
            onContentUpdate={onContentUpdate}
            onVisualizationChange={onVisualizationChange}
            layoutMode={layoutMode}
          />
        )}
        
        {viewer === 'table' && (
          <TableViewer
            artifact={adaptedArtifact}
            visualization={visualization}
            visualizations={visualizations}
            isEditable={isEditable}
            onContentUpdate={onContentUpdate}
            onVisualizationChange={onVisualizationChange}
            layoutMode={layoutMode}
          />
        )}
        
        {viewer === 'kanban' && (
          <KanbanViewer
            artifact={adaptedArtifact}
            visualization={visualization}
            visualizations={visualizations}
            isEditable={isEditable}
            onContentUpdate={onContentUpdate}
            onVisualizationChange={onVisualizationChange}
            layoutMode={layoutMode}
          />
        )}
        
        {viewer === 'gantt' && (
          <GanttViewer
            artifact={adaptedArtifact}
            visualization={visualization}
            visualizations={visualizations}
            isEditable={isEditable}
            onContentUpdate={onContentUpdate}
            onVisualizationChange={onVisualizationChange}
            layoutMode={layoutMode}
          />
        )}
        
        {viewer === 'projectCharter' && (
          <ProjectCharterViewer
            artifact={adaptedArtifact}
            visualization={visualization}
            visualizations={visualizations}
            isEditable={isEditable}
            onContentUpdate={onContentUpdate}
            onVisualizationChange={onVisualizationChange}
            layoutMode={layoutMode}
          />
        )}
        
        {viewer === 'requirements' && (
          <RequirementsViewer
            artifact={adaptedArtifact}
            visualization={visualization}
            visualizations={visualizations}
            isEditable={isEditable}
            onContentUpdate={onContentUpdate}
            onVisualizationChange={onVisualizationChange}
            layoutMode={layoutMode}
          />
        )}
        
        {viewer === 'apiSpecification' && (
          <ApiSpecificationViewer
            artifact={adaptedArtifact}
            visualization={visualization}
            visualizations={visualizations}
            isEditable={isEditable}
            onContentUpdate={onContentUpdate}
            onVisualizationChange={onVisualizationChange}
            layoutMode={layoutMode}
          />
        )}
        
        {viewer === 'systemArchitecture' && (
          <SystemArchitectureViewer
            artifact={adaptedArtifact}
            visualization={visualization}
            visualizations={visualizations}
            isEditable={isEditable}
            onContentUpdate={onContentUpdate}
            onVisualizationChange={onVisualizationChange}
            layoutMode={layoutMode}
          />
        )}
        
        {viewer === 'databaseDesign' && (
          <DatabaseDesignViewer
            artifact={adaptedArtifact}
            visualization={visualization}
            visualizations={visualizations}
            isEditable={isEditable}
            onContentUpdate={onContentUpdate}
            onVisualizationChange={onVisualizationChange}
            layoutMode={layoutMode}
          />
        )}
        
        {viewer === 'userStories' && (
          <UserStoriesViewer
            artifact={adaptedArtifact}
            visualization={visualization}
            visualizations={visualizations}
            isEditable={isEditable}
            onContentUpdate={onContentUpdate}
            onVisualizationChange={onVisualizationChange}
            layoutMode={layoutMode}
          />
        )}
      </Suspense>
    );
  };

  return renderViewer();
};

ArtifactRendererFactory.propTypes = {
  artifact: PropTypes.object,
  visualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onContentUpdate: PropTypes.func,
  onVisualizationChange: PropTypes.func,
  layoutMode: PropTypes.string
};

export default ArtifactRendererFactory; 