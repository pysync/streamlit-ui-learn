import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Chip, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { formatDate } from '../../utils/dateUtils';

/**
 * Shared header component for artifact tabs
 */
const TabHeader = ({ 
  title, 
  artifactType, 
  version = '1.0', 
  status = 'draft', 
  lastModified, 
  actions = [], 
  onActionClick,
  visualizationSelector = null
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleActionClick = (action) => {
    // First try to use the action's direct onClick handler
    if (action.onClick) {
      action.onClick();
    } 
    // Fall back to the onActionClick prop if provided
    else if (onActionClick) {
      onActionClick(action.id);
    }
    
    handleMenuClose();
  };
  
  // Format the last modified date if provided
  const formattedDate = lastModified 
    ? formatDate(lastModified)
    : 'unknown';
  
  // Define status colors
  const statusColors = {
    draft: 'default',
    active: 'primary',
    review: 'info',
    approved: 'success',
    rejected: 'error',
    archived: 'warning',
  };
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
            {title || 'Untitled'}
          </Typography>
          
          {status && (
            <Chip
              label={status}
              size="small"
              color={status === 'Draft' ? 'warning' : status === 'Published' ? 'success' : statusColors[status] || 'default'}
              sx={{ ml: 2 }}
            />
          )}
          
          {lastModified && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
              Last modified: {formattedDate}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Visualization selector */}
          {visualizationSelector && (
            <Box sx={{ mr: 2 }}>
              {visualizationSelector}
            </Box>
          )}
          
          {/* Display the main actions as buttons */}
          {actions.slice(0, 3).map(action => (
            <Tooltip key={action.id} title={action.label}>
              <IconButton 
                color="primary" 
                size="small"
                onClick={() => handleActionClick(action)}
                disabled={action.disabled}
              >
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
          
          {/* Display additional actions in a menu */}
          {actions.length > 3 && (
            <>
              <Tooltip title="More actions">
                <IconButton 
                  size="small"
                  aria-label="more actions" 
                  onClick={handleMenuClick}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
              >
                {actions.slice(3).map(action => (
                  <MenuItem 
                    key={action.id} 
                    onClick={() => handleActionClick(action)}
                    disabled={action.disabled}
                  >
                    {action.icon && (
                      <Box component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        {action.icon}
                      </Box>
                    )}
                    {action.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Chip 
          label={artifactType} 
          size="small" 
          color="secondary" 
          variant="outlined" 
        />
        
        <Chip 
          label={`v${version}`} 
          size="small" 
          variant="outlined" 
        />
      </Box>
    </Box>
  );
};

TabHeader.propTypes = {
  title: PropTypes.string,
  artifactType: PropTypes.string.isRequired,
  version: PropTypes.string,
  status: PropTypes.string,
  lastModified: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
  })),
  onActionClick: PropTypes.func,
  visualizationSelector: PropTypes.node
};

export default TabHeader; 