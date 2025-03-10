import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, CircularProgress, Typography } from '@mui/material';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import ArtifactRendererFactory from './ArtifactRendererFactory';

/**
 * Main artifact viewer component that loads artifact data and passes it to the appropriate renderer
 */
const ArtifactViewer = ({ 
  artifactId, 
  documentId, 
  artifactType,
  visualization,
  visualizations,
  isEditable = true,
  layoutMode = 'single'
}) => {
  const { activeArtifact, execUpdateArtifact } = useWorkspace();

  // Handle content updates
  const handleContentUpdate = async (updatedContent) => {
      if (!activeArtifact) return;

      const updatedArtifact = {
        ...activeArtifact,
        content: updatedContent
      };
      await execUpdateArtifact(updatedArtifact.document_id, updatedArtifact);
  };

  // Handle visualization changes
  const handleVisualizationChange = (newVisualization) => {
    // This would be implemented to handle switching between different visualizations
    console.log('Visualization changed:', newVisualization);
  };

 
  // Show empty state
  if (!activeArtifact) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No artifact selected
        </Typography>
      </Box>
    );
  }

  // Render the appropriate artifact viewer
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ArtifactRendererFactory
        artifact={activeArtifact}
        visualization={visualization}
        visualizations={visualizations}
        isEditable={isEditable}
        onContentUpdate={handleContentUpdate}
        onVisualizationChange={handleVisualizationChange}
        layoutMode={layoutMode}
      />
    </Box>
  );
};

ArtifactViewer.propTypes = {
  artifactId: PropTypes.string,
  documentId: PropTypes.string,
  artifactType: PropTypes.string,
  visualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  layoutMode: PropTypes.string
};

export default ArtifactViewer;