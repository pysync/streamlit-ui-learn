import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useMessage } from '../../contexts/MessageContext';

const MessageSnackbar = () => {
  const { message, clearMessage } = useMessage();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    clearMessage();
  };

  return (
    <Snackbar
      open={Boolean(message.text)}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={message.type || 'info'} 
        sx={{ width: '100%' }}
      >
        {message.text}
      </Alert>
    </Snackbar>
  );
};

export default MessageSnackbar;
