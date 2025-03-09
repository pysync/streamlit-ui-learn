import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider,
  Alert
} from '@mui/material';

// Import shared components
import TabHeader from '../../Shared/TabHeader';
import ViewTypeSelector from '../../Shared/ViewTypeSelector';
import SplitView from '../../Shared/SplitView';
import RelatedArtifactsPanel from '../../Shared/RelatedArtifactsPanel';

/**
 * Generic renderer for artifact types without a specialized renderer
 */
const GenericRenderer = ({
  artifact,
  visualization,
  visualizations,
  isEditable = false,
  onVisualizationChange,
  onContentUpdate
}) => {
  // Handle visualization change
  const handleVisualizationChange = (newVisualization) => {
    if (onVisualizationChange) {
      onVisualizationChange(newVisualization);
    }
  };
  
  // Handle content as JSON or plain text
  const renderContent = () => {
    try {
      // Try to parse as JSON
      const contentObj = typeof artifact.content === 'string' 
        ? JSON.parse(artifact.content) 
        : artifact.content;
        
      return (
        <pre style={{ 
          margin: 0, 
          padding: '1rem', 
          overflowX: 'auto',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          {JSON.stringify(contentObj, null, 2)}
        </pre>
      );
    } catch (e) {
      // Render as plain text if not valid JSON
      return (
        <Typography 
          component="div" 
          sx={{ 
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            p: 2
          }}
        >
          {artifact.content || ''}
        </Typography>
      );
    }
  };
  
  // Secondary panel content
  const secondaryContent = artifact.references?.length > 0 ? (
    <RelatedArtifactsPanel
      references={artifact.references}
      onArtifactClick={(ref) => {
        console.log('Navigate to artifact:', ref);
      }}
      editable={isEditable}
    />
  ) : null;
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabHeader 
        title={artifact.title}
        artifactType={artifact.art_type}
        version={artifact.version}
        status={artifact.status}
        lastModified={artifact.updated_at}
      />
      
      <ViewTypeSelector 
        visualizations={visualizations}
        activeVisualization={visualization}
        onChange={handleVisualizationChange}
      />
      
      <Alert severity="info" sx={{ m: 2 }}>
        No specialized renderer available for artifact type: {artifact.art_type}
      </Alert>
      
      <SplitView 
        secondaryContent={secondaryContent}
        showSecondary={!!secondaryContent}
      >
        <Paper 
          elevation={1} 
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="h5">{artifact.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              Type: {artifact.art_type} • Version: {artifact.version} • Status: {artifact.status}
            </Typography>
          </Box>
          
          <Divider />
          
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {renderContent()}
          </Box>
        </Paper>
      </SplitView>
    </Box>
  );
};

GenericRenderer.propTypes = {
  artifact: PropTypes.shape({
    id: PropTypes.number,
    document_id: PropTypes.string.isRequired,
    art_type: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    references: PropTypes.array,
    version: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    status: PropTypes.string,
    updated_at: PropTypes.string,
    dependencies: PropTypes.object
  }).isRequired,
  visualization: PropTypes.object,
  visualizations: PropTypes.array,
  isEditable: PropTypes.bool,
  onVisualizationChange: PropTypes.func,
  onContentUpdate: PropTypes.func
};

export default GenericRenderer; 