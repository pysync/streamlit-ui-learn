import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import ArtifactRendererFactory from './ArtifactRendererFactory';
import { getDefaultVisualization, ARTIFACT_VISUALIZATIONS } from '../../constants/artifactVisualizations';

/**
 * Common wrapper for artifact content that works with the tab system
 * and replaces the need for a separate ArtifactDetailsView
 */
const ArtifactContent = ({ layoutMode }) => {
  const { 
    activeArtifact,
    execUpdateArtifact,
    currentWorkspace
  } = useWorkspace();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentVisualization, setCurrentVisualization] = useState(null);
  
  useEffect(() => {
    if (activeArtifact) {
      // Set default visualization based on artifact type
      const defaultViz = getDefaultVisualization(activeArtifact.art_type);
      setCurrentVisualization(defaultViz);
    }
  }, [activeArtifact]);
  
  const handleContentUpdate = async (newContent) => {
    if (!activeArtifact) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const artifactData = {
        ...activeArtifact,
        content: typeof newContent === 'object' ? JSON.stringify(newContent) : newContent
      };
      
      await execUpdateArtifact(activeArtifact.document_id, artifactData);
    } catch (err) {
      console.error('Error updating artifact content:', err);
      setError('Failed to update content. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleVisualizationChange = (newVisualization) => {
    setCurrentVisualization(newVisualization);
  };
  
  if (!activeArtifact) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Alert severity="info">Select an artifact to view its content</Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      {loading && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 10
        }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      <ArtifactRendererFactory
        artifact={activeArtifact}
        visualization={currentVisualization}
        visualizations={ARTIFACT_VISUALIZATIONS[activeArtifact.art_type] || []}
        isEditable={true}
        onContentUpdate={handleContentUpdate}
        onVisualizationChange={handleVisualizationChange}
        layoutMode={layoutMode}
      />
    </Box>
  );
};

ArtifactContent.propTypes = {
  layoutMode: PropTypes.string
};

export default ArtifactContent; 