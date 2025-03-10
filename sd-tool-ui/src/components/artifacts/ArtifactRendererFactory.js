import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ARTIFACT_TYPES } from '../../constants/sdlcConstants';

// Lazy load base viewers
const DocumentViewer = React.lazy(() => import('./base/DocumentViewer'));
const TableViewer = React.lazy(() => import('./base/TableViewer'));
const DiagramViewer = React.lazy(() => import('./base/DiagramViewer'));
const KanbanViewer = React.lazy(() => import('./base/KanbanViewer'));
const GanttViewer = React.lazy(() => import('./base/GanttViewer'));

// Lazy load specialized viewers
const RequirementsViewer = React.lazy(() => import('./specialized/RequirementsViewer'));
const ApiSpecificationViewer = React.lazy(() => import('./specialized/ApiSpecificationViewer'));
const SystemArchitectureViewer = React.lazy(() => import('./specialized/SystemArchitectureViewer'));
const ProjectCharterViewer = React.lazy(() => import('./specialized/ProjectCharterViewer'));

// Import adapters
import { getTableAdapter } from './adapters/tableAdapters';
import { getDiagramAdapter } from './adapters/diagramAdapters';
import { 
  projectCharterAdapter,
  businessRequirementsAdapter,
  functionalRequirementsAdapter,
  technicalDesignAdapter,
  testPlanAdapter,
  userManualAdapter
} from './adapters/documentAdapters';

/**
 * Factory component that selects and renders the appropriate artifact viewer
 * based on the artifact type and visualization
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="body1" color="text.secondary">
          No artifact selected
        </Typography>
      </Box>
    );
  }

  // Determine which viewer to use based on artifact type and visualization
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
      
      // Requirements use specialized viewer
      case ARTIFACT_TYPES.BUSINESS_REQUIREMENTS:
      case ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS:
        return 'requirements';
      
      // System architecture uses specialized viewer
      case ARTIFACT_TYPES.SYSTEM_ARCHITECTURE:
        return 'systemArchitecture';
      
      case ARTIFACT_TYPES.TECHNICAL_DESIGN:
      case ARTIFACT_TYPES.TEST_PLAN:
      case ARTIFACT_TYPES.USER_MANUAL:
        return 'document';
      
      // Table-based artifacts
      case ARTIFACT_TYPES.TEST_CASES:
      case ARTIFACT_TYPES.DEFECT_REPORT:
      case ARTIFACT_TYPES.RISK_REGISTER:
        return 'table';
      
      // Diagram-based artifacts
      case ARTIFACT_TYPES.DATABASE_DESIGN:
      case ARTIFACT_TYPES.DEPLOYMENT_DIAGRAM:
      case ARTIFACT_TYPES.SEQUENCE_DIAGRAM:
      case ARTIFACT_TYPES.CLASS_DIAGRAM:
        return 'diagram';
      
      // Timeline-based artifacts
      case ARTIFACT_TYPES.PROJECT_PLAN:
      case ARTIFACT_TYPES.RELEASE_PLAN:
        return 'gantt';
      
      // API-based artifacts
      case ARTIFACT_TYPES.API_SPECIFICATION:
        return 'apiSpecification';
      
      // Board-based artifacts
      case ARTIFACT_TYPES.USER_STORIES:
      case ARTIFACT_TYPES.TASK_BOARD:
        return 'kanban';
      
      // Default to document viewer
      default:
        return 'document';
    }
  };

  // Apply the appropriate adapter to transform the artifact content
  const getAdaptedContent = () => {
    const viewer = getViewer();
    let adaptedArtifact = { ...artifact };
    
    switch (viewer) {
      case 'table':
        const tableAdapter = getTableAdapter(artifact.art_type);
        adaptedArtifact.content = tableAdapter(artifact);
        break;
      
      case 'diagram':
        const diagramAdapter = getDiagramAdapter(artifact.art_type);
        adaptedArtifact.content = diagramAdapter(artifact);
        break;
      
      case 'document':
        // Apply document adapters based on artifact type
        switch (artifact.art_type) {
          case ARTIFACT_TYPES.PROJECT_CHARTER:
            adaptedArtifact.content = projectCharterAdapter(artifact);
            break;
          case ARTIFACT_TYPES.BUSINESS_REQUIREMENTS:
            adaptedArtifact.content = businessRequirementsAdapter(artifact);
            break;
          case ARTIFACT_TYPES.FUNCTIONAL_REQUIREMENTS:
            adaptedArtifact.content = functionalRequirementsAdapter(artifact);
            break;
          case ARTIFACT_TYPES.TECHNICAL_DESIGN:
            adaptedArtifact.content = technicalDesignAdapter(artifact);
            break;
          case ARTIFACT_TYPES.TEST_PLAN:
            adaptedArtifact.content = testPlanAdapter(artifact);
            break;
          case ARTIFACT_TYPES.USER_MANUAL:
            adaptedArtifact.content = userManualAdapter(artifact);
            break;
          default:
            // No adapter needed
            break;
        }
        break;
      
      default:
        // No adapter needed for specialized viewers
        break;
    }
    
    return adaptedArtifact;
  };

  // Get the adapted artifact
  const adaptedArtifact = getAdaptedContent();
  
  // Render the appropriate viewer with a loading fallback
  const renderViewer = () => {
    const viewer = getViewer();
    
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