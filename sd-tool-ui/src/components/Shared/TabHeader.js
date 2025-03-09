import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Chip, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { formatDistanceToNow } from 'date-fns';

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
  onActionClick
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleActionClick = (actionId) => {
    if (onActionClick) {
      onActionClick(actionId);
    }
    handleMenuClose();
  };
  
  // Format the last modified date if provided
  const formattedDate = lastModified 
    ? formatDistanceToNow(new Date(lastModified), { addSuffix: true }) 
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
        borderColor: 'divider' 
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" component="h1">
          {title || 'Untitled'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Display the main actions as buttons */}
          {actions.slice(0, 3).map(action => (
            <Tooltip key={action.id} title={action.label}>
              <IconButton 
                color="primary" 
                size="small"
                onClick={() => handleActionClick(action.id)}
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
                    onClick={() => handleActionClick(action.id)}
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
        
        <Chip 
          label={status} 
          size="small"
          color={statusColors[status] || 'default'}
        />
        
        <Typography variant="body2" color="text.secondary">
          Updated {formattedDate}
        </Typography>
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
    icon: PropTypes.node
  })),
  onActionClick: PropTypes.func
};

export default TabHeader; 