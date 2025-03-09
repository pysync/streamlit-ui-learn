import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Import visualization configs
import { getDefaultVisualization } from '../../constants/artifactVisualizations';
import { ARTIFACT_TYPES } from '../../constants/sdlcConstants';

// Lazy load renderers to improve performance
const DocumentRenderer = React.lazy(() => import('./DocumentViewer'));
// const GanttRenderer = React.lazy(() => import('./renderers/GanttViewer'));
// const TableRenderer = React.lazy(() => import('./renderers/TableViewer'));
// const DiagramRenderer = React.lazy(() => import('./renderers/DiagramViewer'));
// const ApiSpecRenderer = React.lazy(() => import('./renderers/ApiSpecViewer'));
// const KanbanRenderer = React.lazy(() => import('./renderers/KanbanViewer'));
// const ChartRenderer = React.lazy(() => import('./renderers/ChartViewer'));
// const ListRenderer = React.lazy(() => import('./renderers/ListViewer'));

// Map artifact types to their primary renderers
const ARTIFACT_RENDERERS = {
  // Planning Phase
  [ARTIFACT_TYPES.BUSINESS_CASE]: DocumentRenderer,
  [ARTIFACT_TYPES.PROJECT_CHARTER]: DocumentRenderer,
  // [ARTIFACT_TYPES.PROJECT_PLAN]: GanttRenderer,
  // [ARTIFACT_TYPES.STAKEHOLDER_ANALYSIS]: TableRenderer,
  // [ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN]: TableRenderer,
  
  // // Requirements Phase
  // [ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC]: DocumentRenderer,
  // [ARTIFACT_TYPES.USER_STORIES]: KanbanRenderer,
  // [ARTIFACT_TYPES.USE_CASE_DIAGRAMS]: DiagramRenderer,
  // [ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION]: DocumentRenderer,
  // [ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC]: DocumentRenderer,
  // [ARTIFACT_TYPES.DATA_DICTIONARY]: TableRenderer,
  // [ARTIFACT_TYPES.REQUIREMENTS_TRACEABILITY_MATRIX]: TableRenderer,
  
  // // Design Phase
  // [ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT]: DocumentRenderer,
  // [ARTIFACT_TYPES.DATABASE_DESIGN_DOCUMENT]: DiagramRenderer,
  // [ARTIFACT_TYPES.API_SPECIFICATION]: ApiSpecRenderer,
  // [ARTIFACT_TYPES.UI_UX_DESIGN_SPECIFICATION]: DocumentRenderer,
  // [ARTIFACT_TYPES.TECHNICAL_DESIGN_DOCUMENT]: DocumentRenderer,
  // [ARTIFACT_TYPES.DEPLOYMENT_ARCHITECTURE]: DiagramRenderer,
  // [ARTIFACT_TYPES.SECURITY_DESIGN_DOCUMENT]: DocumentRenderer,
  
  // // Testing Phase
  // [ARTIFACT_TYPES.TEST_PLAN]: DocumentRenderer,
  // [ARTIFACT_TYPES.TEST_CASES_SPECIFICATION]: TableRenderer,
  // [ARTIFACT_TYPES.TEST_DATA]: TableRenderer,
  // [ARTIFACT_TYPES.TEST_EXECUTION_REPORT]: ChartRenderer,
  // [ARTIFACT_TYPES.DEFECT_REPORT]: TableRenderer,
  // [ARTIFACT_TYPES.PERFORMANCE_TEST_REPORT]: ChartRenderer,
  // [ARTIFACT_TYPES.SECURITY_TEST_REPORT]: ChartRenderer,
  // [ARTIFACT_TYPES.UAT_PLAN]: DocumentRenderer,
  // [ARTIFACT_TYPES.UAT_REPORT]: DocumentRenderer
};

// Map visualization types to renderer components
const VISUALIZATION_RENDERERS = {
  'document': DocumentRenderer,
  'richText': DocumentRenderer,
  'markdown': DocumentRenderer,
  // 'table': TableRenderer,
  // 'matrix': TableRenderer,
  // 'grid': TableRenderer,
  // 'chart': ChartRenderer,
  // 'barChart': ChartRenderer, 
  // 'pieChart': ChartRenderer,
  // 'lineChart': ChartRenderer,
  // 'timeline': GanttRenderer,
  // 'gantt': GanttRenderer,
  // 'diagram': DiagramRenderer,
  // 'erd': DiagramRenderer,
  // 'flow': DiagramRenderer,
  // 'uml': DiagramRenderer,
  // 'network': DiagramRenderer,
  // 'list': ListRenderer,
  // 'card': ListRenderer,
  // 'kanban': KanbanRenderer,
  // 'swagger': ApiSpecRenderer,
  // 'apiExplorer': ApiSpecRenderer
};

