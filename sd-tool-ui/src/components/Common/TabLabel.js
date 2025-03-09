import React from 'react';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TabLabel = ({ icon, label, onClose }) => {
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) onClose(e);
  };

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'center',
        minWidth: 0,
        position: 'relative',
        '& .close-button': {
          opacity: 0,
          transition: 'opacity 200ms ease',
          marginLeft: 1
        },
        '&:hover .close-button': {
          opacity: 1
        }
      }}
    >
      {icon && (
        <Box
          component="span"
          sx={{ 
            marginRight: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {icon}
        </Box>
      )}
      <Box
        component="span"
        sx={{ 
          marginRight: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {label}
      </Box>
      <Box
        component="span"
        className="close-button"
        onClick={handleClose}
        role="button"
        tabIndex={0}
        sx={{
          display: 'inline-flex',
          padding: 0.5,
          borderRadius: '50%',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <CloseIcon fontSize="small" />
      </Box>
    </Box>
  );
};

export default TabLabel; 