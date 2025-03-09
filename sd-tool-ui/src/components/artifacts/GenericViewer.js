import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Divider, IconButton } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import TabHeader from '../shared/TabHeader';
import ViewSelector from '../shared/ViewSelector';
import SplitView from '../shared/SplitView';
import RelatedItemsPanel from '../shared/RelatedItemsPanel';
import { useWorkspace } from '../../contexts/WorkspaceContext';

/**
 * Fallback viewer for unsupported artifact types
 */
const GenericViewer = ({
  artifact,
  activeVisualization,
  visualizations,
  isEditable = false,
  onContentUpdate,
  onVisualizationChange,
  layoutMode = 'single'
}) => {
  const { navigateToArtifact } = useWorkspace();
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'raw'

  const handleVisualizationChange = (newViz) => {
    if (onVisualizationChange) {
      onVisualizationChange(newViz);
    }
  };

  const secondaryContent = artifact?.references?.length > 0 && (
    <RelatedItemsPanel
      references={artifact.references}
      onArtifactClick={navigateToArtifact}
    />
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader
        title={artifact?.title || 'Untitled Artifact'}
        status={artifact?.status}
        lastModified={artifact?.lastModified}
        actions={[
          <IconButton
            key="view-mode"
            onClick={() => setViewMode(prev => prev === 'preview' ? 'raw' : 'preview')}
            title="Toggle View Mode"
          >
            {viewMode === 'preview' ? <CodeIcon /> : <DescriptionIcon />}
          </IconButton>
        ]}
      />
      
      {visualizations && visualizations.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1 }}>
          <ViewSelector
            visualizations={visualizations}
            activeVisualization={activeVisualization}
            onChange={handleVisualizationChange}
          />
        </Box>
      )}
      
      <SplitView
        direction={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
        primaryContent={
          <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            {viewMode === 'preview' ? (
              <Paper sx={{ p: 2, whiteSpace: 'pre-wrap' }}>
                {typeof artifact.content === 'string' ? (
                  artifact.content
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {JSON.stringify(artifact.content, null, 2)}
                  </Typography>
                )}
              </Paper>
            ) : (
              <Box sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(artifact, null, 2)}
              </Box>
            )}
          </Box>
        }
        secondaryContent={secondaryContent}
        showSecondary={layoutMode !== 'single' && !!secondaryContent}
      />
    </Box>
  );
};

GenericViewer.propTypes = {
  artifact: PropTypes.shape({
    id: PropTypes.string,
    document_id: PropTypes.string.isRequired,
    art_type: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    references: PropTypes.array,
    version: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
  }),
  activeVisualization: PropTypes.string,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onContentUpdate: PropTypes.func,
  onVisualizationChange: PropTypes.func,
  layoutMode: PropTypes.string
}; 

export default GenericViewer;