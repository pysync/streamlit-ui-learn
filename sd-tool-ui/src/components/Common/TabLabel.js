import React from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TabLabel = ({ icon, label, onClose }) => {
  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'center',
        '& .close-button': {
          visibility: 'hidden'
        },
        '&:hover .close-button': {
          visibility: 'visible'
        }
      }}
    >
      {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
      <Box sx={{ mr: 1 }}>{label}</Box>
      <Box
        component="span"
        className="close-button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose(e);
        }}
        sx={{
          display: 'inline-flex',
          p: 0.5,
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