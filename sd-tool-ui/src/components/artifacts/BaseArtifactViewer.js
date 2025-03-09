import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper } from '@mui/material';
import TabHeader from '../shared/TabHeader';
import ViewSelector from '../shared/ViewSelector';
import SplitView from '../shared/SplitView';

/**
 * Base component for all artifact viewers
 * Handles common layout, visualization switching, etc.
 */
const BaseArtifactViewer = ({
  artifact,
  activeVisualization,
  visualizations,
  isEditable,
  onVisualizationChange,
  onContentUpdate,
  renderContent,
  secondaryContent,
  headerActions,
  children
}) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader 
        title={artifact.title}
        subtitle={`v${artifact.version}`}
        status={artifact.status}
        lastModified={artifact.lastModified}
        actions={headerActions}
      />
      
      {visualizations?.length > 0 && (
        <ViewSelector 
          visualizations={visualizations}
          activeVisualization={activeVisualization}
          onChange={onVisualizationChange}
        />
      )}
      
      <SplitView
        primary={
          <Paper elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {children}
          </Paper>
        }
        secondary={secondaryContent}
      />
    </Box>
  );
};

BaseArtifactViewer.propTypes = {
  artifact: PropTypes.object.isRequired,
  activeVisualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onVisualizationChange: PropTypes.func,
  onContentUpdate: PropTypes.func,
  renderContent: PropTypes.func,
  secondaryContent: PropTypes.node,
  headerActions: PropTypes.array,
  children: PropTypes.node
};

export default BaseArtifactViewer; 