/**
 * ArtifactRenderer - Dynamically renders artifacts based on their type and visualization
 */
const ArtifactRenderer = ({
  artifact,
  isEditable = true,
  onUpdate,
  onError,
  loadingOverride = false
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVisualization, setActiveVisualization] = useState(null);
  const [parsedContent, setParsedContent] = useState({});
  
  // Parse artifact content
  useEffect(() => {
    if (!artifact) {
      setError('No artifact provided');
      setLoading(false);
      return;
    }
    
    try {
      // Parse the content if it's a string
      let content = {};
      if (typeof artifact.content === 'string') {
        try {
          content = JSON.parse(artifact.content);
        } catch (e) {
          // If not valid JSON, use as-is (might be plain text)
          content = { textContent: artifact.content };
        }
      } else if (artifact.content) {
        // If already an object, use directly
        content = artifact.content;
      }
      
      // Get default visualization
      const defaultViz = getDefaultVisualization(artifact.artifactType);
      
      // Initialize with default visualization
      setActiveVisualization(defaultViz);
      setParsedContent(content);
      setLoading(false);
    } catch (err) {
      console.error('Error parsing artifact content:', err);
      setError(`Failed to parse artifact: ${err.message}`);
      setLoading(false);
      if (onError) onError(err);
    }
  }, [artifact]);
  
  // Handle visualization change
  const handleVisualizationChange = (newVisualization) => {
    setActiveVisualization(newVisualization);
  };
  
  // Handle content update
  const handleContentUpdate = (updatedContent) => {
    if (onUpdate) {
      // Convert to string if needed
      const contentToSave = typeof updatedContent === 'object' 
        ? JSON.stringify(updatedContent) 
        : updatedContent;
      
      onUpdate({
        ...artifact,
        content: contentToSave
      });
    }
    
    setParsedContent(updatedContent);
  };
  
  // Handle view config update
  const handleViewConfigUpdate = (updatedConfig) => {
    if (onUpdate) {
      const updatedArtifact = {
        ...artifact,
        visualization: artifact.visualization.map(viz => 
          viz.type === activeVisualization.type && 
          viz.subtype === activeVisualization.subtype
            ? { ...viz, ...updatedConfig }
            : viz
        )
      };
      
      onUpdate(updatedArtifact);
    }
  };
  
  // Render loading state
  if (loading || loadingOverride) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          p: 4
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Paper 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 2
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />
        <Typography variant="h6" color="error">Error Loading Artifact</Typography>
        <Typography color="text.secondary">{error}</Typography>
      </Paper>
    );
  }
  
  // Determine the renderer to use
  let RendererComponent;
  
  if (activeVisualization) {
    // First try to get a renderer for the visualization type
    RendererComponent = VISUALIZATION_RENDERERS[activeVisualization.type];
    
    // If no specific renderer for visualization, fall back to artifact type
    if (!RendererComponent) {
      RendererComponent = ARTIFACT_RENDERERS[artifact.artifactType];
    }
  } else {
    // Fall back to artifact type renderer
    RendererComponent = ARTIFACT_RENDERERS[artifact.artifactType];
  }
  
  // If still no renderer found, use document renderer as fallback
  if (!RendererComponent) {
    RendererComponent = DocumentRenderer;
  }
  
  // Render the artifact with the selected renderer
  return (
    <React.Suspense
      fallback={
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            p: 4
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <RendererComponent
        artifact={artifact}
        content={parsedContent}
        visualization={activeVisualization}
        visualizations={artifact.visualization || []}
        isEditable={isEditable}
        onVisualizationChange={handleVisualizationChange}
        onContentUpdate={handleContentUpdate}
        onViewConfigUpdate={handleViewConfigUpdate}
      />
    </React.Suspense>
  );
};

ArtifactRenderer.propTypes = {
  artifact: PropTypes.shape({
    artifactId: PropTypes.string.isRequired,
    artifactType: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    visualization: PropTypes.array
  }),
  isEditable: PropTypes.bool,
  onUpdate: PropTypes.func,
  onError: PropTypes.func,
  loadingOverride: PropTypes.bool
};

export default ArtifactRenderer 