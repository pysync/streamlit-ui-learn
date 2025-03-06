import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useError } from '../../contexts/ErrorContext';

const ErrorSnackbar = () => {
  const { error, clearError } = useError();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    clearError();
  };

  return (
    <Snackbar
      open={Boolean(error)}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
