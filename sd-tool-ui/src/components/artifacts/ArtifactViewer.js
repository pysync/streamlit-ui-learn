import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useEditor } from '../../contexts/EditorContext';
import { useLoading } from '../../contexts/LoadingContext';
import { useMessage } from '../../contexts/MessageContext';
import { useWorkspaceLayout } from '../../contexts/WorkspaceLayoutContext';
import { ARTIFACT_TYPES } from '../../constants/sdlcConstants';
import { getDefaultVisualization, ARTIFACT_VISUALIZATIONS } from '../../constants/artifactVisualizations';

// Import specific viewers
import DocumentViewer from './DocumentViewer';
import FunctionalSpecViewer from './FunctionalSpecViewer';
import TableViewer from './TableViewer';
import GenericViewer from './GenericViewer';

/**
 * Main artifact viewer component that determines which specific viewer to render
 */
const ArtifactViewer = () => {
  // Get layoutMode from context
  const { layoutMode } = useWorkspaceLayout();
  const { activeArtifact, saveArtifact } = useWorkspace();
  const { registerSaveHandler, registerFullscreenHandler } = useEditor();
  const { loading, showLoading, hideLoading } = useLoading();
  const { showError, showSuccess } = useMessage();
  const [currentVisualization, setCurrentVisualization] = useState(null);
  
  // Register global handlers for keyboard shortcuts
  useEffect(() => {
    const saveCurrentArtifact = async () => {
      if (activeArtifact) {
        try {
          await saveArtifact(activeArtifact);
          showSuccess('Artifact saved successfully');
        } catch (error) {
          showError('Failed to save artifact: ' + error.message);
        }
      }
    };
    
    const toggleFullscreen = () => {
      // Implementation for fullscreen toggle
      console.log('Toggle fullscreen');
    };
    
    if (registerSaveHandler) {
      registerSaveHandler(saveCurrentArtifact);
    }
    
    if (registerFullscreenHandler) {
      registerFullscreenHandler(toggleFullscreen);
    }
    
    return () => {
      // Cleanup handlers
    };
  }, [activeArtifact, saveArtifact, registerSaveHandler, registerFullscreenHandler, showSuccess, showError]);
  
  // Initialize visualization when artifact changes
  useEffect(() => {
    if (activeArtifact) {
      const defaultViz = getDefaultVisualization(activeArtifact.art_type);
      setCurrentVisualization(defaultViz);
    }
  }, [activeArtifact?.document_id]);
  
  // Add debug logging for viewer selection
  useEffect(() => {
    if (activeArtifact) {
      console.groupCollapsed(`🔍 Artifact Viewer Debug - ${activeArtifact.document_id}`);
      console.log('Artifact Type:', activeArtifact.art_type);
      console.log('Title:', activeArtifact.title);
      console.log('Layout Mode:', layoutMode);
      console.log('Selected Visualization:', currentVisualization);
      console.groupEnd();
    }
  }, [activeArtifact, currentVisualization, layoutMode]);
  
  // Handle content updates
  const handleContentUpdate = async (updatedContent) => {
    if (!activeArtifact) return;
    
    showLoading('Saving artifact...');
    
    try {
      const updatedArtifact = {
        ...activeArtifact,
        content: updatedContent,
        lastModified: new Date().toISOString()
      };
      
      await saveArtifact(updatedArtifact);
      showSuccess('Artifact saved successfully');
    } catch (error) {
      showError('Failed to save artifact: ' + error.message);
    } finally {
      hideLoading();
    }
  };
  
  // Handle visualization change
  const handleVisualizationChange = (newVisualization) => {
    setCurrentVisualization(newVisualization);
  };
  
  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Show message if no artifact is selected
  if (!activeArtifact) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6" color="text.secondary">
          No artifact selected
        </Typography>
      </Box>
    );
  }
  
  // Get visualizations for this artifact type from constants
  const visualizations = ARTIFACT_VISUALIZATIONS[activeArtifact.art_type] || [];
  
  // Determine which viewer to use based on artifact type
  switch (activeArtifact.art_type) {
    // Functional Specification gets its own specialized viewer
    case ARTIFACT_TYPES.FUNCTIONAL_SPECIFICATION:
      console.log(`📄 Rendering FunctionalSpecViewer for ${activeArtifact.document_id}`);
      return (
        <FunctionalSpecViewer
          artifact={activeArtifact}
          activeVisualization={currentVisualization}
          visualizations={visualizations}
          isEditable={true}
          onContentUpdate={handleContentUpdate}
          onVisualizationChange={handleVisualizationChange}
        />
      );
    
    // Document-based artifacts
    case ARTIFACT_TYPES.BUSINESS_REQUIREMENTS_SPEC:
    case ARTIFACT_TYPES.SYSTEM_ARCHITECTURE_DOCUMENT:
    case ARTIFACT_TYPES.TECHNICAL_DESIGN_DOCUMENT:
    case ARTIFACT_TYPES.SECURITY_DESIGN_DOCUMENT:
    case ARTIFACT_TYPES.TEST_PLAN:
    case ARTIFACT_TYPES.UAT_PLAN:
    case ARTIFACT_TYPES.UAT_REPORT:
    case ARTIFACT_TYPES.BUSINESS_CASE:
    case ARTIFACT_TYPES.PROJECT_CHARTER:
    case ARTIFACT_TYPES.NON_FUNCTIONAL_REQUIREMENTS_SPEC:
      console.log(`📝 Rendering DocumentViewer for ${activeArtifact.document_id}`);
      return (
        <DocumentViewer
          artifact={activeArtifact}
          activeVisualization={currentVisualization}
          visualizations={visualizations}
          isEditable={true}
          onContentUpdate={handleContentUpdate}
          onVisualizationChange={handleVisualizationChange}
        />
      );
    
    // Table-based artifacts
    case ARTIFACT_TYPES.TEST_CASES_SPECIFICATION:
    case ARTIFACT_TYPES.DATA_DICTIONARY:
    case ARTIFACT_TYPES.TEST_DATA:
    case ARTIFACT_TYPES.DEFECT_REPORT:
    case ARTIFACT_TYPES.RISK_MANAGEMENT_PLAN:
      console.log(`📊 Rendering TableViewer for ${activeArtifact.document_id}`);
      return (
        <TableViewer
          artifact={activeArtifact}
          activeVisualization={currentVisualization}
          visualizations={visualizations}
          isEditable={true}
          onContentUpdate={handleContentUpdate}
          onVisualizationChange={handleVisualizationChange}
        />
      );
    
    // For all other types, use the generic viewer
    default:
      console.warn(`🔄 Using GenericViewer for unsupported type: ${activeArtifact?.art_type}`);
      return (
        <GenericViewer
          artifact={activeArtifact}
          activeVisualization={currentVisualization}
          visualizations={visualizations}
          isEditable={true}
          onContentUpdate={handleContentUpdate}
          onVisualizationChange={handleVisualizationChange}
        />
      );
  }
};

export default ArtifactViewer;