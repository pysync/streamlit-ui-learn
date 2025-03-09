import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  IconButton, 
  Tooltip,
  Button
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import AddLinkIcon from '@mui/icons-material/AddLink';
import DeleteIcon from '@mui/icons-material/Delete';

// Import artifact type icons and labels
import { 
  ARTIFACT_TYPE_ICONS, 
  ARTIFACT_TYPE_LABELS 
} from '../../constants/sdlcConstants';

/**
 * Panel displaying related artifacts with the ability to add/remove references
 */
const RelatedArtifactsPanel = ({
  references = [], 
  onArtifactClick, 
  onAddReference, 
  onRemoveReference,
  title = "Related Artifacts",
  editable = true
}) => {
  // Group references by type
  const groupedReferences = references.reduce((acc, ref) => {
    const { artifactType } = ref;
    if (!acc[artifactType]) {
      acc[artifactType] = [];
    }
    acc[artifactType].push(ref);
    return acc;
  }, {});

  return (
    <Paper
      elevation={1}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6">{title}</Typography>
        
        {editable && onAddReference && (
          <Tooltip title="Add Reference">
            <IconButton onClick={onAddReference} color="primary">
              <AddLinkIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        {Object.keys(groupedReferences).length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No related artifacts
            </Typography>
            
            {editable && onAddReference && (
              <Button 
                variant="outlined" 
                startIcon={<AddLinkIcon />}
                onClick={onAddReference}
              >
                Add Reference
              </Button>
            )}
          </Box>
        ) : (
          <>
            {Object.entries(groupedReferences).map(([artifactType, refs], index) => (
              <React.Fragment key={artifactType}>
                {index > 0 && <Divider />}
                
                <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover' }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                  >
                    {ARTIFACT_TYPE_LABELS[artifactType] || artifactType}
                  </Typography>
                </Box>
                
                <List dense disablePadding>
                  {refs.map((ref) => {
                    const IconComponent = ARTIFACT_TYPE_ICONS[ref.artifactType] || LinkIcon;
                    
                    return (
                      <ListItem
                        key={ref.artifactId}
                        sx={{ 
                          '&:hover': { bgcolor: 'action.hover' },
                          cursor: 'pointer'
                        }}
                        secondaryAction={
                          editable && onRemoveReference && (
                            <IconButton 
                              edge="end" 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveReference(ref);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )
                        }
                        onClick={() => onArtifactClick && onArtifactClick(ref)}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <IconComponent fontSize="small" />
                        </ListItemIcon>
                        
                        <ListItemText
                          primary={ref.title || ref.artifactId}
                          primaryTypographyProps={{
                            noWrap: true,
                            title: ref.title || ref.artifactId
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </React.Fragment>
            ))}
          </>
        )}
      </Box>
    </Paper>
  );
};

RelatedArtifactsPanel.propTypes = {
  references: PropTypes.arrayOf(
    PropTypes.shape({
      artifactType: PropTypes.string.isRequired,
      artifactId: PropTypes.string.isRequired,
      title: PropTypes.string
    })
  ),
  onArtifactClick: PropTypes.func,
  onAddReference: PropTypes.func,
  onRemoveReference: PropTypes.func,
  title: PropTypes.string,
  editable: PropTypes.bool
};

export default RelatedArtifactsPanel; 