import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button } from '@mui/material';
import BaseArtifactViewer from '../BaseArtifactViewer';
import RelatedItemsPanel from '../../shared/RelatedItemsPanel';
import { useArtifact } from '../../core/ArtifactContext';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Generic viewer for artifact types that don't have a specialized viewer
 */
const GenericViewer = ({
  artifact,
  activeVisualization,
  visualizations,
  isEditable = false,
  onVisualizationChange,
  onContentUpdate,
}) => {
  const { navigateToArtifact } = useArtifact();

  const contentDisplay = () => {
    if (!artifact || !artifact.content) {
      return (
        <Typography variant="body1" sx={{ p: 2 }}>
          No content available for this artifact.
        </Typography>
      );
    }

    // Try to display structured content if it's an object
    if (typeof artifact.content === 'object') {
      return (
        <Box sx={{ p: 2 }}>
          <pre>
            {JSON.stringify(artifact.content, null, 2)}
          </pre>
        </Box>
      );
    }

    // Display text content
    return (
      <Typography variant="body1" sx={{ p: 2 }}>
        {artifact.content}
      </Typography>
    );
  };

  // Handle artifact reference click
  const handleArtifactClick = (reference) => {
    navigateToArtifact(reference.id);
  };

  // Secondary panel content
  const secondaryContent = artifact.references?.length > 0 ? (
    <RelatedItemsPanel
      references={artifact.references}
      onArtifactClick={handleArtifactClick}
      editable={isEditable}
    />
  ) : null;

  return (
    <BaseArtifactViewer
      artifact={artifact}
      activeVisualization={activeVisualization}
      visualizations={visualizations}
      isEditable={isEditable}
      onVisualizationChange={onVisualizationChange}
      headerActions={[]}
      secondaryContent={secondaryContent}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%' 
      }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%', maxWidth: 600 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <InfoIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Viewing Generic Artifact
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            This is a generic view for the artifact type: <strong>{artifact.type}</strong>. 
            A specialized viewer is not yet available for this type.
          </Typography>
          
          {isEditable && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                // Option to edit raw content if needed
                if (onContentUpdate) {
                  onContentUpdate(artifact);
                }
              }}
            >
              Edit Raw Content
            </Button>
          )}
        </Paper>
        
        <Paper elevation={1} sx={{ p: 2, width: '100%' }}>
          <Typography variant="subtitle1" gutterBottom>
            Artifact Content
          </Typography>
          <Box sx={{ 
            maxHeight: '400px', 
            overflow: 'auto', 
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 1
          }}>
            {contentDisplay()}
          </Box>
        </Paper>
      </Box>
    </BaseArtifactViewer>
  );
};

GenericViewer.propTypes = {
  artifact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    document_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    references: PropTypes.array,
    visualizations: PropTypes.array,
    version: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    lastModified: PropTypes.string
  }).isRequired,
  activeVisualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onVisualizationChange: PropTypes.func,
  onContentUpdate: PropTypes.func
};

export default GenericViewer; 