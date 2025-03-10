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
  const { getArtifact, updateArtifact, loading, error } = useWorkspace();
  const [artifact, setArtifact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load artifact data
  useEffect(() => {
    const loadArtifact = async () => {
      if (!artifactId && !documentId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result = await getArtifact(artifactId, documentId, artifactType);
        setArtifact(result);
      } catch (err) {
        console.error('Error loading artifact:', err);
        setErrorMessage(err.message || 'Failed to load artifact');
      } finally {
        setIsLoading(false);
      }
    };

    loadArtifact();
  }, [artifactId, documentId, artifactType, getArtifact]);

  // Handle content updates
  const handleContentUpdate = async (updatedContent) => {
    if (!artifact) return;

    try {
      const updatedArtifact = {
        ...artifact,
        content: updatedContent
      };
      
      await updateArtifact(updatedArtifact);
      setArtifact(updatedArtifact);
    } catch (err) {
      console.error('Error updating artifact:', err);
      setErrorMessage(err.message || 'Failed to update artifact');
    }
  };

  // Handle visualization changes
  const handleVisualizationChange = (newVisualization) => {
    // This would be implemented to handle switching between different visualizations
    console.log('Visualization changed:', newVisualization);
  };

  // Show loading state
  if (isLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (errorMessage || error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {errorMessage || error || 'An error occurred'}
        </Typography>
      </Box>
    );
  }

  // Show empty state
  if (!artifact) {
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
        artifact={artifact}
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